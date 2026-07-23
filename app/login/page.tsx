"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, ApiError } from "@/lib/api";
import { isLoggedIn, saveSession } from "@/lib/auth";

type Mode = "login" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [fullName, setFullName] = useState("");
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
      const result =
        mode === "login"
          ? await authApi.login({ email, password })
          : await authApi.signup({ fullName, email, password });

      saveSession(result.token, {
        id: result.id,
        fullName: result.fullName,
        email: result.email,
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
          <div className="mb-6 flex rounded-full bg-cream-deep p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError(null);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "login" ? "bg-green text-cream" : "text-ink-soft"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError(null);
              }}
              className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
                mode === "signup" ? "bg-green text-cream" : "text-ink-soft"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-ink-soft">Full name</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none transition-colors focus:border-green"
                  placeholder="Jane Smith"
                />
              </div>
            )}

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
              {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
