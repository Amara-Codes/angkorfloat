"use client";

import { useActionState, useState } from "react";
import { saveCategory } from "@/lib/actions/category";
import { Tag, AlertCircle, Info } from "lucide-react";
import FormActions from "@/components/admin/common/FormActions";
import { cn } from "@/lib/utils";
import BaseModal from "@/components/common/BaseModal";
import { Input } from "@/components/common/Input";

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
  };
}

export default function CategoryForm({ category }: CategoryFormProps) {
  const saveAction = (prevState: any, formData: FormData) => saveCategory(prevState, formData, category?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Trigger modal when error message arrives
  if (errorMessage && !showErrorModal) {
    setShowErrorModal(true);
  }

  return (
    <form action={dispatch} className="max-w-6xl space-y-8 pb-20 transition-colors duration-300">
      <FormActions
        backLink="/admin/categories"
        backLabel="Back to Categories"
        buttonLabel={category ? "Update Category" : "Create Category"}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
        {/* Main Content Area */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="flex-1 bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5 flex flex-col">
            <div className="flex items-end gap-4 mb-10 border-b border-custom-blue/5 dark:border-white/5 pb-6">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl shadow-inner">
                <Tag className="h-10 w-10 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">Category Details</h3>
                <p className="text-[10px] ps-2 uppercase tracking-widest font-bold text-custom-blue/40 dark:text-custom-celadon/50 mt-1">Define the name of your blog post category</p>
              </div>
            </div>

            <div className="space-y-8">
              <Input
                id="name"
                name="name"
                label="Category Name"
                defaultValue={category?.name}
                required
                placeholder="e.g. Wellness, Silence, Health"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings Info Card */}
        <div className="flex flex-col space-y-8">
          <div className="flex-1 bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-4xl p-8 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl">
                <Info className="h-6 w-6 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">Taxonomy</h3>
                <span className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-[0.2em]">About Categories</span>
              </div>
            </div>

            <div className="p-5 bg-white/60 dark:bg-white/5 rounded-2xl border border-custom-blue/10 dark:border-white/10 shadow-sm leading-relaxed text-sm text-custom-blue/80 dark:text-custom-celadon/80 space-y-4">
              <p className="font-bold">
                Categories help users browse and filter articles on the blog list.
              </p>
              <p className="opacity-75 font-bold font-josefin">
                Keep names concise and distinct (e.g. "Floatation", "Mindfulness", "Detox"). Categories are shared globally across all articles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BaseModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} size="md">
        <BaseModal.Header onClose={() => setShowErrorModal(false)}>
          <div className="flex items-end gap-4">
            <div className="flex items-end gap-4">
              <div className="p-2 bg-custom-rosewood/10 rounded-xl">
                <AlertCircle className="w-6 h-6 text-custom-rosewood" />
              </div>
              <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">Category Save Failed</h2>
            </div>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue/70 dark:text-custom-celadon/70 font-josefin">
              We encountered an issue while trying to save the category:
            </p>
            <div className="p-4 bg-custom-rosewood/10 border border-custom-rosewood/20 rounded-2xl text-custom-rosewood font-bold text-sm">
              {errorMessage}
            </div>
          </div>
        </BaseModal.Body>
        <BaseModal.Footer>
          <button
            type="button"
            onClick={() => setShowErrorModal(false)}
            className="w-full py-4 bg-custom-rosewood text-white rounded-2xl font-black uppercase tracking-tighter hover:bg-custom-rosewood/90 transition-all shadow-lg"
          >
            Review Settings
          </button>
        </BaseModal.Footer>
      </BaseModal>
    </form>
  );
}
