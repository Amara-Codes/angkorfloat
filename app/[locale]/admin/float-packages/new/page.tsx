import PackageForm from "@/components/admin/float/PackageForm";

export default function NewPackagePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">New Float Package</h2>
        <p className="text-custom-blue/40 dark:text-custom-celadon/50 mt-1 font-bold uppercase tracking-widest text-[10px]">Create a new membership or float session bundle.</p>
      </div>
      
      <PackageForm />
    </div>
  );
}
