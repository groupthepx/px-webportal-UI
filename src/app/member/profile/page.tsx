'use client';

import AppAffiliations from '@/content/AppAffiliations';
import VJOnlyRoute from '@/components/VJOnlyRoute';
import useAuthentication from '@/hooks/useAuthentication';

export default function MemberProfileShellPage() {
  useAuthentication();
  return <VJOnlyRoute><AppAffiliations /></VJOnlyRoute>;
}
