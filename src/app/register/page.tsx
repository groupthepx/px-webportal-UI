'use client';
import { Suspense } from 'react';
import RegisterPage from "@/content/RecruitmentRegister";

export default function RegisterPages() {
  return (
    <Suspense fallback={null}>
      <RegisterPage />
    </Suspense>

  );
}
