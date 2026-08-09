export interface VdoCategoryGroup {
  id: string;
  name: string;
  sortOrder: number;
  videos: any[];
  total: number;
  completed: number;
  progressPercent: number;
}

const UNCATEGORIZED_ID = 'uncategorized';
const UNCATEGORIZED_NAME = 'ไม่ระบุหมวด';

const clampProgress = (value: unknown) => {
  const numeric = typeof value === 'number' ? value : Number(value || 0);
  if (Number.isNaN(numeric)) return 0;
  return Math.max(0, Math.min(100, numeric));
};

const getCategoryId = (video: any) => {
  const directId = video?.vdo_category_id || video?.category_id;
  const nestedId = video?.vdo_category?.vdo_category_id || video?.category?.category_id;
  return `${directId || nestedId || UNCATEGORIZED_ID}`;
};

const getCategoryName = (video: any) => {
  const directName = video?.vdo_category_name || video?.category_name;
  const nestedName = video?.vdo_category?.name || video?.category?.name;
  const name = `${directName || nestedName || ''}`.trim();
  return name || UNCATEGORIZED_NAME;
};

const getCategorySortOrder = (video: any) => {
  const directOrder = video?.vdo_category_sort_order || video?.category_sort_order;
  const nestedOrder = video?.vdo_category?.sort_order || video?.category?.sort_order;
  const numeric = Number(directOrder || nestedOrder || 9999);
  return Number.isNaN(numeric) ? 9999 : numeric;
};

export const buildVdoCategoryGroups = (
  videos: any[] = [],
  progressItems: any[] = []
): VdoCategoryGroup[] => {
  const progressByVideoId = new Map<string, number>(
    progressItems.map((item: any) => [
      `${item?.vdo_id || item?.vdo?.vdo_id || ''}`,
      clampProgress(item?.progress),
    ])
  );
  const groupById = new Map<string, VdoCategoryGroup & { progressSum: number }>();

  videos.forEach((video) => {
    const id = getCategoryId(video);
    const group =
      groupById.get(id) ||
      {
        id,
        name: getCategoryName(video),
        sortOrder: getCategorySortOrder(video),
        videos: [],
        total: 0,
        completed: 0,
        progressPercent: 0,
        progressSum: 0,
      };

    const videoProgress = progressByVideoId.get(`${video?.vdo_id || ''}`) || 0;
    group.videos.push(video);
    group.total += 1;
    group.completed += videoProgress >= 100 ? 1 : 0;
    group.progressSum += videoProgress;
    group.progressPercent = Math.round(group.progressSum / group.total);
    groupById.set(id, group);
  });

  return Array.from(groupById.values())
    .map(({ progressSum, ...group }) => ({
      ...group,
      videos: [...group.videos].sort(
        (a, b) => Number(a?.vdo_rank || 0) - Number(b?.vdo_rank || 0)
      ),
    }))
    .sort((a, b) => {
      if (a.sortOrder === b.sortOrder) return a.name.localeCompare(b.name);
      return a.sortOrder - b.sortOrder;
    });
};
