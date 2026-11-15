import Link from "next/link";
import { notFound } from "next/navigation";
import { updateFounderProfile } from "@/lib/actions";
import { getFounders, isFounderKey, toFormValues } from "@/lib/founders";
import FounderForm from "./FounderForm";

type Props = { params: Promise<{ key: string }> };

export default async function EditFounderPage({ params }: Props) {
  const { key } = await params;
  if (!isFounderKey(key)) notFound();
  const profile = (await getFounders())[key];

  return (
    <div>
      <h1 className="font-serif text-3xl">Edit {profile.name}&apos;s profile</h1>
      <p className="mt-2 text-slate">
        This is the {key === "founder" ? "founder" : "co-founder"} card on the{" "}
        <Link href="/about" target="_blank" className="underline underline-offset-4">About page</Link>. Changes show there as soon
        as you save. The name is fixed because it also appears in the privacy policy; ask your developer to change it.
      </p>
      <div className="mt-8">
        <FounderForm kind={key} values={toFormValues(profile)} action={updateFounderProfile.bind(null, key)} />
      </div>
    </div>
  );
}
