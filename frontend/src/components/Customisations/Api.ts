// Typed client for the customisation endpoints (see Customisation_API_tester.html).

const BASE: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

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

  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check that the backend is running.");
  }

  const json = await res.json().catch(() => null);
  if (!res.ok) {
    // Validation errors: { message, errors: { formErrors: string[], fieldErrors: Record<string,string[]> } }
    const form: string[] = json?.errors?.formErrors ?? [];
    const fields: Record<string, string[]> = json?.errors?.fieldErrors ?? {};
    const parts = [
      ...form,
      ...Object.entries(fields).map(([k, v]) => `${k.replace(/_/g, " ")}: ${v.join(", ")}`),
    ];
    throw new ApiError(res.status, parts.length ? parts.join(" · ") : (json?.message ?? res.statusText));
  }
  return json?.data as T;
}

const enc = encodeURIComponent;

export const api = {
  // ASSUMPTION: your backend exposes GET /products returning { data: [{ id, name }] }.
  products: async (): Promise<Product[]> => {
    const rows = await request<any[]>("GET", "/products");
    return rows.map((p) => ({ id: p.id, name: p.name ?? p.title ?? p.id }));
  },

  groups: () => request<Group[]>("GET", "/customisation-groups"),
  createGroup: (b: GroupInput) => request<Group>("POST", "/customisation-groups", b),
  updateGroup: (id: string, b: GroupPatch) => request<Group>("PATCH", `/customisation-groups/${enc(id)}`, b),
  deleteGroup: (id: string) => request<Group>("DELETE", `/customisation-groups/${enc(id)}`),
  groupProducts: (id: string) => request<Link[]>("GET", `/customisation-groups/${enc(id)}/products`),

  // NOT in the current API: lists every option of a group, including hidden ones.
  groupOptions: (id: string) => request<Option[]>("GET", `/customisation-groups/${enc(id)}/options`),
  createOption: (groupId: string, b: OptionCreate) =>
    request<Option>("POST", `/customisation-groups/${enc(groupId)}/options`, b),
  updateOption: (id: string, b: OptionPatch) => request<Option>("PATCH", `/customisation-options/${enc(id)}`, b),

  productGroups: (pid: string) => request<ProductGroup[]>("GET", `/products/${enc(pid)}/customisations`),
  attach: (pid: string, b: { group_id: string; required?: boolean; display_order?: number }) =>
    request<Link>("POST", `/products/${enc(pid)}/customisations`, b),
  updateLink: (pid: string, gid: string, b: { required?: boolean; display_order?: number }) =>
    request<Link>("PATCH", `/products/${enc(pid)}/customisations/${enc(gid)}`, b),
  detach: (pid: string, gid: string) =>
    request<Link>("DELETE", `/products/${enc(pid)}/customisations/${enc(gid)}`),
};
