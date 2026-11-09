
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type UserRole = "administrator" | "editor" | "viewer";

type ApprovalStatus = "pending" | "approved" | "rejected";

type UserProfile = {
  id: string;
  email: string;
  role: UserRole;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
};

type UserDraft = {
  role: UserRole;
  approval_status: ApprovalStatus;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("all");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/users", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to load registered users."
        );
      }

      const profiles: UserProfile[] = result.users ?? [];

      setUsers(profiles);

      const initialDrafts: Record<string, UserDraft> = {};

      for (const user of profiles) {
        initialDrafts[user.id] = {
          role: user.role,
          approval_status: user.approval_status,
        };
      }

      setDrafts(initialDrafts);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load registered users."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function updateDraft(
    id: string,
    field: keyof UserDraft,
    value: string
  ) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  }

  async function saveUser(user: UserProfile) {
    const draft = drafts[user.id];

    if (!draft) return;

    const confirmed = window.confirm(
      `Save changes for ${user.email}?\n\n` +
        `Role: ${draft.role}\n` +
        `Status: ${draft.approval_status}`
    );

    if (!confirmed) return;

    setSavingId(user.id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `/api/admin/users/${encodeURIComponent(user.id)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(draft),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error ?? "Unable to update account."
        );
      }

      setMessage(
        `Account updated successfully: ${user.email}`
      );

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update account."
      );
    } finally {
      setSavingId(null);
    }
  }

  const visibleUsers = users.filter((user) => {
    return (
      filter === "all" ||
      user.approval_status === filter
    );
  });

  const pendingCount = users.filter(
    (user) => user.approval_status === "pending"
  ).length;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-cyan-400">
              Surgical Navigation
            </p>

            <h1 className="text-3xl font-bold">
              User Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Review registrations, approve accounts,
              and manage user permissions.
            </p>
          </div>

          <Link
            href="/cases"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
          >
            Back to Cases
          </Link>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Total Users
            </p>
            <p className="mt-2 text-3xl font-bold">
              {users.length}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Pending Approval
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-400">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">
              Approved Users
            </p>
            <p className="mt-2 text-3xl font-bold text-green-400">
              {
                users.filter(
                  (user) =>
                    user.approval_status === "approved"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label
            htmlFor="status-filter"
            className="text-sm text-slate-300"
          >
            Filter by status:
          </label>

          <select
            id="status-filter"
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value)
            }
            className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm"
          >
            <option value="all">All Users</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            type="button"
            onClick={() => void loadUsers()}
            disabled={loading}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mb-5 rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {error}
          </p>
        )}

        {message && (
          <p
            role="status"
            className="mb-5 rounded-lg border border-green-500/40 bg-green-500/10 p-4 text-sm text-green-300"
          >
            {message}
          </p>
        )}

        {loading ? (
          <p className="text-slate-400">
            Loading registered users...
          </p>
        ) : visibleUsers.length === 0 ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 text-center text-slate-400">
            No users found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {visibleUsers.map((user) => {
              const draft = drafts[user.id];

              const hasChanges =
                draft &&
                (draft.role !== user.role ||
                  draft.approval_status !==
                    user.approval_status);

              return (
                <div
                  key={user.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="break-all text-lg font-semibold">
                        {user.email}
                      </h2>

                      <p className="mt-1 text-xs text-slate-500">
                        Registered:{" "}
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
                      </p>

                      <p className="mt-2 text-sm text-slate-400">
                        Current role:{" "}
                        <span className="font-semibold text-white">
                          {user.role}
                        </span>
                        {" • "}
                        Status:{" "}
                        <span className="font-semibold text-white">
                          {user.approval_status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor={`role-${user.id}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        Assigned Role
                      </label>

                      <select
                        id={`role-${user.id}`}
                        value={draft?.role ?? user.role}
                        onChange={(event) =>
                          updateDraft(
                            user.id,
                            "role",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                      >
                        <option value="viewer">
                          Viewer
                        </option>
                        <option value="editor">
                          Editor
                        </option>
                        <option value="administrator">
                          Administrator
                        </option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor={`status-${user.id}`}
                        className="mb-2 block text-sm font-medium"
                      >
                        Approval Status
                      </label>

                      <select
                        id={`status-${user.id}`}
                        value={
                          draft?.approval_status ??
                          user.approval_status
                        }
                        onChange={(event) =>
                          updateDraft(
                            user.id,
                            "approval_status",
                            event.target.value
                          )
                        }
                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white"
                      >
                        <option value="pending">
                          Pending
                        </option>
                        <option value="approved">
                          Approved
                        </option>
                        <option value="rejected">
                          Rejected
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <button
                      type="button"
                      onClick={() => void saveUser(user)}
                      disabled={
                        !hasChanges ||
                        savingId !== null ||
                        loading
                      }
                      className="rounded-lg bg-cyan-500 px-5 py-2.5 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {savingId === user.id
                        ? "Saving..."
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-slate-500">
          SNCT • Administrator Access Only
        </p>
      </div>
    </main>
  );
}
