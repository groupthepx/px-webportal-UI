'use client';

import TrainingAppSelection from '@/content/TrainingAppSelection';
import VJOnlyRoute from '@/components/VJOnlyRoute';
import useAuthentication from '@/hooks/useAuthentication';

export default function MemberTrainingShellPage() {
  useAuthentication();
  return <VJOnlyRoute><TrainingAppSelection /></VJOnlyRoute>;
}
