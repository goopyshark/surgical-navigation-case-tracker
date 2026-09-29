"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import DeleteCaseButton from "../../components/DeleteCaseButton";
import {
  getCaseById,
  SurgicalCase,
} from "../../lib/caseStorage";

export default function CaseDetailsPage() {
  const params = useParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [surgicalCase, setSurgicalCase] =
    useState<SurgicalCase | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoaded(true);
      return;
    }

    const foundCase = getCaseById(id);

    setSurgicalCase(foundCase ?? null);
    setLoaded(true);
  }, [id]);

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-slate-500">Loading case details...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!surgicalCase) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <a
            href="/cases"
            className="text-cyan-700 font-medium hover:underline"
          >
            ← Back to Cases
          </a>

          <div className="mt-6 bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">
              Case Not Found
            </h1>

            <p className="text-slate-500 mt-3">
              The requested surgical case could not be found.
            </p>

            <a
              href="/cases"
              className="inline-block mt-6 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Return to Cases
            </a>
          </div>
        </section>
      </main>
    );
  }

  function formatDate(date: string) {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    return parsedDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <a
          href="/cases"
          className="text-cyan-700 font-medium hover:underline"
        >
          ← Back to Cases
        </a>

        <div className="mt-5 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-cyan-500 pl-4">
              {surgicalCase.name}
            </h1>

            <p className="text-slate-500 mt-3">
              Case ID: {surgicalCase.id}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={`/cases/${surgicalCase.id}/edit`}
              className="border border-slate-300 bg-white hover:bg-slate-50 px-5 py-3 rounded-lg font-medium text-center"
            >
              Edit Case
            </a>

            <DeleteCaseButton caseName={surgicalCase.name} />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Procedure Information */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">
              Procedure Information
            </h2>

            <DetailRow
              label="Procedure"
              value={surgicalCase.procedure}
            />

            <DetailRow
              label="Region"
              value={surgicalCase.region}
            />

            <DetailRow
              label="Case Date"
              value={formatDate(surgicalCase.date)}
            />

            <DetailRow
              label="Duration"
              value={`${surgicalCase.duration} min`}
            />

            <DetailRow
              label="Status"
              value={surgicalCase.status}
            />
          </section>

          {/* Navigation / Robotics Information */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-5">
              Navigation / Robotics Information
            </h2>

            <DetailRow
              label="Technology Type"
              value={surgicalCase.type}
            />

            <DetailRow
              label="System Name"
              value={
                surgicalCase.systemName ||
                "Not specified"
              }
            />

            <DetailRow
              label="Registration Method"
              value={
                surgicalCase.registrationMethod ||
                "Not specified"
              }
            />

            <DetailRow
              label="Navigation Accuracy"
              value={
                surgicalCase.accuracy
                  ? `${surgicalCase.accuracy} mm`
                  : "Not specified"
              }
            />
          </section>
        </div>

        {/* Technical Issues */}
        <section className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-3">
            Technical Issues
          </h2>

          <p className="text-slate-600 leading-7">
            {surgicalCase.technicalIssues ||
              "No technical issues were reported."}
          </p>
        </section>

        {/* Notes */}
        <section className="mt-6 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold mb-3">
            Notes
          </h2>

          <p className="text-slate-600 leading-7">
            {surgicalCase.notes ||
              "No additional notes were provided."}
          </p>
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
      <div className="text-sm text-slate-400">
        {label}
      </div>

      <div className="font-medium mt-1">
        {value}
      </div>
    </div>
  );
}