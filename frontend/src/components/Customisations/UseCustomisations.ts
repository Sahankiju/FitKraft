import { useCallback, useEffect, useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  api,
  ApiError,
  type Group,
  type GroupInput,
  type GroupPatch,
  type Option,
  type OptionCreate,
  type OptionPatch,
  type Product,
  type ProductGroup,
} from "./Api";

const errMsg = (e: unknown) => {
  console.error("[customisations]", e);
  if (e instanceof ApiError) return e.message;
  return e instanceof Error ? e.message : "Something went wrong. Try again.";
};

// Max simultaneous requests when loading per-group details.
const CONCURRENCY = 4;

// Runs fn over items with at most `limit` in flight at once, keeping result order.
async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out = new Array<R>(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

// Status codes that mean "this endpoint isn't there" (0 = timed out / unreachable).
const isMissingEndpoint = (e: unknown) =>
  e instanceof ApiError && [0, 404, 405, 501].includes(e.status);

type OptionsEndpoint = "unknown" | "yes" | "no";

export function useCustomisations() {
  const [products, setProducts] = useState<Product[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [productId, setProductId] = useState<string | null>(null);
  const [attached, setAttached] = useState<ProductGroup[]>([]);
  const [options, setOptions] = useState<Record<string, Option[]>>({}); // groupId -> all options
  const [usage, setUsage] = useState<Record<string, string[]>>({}); // groupId -> productIds
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [hiddenListable, setHiddenListable] = useState(true);

  // Bumped on every refresh so slow, outdated responses can't overwrite newer ones.
  const refreshSeq = useRef(0);
  // Remembers whether GET /customisation-groups/:id/options exists, so we probe it once, not per group.
  const optionsEndpoint = useRef<OptionsEndpoint>("unknown");

  const refresh = useCallback(async (pid: string | null) => {
    const seq = ++refreshSeq.current;

    const [gs, att] = await Promise.all([
      api.groups(),
      pid ? api.productGroups(pid) : Promise.resolve([] as ProductGroup[]),
    ]);
    if (seq !== refreshSeq.current) return; // a newer refresh started

    const fallbackOptions = (id: string) => att.find((a) => a.id === id)?.options ?? [];

    // Loads the links (and, if allowed, all options incl. hidden) of one group.
    const fetchDetail = async (g: Group, useOptions: boolean) => {
      const productIds = await api
        .groupProducts(g.id)
        .then((links) => links.map((l) => l.product_id))
        .catch(() => [] as string[]);

      let opts = fallbackOptions(g.id);
      let optionsError: unknown = null;
      if (useOptions) {
        try {
          opts = await api.groupOptions(g.id);
        } catch (e) {
          optionsError = e;
        }
      }
      return { id: g.id, productIds, opts, optionsError };
    };

    type Detail = Awaited<ReturnType<typeof fetchDetail>>;
    const details: Detail[] = [];
    let rest = gs;

    // Probe the /options endpoint with ONE group first.
    if (optionsEndpoint.current === "unknown" && gs.length > 0) {
      const first = await fetchDetail(gs[0], true);
      details.push(first);
      rest = gs.slice(1);
      if (!first.optionsError) optionsEndpoint.current = "yes";
      else if (isMissingEndpoint(first.optionsError)) optionsEndpoint.current = "no";
      // any other error (e.g. 500): don't cache, just fall back for this refresh
    }

    const useOptions = optionsEndpoint.current === "yes";
    const others = await mapLimit(rest, CONCURRENCY, (g) => fetchDetail(g, useOptions));
    details.push(...others);

    if (seq !== refreshSeq.current) return;

    // Commit everything together so the UI never renders half-loaded data.
    setGroups(gs);
    setAttached(att);
    setUsage(Object.fromEntries(details.map((d) => [d.id, d.productIds])));
    setOptions(Object.fromEntries(details.map((d) => [d.id, d.opts])));
    setHiddenListable(details.every((d) => !d.optionsError) && optionsEndpoint.current !== "no");
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ps = await api.products();
        if (cancelled) return;
        setProducts(ps);
        const first = ps[0]?.id ?? null;
        setProductId(first);
        await refresh(first);
      } catch (e) {
        if (!cancelled) setLoadError(errMsg(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  const selectProduct = async (id: string) => {
    setProductId(id);
    try {
      await refresh(id);
    } catch (e) {
      notifications.show({ title: "Couldn't load product", message: errMsg(e), color: "red" });
    }
  };

  // Runs a mutation, refreshes, toasts. Returns an error message or null on success.
  const run = useCallback(
    async (action: () => Promise<unknown>, success: string, toastError = true): Promise<string | null> => {
      try {
        await action();
      } catch (e) {
        const m = errMsg(e);
        if (toastError) notifications.show({ title: "Couldn't save", message: m, color: "red" });
        return m;
      }
      await refresh(productId).catch(() => undefined);
      notifications.show({ message: success, color: "teal" });
      return null;
    },
    [refresh, productId],
  );

  const needProduct = () => (productId ? null : "Pick a product first.");

  const createGroup = (v: Omit<GroupInput, "product_id"> & { ownOnly: boolean }): Promise<string | null> => {
    const missing = needProduct();
    if (missing) return Promise.resolve(missing);
    return run(
      async () => {
        const g = await api.createGroup({
          name: v.name,
          ...(v.ownOnly ? { product_id: productId! } : {}),
          selection_type: v.selection_type,
          min_selections: v.min_selections,
          max_selections: v.max_selections,
        });
        await api.attach(productId!, { group_id: g.id, required: false, display_order: attached.length });
      },
      `Created ${v.name} and attached it to this product`,
      false,
    );
  };

  const attach = (groupId: string): Promise<string | null> => {
    const missing = needProduct();
    if (missing) return Promise.resolve(missing);
    return run(
      () => api.attach(productId!, { group_id: groupId, required: false, display_order: attached.length }),
      "Group attached",
      false,
    );
  };

  const detach = (g: ProductGroup) =>
    run(() => api.detach(productId!, g.id), `Detached ${g.name}. The group and its options still exist.`);

  const setRequired = (g: ProductGroup, required: boolean) => {
    if (required && g.min_selections < 1) {
      notifications.show({
        title: "Can't make this required",
        message: `${g.name} allows picking nothing. Edit its rules to require at least 1 first.`,
        color: "red",
      });
      return Promise.resolve("min");
    }
    return run(() => api.updateLink(productId!, g.id, { required }), `${g.name} is now ${required ? "required" : "optional"}`);
  };

  const move = (g: ProductGroup, dir: -1 | 1) => {
    const list = [...attached];
    const i = list.findIndex((x) => x.id === g.id);
    const j = i + dir;
    if (j < 0 || j >= list.length) return Promise.resolve(null);
    [list[i], list[j]] = [list[j], list[i]];
    return run(
      () =>
        Promise.all(
          list.map((x, idx) => (x.display_order !== idx ? api.updateLink(productId!, x.id, { display_order: idx }) : null)),
        ),
      "Order updated",
    );
  };

  const updateGroup = (id: string, body: GroupPatch) => run(() => api.updateGroup(id, body), "Rules updated", false);
  const deleteGroup = (g: Group) => run(() => api.deleteGroup(g.id), `Deleted ${g.name}`);
  const addOption = (groupId: string, body: OptionCreate) =>
    run(() => api.createOption(groupId, body), `Added ${body.name}`, false);
  const updateOption = (id: string, body: OptionPatch) => run(() => api.updateOption(id, body), "Option updated", false);
  const toggleOption = (o: Option) =>
    run(
      () => api.updateOption(o.id, { is_active: !o.is_active }),
      o.is_active ? `${o.name} is hidden from customers` : `${o.name} is offered again`,
    );

  const productName = (id: string) => products.find((p) => p.id === id)?.name ?? "Unknown product";

  return {
    products, groups, productId, attached, options, usage,
    loading, loadError, hiddenListable,
    selectProduct, productName,
    createGroup, attach, detach, setRequired, move,
    updateGroup, deleteGroup, addOption, updateOption, toggleOption,
  };
}