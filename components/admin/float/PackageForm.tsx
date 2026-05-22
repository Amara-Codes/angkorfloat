"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveFloatPackage } from "@/lib/actions/float";
import { Save, ArrowLeft, Wind, DollarSign, Layers, Calendar, FileText } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/common/Input";

export default function PackageForm({ package: pkg }: { package?: any }) {
  const saveAction = (prevState: any, formData: FormData) => saveFloatPackage(prevState, formData, pkg?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);

  return (
    <form action={dispatch} className="max-w-4xl space-y-8 pb-20 font-josefin transition-colors duration-300">
      <div className="flex items-center justify-between">
        <Link href="/admin/float-packages" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-custom-blue/50 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Link>
        <SaveButton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-lg">
                <FileText className="h-5 w-5 text-custom-blue dark:text-custom-celadon" />
              </div>
              <h3 className="text-xl font-kugile text-custom-blue dark:text-custom-celadon">Package Definition</h3>
            </div>

            <Input
              id="name"
              name="name"
              label="Package Name"
              defaultValue={pkg?.name}
              required
              placeholder="e.g. Intro Float Pass"
            />

            <Input
              id="description"
              name="description"
              as="textarea"
              label="Description"
              defaultValue={pkg?.description}
              required
              rows={4}
              placeholder="What's included in this package?"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-3xl p-8 shadow-xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-6">Price & Conditions</h3>
            
            <div className="space-y-4">
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                label="Total Price ($)"
                defaultValue={pkg?.price}
                required
                leftIcon={<DollarSign className="h-4 w-4" />}
              />

              <Input
                id="sessionCount"
                name="sessionCount"
                type="number"
                label="Session Count"
                defaultValue={pkg?.sessionCount}
                required
                leftIcon={<Layers className="h-4 w-4" />}
              />

              <Input
                id="validityDays"
                name="validityDays"
                type="number"
                label="Validity (days)"
                defaultValue={pkg?.validityDays}
                required
                leftIcon={<Calendar className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>
      
      {typeof errorMessage === "string" && (
        <div className="p-4 bg-custom-rosewood/10 border border-custom-rosewood/20 rounded-xl text-custom-rosewood text-xs font-bold flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-custom-rosewood animate-pulse" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      size="md"
      roundness="xl"
      isLoading={pending}
      icon={<Save className="h-4 w-4" />}
    >
      Save Package
    </Button>
  );
}
