"use client";

import HistoryPage from "@/content/History";



const HistoryPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <HistoryPage params={params} />;
};
export default HistoryPages;

