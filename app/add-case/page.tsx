"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import {
  addCase,
  generateCaseId,
  SurgicalCase,
} from "../lib/caseStorage";

export default function AddCasePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [procedure, setProcedure] = useState("");
  const [region, setRegion] = useState("");
  const [technologyType, setTechnologyType] = useState("");

  const [date, setDate] = useState(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  });

  const [duration, setDuration] = useState("");
  const [systemName, setSystemName] = useState("");
  const [registrationMethod, setRegistrationMethod] = useState("");
  const [accuracy, setAccuracy] = useState("");
  const [status, setStatus] = useState("Planned");
  const [technicalIssues, setTechnicalIssues] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !name.trim() ||
      !procedure.trim() ||
      !region ||
      !technologyType ||
      !date ||
      !duration
    ) {
      setError(
        "Please complete the case name, procedure, region, technology type, date, and duration."
      );
      return;
    }

    const durationNumber = Number(duration);

    if (Number.isNaN(durationNumber) || durationNumber <= 0) {
      setError("Duration must be greater than 0 minutes.");
      return;
    }

    if (accuracy && Number(accuracy) < 0) {
      setError("Navigation accuracy cannot be negative.");
      return;
    }

    setSaving(true);

    const newCase: SurgicalCase = {
      id: generateCaseId(),
      name: name.trim(),
      procedure: procedure.trim(),
      region,
      type: technologyType,
      date,
      duration,
      status,
      systemName: systemName.trim(),
      registrationMethod: registrationMethod.trim(),
      accuracy,
      technicalIssues:
        technicalIssues.trim() || "No technical issues were reported.",
      notes: notes.trim() || "No additional notes were provided.",
    };

    addCase(newCase);

    router.push("/cases");
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-cyan-500 pl-4">
            Add Surgical Case
          </h1>

          <p className="text-slate-500 mt-3 text-base md:text-lg">
            Enter the details for a new surgical navigation or robotic-assisted
            case.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-white rounded-2xl shadow-sm p-5 sm:p-6 md:p-8"
        >
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-2">
                Case Name *
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Example: Scoliosis Fusion"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Procedure *
              </label>

              <input
                type="text"
                value={procedure}
                onChange={(event) => setProcedure(event.target.value)}
                placeholder="Example: Posterior Spinal Fusion"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Region *
              </label>

              <select
                value={region}
                onChange={(event) => setRegion(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select region</option>
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Technology Type *
              </label>

              <select
                value={technologyType}
                onChange={(event) =>
                  setTechnologyType(event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select technology</option>
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2">
                Case Date *
              </label>

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Duration (minutes) *
              </label>

              <input
                type="number"
                min="1"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                placeholder="Example: 120"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                System Name
              </label>

              <input
                type="text"
                value={systemName}
                onChange={(event) => setSystemName(event.target.value)}
                placeholder="Navigation or robotic system"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registration Method
              </label>

              <input
                type="text"
                value={registrationMethod}
                onChange={(event) =>
                  setRegistrationMethod(event.target.value)
                }
                placeholder="Example: Surface matching"
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
                value={accuracy}
                onChange={(event) => setAccuracy(event.target.value)}
                placeholder="Example: 1.2"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Status
              </label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
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
              value={technicalIssues}
              onChange={(event) =>
                setTechnicalIssues(event.target.value)
              }
              placeholder="Describe any technical issues encountered..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">
              Notes
            </label>

            <textarea
              rows={4}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Additional case notes..."
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <a
              href="/cases"
              className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-lg text-center"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {saving ? "Saving..." : "Save Case"}
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