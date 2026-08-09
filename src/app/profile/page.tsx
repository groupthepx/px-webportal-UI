"use client";
import { Suspense } from "react";
import ProfileSettings from "@/content/ProfileSettings";
import useAuthentication from "@/hooks/useAuthentication";


const ProfileDetailContent = () => {
  useAuthentication()
  return <ProfileSettings />
}

const ProfileDetailPages = () => (
  <Suspense fallback={null}>
    <ProfileDetailContent />
  </Suspense>
);

export default ProfileDetailPages;
