"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveHealingSession } from "@/lib/actions/sessions";
import { Save, ArrowLeft, Clock, DollarSign, FileText, User } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import FormActions from "@/components/admin/common/FormActions";
import { Select, SelectOption } from "@/components/common/Select";
import { useState, useEffect } from "react";
import BaseModal from "@/components/common/BaseModal";
import { AlertCircle } from "lucide-react";
import { Input, Label } from "@/components/common/Input";

export default function SessionForm({ session, therapists }: { session?: any, therapists: any[] }) {
  const saveAction = (prevState: any, formData: FormData) => saveHealingSession(prevState, formData, session?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true);
    }
  }, [errorMessage]);

  const [therapistId, setTherapistId] = useState(session?.therapistId || "");

  return (
    <form action={dispatch} className="max-w-4xl space-y-8 pb-20  transition-colors duration-300">
      <FormActions 
        backLink="/admin/sessions" 
        backLabel="Back to sessions" 
        buttonLabel={session ? "Update Session" : "Create Session"} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl p-8 space-y-6 shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-lg">
                <FileText className="h-5 w-5 text-custom-blue dark:text-custom-celadon" />
              </div>
              <h3 className="text-xl font-kugile text-custom-blue dark:text-custom-celadon">Session Details</h3>
            </div>

            <Input
              id="name"
              name="name"
              label="Session Name"
              defaultValue={session?.name}
              required
              placeholder="e.g. Reiki Infusion"
              autoComplete="off"
            />

            <Input
              id="description"
              name="description"
              as="textarea"
              label="Description"
              defaultValue={session?.description}
              required
              rows={4}
              placeholder="Describe the session benefits..."
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl p-8 shadow-xl">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-6">Logistics & Pricing</h3>
            
            <div className="space-y-4">
              <Input
                id="duration"
                name="duration"
                type="number"
                label="Duration (minutes)"
                defaultValue={session?.duration}
                required
                leftIcon={<Clock className="h-4 w-4" />}
                autoComplete="off"
              />

              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                label="Price ($)"
                defaultValue={session?.price}
                required
                leftIcon={<DollarSign className="h-4 w-4" />}
              />

              <div>
                <Label>Assigned Therapist</Label>
                <div className="relative">
                  <Select
                    name="therapistId"
                    value={therapistId}
                    onChange={setTherapistId}
                    placeholder="Select a therapist..."
                  >
                    {therapists.map(t => (
                      <SelectOption key={t.id} value={t.id} icon={<User className="h-4 w-4" />}>
                        {t.name}
                      </SelectOption>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BaseModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} size="md">
        <BaseModal.Header onClose={() => setShowErrorModal(false)}>
          <div className="flex items-end gap-4">
            <div className="p-2 bg-custom-rosewood/10 rounded-xl">
              <AlertCircle className="w-6 h-6 text-custom-rosewood" />
            </div>
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">Session Update Failed</h2>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue/70 dark:text-custom-celadon/70 font-josefin">
              We encountered an error while trying to save the healing session:
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
            Review Details
          </button>
        </BaseModal.Footer>
      </BaseModal>
    </form>
  );
}


