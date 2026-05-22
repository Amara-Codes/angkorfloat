import prisma from "@/lib/prisma";
import SessionForm from "@/components/admin/sessions/SessionForm";
import { notFound } from "next/navigation";

export default async function EditSessionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [session, therapists] = await Promise.all([
    prisma.healingSession.findUnique({
      where: { id },
    }),
    prisma.therapist.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    })
  ]);

  if (!session) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon">Edit Session</h2>
        <p className="text-custom-blue/40 dark:text-custom-celadon/50 mt-1 font-bold uppercase tracking-widest text-[10px]">Update treatment details and pricing.</p>
      </div>
      
      <SessionForm session={session} therapists={therapists} />
    </div>
  );
}
