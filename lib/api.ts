import { getToken } from "./auth";
import { LEGACY_RECIPE_SLUGS } from "./legacy-slugs";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://angelfood-api.webappconsulting.com.au/api";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options.headers as Record<string, string>) || {}),
  };

  // Data changes constantly (dashboard edits, new recipes) — never let
  // Next.js cache a server-side fetch and serve a stale build-time snapshot.
  //
  // The exception is prerendering for `output: export`: there is no server to
  // refetch from, and Next.js refuses to statically render a page that made an
  // uncached fetch, so the whole point of the build is to bake this data in.
  // Browser calls (the dashboard) always stay uncached either way.
  const isStaticPrerender =
    process.env.STATIC_EXPORT === "true" && typeof window === "undefined";

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    cache: isStaticPrerender ? "force-cache" : "no-store",
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message =
      data?.details ||
      data?.title ||
      data?.message ||
      (data?.errors
        ? Object.values(data.errors as Record<string, string[]>).flat().join(" ")
        : null) ||
      "Something went wrong. Please try again.";
    throw new ApiError(message, res.status);
  }

  return data as T;
}

export type LoginRequest = { email: string; password: string };
export type LoginRole = { roleId?: number; roleName?: string };
export type LoginUser = {
  userId?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: LoginRole | null;
};
export type LoginResponse = { isAuthenticated: boolean; token: string; user: LoginUser };

export type UserProfile = {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
};
export type UpdateProfileRequest = { fullName: string; email: string };
export type ChangePasswordRequest = { currentPassword: string; newPassword: string };

export type IngredientGroup = {
  heading?: string | null;
  items: string[];
};

export type Recipe = {
  id: number;
  title: string;
  description: string | null;
  ingredientGroups: IngredientGroup[];
  instructions: string;
  notes: string | null;
  imageUrl: string | null;
  userId: number;
  ownerName?: string | null;
  createdAt: string;
  updatedAt: string | null;
};

export type RecipeInput = {
  title: string;
  description?: string;
  ingredientGroups: IngredientGroup[];
  instructions: string;
  notes?: string;
  imageUrl?: string | null;
};

export type PagedResult<T> = {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};

// Wire shape used by the /api/Recipe endpoints: ingredients are a flat list
// (one row per ingredient line) instead of the grouped shape the form uses.
type WireIngredient = {
  ingredientId?: number;
  recipeId?: number;
  heading?: string | null;
  items?: string;
  description: string;
};

type RecipeWire = {
  id: number;
  title: string;
  description: string | null;
  ingredients: WireIngredient[];
  instructions: string;
  notes: string | null;
  imageUrl: string | null;
  userId?: number;
  createdAt: string;
  updatedAt: string | null;
};

function ingredientsToGroups(ingredients: WireIngredient[]): IngredientGroup[] {
  const groups: IngredientGroup[] = [];
  for (const ing of ingredients) {
    const heading = ing.heading ?? "";
    const last = groups[groups.length - 1];
    if (last && (last.heading ?? "") === heading) {
      last.items.push(ing.description);
    } else {
      groups.push({ heading: ing.heading ?? undefined, items: [ing.description] });
    }
  }
  return groups.length ? groups : [{ heading: "", items: [] }];
}

function groupsToIngredients(groups: IngredientGroup[]): WireIngredient[] {
  const result: WireIngredient[] = [];
  for (const g of groups) {
    for (const item of g.items) {
      result.push({ ingredientId: 0, recipeId: 0, heading: g.heading || "", items: item, description: item });
    }
  }
  return result;
}

function fromWire(wire: RecipeWire): Recipe {
  return {
    id: wire.id,
    title: wire.title,
    description: wire.description,
    ingredientGroups: ingredientsToGroups(wire.ingredients ?? []),
    instructions: wire.instructions,
    notes: wire.notes,
    imageUrl: wire.imageUrl,
    userId: wire.userId ?? 0,
    createdAt: wire.createdAt,
    updatedAt: wire.updatedAt,
  };
}

