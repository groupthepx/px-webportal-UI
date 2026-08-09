"use client";


import WithdrawMoneyPage from "@/content/withdrawMoney";


const WithdrawMoneyPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <WithdrawMoneyPage params={params} />;
};
export default WithdrawMoneyPages;

