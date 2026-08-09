'use client';

import AngpaoPage from '@/content/Angpao';
import useAuthentication from '@/hooks/useAuthentication';

export default function MemberAngpaoPage() {
  useAuthentication();
  return <AngpaoPage />;
}
