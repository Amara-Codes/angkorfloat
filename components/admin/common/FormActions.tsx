"use client";

import { useFormStatus } from "react-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/common/Button";

interface FormActionsProps {
  backLink: string;
  backLabel?: string;
  buttonLabel?: string;
  disabled?: boolean;
}

export default function FormActions({ 
  backLink, 
  backLabel = "Back to list", 
  buttonLabel = "Save Changes",
  disabled = false
}: FormActionsProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center justify-between">
      <Link 
        href={backLink as any} 
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-custom-blue/50 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>
      
      <Button
        type="submit"
        disabled={pending || disabled}
        variant="theme-responsive"
        size="md"
        roundness="xl"
        className="min-w-[140px]"
        icon={pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
      >
        {pending ? "Saving..." : buttonLabel}
      </Button>
    </div>
  );
}
