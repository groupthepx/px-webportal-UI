export interface LiveSessionHistoryItem {
  live_session_id: string;
  organization_id: string;
  user_id?: string | null;
  live_link: string;
  note?: string | null;
  coin_reward: number;
  approval_status: "pending" | "approved" | "rejected";
  derived_status: "on_live" | "finished_not_approved" | "approved" | "rejected";
  reward_status?:
    | "waiting_approval"
    | "waiting_approval_after_full"
    | "approved_pending_points"
    | "approved_no_points"
    | "points_granted"
    | "rejected";
  is_live: boolean;
  ran_full?: boolean;
  points_earned?: number;
  time_remaining_seconds: number;
  viewed_count: number;
  started_at: string;
  expires_at: string;
  reject_reason?: string | null;
  organization?: { organization_id: string; company_name?: string; company_logo?: string };
}

export const LIVE_STATUS_TH: Record<string, { text: string; color: "default" | "success" | "warning" | "error" | "info" }> = {
  on_live: { text: "กำลังไลฟ์", color: "error" },
  finished_not_approved: { text: "รออนุมัติ", color: "warning" },
  pending: { text: "รออนุมัติ", color: "warning" },
  approved: { text: "อนุมัติแล้ว", color: "success" },
  rejected: { text: "ถูกปฏิเสธ", color: "error" },
};

export const getLiveSessionStatus = (
  item: LiveSessionHistoryItem,
): { text: string; color: "default" | "success" | "warning" | "error" | "info" } => {
  const earned = item.points_earned ?? 0;

  if (item.reward_status === "points_granted" || earned > 0) {
    return { text: "ให้คะแนนแล้ว", color: "success" };
  }
  if (item.reward_status === "approved_pending_points" || (item.approval_status === "approved" && item.is_live)) {
    return { text: "อนุมัติแล้ว รอครบเวลา", color: "warning" };
  }
  if (item.reward_status === "approved_no_points" || (item.approval_status === "approved" && !item.is_live && earned === 0)) {
    return { text: "อนุมัติแล้ว ไม่ได้คะแนน", color: "warning" };
  }
  return LIVE_STATUS_TH[item.derived_status] || LIVE_STATUS_TH["pending"];
};

export const getLiveSessionRewardText = (item: LiveSessionHistoryItem): string => {
  const earned = item.points_earned ?? 0;

  if (item.reward_status === "points_granted" || earned > 0) {
    return `+${earned || item.coin_reward} คะแนน`;
  }
  if (item.reward_status === "approved_pending_points") {
    return `อนุมัติแล้ว · รอครบเวลาเพื่อรับ ${item.coin_reward} คะแนน`;
  }
  if (item.reward_status === "approved_no_points") {
    return "อนุมัติแล้ว · ไม่เข้าเงื่อนไขรับคะแนน";
  }
  if (item.approval_status === "rejected" || item.reward_status === "rejected") {
    return "ไม่ได้รับคะแนน · ถูกปฏิเสธ";
  }
  if (item.is_live) {
    return `รอครบเวลา · สูงสุด ${item.coin_reward} คะแนน`;
  }
  if (item.ran_full === false) {
    return "ไม่ได้รับคะแนน · ไลฟ์ไม่ครบเวลา";
  }
  return "ยังไม่ได้รับคะแนน";
};
