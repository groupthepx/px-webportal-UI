
"use client";
import PXMarketPage from "@/content/PXMarket";
import useAuthentication from "@/hooks/useAuthentication";


const PXMarket = () => {
  useAuthentication()
  return <PXMarketPage />
}
export default PXMarket;

