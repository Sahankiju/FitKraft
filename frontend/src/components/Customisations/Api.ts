// Typed client for the customisation endpoints (see Customisation_API_tester.html).

// The /api/v1 prefix is part of the base URL. Override with VITE_API_URL in .env (restart vite after editing).
const BASE: string = "http://localhost:8000/api/v1";

// Abort requests that get no response, so a hanging endpoint fails fast with a clear message.
const TIMEOUT_MS = 8000;

// price_modifier is an integer in minor units. If 1 unit = 1 NPR keep this at 1;
// if you store paisa, set it to 100.
export const PRICE_DIVISOR = 1;

export type SelectionType = "single" | "multiple";

export interface Product {
  id: string;
  name: string;
}
export interface Group {
  id: string;
  name: string;
  product_id: string | null; // null = reusable
  selection_type: SelectionType;
  min_selections: number;
  max_selections: number | null; // null = no limit
}
export interface Option {
  id: string;
  group_id?: string;
  name: string;
  price_modifier: number;
  thumbnail: string | null;
  is_active: boolean;
}
export interface Link {
  id: string;
  product_id: string;
  group_id: string;
  required: boolean;
  display_order: number;
}
// Shape returned by GET /products/:id/customisations (active options only)
export interface ProductGroup {
  id: string;
  name: string;
  selection_type: SelectionType;
  min_selections: number;
  max_selections: number | null;
  required: boolean;
  display_order: number;
  options: Option[];
}

export interface GroupInput {
  name: string;
  product_id?: string;
  selection_type: SelectionType;
  min_selections: number;
  max_selections: number | null;
}
export type GroupPatch = Partial<Omit<GroupInput, "product_id">>;
export interface OptionCreate {
  name: string;
  price_modifier: number;
  thumbnail?: string;
}
export interface OptionPatch {
  name?: string;
  price_modifier?: number;
  thumbnail?: string | null;
  is_active?: boolean;
}

export const formatPrice = (n: number) =>
  n === 0
    ? "No extra cost"
    : `${n < 0 ? "−" : "+"}NPR ${Math.abs(n / PRICE_DIVISOR).toLocaleString("en-IN")}`;

export const ruleText = (g: Pick<Group, "selection_type" | "min_selections" | "max_selections">) =>
  g.selection_type === "single"
    ? `Pick 1${g.min_selections ? "" : " (optional)"}`
    : `Pick ${g.min_selections}–${g.max_selections ?? "any"}`;

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

// Adjust to however your admin login stores its token.
const authHeader = (): Record<string, string> => {
  const t = localStorage.getItem("adminToken");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { ...authHeader() };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const url = `${BASE}${path}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);

  try {
    let res: Response;
    try {
      res = await fetch(url, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: ctrl.signal,
      });
    } catch (e) {
      console.error(`[api] ${method} ${url} failed`, e);
      throw new ApiError(
        0,
        ctrl.signal.aborted
          ? `${method} ${path} timed out (the server didn't respond)`
          : `Can't reach the server at ${BASE}. Check that it's running and CORS allows this origin.`,
      );
    }

    // The timer keeps running while the body is read, so a stalled body also aborts.
    const json = await res.json().catch(() => null);
    if (!res.ok) {
      // Validation errors: { message, errors: { formErrors: string[], fieldErrors: Record<string,string[]> } }
      const form: string[] = json?.errors?.formErrors ?? [];
      const fields: Record<string, string[]> = json?.errors?.fieldErrors ?? {};
      const parts = [
        ...form,
        ...Object.entries(fields).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v.join(", ")}`),
      ];
      const detail = parts.length ? parts.join(" · ") : (json?.message ?? res.statusText);
      // 404/401/403/5xx are usually route or auth problems, so name the endpoint.
      const where = res.status >= 400 && !parts.length ? ` (${method} ${url} → ${res.status})` : "";
      throw new ApiError(res.status, `${detail}${where}`);
    }
    return json?.data as T;
  } finally {
    clearTimeout(timer);
  }
}

// Accepts a bare array or common wrappers ({ items }, { rows }, { results }, { data }), else [].
const asList = <T>(raw: unknown): T[] => {
  if (Array.isArray(raw)) return raw as T[];
  const r = raw as Record<string, unknown> | null | undefined;
  for (const key of ["items", "rows", "results", "data", "products"]) {
    if (Array.isArray(r?.[key])) return r![key] as T[];
  }
  console.warn("[api] expected a list but got", raw);
  return [];
};

const enc = encodeURIComponent;

export const api = {
  // ASSUMPTION: your backend exposes GET /products returning { data: [{ id, name }] }.
  // If your list endpoint has another path (e.g. /product), change it here.
  products: async (): Promise<Product[]> => {
    // Tries each path until one exists. Once you know the right one, keep only that.
    const candidates = ["/products", "/product"];
    let lastErr: unknown;
    for (const path of candidates) {
      try {
        const rows = asList<any>(await request<unknown>("GET", path));
        return rows.map((p) => ({ id: String(p.id), name: p.name ?? p.title ?? String(p.id) }));
      } catch (e) {
        lastErr = e;
        if (!(e instanceof ApiError && e.status === 404)) throw e; // only keep trying on 404
      }
    }
    throw lastErr;
  },

  groups: async () => asList<Group>(await request<unknown>("GET", "/customisation-groups")),
  createGroup: (b: GroupInput) => request<Group>("POST", "/customisation-groups", b),
  updateGroup: (id: string, b: GroupPatch) => request<Group>("PATCH", `/customisation-groups/${enc(id)}`, b),
  deleteGroup: (id: string) => request<Group>("DELETE", `/customisation-groups/${enc(id)}`),
  groupProducts: async (id: string) =>
    asList<Link>(await request<unknown>("GET", `/customisation-groups/${enc(id)}/products`)),

  // NOT in the current API: lists every option of a group, including hidden ones.
  groupOptions: async (id: string) =>
    asList<Option>(await request<unknown>("GET", `/customisation-groups/${enc(id)}/options`)),
  createOption: (groupId: string, b: OptionCreate) =>
    request<Option>("POST", `/customisation-groups/${enc(groupId)}/options`, b),
  updateOption: (id: string, b: OptionPatch) => request<Option>("PATCH", `/customisation-options/${enc(id)}`, b),

  productGroups: async (pid: string) =>
    asList<ProductGroup>(await request<unknown>("GET", `/products/${enc(pid)}/customisations`)),
  attach: (pid: string, b: { group_id: string; required?: boolean; display_order?: number }) =>
    request<Link>("POST", `/products/${enc(pid)}/customisations`, b),
  updateLink: (pid: string, gid: string, b: { required?: boolean; display_order?: number }) =>
    request<Link>("PATCH", `/products/${enc(pid)}/customisations/${enc(gid)}`, b),
  detach: (pid: string, gid: string) =>
    request<Link>("DELETE", `/products/${enc(pid)}/customisations/${enc(gid)}`),
};