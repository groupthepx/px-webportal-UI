"use client";


import WithdrawCoinPage from "@/content/withdrawcoin";


const WithdrawCoinPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <WithdrawCoinPage params={params} />;
};
export default WithdrawCoinPages;

