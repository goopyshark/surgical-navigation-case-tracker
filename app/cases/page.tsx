"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import type { SurgicalCase } from "../lib/caseStorage";
import { mapDatabaseCase, type DatabaseCase } from "../lib/caseMapper";

export default function CasesPage() {
  const [cases, setCases] = useState<SurgicalCase[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [technologyFilter, setTechnologyFilter] =
    useState("All Technology");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  useEffect(() => {
    const controller = new AbortController();

    async function loadCases() {
      try {
        const response = await fetch("/api/cases", {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            response.status === 401
              ? "Your session has expired. Please sign in again."
              : `Unable to load cases (HTTP ${response.status}).`
          );
        }

        const result: { cases?: DatabaseCase[] } = await response.json();
        if (!Array.isArray(result.cases)) {
          throw new Error("The server returned an unexpected response.");
        }

        setCases(result.cases.map(mapDatabaseCase));
      } catch (error) {
        if (controller.signal.aborted) return;
        setLoadError(
          error instanceof Error ? error.message : "Unable to load cases."
        );
      } finally {
        if (!controller.signal.aborted) setLoaded(true);
      }
    }

    void loadCases();
    return () => controller.abort();
  }, []);

  const filteredCases = cases.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      item.procedure.toLowerCase().includes(search);

    const matchesRegion =
      regionFilter === "All Regions" ||
      item.region === regionFilter;

    const matchesTechnology =
      technologyFilter === "All Technology" ||
      item.type === technologyFilter;

    const matchesStatus =
      statusFilter === "All Statuses" ||
      item.status === statusFilter;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesTechnology &&
      matchesStatus
    );
  });

  async function deleteCase(item: SurgicalCase) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Permanently delete "${item.name}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setDeleteError("");
    setDeletingId(item.id);

    try {
      const response = await fetch(
        `/api/cases/${encodeURIComponent(item.id)}`,
        { method: "DELETE" }
      );
      const result: { success?: boolean; deletedId?: string; error?: string } =
        await response.json();

      if (!response.ok || !result.success || result.deletedId !== item.id) {
        throw new Error(result.error || "Unable to delete case.");
      }

      setCases((current) => current.filter((entry) => entry.id !== item.id));
    } catch (error) {
      setDeleteError(
        error instanceof Error ? error.message : "Unable to delete case."
      );
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setSearchTerm("");
    setRegionFilter("All Regions");
    setTechnologyFilter("All Technology");
    setStatusFilter("All Statuses");
  }

  const filtersActive =
    searchTerm !== "" ||
    regionFilter !== "All Regions" ||
    technologyFilter !== "All Technology" ||
    statusFilter !== "All Statuses";

  function formatDate(date: string) {
    if (!date) return "Not specified";

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function typeStyle(type: string) {
    return type === "Navigation"
      ? "bg-cyan-100 text-cyan-700"
      : "bg-violet-100 text-violet-700";
  }

  function statusStyle(status: string) {
    if (status === "Completed") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Cancelled") {
      return "bg-red-100 text-red-700";
    }

    return "bg-amber-100 text-amber-700";
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="border-l-4 border-cyan-500 pl-4 text-3xl font-bold md:text-4xl">
              Surgical Cases
            </h1>

            <p className="mt-3 text-base text-slate-500 md:text-lg">
              View and manage your surgical navigation and
              robotic-assisted cases.
            </p>
          </div>

          <a
            href="/add-case"
            className="rounded-xl bg-cyan-600 px-6 py-3 text-center font-semibold text-white shadow hover:bg-cyan-700"
          >
            + Add Case
          </a>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 rounded-2xl bg-white p-5 shadow-sm md:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <select
              value={regionFilter}
              onChange={(event) =>
                setRegionFilter(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
            >
              <option>All Regions</option>
              <option>Spine</option>
              <option>Cranial</option>
              <option>Cervical</option>
              <option>Thoracic</option>
              <option>Lumbar</option>
            </select>

            <select
              value={technologyFilter}
              onChange={(event) =>
                setTechnologyFilter(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
            >
              <option>All Technology</option>
              <option>Navigation</option>
              <option>Robotic</option>
              <option>Navigation + Robotic</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
            >
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Planned</option>
              <option>Cancelled</option>
            </select>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredCases.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {cases.length}
              </span>{" "}
              cases
            </p>

            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-left text-sm font-medium text-cyan-700 hover:text-cyan-900 sm:text-right"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {deleteError && (
          <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {deleteError}
          </div>
        )}

        {/* Case List */}
        <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
          {!loaded ? (
            <div className="px-6 py-14 text-center text-slate-500">
              Loading cases...
            </div>
          ) : loadError ? (
            <div role="alert" className="px-6 py-14 text-center text-red-700">
              {loadError}
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-4">Case / ID</th>
                      <th className="px-3 py-4">Procedure</th>
                      <th className="px-3 py-4">Region</th>
                      <th className="px-3 py-4">Technology</th>
                      <th className="px-3 py-4">Date</th>
                      <th className="px-3 py-4">Duration</th>
                      <th className="px-3 py-4">Status</th>
                      <th className="px-3 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCases.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-3 py-4">
                          <div className="font-semibold text-slate-900">
                            {item.name}
                          </div>
                          <div className="mt-1 text-xs text-slate-400">
                            {item.id}
                          </div>
                        </td>

                        <td className="px-3 py-4">
                          {item.procedure}
                        </td>

                        <td className="px-3 py-4">
                          {item.region}
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${typeStyle(item.type)}`}
                          >
                            {item.type}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-3 py-4">
                          {formatDate(item.date)}
                        </td>

                        <td className="whitespace-nowrap px-3 py-4">
                          {item.duration} min
                        </td>

                        <td className="px-3 py-4">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${statusStyle(item.status)}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-3 py-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={`/cases/${encodeURIComponent(item.id)}`}
                              className="rounded-lg border border-cyan-300 px-3 py-2 text-xs font-medium text-cyan-700 hover:bg-cyan-50"
                            >
                              View
                            </a>
                            <a
                              href={`/cases/${encodeURIComponent(item.id)}/edit`}
                              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                            >
                              Edit
                            </a>
                            <button
                              type="button"
                              onClick={() => void deleteCase(item)}
                              disabled={deletingId !== null}
                              className="rounded-lg border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === item.id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile and Tablet Cards */}
              <div className="grid gap-4 p-4 lg:hidden">
                {filteredCases.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 p-4 shadow-sm"
                  >
                    <div className="mb-3">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {item.name}
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        {item.id}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">
                          Procedure
                        </p>
                        <p className="font-medium">
                          {item.procedure}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Region
                        </p>
                        <p>{item.region}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Technology
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${typeStyle(item.type)}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Date
                        </p>
                        <p>{formatDate(item.date)}</p>
                      </div>

                      <div>
                        <p className="text-xs text-slate-500">
                          Duration
                        </p>
                        <p>{item.duration} min</p>
                      </div>

                      <div className="col-span-2">
                        <p className="text-xs text-slate-500">
                          Status
                        </p>
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${statusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
                      <a
                        href={`/cases/${encodeURIComponent(item.id)}`}
                        className="rounded-lg border border-cyan-300 px-4 py-2 text-sm font-medium text-cyan-700 hover:bg-cyan-50"
                      >
                        View
                      </a>
                      <a
                        href={`/cases/${encodeURIComponent(item.id)}/edit`}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        Edit
                      </a>
                      <button
                        type="button"
                        onClick={() => void deleteCase(item)}
                        disabled={deletingId !== null}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredCases.length === 0 && (
                <div className="px-6 py-14 text-center">
                  <div className="mb-3 text-4xl">⌕</div>

                  <h2 className="text-xl font-semibold">
                    No cases found
                  </h2>

                  <p className="mt-2 text-slate-500">
                    {filtersActive
                      ? "Try changing your search or filter selections."
                      : "No database cases have been added yet."}
                  </p>

                  {filtersActive && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="mt-5 rounded-lg bg-cyan-600 px-5 py-2 font-medium text-white hover:bg-cyan-700"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <footer className="mt-8 pb-6 text-xs text-slate-400">
          SNCT • For educational and simulation use only •
          Not for clinical decision-making
        </footer>
      </section>
    </main>
  );
}