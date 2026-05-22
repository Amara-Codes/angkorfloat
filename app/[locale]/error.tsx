"use client";

import { useEffect, useState } from "react";
import { AlertCircle, RefreshCcw } from "lucide-react";
import BaseModal from "@/components/common/BaseModal";
import { Button } from "@/components/common/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    console.error("Global boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-custom-celadon/10 dark:bg-custom-green/5 flex items-center justify-center p-6">
      <BaseModal
        isOpen={isOpen}
        onClose={() => reset()}
      >
        <BaseModal.Header onClose={() => reset()}>
          <div className="flex items-end gap-4">
            <div className="p-2 bg-custom-rosewood/10 rounded-xl">
              <AlertCircle className="w-6 h-6 text-custom-rosewood" />
            </div>
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">System Error</h2>
          </div>
        </BaseModal.Header>

        <BaseModal.Body>
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-lg font-bold text-custom-blue dark:text-custom-almond">Something went wrong</p>
              <p className="text-sm text-custom-blue/60 dark:text-custom-celadon/60 leading-relaxed">
                An unexpected error occurred. This could be due to a server issue, a connection problem, or a file size limit.
              </p>
            </div>
            
            <div className="bg-custom-rosewood/5 border border-custom-rosewood/10 rounded-2xl p-4 overflow-hidden">
              <p className="text-[10px] font-mono text-custom-rosewood break-all uppercase tracking-tight opacity-70 mb-2">Technical Details</p>
              <p className="text-xs font-mono text-custom-rosewood wrap-break-word leading-tight">
                {error.message || "Unknown Error"}
              </p>
            </div>
          </div>
        </BaseModal.Body>

        <BaseModal.Footer>
          <div className="flex justify-end">
            <Button
              onClick={() => reset()}
              variant="rosewood"
              size="md"
              roundness="xl"
              fullWidth
              icon={<RefreshCcw className="h-4 w-4" />}
            >
              Try Again
            </Button>
          </div>
        </BaseModal.Footer>
      </BaseModal>
    </div>
  );
}
