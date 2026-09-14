import DeleteCaseButton from "../components/DeleteCaseButton";

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
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="bg-slate-950 text-white px-6 md:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
            +
          </div>
          <span className="text-2xl font-bold">SNCT</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="/" className="hover:text-cyan-400">
            Dashboard
          </a>
          <a
            href="/cases"
            className="bg-cyan-500 px-5 py-2 rounded-lg"
          >
            Cases
          </a>
          <a href="/add-case" className="hover:text-cyan-400">
            Add Case
          </a>
          <a href="/about" className="hover:text-cyan-400">
            About
          </a>
          <span className="text-slate-400">Logout</span>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold border-l-4 border-cyan-500 pl-4">
              Surgical Cases
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
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

        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search cases..."
              className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />

            <select className="border border-slate-300 rounded-lg px-4 py-3 bg-white">
              <option>All Regions</option>
              <option>Spine</option>
              <option>Cranial</option>
              <option>Cervical</option>
            </select>

            <select className="border border-slate-300 rounded-lg px-4 py-3 bg-white">
              <option>All Technology</option>
              <option>Navigation</option>
              <option>Robotic</option>
            </select>

            <select className="border border-slate-300 rounded-lg px-4 py-3 bg-white">
              <option>All Statuses</option>
              <option>Completed</option>
              <option>Planned</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
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
                {cases.map((item) => (
                  <tr key={item.id} className="border-t">
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
                      <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm">
                        ● {item.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        <a
                          href={`/cases/${item.id}`}
                          className="border border-cyan-300 text-cyan-700 px-3 py-2 rounded-lg"
                        >
                          View
                        </a>

                        <a
                          href={`/cases/${item.id}/edit`}
                          className="border border-slate-300 text-slate-700 px-3 py-2 rounded-lg"
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
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <a
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
          </a>

          <a
            href="/"
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-cyan-300 transition-colors"
          >
            <p className="text-cyan-600 font-semibold mb-2">Dashboard</p>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Return to Overview
            </h3>

            <p className="text-slate-500">
              Review case totals, recent procedures, and overall activity.
            </p>
          </a>
        </div>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}