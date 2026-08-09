"use client";
import AccountBackPage from "@/content/AccountBank";
import useAuthentication from "@/hooks/useAuthentication";

const AccountBackPages = () => {
  useAuthentication()
  return <AccountBackPage />
}
export default AccountBackPages;
