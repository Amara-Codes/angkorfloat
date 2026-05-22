import TherapistForm from "@/components/admin/therapists/TherapistForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditTherapistPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  
  const therapist = await prisma.therapist.findUnique({
    where: { id },
  });

  if (!therapist) {
    notFound();
  }

  const serializedTherapist = therapist ? {
    ...therapist,
    image: !therapist.imageUrl && therapist.image 
      ? `data:image/png;base64,${Buffer.from(therapist.image).toString('base64')}` 
      : null,
  } : null;

  return (
      <TherapistForm therapist={serializedTherapist as any} />
  );
}
