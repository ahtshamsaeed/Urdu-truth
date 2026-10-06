"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuthApiError,
  authRequest,
  type AuthenticatedUser,
} from "../lib/auth-api";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Check a post", href: "/check", icon: "check" },
  { label: "History", href: "/history", icon: "history" },
  { label: "Saved checks", href: "/saved", icon: "saved" },
  { label: "Evidence & sources", href: "/evidence", icon: "evidence" },
  { label: "How it works", href: "/how-it-works", icon: "help" },
  { label: "Settings", href: "/settings", icon: "settings" },
  { label: "Profile", href: "/profile", icon: "profile" },
];

const iconPaths: Record<string, React.ReactNode> = {
  dashboard: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  check: <><path d="M12 3.5 19 6v5.2c0 4.2-2.8 7.4-7 9.3-4.2-1.9-7-5.1-7-9.3V6l7-2.5Z" /><path d="m9 12 2 2 4-4" /></>,
  history: <><path d="M3.8 11a8.2 8.2 0 1 1 .7 4.3" /><path d="M3.5 4.8v5h5M12 7v5l3 2" /></>,
  saved: <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.7L6 21V4.5Z" />,
  evidence: <><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v16H6.5A2.5 2.5 0 0 0 4 21V5.5A1 1 0 0 1 5 4.5Z" /><path d="M8 7h7M8 10h7M8 13h5" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.7 9a2.4 2.4 0 1 1 4.5 1.2c-.8 1.1-2.2 1.2-2.2 3M12 16.7h.01" /></>,
  settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1 1.7-1.7 2.9-2-.5a7.8 7.8 0 0 1-1.7 1l-.4 2h-3.4l-.4-2a7.8 7.8 0 0 1-1.7-1l-2 .5-1.7-2.9 1-1.7a8.5 8.5 0 0 1 0-2l-1-1.7 1.7-2.9 2 .5a7.8 7.8 0 0 1 1.7-1l.4-2h3.4l.4 2a7.8 7.8 0 0 1 1.7 1l2-.5 1.7 2.9-1 1.7a8.5 8.5 0 0 1 0 2Z" transform="translate(-1 -1) scale(.98)" /></>,
  profile: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
};

export function UiIcon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {iconPaths[name] ?? iconPaths.dashboard}
    </svg>
  );
}

export default function WorkspaceShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [authError, setAuthError] = useState("");
  const [authAttempt, setAuthAttempt] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let isActive = true;

    authRequest<AuthenticatedUser>("/auth/me")
      .then((user) => {
        if (isActive) setCurrentUser(user);
      })
      .catch((error: unknown) => {
        if (!isActive) return;
        if (error instanceof AuthApiError && error.status === 401) {
          router.replace("/login");
          return;
        }
        setAuthError(
          error instanceof Error
            ? error.message
            : "Could not verify your session.",
        );
      });

    return () => {
      isActive = false;
    };
  }, [authAttempt, router]);

  async function handleSignOut() {
    setIsSigningOut(true);
    setAuthError("");
    try {
      await authRequest<void>("/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch (error) {
      setAuthError(
        error instanceof Error ? error.message : "Sign out failed.",
      );
      setIsSigningOut(false);
    }
  }

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070f1d] px-5 text-slate-100">
        <section className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0b1728] p-6 text-center">
          {authError ? (
            <>
              <h1 className="text-lg font-semibold">Workspace unavailable</h1>
              <p role="alert" className="mt-2 text-sm leading-6 text-rose-200">
                {authError}
              </p>
              <button
                type="button"
                onClick={() => {
                  setCurrentUser(null);
                  setAuthError("");
                  setAuthAttempt((attempt) => attempt + 1);
                }}
                className="mt-5 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-semibold text-[#06111f]"
              >
                Try again
              </button>
            </>
          ) : (
            <p role="status" className="text-sm text-slate-300">
              Verifying your UrduTruth account…
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#070f1d] font-sans text-slate-100">
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[248px] flex-col border-r border-white/[0.07] bg-[#091426] px-4 py-5 transition-transform duration-200 md:translate-x-0 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Link href="/dashboard" className="mb-7 flex items-center gap-2.5 px-2">
          <Image
            src="/urdu-truth-logo.png"
            alt=""
            width={36}
            height={36}
            className="h-8 w-8 object-contain"
          />
          <span className="text-[13px] font-bold tracking-[0.15em] text-slate-200">
            URDU <span className="text-cyan-300">TRUTH</span>
          </span>
        </Link>

        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          Workspace
        </p>
        <nav aria-label="Main navigation" className="space-y-1">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              (item.href === "/check" && pathname.startsWith("/result"));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-10 items-center gap-3 rounded-lg px-3 text-[13px] transition ${active ? "bg-cyan-400/[0.11] font-medium text-cyan-200 ring-1 ring-inset ring-cyan-300/[0.12]" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-100"}`}
              >
                <UiIcon name={item.icon} className="h-[17px] w-[17px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-cyan-300/[0.1] bg-cyan-300/[0.04] p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-slate-300">Workspace ready</span>
          </div>
          <p className="text-[11px] leading-5 text-slate-500">
            Review Urdu and English claims with evidence-first checks.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="mt-3 min-h-10 rounded-lg px-3 text-left text-[12px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-100 disabled:cursor-wait disabled:opacity-60"
        >
          {isSigningOut ? "Signing out…" : "Sign out"}
        </button>
        {authError && (
          <p role="alert" className="mt-2 px-2 text-[11px] leading-5 text-rose-300">
            {authError}
          </p>
        )}
        <p className="mt-4 px-2 text-[10px] text-slate-600">UrduTruth.com</p>
      </aside>

      <div className="min-h-screen md:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-white/[0.07] bg-[#070f1d]/90 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300 hover:bg-white/[0.05] md:hidden"
            aria-label="Open navigation menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          </button>

          <label className="relative ml-auto hidden w-full max-w-[340px] sm:block">
            <UiIcon name="dashboard" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              placeholder="Search your checks..."
              aria-label="Search your checks"
              className="h-9 w-full rounded-lg border border-white/[0.08] bg-white/[0.025] pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
            />
          </label>

          <Link
            href="/check"
            className="hidden h-9 items-center gap-2 rounded-lg bg-cyan-400 px-3 text-xs font-semibold text-[#06111f] transition hover:bg-cyan-300 sm:flex"
          >
            <UiIcon name="check" className="h-4 w-4" />
            Check a post
          </Link>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-[18px] w-[18px]" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cyan-300" />
          </button>

          <Link
            href="/profile"
            aria-label="Open profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-teal-500 text-[11px] font-bold text-[#06111f] ring-2 ring-cyan-300/10"
          >
            {currentUser.full_name
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0])
              .join("")
              .toUpperCase()}
          </Link>
        </header>

        <main className="mx-auto w-full max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>

        <Link
          href="/check"
          className="fixed bottom-5 right-5 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-400 text-[#06111f] shadow-lg shadow-cyan-950/40 transition hover:scale-105 sm:hidden"
          aria-label="Check a post"
        >
          <UiIcon name="check" className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
