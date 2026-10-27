import { notFound } from "next/navigation";
import { updateReview } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import ReviewEditForm from "../ReviewEditForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditReviewPage({ params }: Props) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit review</h1>
      <p className="mt-2 text-slate">Redact personal details from the display name or message. The rating and status are unchanged.</p>
      <div className="mt-8">
        <ReviewEditForm action={updateReview.bind(null, review.id)} name={review.name} message={review.message} />
      </div>
    </div>
  );
}
