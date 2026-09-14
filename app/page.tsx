import Link from "next/link";
import DeleteCaseButton from "./components/DeleteCaseButton";

const recentCases = [
  {
    id: "SNC-2026-024",
    procedure: "Scoliosis Fusion",
    type: "Navigation",
    region: "Spine",
    date: "Sep 12, 2026",
    duration: "185 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-023",
    procedure: "Cranial Biopsy",
    type: "Navigation",
    region: "Cranial",
    date: "Sep 10, 2026",
    duration: "95 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-022",
    procedure: "Lumbar Fusion",
    type: "Robotic",
    region: "Spine",
    date: "Sep 8, 2026",
    duration: "160 min",
    status: "Completed",
  },
  {
    id: "SNC-2026-021",
    procedure: "Thoracic Fusion",
    type: "Navigation",
    region: "Spine",
    date: "Sep 5, 2026",
    duration: "130 min",
    status: "Completed",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              +
            </div>
            <span className="text-xl font-bold">SNCT</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="bg-cyan-600 px-4 py-2 rounded-lg font-medium"
            >
              Dashboard
            </Link>

            <Link href="/cases" className="hover:text-cyan-400">
              Cases
            </Link>

            <Link href="/add-case" className="hover:text-cyan-400">
              Add Case
            </Link>

            <Link href="/about" className="hover:text-cyan-400">
              About
            </Link>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <p className="text-cyan-600 font-semibold mb-2">
              Surgical Case Management
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Surgical Navigation Case Tracker
            </h1>

            <p className="text-slate-600 text-lg">
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
            <p className="text-3xl font-bold text-slate-900">24</p>
            <p className="text-sm text-slate-500 mt-2">All recorded cases</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Navigation Cases
            </p>
            <p className="text-3xl font-bold text-cyan-600">16</p>
            <p className="text-sm text-slate-500 mt-2">
              Navigation-assisted
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Robotic Cases
            </p>
            <p className="text-3xl font-bold text-slate-900">8</p>
            <p className="text-sm text-slate-500 mt-2">Robotic-assisted</p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500 mb-2">
              Average Duration
            </p>
            <p className="text-3xl font-bold text-slate-900">142 min</p>
            <p className="text-sm text-slate-500 mt-2">Across all cases</p>
          </div>
        </div>

        {/* Recent Cases */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
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

          {/* Makes table scrollable on smaller screens */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-semibold">Case ID</th>
                  <th className="px-6 py-4 font-semibold">Procedure</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Region</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Duration</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {recentCases.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-5 font-medium text-slate-900 whitespace-nowrap">
                      {item.id}
                    </td>

                    <td className="px-6 py-5 text-slate-700 whitespace-nowrap">
                      {item.procedure}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          item.type === "Robotic"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-cyan-100 text-cyan-700"
                        }`}
                      >
                        {item.type}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-slate-600">
                      {item.region}
                    </td>

                    <td className="px-6 py-5 text-slate-600 whitespace-nowrap">
                      {item.date}
                    </td>

                    <td className="px-6 py-5 text-slate-600 whitespace-nowrap">
                      {item.duration}
                    </td>

                    <td className="px-6 py-5">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Link
                          href={`/cases/${item.id}`}
                          className="border border-cyan-300 text-cyan-700 px-3 py-2 rounded-lg hover:bg-cyan-50"
                        >
                          View
                        </Link>

                        <Link
                          href={`/cases/${item.id}/edit`}
                          className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-50"
                        >
                          Edit
                        </Link>

                        <DeleteCaseButton caseName={item.procedure} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link
            href="/add-case"
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-cyan-300 transition-colors"
          >
            <p className="text-cyan-600 font-semibold mb-2">New Case</p>
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
            <p className="text-cyan-600 font-semibold mb-2">Case Records</p>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Manage Existing Cases
            </h3>
            <p className="text-slate-500">
              View, edit, and manage previously recorded surgical cases.
            </p>
          </Link>
        </div>
      </section>
    </main>
  );
}