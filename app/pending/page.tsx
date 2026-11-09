
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowser } from "../lib/supabaseBrowser";

type ApprovalStatus = "pending" | "approved" | "rejected";

export default function PendingPage() {
  const router = useRouter();

  const [status, setStatus] = useState<ApprovalStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function checkAccount() {
      try {
        const supabase = getSupabaseBrowser();

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        const { data: profile, error: profileError } =
          await supabase
            .from("user_profiles")
            .select("approval_status")
            .eq("id", user.id)
            .maybeSingle();

        if (!active) return;

        if (profileError) {
          setError(
            "Unable to check your account status. Please try again."
          );
          return;
        }

        if (profile?.approval_status === "approved") {
          router.replace("/cases");
          return;
        }

        setStatus(
          profile?.approval_status === "rejected"
            ? "rejected"
            : "pending"
        );
      } catch {
        if (active) {
          setError(
            "Unable to check your account status. Please try again."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void checkAccount();

    return () => {
      active = false;
    };
  }, [router]);

  async function handleSignOut() {
    setError("");

    try {
      const supabase = getSupabaseBrowser();
      const { error: signOutError } =
        await supabase.auth.signOut();

      if (signOutError) {
        setError("Unable to sign out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch {
      setError("Unable to sign out. Please try again.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 text-center shadow-xl">
        <div className="mb-3 text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Surgical Navigation
        </div>

        {loading ? (
          <>
            <h1 className="text-2xl font-bold">
              Checking Account Status
            </h1>

            <p className="mt-4 text-sm text-slate-400">
              Please wait while we verify your access.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold">
              {status === "rejected"
                ? "Access Request Declined"
                : status === "pending"
                  ? "Approval Pending"
                  : "Unable to Verify Access"}
            </h1>

            <p className="mt-4 text-sm leading-6 text-slate-400">
              {status === "rejected"
                ? "Your account access request was declined by an administrator."
                : status === "pending"
                  ? "Your account has been created, but an administrator must approve it before you can access surgical navigation cases."
                  : "We couldn't verify your account status. Please try signing in again later."}
            </p>

            {status === "pending" && (
              <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-left">
                <p className="text-sm text-amber-200">
                  Once an administrator approves your
                  account, you can sign in and access
                  the features assigned to your role.
                </p>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="mt-5 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              className="mt-7 w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Sign Out
            </button>
          </>
        )}

        <p className="mt-8 text-xs text-slate-500">
          SNCT • Educational demonstration using
          simulated case data
        </p>
      </div>
    </main>
  );
}
