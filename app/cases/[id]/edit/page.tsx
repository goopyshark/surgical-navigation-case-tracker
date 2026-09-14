type EditCasePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const sampleCases = [
  {
    id: "SNC-2026-024",
    name: "Scoliosis Fusion",
    procedure: "Posterior Spinal Fusion",
    region: "Spine",
    type: "Navigation",
    date: "2026-08-27",
    duration: "178",
    status: "Completed",
    systemName: "Surgical Navigation Platform",
    registrationMethod: "Surface Matching",
    accuracy: "1.2",
    technicalIssues: "No major technical issues were reported.",
    notes:
      "Navigation was used to support pedicle screw placement during the simulated case.",
  },
  {
    id: "SNC-2026-023",
    name: "Cranial Biopsy",
    procedure: "Stereotactic Biopsy",
    region: "Cranial",
    type: "Navigation",
    date: "2026-08-24",
    duration: "94",
    status: "Completed",
    systemName: "Cranial Navigation Platform",
    registrationMethod: "Fiducial Registration",
    accuracy: "0.9",
    technicalIssues: "Minor registration adjustment was required.",
    notes:
      "Navigation was used to localize the simulated biopsy target.",
  },
];

export default async function EditCasePage({
  params,
}: EditCasePageProps) {
  const { id } = await params;

  const surgicalCase =
    sampleCases.find((item) => item.id === id) ?? sampleCases[0];

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
          <a href="/cases" className="bg-cyan-500 px-5 py-2 rounded-lg">
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

      <section className="max-w-4xl mx-auto px-6 py-8">
        <a
          href={`/cases/${surgicalCase.id}`}
          className="text-cyan-700 font-medium hover:underline"
        >
          ← Back to Case Details
        </a>

        <div className="mt-5">
          <h1 className="text-4xl font-bold border-l-4 border-cyan-500 pl-4">
            Edit Surgical Case
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Update the information for {surgicalCase.name}.
          </p>
        </div>

        <form className="mt-8 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">Case Name</label>
              <input
                type="text"
                defaultValue={surgicalCase.name}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Procedure</label>
              <input
                type="text"
                defaultValue={surgicalCase.procedure}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Region</label>
              <select
                defaultValue={surgicalCase.region}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
              >
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Technology Type</label>
              <select
                defaultValue={surgicalCase.type}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
              >
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">Case Date</label>
              <input
                type="date"
                defaultValue={surgicalCase.date}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue={surgicalCase.duration}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">System Name</label>
              <input
                type="text"
                defaultValue={surgicalCase.systemName}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registration Method
              </label>
              <input
                type="text"
                defaultValue={surgicalCase.registrationMethod}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Navigation Accuracy (mm)
              </label>
              <input
                type="number"
                step="0.1"
                defaultValue={surgicalCase.accuracy}
                className="w-full border border-slate-300 rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Status</label>
              <select
                defaultValue={surgicalCase.status}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white"
              >
                <option>Planned</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Technical Issues</label>
            <textarea
              rows={4}
              defaultValue={surgicalCase.technicalIssues}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">Notes</label>
            <textarea
              rows={4}
              defaultValue={surgicalCase.notes}
              className="w-full border border-slate-300 rounded-lg px-4 py-3"
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <a
              href={`/cases/${surgicalCase.id}`}
              className="border border-slate-300 px-6 py-3 rounded-lg text-center"
            >
              Cancel
            </a>

            <button
              type="submit"
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}