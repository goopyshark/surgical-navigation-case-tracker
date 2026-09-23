"use client";

import { useState } from "react";
import DeleteCaseButton from "../components/DeleteCaseButton";
import Navbar from "../components/Navbar";

const cases = [
  {
    id: "SNC-2026-024",
    name: "Scoliosis Fusion",
    procedure: "Posterior Spinal Fusion",
    region: "Spine",
    type: "Navigation",
    date: "Aug 27, 2026",
    duration: "178 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-023",
    name: "Cranial Biopsy",
    procedure: "Stereotactic Biopsy",
    region: "Cranial",
    type: "Navigation",
    date: "Aug 24, 2026",
    duration: "94 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-022",
    name: "Pedicle Screw Placement",
    procedure: "Lumbar Fusion",
    region: "Spine",
    type: "Robotic",
    date: "Aug 20, 2026",
    duration: "154 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-021",
    name: "Cervical Fusion",
    procedure: "Anterior Cervical Fusion",
    region: "Cervical",
    type: "Navigation",
    date: "Aug 15, 2026",
    duration: "126 min",
    status: "Completed",
  },
];

export default function CasesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [technologyFilter, setTechnologyFilter] =
    useState("All Technology");
  const [statusFilter, setStatusFilter] = useState("All Statuses");

  const filteredCases = cases.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.id.toLowerCase().includes(search) ||
      item.procedure.toLowerCase().includes(search);

    const matchesRegion =
      regionFilter === "All Regions" || item.region === regionFilter;

    const matchesTechnology =
      technologyFilter === "All Technology" ||
      item.type === technologyFilter;

    const matchesStatus =
      statusFilter === "All Statuses" || item.status === statusFilter;

    return (
      matchesSearch &&
      matchesRegion &&
      matchesTechnology &&
      matchesStatus
    );
  });

  const clearFilters = () => {
    setSearchTerm("");
    setRegionFilter("All Regions");
    setTechnologyFilter("All Technology");
    setStatusFilter("All Statuses");
  };

  const filtersActive =
    searchTerm !== "" ||
    regionFilter !== "All Regions" ||
    technologyFilter !== "All Technology" ||
    statusFilter !== "All Statuses";

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-cyan-500 pl-4">
              Surgical Cases
            </h1>

            <p className="text-slate-500 mt-3 text-base md:text-lg">
              View and manage your surgical navigation and robotic-assisted
              cases.
            </p>
          </div>

          <a
            href="/add-case"
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow text-center"
          >
            + Add Case
          </a>
        </div>

        {/* Search and Filters */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-5 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search cases..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <select
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
            >
              <option>All Regions</option>
              <option>Spine</option>
              <option>Cranial</option>
              <option>Cervical</option>
            </select>

            <select
              value={technologyFilter}
              onChange={(event) =>
                setTechnologyFilter(event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
            >
              <option>All Technology</option>
              <option>Navigation</option>
              <option>Robotic</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
            >
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Planned</option>
              <option>Cancelled</option>
            </select>
          </div>

          {/* Filter Summary */}
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
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
                className="text-cyan-700 hover:text-cyan-900 font-medium text-sm text-left sm:text-right"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Cases Table */}
        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4">Case / ID</th>
                  <th className="px-6 py-4">Procedure</th>
                  <th className="px-6 py-4">Region</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-slate-50 transition"
                  >
                    <td className="px-6 py-5">
                      <div className="font-semibold">{item.name}</div>

                      <div className="text-xs text-slate-400 mt-1">
                        {item.id}
                      </div>
                    </td>

                    <td className="px-6 py-5">{item.procedure}</td>

                    <td className="px-6 py-5">{item.region}</td>

                    <td className="px-6 py-5">
                      <span
                        className={
                          item.type === "Navigation"
                            ? "bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-sm"
                            : "bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm"
                        }
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="px-6 py-5">{item.date}</td>

                    <td className="px-6 py-5">{item.duration}</td>

                    <td className="px-6 py-5">
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                        ● {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <a
                          href={`/cases/${item.id}`}
                          className="border border-cyan-300 text-cyan-700 hover:bg-cyan-50 px-3 py-2 rounded-lg"
                        >
                          View
                        </a>

                        <a
                          href={`/cases/${item.id}/edit`}
                          className="border border-slate-300 text-slate-700 hover:bg-slate-100 px-3 py-2 rounded-lg"
                        >
                          Edit
                        </a>

                        <DeleteCaseButton caseName={item.name} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Search Results */}
          {filteredCases.length === 0 && (
            <div className="py-14 px-6 text-center">
              <div className="text-4xl mb-3">⌕</div>

              <h2 className="text-xl font-semibold">
                No cases found
              </h2>

              <p className="text-slate-500 mt-2">
                Try changing your search or filter selections.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Clear Filters
              </button>
            </div>
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