"use client";

import RecruitmentApplyPage from "@/content/RecruitmentApply";
import { useParams } from "next/navigation";

export default function ApplyBySourcePage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  return <RecruitmentApplyPage slug={slug || "direct"} />;
}
