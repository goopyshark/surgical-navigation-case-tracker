
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type FieldName =
  | "name"
  | "procedure"
  | "region"
  | "technologyType"
  | "date"
  | "duration"
  | "accuracy";

type FieldErrors = Partial<Record<FieldName, string>>;

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

  const [errors, setErrors] = useState<FieldErrors>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  function clearError(field: FieldName) {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const updated = { ...previous };
      delete updated[field];

      return updated;
    });
  }

  function fieldClass(field: FieldName) {
    return `w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 bg-red-50 focus:ring-red-400"
        : "border-slate-300 focus:ring-cyan-500"
    }`;
  }

  function fieldError(field: FieldName) {
    return errors[field] ? (
      <p
        id={`${field}-error`}
        role="alert"
        className="mt-1 text-sm text-red-700"
      >
        {errors[field]}
      </p>
    ) : null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setSaveError("");

    const nextErrors: FieldErrors = {};

    if (!name.trim()) {
      nextErrors.name = "Enter a case name.";
    }

    if (!procedure.trim()) {
      nextErrors.procedure = "Enter a procedure.";
    }

    if (!region) {
      nextErrors.region = "Select a region.";
    }

    if (!technologyType) {
      nextErrors.technologyType = "Select a technology type.";
    }

    if (!date) {
      nextErrors.date = "Select a case date.";
    }

    if (!duration.trim()) {
      nextErrors.duration = "Enter a duration in minutes.";
    } else if (
      !Number.isSafeInteger(Number(duration)) ||
      Number(duration) <= 0
    ) {
      nextErrors.duration =
        "Duration must be a positive whole number.";
    }

    if (
      accuracy.trim() &&
      (!Number.isFinite(Number(accuracy)) ||
        Number(accuracy) < 0)
    ) {
      nextErrors.accuracy =
        "Navigation accuracy cannot be negative.";
    }

    setErrors(nextErrors);

    const firstInvalid = (
      Object.keys(nextErrors) as FieldName[]
    )[0];

    if (firstInvalid) {
      requestAnimationFrame(() => {
        const input = document.getElementById(firstInvalid);

        input?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        input?.focus({ preventScroll: true });
      });

      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
            technicalIssues.trim() ||
            "No technical issues were reported.",
          notes:
            notes.trim() ||
            "No additional notes were provided.",
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setSaveError(
            "Your login session has expired. Please sign in again."
          );
        } else if (response.status === 403) {
          setSaveError(
            "Your account does not have permission to create cases."
          );
        } else {
          setSaveError(
            typeof result.error === "string"
              ? result.error
              : "Unable to save the case. Please try again."
          );
        }

        return;
      }

      if (!result.case?.id) {
        setSaveError(
          "The server returned an unexpected response. Check the database before trying again."
        );
        return;
      }

      router.push("/cases");
      router.refresh();
    } catch (error) {
      console.error("Save case failed:", error);

      setSaveError(
        "Unable to connect to the server. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <Navbar />

      <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <div>
          <h1 className="border-l-4 border-cyan-500 pl-4 text-3xl font-bold md:text-4xl">
            Add Surgical Case
          </h1>

          <p className="mt-3 text-base text-slate-500 md:text-lg">
            Enter the details for a new surgical navigation or
            robotic-assisted case.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-6 md:p-8"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block font-medium">
                Case Name *
              </label>

              <input
                id="name"
                type="text"
                value={name}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name ? "name-error" : undefined
                }
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
                placeholder="Example: Scoliosis Fusion"
                className={fieldClass("name")}
              />

              {fieldError("name")}
            </div>

            <div>
              <label
                htmlFor="procedure"
                className="mb-2 block font-medium"
              >
                Procedure *
              </label>

              <input
                id="procedure"
                type="text"
                value={procedure}
                aria-invalid={Boolean(errors.procedure)}
                aria-describedby={
                  errors.procedure
                    ? "procedure-error"
                    : undefined
                }
                onChange={(event) => {
                  setProcedure(event.target.value);
                  clearError("procedure");
                }}
                placeholder="Example: Posterior Spinal Fusion"
                className={fieldClass("procedure")}
              />

              {fieldError("procedure")}
            </div>

            <div>
              <label
                htmlFor="region"
                className="mb-2 block font-medium"
              >
                Region *
              </label>

              <select
                id="region"
                value={region}
                aria-invalid={Boolean(errors.region)}
                aria-describedby={
                  errors.region ? "region-error" : undefined
                }
                onChange={(event) => {
                  setRegion(event.target.value);
                  clearError("region");
                }}
                className={fieldClass("region")}
              >
                <option value="">Select region</option>
                <option>Spine</option>
                <option>Cranial</option>
                <option>Cervical</option>
                <option>Thoracic</option>
                <option>Lumbar</option>
              </select>

              {fieldError("region")}
            </div>

            <div>
              <label
                htmlFor="technologyType"
                className="mb-2 block font-medium"
              >
                Technology Type *
              </label>

              <select
                id="technologyType"
                value={technologyType}
                aria-invalid={Boolean(errors.technologyType)}
                aria-describedby={
                  errors.technologyType
                    ? "technologyType-error"
                    : undefined
                }
                onChange={(event) => {
                  setTechnologyType(event.target.value);
                  clearError("technologyType");
                }}
                className={fieldClass("technologyType")}
              >
                <option value="">Select technology</option>
                <option>Navigation</option>
                <option>Robotic</option>
                <option>Navigation + Robotic</option>
              </select>

              {fieldError("technologyType")}
            </div>

            <div>
              <label
                htmlFor="date"
                className="mb-2 block font-medium"
              >
                Case Date *
              </label>

              <input
                id="date"
                type="date"
                value={date}
                aria-invalid={Boolean(errors.date)}
                aria-describedby={
                  errors.date ? "date-error" : undefined
                }
                onChange={(event) => {
                  setDate(event.target.value);
                  clearError("date");
                }}
                className={fieldClass("date")}
              />

              {fieldError("date")}
            </div>

            <div>
              <label
                htmlFor="duration"
                className="mb-2 block font-medium"
              >
                Duration (minutes) *
              </label>

              <input
                id="duration"
                type="number"
                min="1"
                step="1"
                value={duration}
                aria-invalid={Boolean(errors.duration)}
                aria-describedby={
                  errors.duration
                    ? "duration-error"
                    : undefined
                }
                onChange={(event) => {
                  setDuration(event.target.value);
                  clearError("duration");
                }}
                placeholder="Example: 120"
                className={fieldClass("duration")}
              />

              {fieldError("duration")}
            </div>

            <div>
              <label
                htmlFor="systemName"
                className="mb-2 block font-medium"
              >
                System Name
              </label>

              <input
                id="systemName"
                type="text"
                value={systemName}
                onChange={(event) =>
                  setSystemName(event.target.value)
                }
                placeholder="Navigation or robotic system"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="registrationMethod"
                className="mb-2 block font-medium"
              >
                Registration Method
              </label>

              <input
                id="registrationMethod"
                type="text"
                value={registrationMethod}
                onChange={(event) =>
                  setRegistrationMethod(event.target.value)
                }
                placeholder="Example: Surface matching"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label
                htmlFor="accuracy"
                className="mb-2 block font-medium"
              >
                Navigation Accuracy (mm)
              </label>

              <input
                id="accuracy"
                type="number"
                step="0.1"
                min="0"
                value={accuracy}
                aria-invalid={Boolean(errors.accuracy)}
                aria-describedby={
                  errors.accuracy
                    ? "accuracy-error"
                    : undefined
                }
                onChange={(event) => {
                  setAccuracy(event.target.value);
                  clearError("accuracy");
                }}
                placeholder="Example: 1.2"
                className={fieldClass("accuracy")}
              />

              {fieldError("accuracy")}
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block font-medium"
              >
                Status
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option>Planned</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label
              htmlFor="technicalIssues"
              className="mb-2 block font-medium"
            >
              Technical Issues
            </label>

            <textarea
              id="technicalIssues"
              rows={4}
              value={technicalIssues}
              onChange={(event) =>
                setTechnicalIssues(event.target.value)
              }
              placeholder="Describe any technical issues encountered..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="notes"
              className="mb-2 block font-medium"
            >
              Notes
            </label>

            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Additional case notes..."
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {saveError && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700"
            >
              {saveError}
            </div>
          )}

          {Object.keys(errors).length > 0 && (
            <p
              role="alert"
              className="mt-6 text-sm font-medium text-red-700"
            >
              Please correct the highlighted fields before saving.
            </p>
          )}

          <div className="mt-8 flex flex-col justify-end gap-3 sm:flex-row">
            <a
              href="/cases"
              className="rounded-lg border border-slate-300 px-6 py-3 text-center hover:bg-slate-50"
            >
              Cancel
            </a>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-cyan-600 px-6 py-3 font-semibold text-white hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {saving ? "Saving..." : "Save Case"}
            </button>
          </div>
        </form>

        <footer className="mt-8 pb-6 text-xs text-slate-400">
          SNCT • For educational and simulation use only •
          Not for clinical decision-making
        </footer>
      </section>
    </main>
  );
}
