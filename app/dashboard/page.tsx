"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChefHat, UserRound } from "lucide-react";
import { recipeApi } from "@/lib/api";
import { getSessionUser } from "@/lib/auth";

export default function DashboardHome() {
  const [recipeCount, setRecipeCount] = useState<number | null>(null);
  const user = getSessionUser();

  useEffect(() => {
    recipeApi
      .getPaginated(1, 1)
      .then((res) => setRecipeCount(res.totalCount))
      .catch(() => setRecipeCount(null));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink">
          Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="mt-1 text-ink-soft">Manage your recipes from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/recipes"
          className="group rounded-3xl border border-line bg-paper p-6 transition-colors hover:border-green"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green/10 text-green">
            <ChefHat size={22} />
          </div>
          <p className="mt-4 font-display text-2xl font-bold text-ink">
            {recipeCount ?? "—"}
          </p>
          <p className="text-sm text-ink-soft">
            Total recipe{recipeCount === 1 ? "" : "s"}
          </p>
          <p className="mt-3 text-sm font-semibold text-green group-hover:underline">
            Manage recipes →
          </p>
        </Link>

        <Link
          href="/dashboard/profile"
          className="group rounded-3xl border border-line bg-paper p-6 transition-colors hover:border-green"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 text-gold">
            <UserRound size={22} />
          </div>
          <p className="mt-4 font-display text-2xl font-bold text-ink">Profile</p>
          <p className="text-sm text-ink-soft">Update your details or password</p>
          <p className="mt-3 text-sm font-semibold text-green group-hover:underline">
            Go to profile →
          </p>
        </Link>
      </div>
    </div>
  );
}
