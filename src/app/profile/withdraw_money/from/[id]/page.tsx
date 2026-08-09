"use client";


import WithdrawMoneyFromPage from "@/content/withdrawFrom";


const WithdrawMoneyFromPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <WithdrawMoneyFromPage params={params} />;
};
export default WithdrawMoneyFromPages;

