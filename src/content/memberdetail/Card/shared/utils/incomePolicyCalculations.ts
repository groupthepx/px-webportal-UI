/**
 * Utility Functions สำหรับคำนวณข้อมูล Income Policy
 * แยก logic ที่ซับซ้อนออกจาก component
 */

interface IncomePolicyData {
  amount_start: number;
  amount_end: number;
  percent_reward: number;
  [key: string]: any;
}

interface MilestoneData {
  value: number;
  percent: number;
}

interface IncomePolicyResult {
  progress: number;
  coinBonus: number;
  filteredMilestones: MilestoneData[];
  start: number;
  maxAmountEndNew: number;
}

/**
 * คำนวณ progress, bonus และ milestones สำหรับ Income Policy
 */
export const calculateIncomePolicyProgress = (
  myAmount: number,
  data: IncomePolicyData[] = []
): IncomePolicyResult => {
  if (!data || data.length === 0) {
    return {
      progress: 0,
      coinBonus: 0,
      filteredMilestones: [],
      start: 0,
      maxAmountEndNew: 0,
    };
  }

  const maxAmountEnd = Math.max(...data.map((item) => item.amount_end));

  // กรณีที่ยอดเกิน max amount
  if (myAmount > maxAmountEnd) {
    const maxPrevious = data.reduce((max, item) =>
      item.amount_end > max.amount_end ? item : max
    );

    const coinBonus = maxPrevious
      ? (maxPrevious.percent_reward * myAmount) / 100
      : 0;

    return {
      progress: (myAmount / maxAmountEnd) * 100 || 0,
      coinBonus,
      filteredMilestones: [
        {
          value: maxPrevious.amount_end,
          percent: maxPrevious.percent_reward,
        },
      ],
      start: 0,
      maxAmountEndNew: maxAmountEnd,
    };
  }

  // กรณีปกติ
  const previousMilestones = data.filter((item) => item.amount_end <= myAmount);
  const nextMilestones = data.filter((item) => item.amount_end > myAmount);

  const maxPreviousMilestone =
    previousMilestones.length > 0
      ? previousMilestones.reduce((max, item) =>
          item.amount_end > max.amount_end ? item : max
        )
      : null;

  const minNextMilestone =
    nextMilestones.length > 0
      ? nextMilestones.reduce((min, item) =>
          item.amount_end < min.amount_end ? item : min
        )
      : null;

  const progress =
    maxPreviousMilestone && minNextMilestone
      ? ((myAmount - maxPreviousMilestone.amount_end) /
          (minNextMilestone.amount_end - maxPreviousMilestone.amount_end)) *
        100
      : (myAmount / maxAmountEnd) * 100 || 0;

  const coinBonus = maxPreviousMilestone
    ? (maxPreviousMilestone.percent_reward * myAmount) / 100
    : 0;

  const start = maxPreviousMilestone ? maxPreviousMilestone.amount_end : 0;
  const maxAmountEndNew = minNextMilestone ? minNextMilestone.amount_end : 0;

  const filteredMilestones = [maxPreviousMilestone, minNextMilestone]
    .filter(Boolean)
    .map((item: any) => ({
      value: item.amount_end,
      percent: item.percent_reward,
    }));

  return {
    progress,
    coinBonus,
    filteredMilestones,
    start,
    maxAmountEndNew,
  };
};

/**
 * คำนวณ milestone progress สำหรับ display
 */
export const calculateMilestoneProgress = (
  milestoneValue: number,
  start: number,
  maxAmountEnd: number
): number => {
  if (maxAmountEnd === start) return 100;
  return ((milestoneValue - start) / (maxAmountEnd - start)) * 100;
};

