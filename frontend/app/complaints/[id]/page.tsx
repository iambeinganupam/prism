import React from "react";
import { CaseDetailClient } from "./CaseDetailClient";
import { getAllMockCases } from "@/lib/mock/data";

export function generateStaticParams() {
  const cases = getAllMockCases();
  return cases.map((c) => ({
    id: encodeURIComponent(c.id),
  }));
}

export default async function ComplaintDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseDetailClient caseId={id} />;
}
