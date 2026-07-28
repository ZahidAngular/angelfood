"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, ApiError } from "@/lib/api";
import { isLoggedIn, saveSession } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await authApi.login({ email, password });

      if (!result.isAuthenticated) {
        setError("Invalid email or password.");
        return;
      }

      const fullName = [result.user.firstName, result.user.lastName].filter(Boolean).join(" ");
      saveSession(result.token, {
        id: result.user.userId ?? 0,
        fullName: fullName || result.user.email || email,
        email: result.user.email ?? email,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-cream px-5 pb-24 pt-40 sm:px-8">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl font-extrabold text-green">
            Angel<span className="text-gold">Food</span>
          </span>
          <p className="mt-2 text-sm text-ink-soft">Recipes dashboard</p>
        </div>

        <div className="rounded-3xl border border-line bg-paper p-8 shadow-[0_10px_40px_-20px_rgba(20,66,44,0.3)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Email</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-ink-soft">Password</label>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-xl bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-green px-6 py-3 text-sm font-semibold text-cream transition-all hover:scale-[1.02] disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Log in"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
