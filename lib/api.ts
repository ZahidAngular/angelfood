import { getToken } from "./auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5085/api";

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

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });

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

export type SignupRequest = { fullName: string; email: string; password: string };
export type LoginRequest = { email: string; password: string };
export type AuthResponse = { id: number; fullName: string; email: string; token: string };

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

export const authApi = {
  signup: (data: SignupRequest) =>
    request<AuthResponse>("/Auth/Signup", { method: "POST", body: JSON.stringify(data) }),
  login: (data: LoginRequest) =>
    request<AuthResponse>("/Auth/Login", { method: "POST", body: JSON.stringify(data) }),
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

export const recipeApi = {
  getAll: () => request<Recipe[]>("/Recipe/GetAllRecipes"),
  getPaginated: (pageNumber = 1, pageSize = 10) =>
    request<PagedResult<Recipe>>(
      `/Recipe/GetRecipesPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),
  getById: (id: number) => request<Recipe>(`/Recipe/GetRecipeById/${id}`),
  create: (data: RecipeInput) =>
    request<Recipe>("/Recipe/CreateRecipe", { method: "POST", body: JSON.stringify(data) }),
  update: (id: number, data: RecipeInput) =>
    request<Recipe>(`/Recipe/UpdateRecipe/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: number) =>
    request<{ message: string }>(`/Recipe/DeleteRecipe/${id}`, { method: "DELETE" }),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ imageUrl: string }>("/Recipe/UploadImage", {
      method: "POST",
      body: formData,
    });
  },
};

export function resolveImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  // Backend-uploaded images live under /uploads on the API server.
  // Anything else (e.g. /images/...) is a local Next.js public asset.
  if (path.startsWith("/uploads/")) {
    const origin = API_BASE_URL.replace(/\/api$/, "");
    return `${origin}${path}`;
  }
  return path;
}
