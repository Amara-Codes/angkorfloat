import prisma from "@/lib/prisma";
import PackageForm from "@/components/admin/float/PackageForm";
import { notFound } from "next/navigation";

export default async function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const pkg = await prisma.floatPackage.findUnique({
    where: { id },
  });

  if (!pkg) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">Edit Package</h2>
        <p className="text-custom-blue/40 dark:text-custom-celadon/50 mt-1 font-bold uppercase tracking-widest text-[10px]">Update package pricing, session count or validity.</p>
      </div>
      
      <PackageForm package={pkg} />
    </div>
  );
}
