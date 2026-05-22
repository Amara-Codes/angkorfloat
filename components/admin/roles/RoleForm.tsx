"use client";

import { useActionState } from "react";
import { saveRole } from "@/lib/actions/role";
import { Shield, CheckCircle2, Circle, Fingerprint, Lock } from "lucide-react";
import FormActions from "@/components/admin/common/FormActions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/common/Button";
import { useState, useEffect } from "react";
import BaseModal from "@/components/common/BaseModal";
import { AlertCircle } from "lucide-react";
import { Input } from "@/components/common/Input";

export default function RoleForm({ role, allPermissions }: { role?: any, allPermissions: any[] }) {
  const saveAction = (prevState: any, formData: FormData) => saveRole(prevState, formData, role?.id);
  const [errorMessage, dispatch] = useActionState(saveAction, undefined);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    if (errorMessage) {
      setShowErrorModal(true);
    }
  }, [errorMessage]);

  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<string>>(
    new Set(role?.permissions?.map((p: any) => p.id) || [])
  );

  const togglePermission = (id: string) => {
    setSelectedPermissionIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group permissions by resource
  const groupedPermissions: Record<string, any[]> = {};
  allPermissions.forEach(p => {
    const [resource] = p.name.split(':');
    if (!groupedPermissions[resource]) groupedPermissions[resource] = [];
    groupedPermissions[resource].push(p);
  });

  const resourceLabels: Record<string, string> = {
    blog: "Content (Blog)",
    category: "Taxonomy (Categories)",
    therapist: "Team (Therapists)",
    session: "Operations (Sessions)",
    package: "Offers (Packages)",
    user: "Users",
    role: "Governance (Roles)",
    faq: "FAQs & Knowledge"
  };

  const rolePermissionIds = new Set(role?.permissions?.map((p: any) => p.id) || []);

  return (
    <form action={dispatch} className="max-w-6xl space-y-8 pb-20 transition-colors duration-300">
      <FormActions 
        backLink="/admin/roles" 
        backLabel="Back to roles list" 
        buttonLabel={role ? "Update Role" : "Create Role"} 
      />

      <div className="bg-custom-coconut/60 dark:bg-custom-blue border border-custom-blue/5 dark:border-custom-coconut/5 rounded-4xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl transition-all hover:shadow-custom-blue/5">
        <div className="flex items-end gap-4 mb-10 border-b border-custom-blue/5 dark:border-custom-coconut/5 pb-6">
          <div className="p-3 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-2xl shadow-inner">
            <Shield className="h-10 w-10 text-custom-blue dark:text-custom-celadon" />
          </div>
          <div>
            <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">Role Configuration</h3>
            <p className="text-[10px] ps-2 uppercase tracking-widest font-bold text-custom-blue/60 dark:text-custom-celadon/60 mt-1">Define functional access levels and granular permissions</p>
          </div>
        </div>

        <div className="space-y-12">
            <Input
              id="name"
              name="name"
              label="Role Identity (Label)"
              defaultValue={role?.name?.replace(/_/g, " ")}
              required
              placeholder="e.g. Content Editor, Store Manager..."
              leftIcon={<Fingerprint className="h-5 w-5" />}
              autoComplete="off"
            />

          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-custom-blue/60 dark:text-custom-celadon/60">Granular Permissions Matrix</h3>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-custom-celadon/10 text-custom-celadon border border-custom-celadon/20">
                <Lock className="h-3 w-3 text-custom-blue/60 dark:text-custom-celadon/60" />
                <span className="text-[8px] font-black uppercase tracking-tighter text-custom-blue/60 dark:text-custom-celadon/60">Secure RBAC</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="bg-custom-coconut/30 dark:bg-custom-coconut/5 border border-custom-blue/5 dark:border-custom-coconut/5 rounded-3xl p-6 transition-all hover:bg-custom-coconut/60 dark:hover:bg-custom-coconut/10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold text-custom-blue dark:text-custom-celadon flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-custom-celadon animate-pulse" />
                      {resourceLabels[resource] || resource.toUpperCase()}
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {perms.map(p => {
                      const action = p.name.split(':')[1];
                      const isChecked = selectedPermissionIds.has(p.id);
                      return (
                        <div key={p.id} className="relative">
                          {isChecked && <input type="hidden" name="permissions" value={p.id} />}
                          <Button
                            type="button"
                            variant={isChecked ? "theme-responsive" : "outline-light"}
                            size="sm"
                            roundness="lg"
                            icon={isChecked ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3.5 w-3.5 opacity-40" />}
                            onClick={() => togglePermission(p.id)}
                            className="font-black uppercase tracking-tighter text-[10px] min-w-[100px]"
                          >
                            {action}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
            <h2 className="text-2xl font-kugile text-custom-blue dark:text-custom-almond">Role Update Failed</h2>
          </div>
        </BaseModal.Header>
        <BaseModal.Body>
          <div className="space-y-4">
            <p className="text-custom-blue/70 dark:text-custom-celadon/70 font-josefin">
              We encountered an error while trying to save the role configuration:
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
