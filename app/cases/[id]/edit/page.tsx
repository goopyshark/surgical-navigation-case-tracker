"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
  type ValidatedField = "name" | "procedure" | "region" | "type" | "date" | "duration" | "accuracy";
  const [errors, setErrors] = useState<Partial<Record<ValidatedField, string>>>({});
  const fieldRefs = useRef<Partial<Record<ValidatedField, HTMLInputElement | HTMLSelectElement | null>>>({});
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
    if (field in errors) {
      setErrors((previous) => {
        const next = { ...previous };
        delete next[field as ValidatedField];
        return next;
      });
    }
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

    const nextErrors: Partial<Record<ValidatedField, string>> = {};
    if (!surgicalCase.name.trim()) nextErrors.name = "Case name is required.";
    if (!surgicalCase.procedure.trim()) nextErrors.procedure = "Procedure is required.";
    if (!surgicalCase.region) nextErrors.region = "Select a region.";
    if (!surgicalCase.type) nextErrors.type = "Select a technology type.";
    if (!surgicalCase.date) nextErrors.date = "Select a case date.";
    if (!surgicalCase.duration.trim()) {
      nextErrors.duration = "Duration is required.";
    } else if (!Number.isFinite(Number(surgicalCase.duration)) || Number(surgicalCase.duration) <= 0) {
      nextErrors.duration = "Duration must be greater than 0 minutes.";
    }
    if (surgicalCase.accuracy.trim() &&
      (!Number.isFinite(Number(surgicalCase.accuracy)) || Number(surgicalCase.accuracy) < 0)) {
      nextErrors.accuracy = "Accuracy must be zero or greater.";
    }

    setErrors(nextErrors);
    const firstInvalid = (["name", "procedure", "region", "type", "date", "duration", "accuracy"] as ValidatedField[])
      .find((field) => nextErrors[field]);
    if (firstInvalid) {
      requestAnimationFrame(() => {
        const element = fieldRefs.current[firstInvalid];
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
        element?.focus({ preventScroll: true });
      });
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
                ref={(element) => { fieldRefs.current.name = element; }}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "error-name" : undefined}
                className={`w-full border ${errors.name ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              {errors.name && (
                <p id="error-name" role="alert" className="mt-2 text-sm text-red-600">{errors.name}</p>
              )}
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
                ref={(element) => { fieldRefs.current.procedure = element; }}
                aria-invalid={Boolean(errors.procedure)}
                aria-describedby={errors.procedure ? "error-procedure" : undefined}
                className={`w-full border ${errors.procedure ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              {errors.procedure && (
                <p id="error-procedure" role="alert" className="mt-2 text-sm text-red-600">{errors.procedure}</p>
              )}
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
                ref={(element) => { fieldRefs.current.region = element; }}
                aria-invalid={Boolean(errors.region)}
                aria-describedby={errors.region ? "error-region" : undefined}
                className={`w-full border ${errors.region ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500`}
              >
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>
              {errors.region && (
                <p id="error-region" role="alert" className="mt-2 text-sm text-red-600">{errors.region}</p>
              )}
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
                ref={(element) => { fieldRefs.current.type = element; }}
                aria-invalid={Boolean(errors.type)}
                aria-describedby={errors.type ? "error-type" : undefined}
                className={`w-full border ${errors.type ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-cyan-500`}
              >
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>
              {errors.type && (
                <p id="error-type" role="alert" className="mt-2 text-sm text-red-600">{errors.type}</p>
              )}
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
                ref={(element) => { fieldRefs.current.date = element; }}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={errors.date ? "error-date" : undefined}
                className={`w-full border ${errors.date ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              {errors.date && (
                <p id="error-date" role="alert" className="mt-2 text-sm text-red-600">{errors.date}</p>
              )}
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
                ref={(element) => { fieldRefs.current.duration = element; }}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={errors.duration ? "error-duration" : undefined}
                className={`w-full border ${errors.duration ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              {errors.duration && (
                <p id="error-duration" role="alert" className="mt-2 text-sm text-red-600">{errors.duration}</p>
              )}
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
                ref={(element) => { fieldRefs.current.accuracy = element; }}
                aria-invalid={Boolean(errors.accuracy)}
                aria-describedby={errors.accuracy ? "error-accuracy" : undefined}
                className={`w-full border ${errors.accuracy ? "border-red-500 ring-1 ring-red-500" : "border-slate-300"} rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500`}
              />
              {errors.accuracy && (
                <p id="error-accuracy" role="alert" className="mt-2 text-sm text-red-600">{errors.accuracy}</p>
              )}
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

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Please correct the highlighted fields before saving.
            </p>
          )}

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