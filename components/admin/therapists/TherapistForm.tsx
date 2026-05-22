"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { saveTherapist } from "@/lib/actions/therapists";
import { Loader2, Save, ArrowLeft, Camera, UserCheck, UserX, User, Upload, Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/common/Button";
import { cn } from "@/lib/utils";
import imageCompression from 'browser-image-compression';
import { useRef } from "react";
import FormActions from "@/components/admin/common/FormActions";
import { Input } from "@/components/common/Input";

export default function TherapistForm({ therapist }: { therapist?: any }) {
  const saveAction = (prevState: any, formData: FormData) => saveTherapist(prevState, formData, therapist?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [isActive, setIsActive] = useState(therapist ? therapist.isActive : true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const displayImage = imagePreview || therapist?.imageUrl || therapist?.image;

  return (
    <form action={dispatch} className="max-w-6xl space-y-8 pb-20 transition-colors duration-300">
      <FormActions 
        backLink="/admin/therapists" 
        backLabel="Back to team" 
        buttonLabel={therapist ? "Update Profile" : "Add Therapist"} 
      />

      <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5">
        <div className="flex items-end gap-4 mb-10 border-b border-custom-blue/5 dark:border-white/5 pb-6">
          <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl shadow-inner">
            <User className="h-10 w-10 text-custom-blue dark:text-custom-celadon" />
          </div>
          <div>
            <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">Therapist Profile</h3>
            <p className="text-[10px] ps-2 uppercase tracking-widest font-bold text-custom-blue/40 dark:text-custom-celadon/50 mt-1">Manage information, photo and visibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-8">
            <Input
              id="name"
              name="name"
              label="Full Name"
              defaultValue={therapist?.name}
              required
              placeholder="e.g. Dr. Jane Smith"
            />

            <Input
              id="specialties"
              name="specialties"
              label="Specialties (EN)"
              defaultValue={therapist?.specialties}
              required
              placeholder="e.g. Reiki, Sound Healing, Deep Tissue"
            />

            <Input
              id="specialties_kh"
              name="specialties_kh"
              label="Specialties (KH)"
              defaultValue={therapist?.specialties_kh}
              placeholder="e.g. រ៉េគី, ការព្យាបាលដោយសំឡេង"
            />

            <Input
              id="bio"
              name="bio"
              as="textarea"
              label="Biography"
              defaultValue={therapist?.bio}
              rows={6}
              placeholder="Professional background and approach..."
              className="resize-none"
            />
          </div>

          <div className="flex flex-col justify-between gap-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-4">Profile Photo</h3>
              <div className="flex flex-col items-start gap-4">
                 <div className="h-52 w-52 mx-auto rounded-full bg-white/50 dark:bg-white/5 border-2 border-dashed border-custom-blue/10 dark:border-custom-celadon/30 flex flex-col items-center justify-center gap-2 relative group cursor-pointer overflow-hidden text-custom-blue/30 dark:text-custom-celadon/40 hover:bg-white dark:hover:bg-white/10 hover:border-custom-blue/30 dark:hover:border-custom-celadon/60 transition-all shadow-inner">
                    {isCompressing ? (
                      <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                        <Loader2 className="h-10 w-10 text-custom-rosewood animate-spin" />
                        <span className="text-[10px] font-black uppercase text-custom-rosewood">Optimizing</span>
                      </div>
                    ) : !removeImage && displayImage ? (
                      <>
                        <img src={displayImage} className="h-full w-full object-cover" alt="Therapist" />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-custom-blue/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4 z-10">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 bg-custom-coconut text-custom-blue rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
                            title="Change photo"
                          >
                            <Upload className="h-5 w-5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setRemoveImage(true);
                              if (fileInputRef.current) fileInputRef.current.value = "";
                            }}
                            className="p-3 bg-custom-rosewood text-custom-coconut rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all duration-200"
                            title="Remove photo"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-full bg-linear-to-br from-custom-celadon/10 via-custom-blue/5 to-custom-rosewood/5 flex flex-col items-center justify-center gap-2 group-hover:scale-110 transition-transform duration-500"
                      >
                        <Camera className="h-8 w-8 opacity-30 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] font-bold uppercase opacity-30 group-hover:opacity-100">Upload Photo</span>
                      </button>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      name="image" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            setIsCompressing(true);
                            setRemoveImage(false);
                            const options = {
                              maxSizeMB: 1,
                              maxWidthOrHeight: 1024,
                              useWebWorker: true,
                            };
                            const compressedFile = await imageCompression(file, options);
                            
                            const dataTransfer = new DataTransfer();
                            dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
                            if (fileInputRef.current) {
                              fileInputRef.current.files = dataTransfer.files;
                            }

                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result as string);
                              setIsCompressing(false);
                            };
                            reader.readAsDataURL(compressedFile);
                          } catch (error) {
                            console.error("Compression failed:", error);
                            setIsCompressing(false);
                          }
                        }
                      }}
                    />
                 </div>
                 <input type="hidden" name="removeImage" value={String(removeImage)} />
                 <p className="text-[10px] mx-auto text-custom-blue/30 dark:text-custom-celadon/30 uppercase tracking-tighter font-bold">Square aspect ratio (400x400).</p>
              </div>
            </div>

            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-4">Status</h3>
              <div className="flex items-center justify-between p-4 sm:p-5 bg-white/60 dark:bg-white/5 rounded-2xl border border-custom-blue/10 dark:border-white/10 shadow-sm transition-all gap-4 mb-2">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2.5 rounded-2xl transition-colors shrink-0", isActive ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400" : "bg-custom-rosewood/10 text-custom-rosewood")}>
                    {isActive ? <UserCheck className="h-5 w-5" /> : <UserX className="h-5 w-5" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm uppercase tracking-wider text-custom-blue dark:text-custom-almond">{isActive ? "Active" : "Inactive"}</span>
                  </div>
                </div>
                <input type="hidden" name="isActive" value={String(isActive)} />
                <button 
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={cn(
                    "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-custom-blue/20 dark:focus:ring-custom-celadon/30 shadow-inner",
                    isActive ? "bg-emerald-500" : "bg-custom-blue/10 dark:bg-white/10"
                  )}
                >
                  <span className={cn(
                    "pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition-transform duration-300 ease-in-out",
                    isActive ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {typeof errorMessage === "string" && (
        <div className="p-5 bg-custom-rosewood/10 border border-custom-rosewood/20 rounded-2xl text-custom-rosewood text-sm font-bold flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-custom-rosewood animate-pulse" />
          {errorMessage}
        </div>
      )}
    </form>
  );
}
