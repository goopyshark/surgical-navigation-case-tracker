"use client";

import { useRouter } from "next/navigation";
import { deleteCase } from "../lib/caseStorage";

type DeleteCaseButtonProps = {
  caseId: string;
  caseName: string;
  onDeleted?: (caseId: string) => void;
};

export default function DeleteCaseButton({
  caseId,
  caseName,
  onDeleted,
}: DeleteCaseButtonProps) {
  const router = useRouter();

  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${caseName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    deleteCase(caseId);

    if (onDeleted) {
      onDeleted(caseId);
    } else {
      router.push("/cases");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="border border-red-300 text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg"
    >
      Delete
    </button>
  );
}