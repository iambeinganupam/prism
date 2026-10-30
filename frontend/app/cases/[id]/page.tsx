import { redirect } from "next/navigation";

export default async function CaseIdRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/complaints/${id}`);
}
