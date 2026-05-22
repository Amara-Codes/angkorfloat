"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteFloatPackage } from "@/lib/actions/float";
import { useRouter } from "@/i18n/routing";

export default function DeletePackageButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    setIsDeleting(true);
    try {
      await deleteFloatPackage(id);
      router.refresh();
    } catch (error) {
      alert("Failed to delete package.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-custom-rosewood/40 hover:text-custom-rosewood hover:bg-custom-rosewood/10 rounded-xl transition-all disabled:opacity-50"
      title="Delete package"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
