'use client';

import MemberLevelProgress from '@/content/MemberLevelProgress';
import VJOnlyRoute from '@/components/VJOnlyRoute';
import useAuthentication from '@/hooks/useAuthentication';

export default function MemberLevelProgressPage() {
  useAuthentication();
  return <VJOnlyRoute><MemberLevelProgress /></VJOnlyRoute>;
}
