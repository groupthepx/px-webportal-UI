'use client';

import useAuthentication from '@/hooks/useAuthentication';
import MiniAppPage from '@/content/MiniApp';

export default function MiniAppRoute() {
  useAuthentication();

  return <MiniAppPage />;
}
