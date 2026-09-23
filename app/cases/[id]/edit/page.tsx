import Navbar from "../../../components/Navbar";

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
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back Link */}
        <a
          href={`/cases/${surgicalCase.id}`}
          className="text-cyan-700 font-medium hover:underline"
        >
          ← Back to Case Details
        </a>

        {/* Page Header */}
        <div className="mt-5">
          <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-cyan-500 pl-4">
            Edit Surgical Case
          </h1>

          <p className="text-slate-500 mt-3 text-base md:text-lg">
            Update the information for {surgicalCase.name}.
          </p>
        </div>

        {/* Edit Form */}
        <form className="mt-8 bg-white rounded-2xl shadow-sm p-5 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Case Name
              </label>

              <input
                type="text"
                defaultValue={surgicalCase.name}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Procedure
              </label>

              <input
                type="text"
                defaultValue={surgicalCase.procedure}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Region
              </label>

              <select
                defaultValue={surgicalCase.region}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Technology Type
              </label>

              <select
                defaultValue={surgicalCase.type}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Case Date
              </label>

              <input
                type="date"
                defaultValue={surgicalCase.date}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Duration (minutes)
              </label>

              <input
                type="number"
                min="1"
                defaultValue={surgicalCase.duration}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                System Name
              </label>

              <input
                type="text"
                defaultValue={surgicalCase.systemName}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registration Method
              </label>

              <input
                type="text"
                defaultValue={surgicalCase.registrationMethod}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Navigation Accuracy (mm)
              </label>

              <input
                type="number"
                step="0.1"
                min="0"
                defaultValue={surgicalCase.accuracy}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Status
              </label>

              <select
                defaultValue={surgicalCase.status}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Planned</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">
              Technical Issues
            </label>

            <textarea
              rows={4}
              defaultValue={surgicalCase.technicalIssues}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">
              Notes
            </label>

            <textarea
              rows={4}
              defaultValue={surgicalCase.notes}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <a
              href={`/cases/${surgicalCase.id}`}
              className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-lg text-center"
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

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}