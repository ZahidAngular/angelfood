"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import {
  recipeApi,
  resolveImageUrl,
  ApiError,
  type Recipe,
  type RecipeInput,
  type IngredientGroup,
} from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

const PAGE_SIZE = 8;

const EMPTY_GROUP: IngredientGroup = { heading: "", items: [] };

const EMPTY_FORM: RecipeInput = {
  title: "",
  description: "",
  ingredientGroups: [EMPTY_GROUP],
  instructions: "",
  notes: "",
  imageUrl: null,
};

export default function RecipesPage() {
  const currentUser = getSessionUser();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<RecipeInput>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadRecipes = useCallback(async (targetPage: number) => {
    setLoading(true);
    setListError(null);
    try {
      const res = await recipeApi.getPaginated(targetPage, PAGE_SIZE);
      setRecipes(res.items);
      setTotalPages(res.totalPages || 1);
      setPage(res.pageNumber);
    } catch (err) {
      setListError(
        err instanceof ApiError ? err.message : "Could not load recipes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRecipes(1);
  }, [loadRecipes]);

  useEffect(() => {
    if (!formOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [formOpen]);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError(null);
    setFormOpen(true);
  }

  function openEditForm(recipe: Recipe) {
    setEditingId(recipe.id);
    setForm({
      title: recipe.title,
      description: recipe.description ?? "",
      ingredientGroups:
        recipe.ingredientGroups.length > 0 ? recipe.ingredientGroups : [EMPTY_GROUP],
      instructions: recipe.instructions,
      notes: recipe.notes ?? "",
      imageUrl: recipe.imageUrl,
    });
    setFormError(null);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
  }

  function addIngredientGroup() {
    setForm((f) => ({ ...f, ingredientGroups: [...f.ingredientGroups, { ...EMPTY_GROUP }] }));
  }

  function removeIngredientGroup(index: number) {
    setForm((f) => ({
      ...f,
      ingredientGroups: f.ingredientGroups.filter((_, i) => i !== index),
    }));
  }

  function updateGroupHeading(index: number, heading: string) {
    setForm((f) => {
      const groups = [...f.ingredientGroups];
      groups[index] = { ...groups[index], heading };
      return { ...f, ingredientGroups: groups };
    });
  }

  function updateGroupItems(index: number, text: string) {
    setForm((f) => {
      const groups = [...f.ingredientGroups];
      groups[index] = { ...groups[index], items: text.split("\n") };
      return { ...f, ingredientGroups: groups };
    });
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError(null);
    try {
      const res = await recipeApi.uploadImage(file);
      setForm((f) => ({ ...f, imageUrl: res.imageUrl }));
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const cleanedGroups = form.ingredientGroups
      .map((g) => ({
        heading: g.heading?.trim() || undefined,
        items: g.items.map((i) => i.trim()).filter(Boolean),
      }))
      .filter((g) => g.items.length > 0);

    if (cleanedGroups.length === 0) {
      setFormError("Add at least one ingredient.");
      return;
    }

    setSaving(true);
    setFormError(null);
    try {
      const payload = { ...form, ingredientGroups: cleanedGroups };
      if (editingId) {
        await recipeApi.update(editingId, payload);
      } else {
        await recipeApi.create(payload);
      }
      closeForm();
      loadRecipes(editingId ? page : 1);
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "Could not save recipe.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this recipe? This can't be undone.")) return;
    try {
      await recipeApi.remove(id);
      loadRecipes(recipes.length === 1 && page > 1 ? page - 1 : page);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Could not delete recipe.");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-ink">My Recipes</h1>
          <p className="mt-1 text-ink-soft">Create, edit and manage recipes.</p>
        </div>
        {!formOpen && (
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 rounded-full bg-green px-5 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.02]"
          >
            <Plus size={16} />
            Add recipe
          </button>
        )}
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-[80] flex flex-col bg-cream">
          <div className="flex items-center justify-between border-b border-line bg-paper px-6 py-5 sm:px-10 lg:px-16">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {editingId ? "Edit recipe" : "Add a new recipe"}
              </h2>
              <p className="mt-1 text-sm text-ink-soft">
                Fill in the details below — everything shows up in your recipe library.
              </p>
            </div>
            <button
              onClick={closeForm}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-coral hover:text-coral"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 lg:px-16">
            <form id="recipe-form" onSubmit={handleSubmit} className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.7fr_1fr]">
              {/* Left column — content fields */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">Title</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Cheesy Zucchini Fritters"
                    className="rounded-xl border border-line bg-paper px-4 py-3.5 text-base font-medium outline-none transition-colors focus:border-green"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">
                    Short description
                  </label>
                  <textarea
                    value={form.description ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    rows={2}
                    placeholder="One line that sums up the dish"
                    className="resize-none rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-ink-soft">Ingredients</label>
                    <button
                      type="button"
                      onClick={addIngredientGroup}
                      className="flex items-center gap-1 text-xs font-semibold text-green hover:underline"
                    >
                      <Plus size={13} /> Add group
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {form.ingredientGroups.map((group, i) => (
                      <div key={i} className="rounded-xl border border-line p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            value={group.heading ?? ""}
                            onChange={(e) => updateGroupHeading(i, e.target.value)}
                            placeholder={
                              form.ingredientGroups.length > 1
                                ? "Group name, e.g. Cake"
                                : "Group name (optional)"
                            }
                            className="flex-1 rounded-lg border border-line bg-paper px-3 py-2 text-sm font-medium outline-none transition-colors focus:border-green"
                          />
                          {form.ingredientGroups.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeIngredientGroup(i)}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-coral transition-colors hover:bg-coral/10"
                              aria-label="Remove group"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <textarea
                          value={group.items.join("\n")}
                          onChange={(e) => updateGroupItems(i, e.target.value)}
                          rows={4}
                          placeholder={"One per line, e.g.\n2 cups flour\n1 tsp salt"}
                          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition-colors focus:border-green"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">Instructions</label>
                  <textarea
                    required
                    value={form.instructions}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, instructions: e.target.value }))
                    }
                    rows={7}
                    placeholder={"Step by step, e.g.\n1. Preheat oven to 180°C\n2. Mix everything together"}
                    className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                  />
                </div>
              </div>

              {/* Right column — photo + meta */}
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">Photo</label>
                  <label className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-line bg-cream-deep/40 transition-colors hover:border-green">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {form.imageUrl ? (
                      <>
                        <Image
                          src={resolveImageUrl(form.imageUrl)!}
                          alt="Recipe preview"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-ink/0 opacity-0 transition-opacity group-hover:bg-ink/40 group-hover:opacity-100">
                          <span className="rounded-full bg-paper px-4 py-2 text-xs font-semibold text-ink">
                            Change photo
                          </span>
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center gap-2 px-6 text-center text-ink-soft">
                        <ImagePlus size={28} />
                        <span className="text-sm font-semibold">Click to upload a photo</span>
                        <span className="text-xs">PNG, JPG or WEBP — up to 5MB</span>
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-paper/85">
                        <span className="text-sm font-medium text-ink-soft">
                          Uploading…
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-ink-soft">
                    Notes <span className="font-normal text-ink-soft/70">(optional)</span>
                  </label>
                  <textarea
                    value={form.notes ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={4}
                    placeholder="Substitutions, storage tips, or anything else worth knowing"
                    className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                  />
                </div>

                {formError && (
                  <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">
                    {formError}
                  </p>
                )}
              </div>
            </div>
            </form>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-line bg-paper px-6 py-5 sm:flex-row sm:justify-end sm:px-10 lg:px-16">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-ink-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="recipe-form"
              disabled={saving || uploading}
              className="rounded-full bg-green px-8 py-3 text-sm font-semibold text-cream transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {saving ? "Saving…" : editingId ? "Save changes" : "Create recipe"}
            </button>
          </div>
        </div>
      )}

      {listError && (
        <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{listError}</p>
      )}

      {loading ? (
        <p className="text-sm text-ink-soft">Loading recipes…</p>
      ) : recipes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-paper p-12 text-center">
          <p className="text-ink-soft">No recipes yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => {
            const image = resolveImageUrl(recipe.imageUrl);
            const canEdit = currentUser?.id === recipe.userId;
            return (
              <div
                key={recipe.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-line bg-paper"
              >
                <div className="relative h-40 w-full bg-cream-deep">
                  {image ? (
                    <Image
                      src={image}
                      alt={recipe.title}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-soft">
                      <ImagePlus size={28} />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-lg font-bold text-ink">
                    {recipe.title}
                  </h3>
                  {recipe.description && (
                    <p className="line-clamp-2 text-sm text-ink-soft">
                      {recipe.description}
                    </p>
                  )}
                  {recipe.ownerName && (
                    <p className="text-xs text-ink-soft">By {recipe.ownerName}</p>
                  )}
                  {canEdit && (
                    <div className="mt-auto flex gap-2 pt-3">
                      <button
                        onClick={() => openEditForm(recipe)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-line py-2 text-sm font-medium text-ink-soft transition-colors hover:border-green hover:text-green"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(recipe.id)}
                        className="flex items-center justify-center rounded-full border border-line p-2 text-coral transition-colors hover:border-coral"
                        aria-label="Delete recipe"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => loadRecipes(p)}
              className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${
                p === page ? "bg-green text-cream" : "text-ink-soft hover:bg-cream-deep"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
