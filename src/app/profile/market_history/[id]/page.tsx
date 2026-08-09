"use client";

import MarketHistoryPage from "@/content/Market";
const MarketHistoryPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <MarketHistoryPage params={params} />;
};
export default MarketHistoryPages;

