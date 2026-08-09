"use client";


import ExchangeCoinPage from "@/content/ExchangeCoin";



const ExchangeCoinPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <ExchangeCoinPage params={params} />;
};
export default ExchangeCoinPages;

