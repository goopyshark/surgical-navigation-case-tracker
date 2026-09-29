"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import {
  getCaseById,
  SurgicalCase,
  updateCase,
} from "../../../lib/caseStorage";

export default function EditCasePage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [surgicalCase, setSurgicalCase] =
    useState<SurgicalCase | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      setLoaded(true);
      return;
    }

    const foundCase = getCaseById(id);

    setSurgicalCase(foundCase ?? null);
    setLoaded(true);
  }, [id]);

  function updateField(
    field: keyof SurgicalCase,
    value: string
  ) {
    setSurgicalCase((currentCase) => {
      if (!currentCase) {
        return currentCase;
      }

      return {
        ...currentCase,
        [field]: value,
      };
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!surgicalCase) {
      return;
    }

    setError("");

    if (
      !surgicalCase.name.trim() ||
      !surgicalCase.procedure.trim() ||
      !surgicalCase.region ||
      !surgicalCase.type ||
      !surgicalCase.date ||
      !surgicalCase.duration
    ) {
      setError(
        "Please complete the case name, procedure, region, technology type, date, and duration."
      );
      return;
    }

    const durationNumber = Number(surgicalCase.duration);

    if (
      Number.isNaN(durationNumber) ||
      durationNumber <= 0
    ) {
      setError("Duration must be greater than 0 minutes.");
      return;
    }

    if (
      surgicalCase.accuracy &&
      Number(surgicalCase.accuracy) < 0
    ) {
      setError("Navigation accuracy cannot be negative.");
      return;
    }

    setSaving(true);

    const updatedCase: SurgicalCase = {
      ...surgicalCase,
      name: surgicalCase.name.trim(),
      procedure: surgicalCase.procedure.trim(),
      systemName: surgicalCase.systemName.trim(),
      registrationMethod:
        surgicalCase.registrationMethod.trim(),
      technicalIssues:
        surgicalCase.technicalIssues.trim() ||
        "No technical issues were reported.",
      notes:
        surgicalCase.notes.trim() ||
        "No additional notes were provided.",
    };

    updateCase(updatedCase);

    router.push(`/cases/${updatedCase.id}`);
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <p className="text-slate-500">
              Loading case information...
            </p>
          </div>
        </section>
      </main>
    );
  }

  if (!surgicalCase) {
    return (
      <main className="min-h-screen bg-slate-100 text-slate-900">
        <Navbar />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <a
            href="/cases"
            className="text-cyan-700 font-medium hover:underline"
          >
            ← Back to Cases
          </a>

          <div className="mt-6 bg-white rounded-2xl shadow-sm p-8 text-center">
            <h1 className="text-2xl font-bold">
              Case Not Found
            </h1>

            <p className="text-slate-500 mt-3">
              The surgical case you are trying to edit could not
              be found.
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

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <a
          href={`/cases/${surgicalCase.id}`}
          className="text-cyan-700 font-medium hover:underline"
        >
          ← Back to Case Details
        </a>

        <div className="mt-5">
          <h1 className="text-3xl md:text-4xl font-bold border-l-4 border-cyan-500 pl-4">
            Edit Surgical Case
          </h1>

          <p className="text-slate-500 mt-3 text-base md:text-lg">
            Update the information for {surgicalCase.name}.
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
                value={surgicalCase.name}
                onChange={(event) =>
                  updateField("name", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Procedure *
              </label>

              <input
                type="text"
                value={surgicalCase.procedure}
                onChange={(event) =>
                  updateField("procedure", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Region *
              </label>

              <select
                value={surgicalCase.region}
                onChange={(event) =>
                  updateField("region", event.target.value)
                }
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
                Technology Type *
              </label>

              <select
                value={surgicalCase.type}
                onChange={(event) =>
                  updateField("type", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500"
              >
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
                value={surgicalCase.date}
                onChange={(event) =>
                  updateField("date", event.target.value)
                }
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
                value={surgicalCase.duration}
                onChange={(event) =>
                  updateField("duration", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                System Name
              </label>

              <input
                type="text"
                value={surgicalCase.systemName}
                onChange={(event) =>
                  updateField("systemName", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Registration Method
              </label>

              <input
                type="text"
                value={surgicalCase.registrationMethod}
                onChange={(event) =>
                  updateField(
                    "registrationMethod",
                    event.target.value
                  )
                }
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
                value={surgicalCase.accuracy}
                onChange={(event) =>
                  updateField("accuracy", event.target.value)
                }
                className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Status
              </label>

              <select
                value={surgicalCase.status}
                onChange={(event) =>
                  updateField("status", event.target.value)
                }
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
              value={surgicalCase.technicalIssues}
              onChange={(event) =>
                updateField(
                  "technicalIssues",
                  event.target.value
                )
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-6">
            <label className="block font-medium mb-2">
              Notes
            </label>

            <textarea
              rows={4}
              value={surgicalCase.notes}
              onChange={(event) =>
                updateField("notes", event.target.value)
              }
              className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-end gap-3">
            <a
              href={`/cases/${surgicalCase.id}`}
              className="border border-slate-300 hover:bg-slate-50 px-6 py-3 rounded-lg text-center"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={saving}
              className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {saving ? "Saving..." : "Save Changes"}
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