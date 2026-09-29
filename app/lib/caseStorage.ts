export type SurgicalCase = {
  id: string;
  name: string;
  procedure: string;
  region: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  systemName: string;
  registrationMethod: string;
  accuracy: string;
  technicalIssues: string;
  notes: string;
};

export const defaultCases: SurgicalCase[] = [
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
  {
    id: "SNC-2026-022",
    name: "Pedicle Screw Placement",
    procedure: "Lumbar Fusion",
    region: "Spine",
    type: "Robotic",
    date: "2026-08-20",
    duration: "154",
    status: "Completed",
    systemName: "Robotic Spine Platform",
    registrationMethod: "3D Image Registration",
    accuracy: "1.0",
    technicalIssues: "No major technical issues were reported.",
    notes:
      "Robotic assistance was used for simulated pedicle screw trajectory planning.",
  },
  {
    id: "SNC-2026-021",
    name: "Cervical Fusion",
    procedure: "Anterior Cervical Fusion",
    region: "Cervical",
    type: "Navigation",
    date: "2026-08-15",
    duration: "126",
    status: "Completed",
    systemName: "Surgical Navigation Platform",
    registrationMethod: "Surface Matching",
    accuracy: "1.1",
    technicalIssues: "No major technical issues were reported.",
    notes:
      "Navigation was used during the simulated cervical fusion procedure.",
  },
];

const STORAGE_KEY = "snct-cases";

// Get all cases
export function getCases(): SurgicalCase[] {
  if (typeof window === "undefined") {
    return defaultCases;
  }

  const storedCases = localStorage.getItem(STORAGE_KEY);

  if (!storedCases) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCases));
    return defaultCases;
  }

  try {
    return JSON.parse(storedCases) as SurgicalCase[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCases));
    return defaultCases;
  }
}

// Get one case by ID
export function getCaseById(id: string): SurgicalCase | undefined {
  return getCases().find((surgicalCase) => surgicalCase.id === id);
}

// Add a new case
export function addCase(newCase: SurgicalCase): void {
  const cases = getCases();

  cases.push(newCase);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

// Update an existing case
export function updateCase(updatedCase: SurgicalCase): void {
  const cases = getCases();

  const updatedCases = cases.map((surgicalCase) =>
    surgicalCase.id === updatedCase.id ? updatedCase : surgicalCase
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCases));
}

// Delete a case
export function deleteCase(id: string): void {
  const cases = getCases();

  const updatedCases = cases.filter(
    (surgicalCase) => surgicalCase.id !== id
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCases));
}

// Generate the next case ID
export function generateCaseId(): string {
  const cases = getCases();

  const year = new Date().getFullYear();

  const numbers = cases
    .map((surgicalCase) => {
      const parts = surgicalCase.id.split("-");
      return Number(parts[parts.length - 1]);
    })
    .filter((number) => !Number.isNaN(number));

  const nextNumber =
    numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return `SNC-${year}-${String(nextNumber).padStart(3, "0")}`;
}