"use client";

import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { deleteRole } from "@/lib/actions/role";
import { useRouter } from "@/i18n/routing";
import BaseModal from "@/components/common/BaseModal";
import { Button } from "@/components/common/Button";

export default function DeleteRoleButton({ id, name }: { id: string, name: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteRole(id);
      setShowConfirm(false);
      router.refresh();
    } catch (error: any) {
      alert(error.message || "Failed to delete role.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setShowConfirm(true)}
        disabled={isDeleting}
        className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-rosewood dark:hover:text-custom-rosewood hover:bg-custom-rosewood/10 rounded-xl transition-all disabled:opacity-50 shadow-sm"
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>

      <BaseModal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
        <BaseModal.Header onClose={() => setShowConfirm(false)}>
          <div className="flex items-end gap-4">
            <div className="p-2 bg-custom-rosewood/10 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-custom-rosewood" />
            </div>
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">Confirm Deletion</h2>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-xl font-kugile text-center mb-8 font-bold text-custom-blue dark:text-custom-celadon leading-tight">
              Delete role {name}?
            </p>
            <p className="text-sm text-custom-blue/60 dark:text-custom-celadon/60 leading-relaxed">
              Ensure no users are currently assigned to this role before deletion.
            </p>
          </div>
        </BaseModal.Body>
        <BaseModal.Footer>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-end">
            <Button onClick={() => setShowConfirm(false)} variant="outline" size="md" roundness="xl" fullWidth className="sm:w-auto">Cancel</Button>
            <Button onClick={handleDelete} variant="rosewood" size="md" roundness="xl" fullWidth className="sm:w-auto" disabled={isDeleting} icon={isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}>
              {isDeleting ? "Deleting..." : "Delete Role"}
            </Button>
          </div>
        </BaseModal.Footer>
      </BaseModal>
    </>
  );
}
