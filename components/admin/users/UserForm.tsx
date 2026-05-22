"use client";

import { useActionState, useState, useRef, useEffect } from "react";
import { saveUser } from "@/lib/actions/user";
import { Loader2, Camera, User, Mail, Lock, Shield, Eye, EyeOff, Upload, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import imageCompression from 'browser-image-compression';
import FormActions from "@/components/admin/common/FormActions";
import { Select, SelectOption } from "@/components/common/Select";
import BaseModal from "@/components/common/BaseModal";
import { AlertCircle } from "lucide-react";
import { Input, Label } from "@/components/common/Input";

export default function UserForm({ user, roles }: { user?: any, roles: any[] }) {
  const saveAction = (prevState: any, formData: FormData) => saveUser(prevState, formData, user?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true);
    }
  }, [errorMessage]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [selectedRoleId, setSelectedRoleId] = useState(user?.roles?.[0]?.id || "");
  
  // Resolve avatar URL from either imageUrl or serialized binary image
  const displayImage = imagePreview || user?.imageUrl || user?.image || null;

  return (
    <form action={dispatch} className="max-w-6xl space-y-8 pb-20 transition-colors duration-300">
      <FormActions 
        backLink="/admin/users" 
        backLabel="Back to users list" 
        buttonLabel={user ? "Update Account" : "Create User"} 
      />

      <div className="bg-custom-coconut/40 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5">
        <div className="flex items-end gap-4 mb-10 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-6">
          <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl shadow-inner">
            <User className="h-10 w-10 text-custom-blue dark:text-custom-celadon" />
          </div>
          <div>
            <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">User Identity</h3>
            <p className="text-[10px] ps-2 uppercase tracking-widest font-bold text-custom-blue/40 dark:text-custom-celadon/50 mt-1">Configure administrator access and profile details</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input
                id="name"
                name="name"
                label="First Name"
                defaultValue={user?.name}
                placeholder="e.g. Robert"
                autoComplete="off"
              />
              <Input
                id="surname"
                name="surname"
                label="Last Name"
                defaultValue={user?.surname}
                placeholder="e.g. Fox"
                autoComplete="off"
              />
            </div>

            <Input
              id="email"
              name="email"
              type="email"
              label="Email Address"
              defaultValue={user?.email}
              required
              placeholder="admin@angkorfloat.com"
              leftIcon={<Mail className="h-5 w-5" />}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label={user ? "Password (Leave blank to keep)" : "Password"}
                value={password}
                onChange={setPassword}
                required={!user}
                minLength={6}
                placeholder="••••••••"
                leftIcon={<Lock className="h-5 w-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-custom-blue/20 dark:text-custom-celadon/20 hover:text-custom-blue dark:hover:text-custom-celadon transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                autoComplete="new-password"
              />
              <Input
                id="passwordConfirm"
                name="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                label="Confirm Password"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
                required={!user || password.length > 0}
                placeholder="••••••••"
                leftIcon={<Lock className={cn("h-5 w-5", password && password === passwordConfirm ? "text-emerald-500" : "text-custom-blue/20")} />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="text-custom-blue/20 dark:text-custom-celadon/20 hover:text-custom-blue dark:hover:text-custom-celadon transition-colors"
                  >
                    {showPasswordConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                className={password && password !== passwordConfirm ? "border-custom-rosewood/50 ring-custom-rosewood/20" : ""}
                autoComplete="new-password"
              />
            </div>

            <div>
              <Label>Access Role</Label>
              <div className="relative">
                <Select
                  name="roleId"
                  value={selectedRoleId}
                  onChange={setSelectedRoleId}
                  placeholder="Select a role"
                >
                  {roles.map(role => (
                    <SelectOption key={role.id} value={role.id} icon={<Shield className="h-4 w-4" />}>
                      {role.name.replace(/_/g, " ")}
                    </SelectOption>
                  ))}
                </Select>
              </div>
            </div>

            <Input
              id="biography"
              name="biography"
              as="textarea"
              label="Biography"
              defaultValue={user?.biography}
              placeholder="Write a short biography about the author..."
              rows={5}
              className="resize-none min-h-[120px]"
            />
          </div>

          <div className="flex flex-col gap-12">
            <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-4">Avatar Photo</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="h-52 w-52 rounded-full bg-custom-coconut/50 dark:bg-custom-coconut/5 border-2 border-dashed border-custom-blue/10 dark:border-custom-celadon/30 flex flex-col items-center justify-center gap-2 relative group cursor-pointer overflow-hidden text-custom-blue/30 dark:text-custom-celadon/40 hover:bg-custom-coconut dark:hover:bg-custom-coconut/10 hover:border-custom-blue/30 dark:hover:border-custom-celadon/60 transition-all shadow-inner">
                  {isCompressing ? (
                    <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                      <Loader2 className="h-10 w-10 text-custom-rosewood animate-spin" />
                    </div>
                  ) : !removeImage && displayImage ? (
                    <>
                      <img src={displayImage} className="h-full w-full object-cover" alt="User" />
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
                      <span className="text-[10px] font-bold uppercase opacity-30 group-hover:opacity-100">Upload Avatar</span>
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
                          const options = { maxSizeMB: 0.5, maxWidthOrHeight: 512, useWebWorker: true };
                          const compressedFile = await imageCompression(file, options);
                          const dataTransfer = new DataTransfer();
                          dataTransfer.items.add(new File([compressedFile], file.name, { type: file.type }));
                          if (fileInputRef.current) fileInputRef.current.files = dataTransfer.files;
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
                <p className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 uppercase tracking-tighter font-bold">Square profile image.</p>
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
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">User Profile Update Failed</h2>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue/70 dark:text-custom-celadon/70 font-josefin">
              We encountered an error while trying to save the user profile:
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
            I Understand
          </button>
        </BaseModal.Footer>
      </BaseModal>
    </form>
  );
}
