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
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <nav className="bg-slate-950 text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500 rounded-xl w-10 h-10 flex items-center justify-center font-bold">
            +
          </div>
          <span className="text-2xl font-bold">SNCT</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a className="bg-cyan-500 px-5 py-2 rounded-lg" href="#">
            Dashboard
          </a>
          <a href="#">Cases</a>
          <a href="#">Add Case</a>
          <a href="#">About</a>
          <span className="text-slate-400">Logout</span>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold border-l-4 border-cyan-500 pl-4">
              Surgical Navigation Case Tracker
            </h1>
            <p className="text-slate-500 mt-3 text-lg">
              Track and review your navigation and robotic-assisted surgical
              cases.
            </p>
          </div>

          <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl font-semibold shadow">
            + Add Case
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <StatCard value="24" label="Total Cases" />
          <StatCard value="16" label="Navigation Cases" />
          <StatCard value="8" label="Robotic Cases" />
          <StatCard value="142 min" label="Average Duration" />
        </div>

        <div className="mt-10 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 flex items-center justify-between border-b">
            <div>
              <h2 className="text-xl font-bold">Recent Cases</h2>
              <p className="text-sm text-slate-400">Last 30 days</p>
            </div>

            <a href="#" className="text-cyan-600 font-medium">
              View All Cases →
            </a>
          </div>

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
                      <button className="border border-cyan-300 text-cyan-700 px-4 py-2 rounded-lg">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}

function StatCard({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="w-10 h-10 rounded-xl bg-cyan-100 mb-5" />
      <div className="text-4xl font-bold">{value}</div>
      <div className="text-slate-500 mt-2">{label}</div>
      <div className="h-1 rounded-full bg-slate-100 mt-6 overflow-hidden">
        <div className="h-full w-2/3 bg-cyan-500 rounded-full" />
      </div>
    </div>
  );
}