"use client";

import MemberdetailPage from "@/content/memberdetail";


const MemberdetailPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <MemberdetailPage params={params} />;
};
export default MemberdetailPages;

