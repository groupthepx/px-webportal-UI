export type AppShortcutAction = 'training' | 'affiliate_bonus';

export type AppShortcutDestination =
  | { mode: 'direct'; appId: string }
  | { mode: 'select'; href: '/member/profile' | '/member/training' };

export function getAppShortcutDestination(action: AppShortcutAction, appIds: string[]): AppShortcutDestination {
  if (appIds.length === 1) {
    return { mode: 'direct', appId: appIds[0] };
  }

  return {
    mode: 'select',
    href: action === 'training' ? '/member/training' : '/member/profile',
  };
}
