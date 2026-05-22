"use client";

import { useActionState, useState } from "react";
import { saveFaq } from "@/lib/actions/faq";
import { HelpCircle, Lock, Globe, AlertCircle, Settings } from "lucide-react";
import FormActions from "@/components/admin/common/FormActions";
import { cn } from "@/lib/utils";
import BaseModal from "@/components/common/BaseModal";
import { Input } from "@/components/common/Input";

interface FaqFormProps {
  faq?: {
    id: string;
    question: string;
    question_kh: string | null;
    answer: string;
    answer_kh: string | null;
    published: boolean;
  };
  canPublish?: boolean;
}

export default function FaqForm({ faq, canPublish = true }: FaqFormProps) {
  const saveAction = (prevState: any, formData: FormData) => saveFaq(prevState, formData, faq?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [published, setPublished] = useState(faq ? faq.published : false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Trigger modal when error message arrives
  if (errorMessage && !showErrorModal) {
    setShowErrorModal(true);
  }

  return (
    <form action={dispatch} className="max-w-6xl space-y-8 pb-20 transition-colors duration-300">
      <FormActions 
        backLink="/admin/faq" 
        backLabel="Back to FAQs" 
        buttonLabel={faq ? "Update FAQ" : "Create FAQ"} 
        disabled={!canPublish && published}
      />

      {/* Hidden input to pass published status */}
      <input type="hidden" name="published" value={String(published)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5">
            <div className="flex items-end gap-4 mb-10 border-b border-custom-blue/5 dark:border-white/5 pb-6">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl shadow-inner">
                <HelpCircle className="h-10 w-10 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">FAQ Details</h3>
                <p className="text-[10px] ps-2 uppercase tracking-widest font-bold text-custom-blue/40 dark:text-custom-celadon/50 mt-1">Manage localized questions, answers, and visibility</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50">English Version</h4>
                <Input
                  id="question"
                  name="question"
                  label="Question (EN)"
                  defaultValue={faq?.question}
                  required
                  placeholder="e.g. What is float therapy?"
                />

                <Input
                  id="answer"
                  name="answer"
                  as="textarea"
                  label="Answer (EN)"
                  defaultValue={faq?.answer}
                  required
                  rows={6}
                  placeholder="e.g. Float therapy is a way of relaxing..."
                  className="resize-none"
                />
              </div>

              <div className="space-y-6 pt-6 border-t border-custom-blue/5 dark:border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/50">Khmer Version</h4>
                <Input
                  id="question_kh"
                  name="question_kh"
                  label="Question (KH)"
                  defaultValue={faq?.question_kh || undefined}
                  placeholder="e.g. តើការព្យាបាលដោយអណ្តែតទឹកគឺជាអ្វី?"
                />

                <Input
                  id="answer_kh"
                  name="answer_kh"
                  as="textarea"
                  label="Answer (KH)"
                  defaultValue={faq?.answer_kh || undefined}
                  rows={6}
                  placeholder="e.g. ការព្យាបាលដោយអណ្តែតទឹកគឺជាវិធីសាស្រ្តមួយ..."
                  className="resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-4xl p-8 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl">
                <Settings className="h-6 w-6 text-custom-blue dark:text-custom-celadon" />
              </div>
              <div>
                <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon">Visibility</h3>
                <span className="text-[10px] font-bold text-custom-blue/60 dark:text-custom-celadon/60 uppercase tracking-[0.2em]">Publish Status</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 sm:p-5 bg-white/60 dark:bg-white/5 rounded-2xl border border-custom-blue/10 dark:border-white/10 shadow-sm transition-all gap-4">
              <div className="flex items-center gap-3">
                <div className={cn("p-2.5 rounded-2xl transition-colors shrink-0", published ? "bg-emerald-500/10 text-emerald-500" : "bg-custom-rosewood/10 text-custom-rosewood")}>
                  {published ? <Globe className="h-5 w-5" /> : <Lock className="h-5 w-5" />}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm uppercase tracking-wider text-custom-blue dark:text-custom-almond">{published ? "Published" : "Draft"}</span>
                  <span className="text-[9px] text-custom-blue/40 dark:text-custom-celadon/30 uppercase tracking-tighter font-bold">{published ? "Live on site" : "Hidden"}{!canPublish && " (Read-only)"}</span>
                </div>
              </div>
              
              <button 
                type="button"
                disabled={!canPublish}
                onClick={() => setPublished(!published)}
                className={cn(
                  "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-custom-blue/20 dark:focus:ring-custom-celadon/30 shadow-inner",
                  published ? "bg-emerald-500" : "bg-custom-blue/10 dark:bg-white/10",
                  !canPublish && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className={cn(
                  "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out",
                  published ? "translate-x-6" : "translate-x-0"
                )} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <BaseModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} size="md">
        <BaseModal.Header onClose={() => setShowErrorModal(false)}>
          <div className="flex items-center gap-3 text-custom-rosewood">
            <AlertCircle className="h-6 w-6" />
            <span>FAQ Update Failed</span>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue/70 dark:text-custom-celadon/70 font-josefin">
              We encountered an error while trying to save the FAQ configuration:
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
