/**
 * Utility Functions สำหรับคำนวณข้อมูล Mission
 * แยก logic ที่ซับซ้อนออกจาก component
 */

interface MissionData {
  mission_id: string | number;
  name_mission: string;
  icon_img?: string;
  amount_mission: number;
  bonus_mission?: number;
  bonus_position_mission?: number;
  [key: string]: any;
}

interface ProcessedMission {
  name: string;
  id: string | number;
  title: string;
  url_active: string;
  url_unactive: string;
  coin: number;
  bonus_mission?: number;
  bonus_position_mission?: number;
}

interface MilestoneResult {
  filteredMilestones: ProcessedMission[];
  coinData: number;
}

/**
 * แปลง mission data ให้อยู่ในรูปแบบที่ใช้งานได้
 */
export const processMissionData = (
  data: MissionData[] = [],
  limit: number = 20
): ProcessedMission[] => {
  if (!data || data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => a.amount_mission - b.amount_mission);

  return sortedData.slice(0, limit).map((item) => ({
    name: item.name_mission,
    id: item.mission_id,
    title: item.name_mission,
    url_active: item.icon_img
      ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.icon_img}`
      : '',
    url_unactive: item.icon_img
      ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.icon_img}`
      : '',
    coin: item.amount_mission,
    bonus_mission: item.bonus_mission,
    bonus_position_mission: item.bonus_position_mission,
  }));
};

/**
 * คำนวณ milestone และ coin data สำหรับ position mission
 */
export const calculatePositionMilestones = (
  myAmount: number,
  missions: ProcessedMission[] = [],
  maxAmountEnd: number
): MilestoneResult => {
  if (!missions || missions.length === 0) {
    return { filteredMilestones: [], coinData: 0 };
  }

  // กรณีที่ยอดเกิน max amount
  if (myAmount > maxAmountEnd) {
    const topMissions = [...missions]
      .sort((a, b) => b.coin - a.coin)
      .slice(0, 5)
      .sort((a, b) => a.coin - b.coin);

    const maxPrevious = missions.reduce((max, item) =>
      item.coin > max.coin ? item : max
    );

    const coinData = maxPrevious?.bonus_position_mission ?? 0;

    return {
      filteredMilestones: topMissions,
      coinData,
    };
  }

  // กรณีปกติ
  const previousMilestone = missions.filter((item) => item.coin <= myAmount);
  const nextMilestone = missions.filter((item) => item.coin > myAmount);

  const beforeItems = previousMilestone.slice(
    nextMilestone.length === 1 ? -4 : -3,
    -1
  );
  const currentItem = previousMilestone.length > 0 ? previousMilestone.slice(-1) : [];
  const afterItems = nextMilestone.slice(0, 2);

  const maxPreviousMilestone =
    previousMilestone.length > 0
      ? previousMilestone.reduce((max, item) => (item.coin > max.coin ? item : max))
      : null;

  const coinData = maxPreviousMilestone?.bonus_position_mission ?? 0;

  let combined = [...beforeItems, ...currentItem, ...afterItems];

  // เพิ่มรายการเพื่อให้ได้ 5 items
  if (combined.length < 5) {
    const missing = 5 - combined.length;

    const moreBefore = previousMilestone
      .slice(
        Math.max(0, previousMilestone.length - beforeItems.length - missing),
        previousMilestone.length - beforeItems.length
      )
      .filter((item) => !combined.some((c) => c.id === item.id));

    const moreAfter = nextMilestone
      .slice(afterItems.length, afterItems.length + missing)
      .filter((item) => !combined.some((c) => c.id === item.id));

    combined = [...moreBefore, ...combined, ...moreAfter].slice(-5);
  }

  const filteredMilestones = combined.sort((a, b) => a.coin - b.coin);

  return {
    filteredMilestones,
    coinData,
  };
};

/**
 * คำนวณ total bonus จาก collected missions
 */
export const calculateTotalMissionBonus = (
  collectedMissions: Array<{ collect_bonus_position_mission?: number }> = []
): number => {
  return collectedMissions.reduce((sum, item) => {
    return sum + (item.collect_bonus_position_mission || 0);
  }, 0);
};

