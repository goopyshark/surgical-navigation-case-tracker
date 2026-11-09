
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../lib/supabaseBrowser";

type UserRole = "administrator" | "editor" | "viewer";

export default function Navbar() {
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    const supabase = getSupabaseBrowser();

    async function loadUserRole() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          setSignedIn(false);
          setRole(null);
          return;
        }

        setSignedIn(true);

        const { data: profile, error: profileError } =
          await supabase
            .from("user_profiles")
            .select("role, approval_status")
            .eq("id", user.id)
            .maybeSingle();

        if (!active) return;

        if (
          profileError ||
          profile?.approval_status !== "approved"
        ) {
          setRole(null);
          return;
        }

        if (
          profile.role === "administrator" ||
          profile.role === "editor" ||
          profile.role === "viewer"
        ) {
          setRole(profile.role);
        } else {
          setRole(null);
        }
      } catch {
        if (active) {
          setRole(null);
        }
      }
    }

    void loadUserRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      if (active) {
        setRole(null);
        void loadUserRole();
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const supabase = getSupabaseBrowser();

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error.message);
        alert("Unable to sign out. Please try again.");
        return;
      }

      setRole(null);
      setSignedIn(false);
      setMenuOpen(false);

      router.replace("/login");
      router.refresh();
    } catch {
      alert("Unable to sign out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  const canCreateCases =
    role === "administrator" || role === "editor";

  const isAdministrator = role === "administrator";

  const navigationLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/cases", label: "Cases" },
    ...(canCreateCases
      ? [{ href: "/add-case", label: "Add Case" }]
      : []),
    { href: "/activity", label: "Activity History" },
    ...(isAdministrator
      ? [
          {
            href: "/admin/users",
            label: "User Management",
          },
        ]
      : []),
    { href: "/about", label: "About" },
  ];

  return (
    <nav className="bg-slate-950 text-white">
      <div className="flex items-center justify-between px-6 py-4 md:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500 font-bold text-slate-950">
            +
          </div>

          <span className="text-2xl font-bold">
            SNCT
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-cyan-400"
            >
              {link.label}
            </Link>
          ))}

          {signedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-slate-400 transition-colors hover:text-cyan-400 disabled:opacity-50"
            >
              {loggingOut ? "Signing Out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              className="text-slate-400 transition-colors hover:text-cyan-400"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-lg border border-slate-700 px-3 py-2 hover:bg-slate-800 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className="text-xl">
            {menuOpen ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-slate-800 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 hover:bg-slate-800 hover:text-cyan-400"
              >
                {link.label}
              </Link>
            ))}

            {signedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-lg px-4 py-3 text-left text-slate-400 hover:bg-slate-800 hover:text-cyan-400 disabled:opacity-50"
              >
                {loggingOut
                  ? "Signing Out..."
                  : "Logout"}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-cyan-400"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
