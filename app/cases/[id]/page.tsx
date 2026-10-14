"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import type { SurgicalCase } from "../../lib/caseStorage";
import { mapDatabaseCase, type DatabaseCase } from "../../lib/caseMapper";

export default function CaseDetailsPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [surgicalCase, setSurgicalCase] = useState<SurgicalCase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadCase() {
      setLoading(true);
      setError("");
      setSurgicalCase(null);
      if (!id) { setError("Missing case ID."); setLoading(false); return; }
      try {
        const response = await fetch(`/api/cases/${encodeURIComponent(id)}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 404) { setLoading(false); return; }
        if (!response.ok) {
          setError(response.status === 401
            ? "Your session has expired. Please sign in again."
            : "Unable to load case details. Please try again.");
          return;
        }
        const result: { case: DatabaseCase } = await response.json();
        if (!controller.signal.aborted) setSurgicalCase(mapDatabaseCase(result.case));
      } catch (cause) {
        if (!controller.signal.aborted) {
          console.error("Failed to load case:", cause);
          setError("Unable to connect to the server. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadCase();
    return () => controller.abort();
  }, [id]);

  const shell = (content: React.ReactNode) => (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{content}</section>
    </main>
  );

  if (loading) return shell(
    <div className="rounded-2xl bg-white p-8 text-center shadow-sm text-slate-500">Loading case details...</div>
  );

  if (error || !surgicalCase) return shell(
    <>
      <a href="/cases" className="font-medium text-cyan-700 hover:underline">← Back to Cases</a>
      <div className="mt-6 rounded-2xl bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold">{error ? "Unable to Load Case" : "Case Not Found"}</h1>
        <p className="mt-3 text-slate-500">{error || "The requested surgical case could not be found."}</p>
        <a href="/cases" className="mt-6 inline-block rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700">Return to Cases</a>
      </div>
    </>
  );

  function formatDate(date: string) {
    if (!date) return "Not specified";
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
      month: "long", day: "numeric", year: "numeric",
    });
  }

  return shell(
    <>
      <a href="/cases" className="font-medium text-cyan-700 hover:underline">← Back to Cases</a>
      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="border-l-4 border-cyan-500 pl-4 text-3xl font-bold md:text-4xl">{surgicalCase.name}</h1>
          <p className="mt-3 break-all text-slate-500">Case ID: {surgicalCase.id}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button disabled title="Database editing is coming next" className="cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-center font-medium text-slate-400">Edit Case (coming soon)</button>
          <button disabled title="Database deletion is coming next" className="cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-5 py-3 text-center font-medium text-slate-400">Delete (coming soon)</button>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">Procedure Information</h2>
          <DetailRow label="Procedure" value={surgicalCase.procedure} />
          <DetailRow label="Region" value={surgicalCase.region} />
          <DetailRow label="Case Date" value={formatDate(surgicalCase.date)} />
          <DetailRow label="Duration" value={`${surgicalCase.duration} min`} />
          <DetailRow label="Status" value={surgicalCase.status} />
        </section>
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-bold">Navigation / Robotics Information</h2>
          <DetailRow label="Technology Type" value={surgicalCase.type} />
          <DetailRow label="System Name" value={surgicalCase.systemName || "Not specified"} />
          <DetailRow label="Registration Method" value={surgicalCase.registrationMethod || "Not specified"} />
          <DetailRow label="Navigation Accuracy" value={surgicalCase.accuracy !== "" ? `${surgicalCase.accuracy} mm` : "Not specified"} />
        </section>
      </div>
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">Technical Issues</h2>
        <p className="whitespace-pre-wrap leading-7 text-slate-600">{surgicalCase.technicalIssues || "No technical issues were reported."}</p>
      </section>
      <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">Notes</h2>
        <p className="whitespace-pre-wrap leading-7 text-slate-600">{surgicalCase.notes || "No additional notes were provided."}</p>
      </section>
      <footer className="mt-8 pb-6 text-xs text-slate-400">SNCT • For educational and simulation use only • Not for clinical decision-making</footer>
    </>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-100 py-3 last:border-b-0">
      <div className="text-sm text-slate-400">{label}</div>
      <div className="mt-1 font-medium">{value}</div>
    </div>
  );
}