// A 1x1 transparent PNG, used when no photo is picked: the API rejects
// create/update with "No files were uploaded." if the file field is absent.
const PLACEHOLDER_IMAGE = new Blob(
  [Uint8Array.from(atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII="), (c) => c.charCodeAt(0))],
  { type: "image/png" }
);

// The API only accepts multipart/form-data for create/update (no
// application/json option), and binds nested arrays via indexed keys.
// It also requires a "Files" field to be present even when there's no photo.
function toFormData(data: RecipeInput, id: number | undefined, file: File | undefined): FormData {
  const now = new Date().toISOString();
  const fd = new FormData();
  fd.append("Id", String(id ?? 0));
  fd.append("Title", data.title);
  fd.append("Description", data.description ?? "");
  fd.append("Instructions", data.instructions);
  fd.append("Notes", data.notes ?? "");
  fd.append("ImageUrl", data.imageUrl ?? "");
  fd.append("CreatedAt", now);
  fd.append("UpdatedAt", now);
  groupsToIngredients(data.ingredientGroups).forEach((ing, i) => {
    fd.append(`Ingredients[${i}].IngredientId`, String(ing.ingredientId ?? 0));
    fd.append(`Ingredients[${i}].RecipeId`, String(ing.recipeId ?? 0));
    fd.append(`Ingredients[${i}].Heading`, ing.heading ?? "");
    fd.append(`Ingredients[${i}].Items`, ing.items ?? "");
    fd.append(`Ingredients[${i}].Description`, ing.description);
  });
  fd.append("Files", file ?? PLACEHOLDER_IMAGE, file?.name ?? "blank.png");
  return fd;
}

// PUT /api/Recipe only accepts application/json (confirmed via the live
// swagger.json — its requestBody.content has no multipart/form-data option,
// unlike POST). It also has no file-upload field, so an update can't change
// the photo — only create (multipart) can.
function toJsonBody(data: RecipeInput, id: number) {
  const now = new Date().toISOString();
  return {
    id,
    title: data.title,
    description: data.description ?? "",
    ingredients: groupsToIngredients(data.ingredientGroups),
    instructions: data.instructions,
    notes: data.notes ?? "",
    imageUrl: data.imageUrl ?? "",
    createdAt: now,
    updatedAt: now,
  };
}

// POST /api/Recipe does not reliably return the new recipe's id (it appears
// to return a rows-affected style count instead), so we can't trust it for a
// follow-up lookup. Instead, re-fetch the list and find the newest recipe
// matching a marker title, which is unique enough for this purpose.
async function findLatestByTitle(title: string): Promise<RecipeWire | null> {
  const all = await request<RecipeWire[]>("/Recipe");
  const matches = all.filter((r) => r.title === title);
  if (matches.length === 0) return null;
  matches.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return matches[0];
}

export const authApi = {
  login: (data: LoginRequest) =>
    request<LoginResponse>("/Auth/", { method: "POST", body: JSON.stringify(data) }),
};

export const userApi = {
  getProfile: () => request<UserProfile>("/User/GetProfile"),
  updateProfile: (data: UpdateProfileRequest) =>
    request<UserProfile>("/User/UpdateProfile", { method: "PUT", body: JSON.stringify(data) }),
  changePassword: (data: ChangePasswordRequest) =>
    request<{ message: string }>("/User/ChangePassword", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/**
 * A static export renders every page at build time, and each recipe page (plus
 * its metadata, the listing, the homepage and the sitemap) asks for the full
 * recipe list — well over a hundred identical calls in a few seconds, which the
 * API starts refusing. Holding onto the first promise collapses them into one
 * request for the whole build. Only for `output: export`: on a server build the
 * data must stay live, so each request refetches as before.
 */
const memoizeForStaticExport = process.env.STATIC_EXPORT === "true";
let allRecipesPromise: Promise<Recipe[]> | null = null;

export const recipeApi = {
  getAll: async (): Promise<Recipe[]> => {
    const fetchAll = async () => {
      const wire = await request<RecipeWire[]>("/Recipe");
      return wire.map(fromWire);
    };

    if (!memoizeForStaticExport) return fetchAll();

    if (!allRecipesPromise) {
      allRecipesPromise = fetchAll().catch((err) => {
        // Don't cache a failure — the next caller should get a real attempt.
        allRecipesPromise = null;
        throw err;
      });
    }
    return allRecipesPromise;
  },
  // The API has no server-side pagination (GET /api/Recipe takes no
  // parameters), so we fetch everything and paginate on the client.
  getPaginated: async (pageNumber = 1, pageSize = 10): Promise<PagedResult<Recipe>> => {
    const all = await recipeApi.getAll();
    const totalCount = all.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const start = (pageNumber - 1) * pageSize;
    return {
      items: all.slice(start, start + pageSize),
      totalCount,
      pageNumber,
      pageSize,
      totalPages,
    };
  },
  getById: async (id: number): Promise<Recipe> => {
    const wire = await request<RecipeWire>(`/Recipe/${id}`);
    return fromWire(wire);
  },
  // POST doesn't reliably return the new recipe's id, so we look it up by
  // title afterward (see findLatestByTitle) instead of trusting the response.
  create: async (data: RecipeInput, file?: File): Promise<Recipe> => {
    await request<unknown>("/Recipe", {
      method: "POST",
      body: toFormData(data, undefined, file),
    });
    const wire = await findLatestByTitle(data.title);
    if (!wire) throw new ApiError("Recipe was created but could not be found.", 500);
    return fromWire(wire);
  },
  // No file param: the update endpoint (PUT, application/json) has no file
  // field, and there's no working DELETE to clean up a disposable upload
  // (confirmed 405), so photo changes aren't possible on edit yet.
  update: async (id: number, data: RecipeInput): Promise<Recipe> => {
    await request<unknown>("/Recipe", {
      method: "PUT",
      body: JSON.stringify(toJsonBody(data, id)),
    });
    return recipeApi.getById(id);
  },
  remove: (id: number) =>
    request<{ message: string }>(`/Recipe/${id}`, { method: "DELETE" }),
};

const S3_BUCKET_URL = "https://angelfood-bucket.s3.ap-southeast-2.amazonaws.com/";

export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  // Full URLs (S3, http) and local blob: previews are already usable as-is.
  if (path.startsWith("http") || path.startsWith("blob:")) return path;
  // Backend-uploaded images live under /uploads on the API server.
  if (path.startsWith("/uploads/")) {
    const origin = API_BASE_URL.replace(/\/api$/, "");
    return `${origin}${path}`;
  }
  // Recipe photos come back as a relative S3 key, e.g. "recipes/xxx.png".
  return `${S3_BUCKET_URL}${path}`;
}

/** Raw slug straight from the title, e.g. "Colin's bolognese" -> "colins-bolognese". */
export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * The recipe's canonical URL slug. Where the old angelfood.co.nz site used a
 * different slug than the title produces, the old one wins — it holds the
 * search rankings and inbound links — so that is what links and the sitemap use.
 */
export function recipeSlug(title: string): string {
  const generated = slugifyTitle(title);
  return LEGACY_RECIPE_SLUGS[generated] ?? generated;
}

/**
 * Whether `slug` addresses this recipe. Both the canonical (old-site) slug and
 * the title-derived one resolve to the page, so neither address 404s; the
 * canonical link tag tells search engines which of the two is the real one.
 */
export function recipeMatchesSlug(title: string, slug: string): boolean {
  const generated = slugifyTitle(title);
  return slug === generated || slug === (LEGACY_RECIPE_SLUGS[generated] ?? generated);
}
