"use client";

import WithdrawMoneyReportPage from "@/content/withdrawMoney/Report";




const WithdrawMoneyReportPages = ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  return <WithdrawMoneyReportPage params={params} />;
};
export default WithdrawMoneyReportPages;

