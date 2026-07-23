"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ChefHat, UserRound, LogOut } from "lucide-react";
import { clearSession, getSessionUser, isLoggedIn, type SessionUser } from "@/lib/auth";

const MENU = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Recipes", href: "/dashboard/recipes", icon: ChefHat },
  { label: "Profile", href: "/dashboard/profile", icon: UserRound },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/login");
      return;
    }
    setUser(getSessionUser());
    setChecked(true);
  }, [router]);

  function handleLogout() {
    clearSession();
    router.push("/login");
  }

  if (!checked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-cream pt-32">
        <p className="text-sm text-ink-soft">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream pb-16 pt-32">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 sm:px-8 lg:flex-row">
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-3xl border border-line bg-paper p-5 lg:sticky lg:top-32">
            <div className="mb-5 px-2">
              <p className="font-display text-lg font-bold text-ink">
                {user?.fullName ?? "Account"}
              </p>
              <p className="truncate text-xs text-ink-soft">{user?.email}</p>
            </div>
            <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
              {MENU.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                      active ? "bg-green text-cream" : "text-ink-soft hover:bg-cream-deep"
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="mt-2 flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-coral transition-colors hover:bg-coral/10"
              >
                <LogOut size={16} />
                Log out
              </button>
            </nav>
          </div>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </main>
  );
}
