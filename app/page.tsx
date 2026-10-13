"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "./components/Navbar";
import DeleteCaseButton from "./components/DeleteCaseButton";
import {
  getCases,
  SurgicalCase,
} from "./lib/caseStorage";

export default function Home() {
  const [cases, setCases] = useState<SurgicalCase[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCases(getCases());
    setLoaded(true);
  }, []);

  const totalCases = cases.length;

  const navigationCases = cases.filter(
    (item) =>
      item.type === "Navigation" ||
      item.type === "Navigation + Robotic"
  ).length;

  const roboticCases = cases.filter(
    (item) =>
      item.type === "Robotic" ||
      item.type === "Navigation + Robotic"
  ).length;

  const averageDuration =
    totalCases > 0
      ? Math.round(
          cases.reduce(
            (total, item) =>
              total + (Number(item.duration) || 0),
            0
          ) / totalCases
        )
      : 0;

  const recentCases = [...cases]
    .sort((a, b) => {
      return (
        new Date(b.date).getTime() -
        new Date(a.date).getTime()
      );
    })
    .slice(0, 4);

  function formatDate(date: string) {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function handleCaseDeleted(caseId: string) {
    setCases((currentCases) =>
      currentCases.filter(
        (surgicalCase) => surgicalCase.id !== caseId
      )
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-cyan-600 font-semibold mb-2">
              Surgical Case Management
            </p>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Surgical Navigation Case Tracker
            </h1>

            <p className="text-slate-600 text-base md:text-lg">
              Track and review your navigation and robotic-assisted surgical
              cases.
            </p>
          </div>

          <Link
            href="/add-case"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow text-center"
          >
            + Add Case
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Total Cases
            </p>

            <p className="text-3xl font-bold text-slate-900">
              {loaded ? totalCases : "—"}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              All recorded cases
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Navigation Cases
            </p>

            <p className="text-3xl font-bold text-cyan-600">
              {loaded ? navigationCases : "—"}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Navigation-assisted
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Robotic Cases
            </p>

            <p className="text-3xl font-bold text-slate-900">
              {loaded ? roboticCases : "—"}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Robotic-assisted
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Average Duration
            </p>

            <p className="text-3xl font-bold text-slate-900">
              {loaded ? `${averageDuration} min` : "—"}
            </p>

            <p className="text-sm text-slate-500 mt-2">
              Across all cases
            </p>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 sm:px-6 py-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Cases
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Recently recorded surgical cases
              </p>
            </div>

            <Link
              href="/cases"
              className="text-cyan-600 hover:text-cyan-700 font-medium"
            >
              View All Cases →
            </Link>
          </div>

          {!loaded ? (
            <div className="px-6 py-12 text-center text-slate-500">
              Loading cases...
            </div>
          ) : recentCases.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                No cases recorded
              </h3>

              <p className="text-slate-500 mt-2">
                Add your first surgical case to begin tracking cases.
              </p>

              <Link
                href="/add-case"
                className="inline-block mt-5 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Add Case
              </Link>
            </div>
          ) : (
            <>
              {/* Compact cards keep every action visible on phones. */}
              <div className="divide-y divide-slate-200 lg:hidden">
                {recentCases.map((item) => (
                  <div key={item.id} className="p-5 space-y-3">
                    <div className="min-w-0">
                      <Link href={`/cases/${item.id}`} className="font-semibold text-slate-900 hover:text-cyan-700 break-words">
                        {item.name}
                      </Link>
                      <p className="text-xs text-slate-500 mt-1 break-all">{item.id}</p>
                    </div>
                    <p className="text-sm text-slate-700 break-words">{item.procedure}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full">{item.region}</span>
                      <span className={item.type === "Navigation" ? "bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full" : "bg-violet-100 text-violet-700 px-2 py-1 rounded-full"}>{item.type}</span>
                      <span className={item.status === "Completed" ? "bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full" : item.status === "Cancelled" ? "bg-red-100 text-red-700 px-2 py-1 rounded-full" : "bg-amber-100 text-amber-700 px-2 py-1 rounded-full"}>● {item.status}</span>
                    </div>
                    <p className="text-sm text-slate-500">{formatDate(item.date)} · {item.duration} min</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/cases/${item.id}`} className="border border-cyan-300 text-cyan-700 px-3 py-2 rounded-lg hover:bg-cyan-50">View</Link>
                      <Link href={`/cases/${item.id}/edit`} className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50">Edit</Link>
                      <DeleteCaseButton caseId={item.id} caseName={item.name} onDeleted={handleCaseDeleted} />
                    </div>
                  </div>
                ))}
              </div>
              {/* Laptop/desktop table: no forced minimum width or hidden actions. */}
              <div className="hidden lg:block">
                <table className="w-full table-fixed text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="w-[23%] px-3 xl:px-4 py-4 font-semibold">Case / ID</th>
                      <th className="w-[22%] px-3 xl:px-4 py-4 font-semibold">Procedure</th>
                      <th className="w-[17%] px-3 xl:px-4 py-4 font-semibold">Type</th>
                      <th className="w-[13%] px-3 xl:px-4 py-4 font-semibold">Status</th>
                      <th className="w-[25%] px-3 xl:px-4 py-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {recentCases.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-3 xl:px-4 py-4 align-top min-w-0">
                          <Link href={`/cases/${item.id}`} className="block font-semibold text-slate-900 hover:text-cyan-700 break-words">{item.name}</Link>
                          <div className="text-xs text-slate-400 mt-1 break-all">{item.id}</div>
                        </td>
                        <td className="px-3 xl:px-4 py-4 align-top text-slate-700 break-words">{item.procedure}</td>
                        <td className="px-3 xl:px-4 py-4 align-top">
                          <span className={item.type === "Navigation" ? "inline-block bg-cyan-100 text-cyan-700 px-2 py-1 rounded-full text-xs break-words" : "inline-block bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs break-words"}>{item.type}</span>
                        </td>
                        <td className="px-3 xl:px-4 py-4 align-top">
                          <span className={item.status === "Completed" ? "inline-block bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs" : item.status === "Cancelled" ? "inline-block bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs" : "inline-block bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs"}>● {item.status}</span>
                        </td>
                        <td className="px-3 xl:px-4 py-4 align-top">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link href={`/cases/${item.id}`} className="border border-cyan-300 text-cyan-700 px-2 py-2 rounded-lg hover:bg-cyan-50">View</Link>
                            <Link href={`/cases/${item.id}/edit`} className="border border-slate-300 text-slate-700 px-2 py-2 rounded-lg hover:bg-slate-50">Edit</Link>
                            <DeleteCaseButton caseId={item.id} caseName={item.name} onDeleted={handleCaseDeleted} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/add-case"
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-cyan-300 transition-colors"
          >
            <p className="text-cyan-600 font-semibold mb-2">
              New Case
            </p>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Record a Surgical Case
            </h3>

            <p className="text-slate-500">
              Add a new navigation or robotic-assisted procedure.
            </p>
          </Link>

          <Link
            href="/cases"
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-cyan-300 transition-colors"
          >
            <p className="text-cyan-600 font-semibold mb-2">
              Case Records
            </p>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Manage Existing Cases
            </h3>

            <p className="text-slate-500">
              View, edit, and manage previously recorded surgical cases.
            </p>
          </Link>
        </div>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}