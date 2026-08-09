export type MissionView = 'none' | 'star_live';

export function getLiveShortcutAppId(appIds: string[]) {
  return appIds.length === 1 ? appIds[0] : undefined;
}

export function toggleMissionView(current: MissionView, next: Exclude<MissionView, 'none'>): MissionView {
  return current === next ? 'none' : next;
}
