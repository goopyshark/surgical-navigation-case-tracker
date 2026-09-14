"use client";

type DeleteCaseButtonProps = {
  caseName: string;
};

export default function DeleteCaseButton({
  caseName,
}: DeleteCaseButtonProps) {
  function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${caseName}"?`
    );

    if (confirmed) {
      alert(
        `"${caseName}" would be deleted here once the database is connected.`
      );
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="border border-red-300 text-red-600 px-3 py-2 rounded-lg hover:bg-red-50"
    >
      Delete
    </button>
  );
}