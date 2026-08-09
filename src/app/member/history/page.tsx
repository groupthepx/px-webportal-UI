'use client';

import MemberHistory from '@/content/MemberHistory';
import useAuthentication from '@/hooks/useAuthentication';

export default function MemberHistoryShellPage() {
  useAuthentication();
  return <MemberHistory />;
}
