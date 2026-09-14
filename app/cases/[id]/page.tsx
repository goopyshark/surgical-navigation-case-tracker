import DeleteCaseButton from "../../components/DeleteCaseButton";

type CaseDetailsPageProps = {
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
    date: "Aug 27, 2026",
    duration: "178 min",
    status: "Completed",
    systemName: "Surgical Navigation Platform",
    registrationMethod: "Surface Matching",
    accuracy: "1.2 mm",
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
    date: "Aug 24, 2026",
    duration: "94 min",
    status: "Completed",
    systemName: "Cranial Navigation Platform",
    registrationMethod: "Fiducial Registration",
    accuracy: "0.9 mm",
    technicalIssues: "Minor registration adjustment was required.",
    notes:
      "Navigation was used to localize the simulated biopsy target.",
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
    systemName: "Robotic Spine Platform",
    registrationMethod: "3D Image Registration",
    accuracy: "1.0 mm",
    technicalIssues: "No major technical issues were reported.",
    notes:
      "Robotic assistance was used for simulated pedicle screw trajectory planning.",
  },
];

export default async function CaseDetailsPage({
  params,
}: CaseDetailsPageProps) {
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

      <section className="max-w-5xl mx-auto px-6 py-8">
        <a
          href="/cases"
          className="text-cyan-700 font-medium hover:underline"
        >
          ← Back to Cases
        </a>

        <div className="mt-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold border-l-4 border-cyan-500 pl-4">
              {surgicalCase.name}
            </h1>
            <p className="text-slate-500 mt-3">
              Case ID: {surgicalCase.id}
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href={`/cases/${surgicalCase.id}/edit`}
              className="border border-slate-300 bg-white px-5 py-3 rounded-lg font-medium"
            >
              Edit Case
            </a>

            <DeleteCaseButton caseName={surgicalCase.name} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">Procedure Information</h2>

            <DetailRow label="Procedure" value={surgicalCase.procedure} />
            <DetailRow label="Region" value={surgicalCase.region} />
            <DetailRow label="Case Date" value={surgicalCase.date} />
            <DetailRow label="Duration" value={surgicalCase.duration} />
            <DetailRow label="Status" value={surgicalCase.status} />
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">
              Navigation / Robotics Information
            </h2>

            <DetailRow label="Technology Type" value={surgicalCase.type} />
            <DetailRow label="System Name" value={surgicalCase.systemName} />
            <DetailRow
              label="Registration Method"
              value={surgicalCase.registrationMethod}
            />
            <DetailRow
              label="Navigation Accuracy"
              value={surgicalCase.accuracy}
            />
          </section>
        </div>

        <section className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-3">Technical Issues</h2>
          <p className="text-slate-600 leading-7">
            {surgicalCase.technicalIssues}
          </p>
        </section>

        <section className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-3">Notes</h2>
          <p className="text-slate-600 leading-7">{surgicalCase.notes}</p>
        </section>

        <footer className="text-xs text-slate-400 mt-8 pb-6">
          SNCT • For educational and simulation use only • Not for clinical
          decision-making
        </footer>
      </section>
    </main>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="py-3 border-b border-slate-100 last:border-b-0">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="font-medium mt-1">{value}</div>
    </div>
  );
}