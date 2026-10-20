
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

type Activity = {
  id: string;
  case_id: string;
  case_name: string;
  action: "CREATED" | "UPDATED" | "DELETED";
  description: string | null;
  performed_at: string;
};

export default function ActivityPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadActivities() {
      try {
        const response = await fetch("/api/activity", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Please sign in to view activity history."
              : "Unable to load activity history."
          );
        }

        const result: { activities?: Activity[] } =
          await response.json();

        if (!Array.isArray(result.activities)) {
          throw new Error("Unexpected server response.");
        }

        if (!controller.signal.aborted) {
          setActivities(result.activities);
        }
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load activity history."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => controller.abort();
  }, []);

  function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function actionStyles(action: Activity["action"]) {
    switch (action) {
      case "CREATED":
        return "bg-emerald-100 text-emerald-800";
      case "UPDATED":
        return "bg-cyan-100 text-cyan-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-cyan-600 font-semibold mb-2">
              Surgical Case Management
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              Activity History
            </h1>

            <p className="text-slate-600 mt-3">
              Review surgical case creation, updates, and deletions.
            </p>
          </div>

          <Link
            href="/cases"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
          >
            View Cases
          </Link>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showing up to 100 recent activity records
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-slate-500">
              Loading activity history...
            </div>
          ) : error ? (
            <div
              role="alert"
              className="px-6 py-12 text-center text-red-700"
            >
              <p>{error}</p>

              <Link
                href="/login?next=%2Factivity"
                className="inline-block mt-3 underline"
              >
                Sign in
              </Link>
            </div>
          ) : activities.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-500">
              No activity has been recorded yet.
            </div>
          ) : (
            <>
              {/* Mobile and tablet cards */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-5 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${actionStyles(activity.action)}`}
                      >
                        {activity.action}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatDate(activity.performed_at)}
                      </span>
                    </div>

                    <h3 className="font-semibold text-slate-900 break-words">
                      {activity.case_name}
                    </h3>

                    <p className="text-sm text-slate-600 break-words">
                      {activity.description || "No description provided."}
                    </p>

                    <p className="text-xs text-slate-400 break-all">
                      Case ID: {activity.case_id}
                    </p>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="w-[20%] px-5 py-4 font-semibold">
                        Date / Time
                      </th>
                      <th className="w-[23%] px-5 py-4 font-semibold">
                        Case Name
                      </th>
                      <th className="w-[15%] px-5 py-4 font-semibold">
                        Action
                      </th>
                      <th className="w-[42%] px-5 py-4 font-semibold">
                        Description
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-200">
                    {activities.map((activity) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4 align-top text-slate-600">
                          {formatDate(activity.performed_at)}
                        </td>

                        <td className="px-5 py-4 align-top">
                          <p className="font-semibold text-slate-900 break-words">
                            {activity.case_name}
                          </p>
                          <p className="text-xs text-slate-400 mt-1 break-all">
                            {activity.case_id}
                          </p>
                        </td>

                        <td className="px-5 py-4 align-top">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${actionStyles(activity.action)}`}
                          >
                            {activity.action}
                          </span>
                        </td>

                        <td className="px-5 py-4 align-top text-slate-600 break-words">
                          {activity.description || "No description provided."}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}
