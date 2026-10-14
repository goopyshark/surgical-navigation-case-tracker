
import type { SurgicalCase } from "./caseStorage";

export type DatabaseCase = {
  id: string;
  name: string;
  procedure: string;
  region: string;
  type: string;
  date: string;
  duration: number;
  status: string;
  system_name: string | null;
  registration_method: string | null;
  accuracy: number | null;
  technical_issues: string | null;
  notes: string | null;
  created_at?: string;
};

export function mapDatabaseCase(
  record: DatabaseCase
): SurgicalCase {
  return {
    id: record.id,
    name: record.name,
    procedure: record.procedure,
    region: record.region,
    type: record.type,
    date: record.date,
    duration: String(record.duration),
    status: record.status,
    systemName: record.system_name ?? "",
    registrationMethod: record.registration_method ?? "",
    accuracy:
      record.accuracy === null
        ? ""
        : String(record.accuracy),
    technicalIssues: record.technical_issues ?? "",
    notes: record.notes ?? "",
  };
}
