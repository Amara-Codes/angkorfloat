import prisma from "@/lib/prisma";
import SessionForm from "@/components/admin/sessions/SessionForm";

export default async function NewSessionPage() {
  const therapists = await prisma.therapist.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">New Healing Session</h2>
        <p className="text-custom-blue/40 dark:text-custom-celadon/50 mt-1 font-bold uppercase tracking-widest text-[10px]">Add a new wellness treatment to your catalog.</p>
      </div>
      
      <SessionForm therapists={therapists} />
    </div>
  );
}
