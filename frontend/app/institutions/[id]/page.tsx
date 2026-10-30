import React from "react";
import { InstitutionDetailClient } from "./InstitutionDetailClient";
import { MOCK_INSTITUTIONS } from "@/lib/mock/data";

export function generateStaticParams() {
  return MOCK_INSTITUTIONS.map((inst) => ({
    id: inst.id,
  }));
}

export default async function InstitutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InstitutionDetailClient institutionId={id} />;
}
