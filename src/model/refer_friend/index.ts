export interface ReferFriendModel {
  data: ReferFriendDetail[]
  status: number
  error: boolean
  message: string
}

export interface ReferFriendDetail {
  add_reward_history_id: string
  status: string
  member_reward_type: string
  organization_reward_type: string
  amount: number
  mission_coin_up_detail: string
  mission_coin_up: any
  bonus_mission_detail: any
  bonus_mission: number
  vj_active_detail: any
  vj_active: number
  rank_bonus_detail: any
  rank_bonus: number
  coin_up_from_excel_detail: string
  coin_up_from_excel: number
  collect_mission_detail: any
  collect_mission: any
  coupon_detail: any
  coupon_amount: any
  refer_bonus_detail: string
  refer_bonus: number
  transfer_coin_balance_detail: any
  transfer_coin_balance: any
  order_detail: any
  order_amount: any
  learn_detail: any
  learn_amount: any
  coupon_id: any
  member_id: string
  organization_id: string
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: any
  created_by: CreatedBy
}

export interface CreatedBy {
  member_id: string
  fbuid: string
  user_px: string
  profile: string
  nick_name: string
  full_name: string
  secu_name: string
  dob: string
  province: string
  country: string
  subdistrict: string
  zip_code: string
  email: string
  line: string
  phone: string
  refer_id: any
  card_number: string
  bank_account_id: string
  card_with_profile_img: string
  role: string
  status: string
  approved_by_id: any
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}

// ==========================================
// New API Response for Refer Reward History
// /add-reward-history/refer-reward/member/:member_id
// ==========================================

export interface ReferRewardHistoryModel {
  data: ReferRewardHistoryDetail[]
  pagination: ReferRewardPagination
  status: number
  error: boolean
  message: string
}

export interface ReferRewardPagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ReferRewardHistoryDetail {
  add_reward_history_id: string
  status: string
  member_reward_type: string
  organization_reward_type: string
  amount: number
  mission_coin_up_detail: string | null
  mission_coin_up: number | null
  bonus_mission_detail: string | null
  bonus_mission: number | null
  vj_active_detail: string | null
  vj_active: number | null
  rank_bonus_detail: string | null
  rank_bonus: number | null
  coin_up_from_excel_detail: string | null
  coin_up_from_excel: number | null
  collect_mission_detail: string | null
  collect_mission: number | null
  coupon_detail: string | null
  coupon_amount: number | null
  refer_bonus_detail: string | null
  refer_bonus: number | null
  transfer_coin_balance_detail: string | null
  transfer_coin_balance: number | null
  order_detail: string | null
  order_amount: number | null
  learn_detail: string | null
  learn_amount: number | null
  coupon_id: string | null
  member_id: string
  organization_id: string
  is_active: boolean
  created_at: string
  updated_at: string | null
  deleted_at: string | null
  organization: ReferRewardOrganization
  /** ID ของสมาชิกที่เราแนะนำ (คนที่ทำให้เราได้ bonus) */
  referred_member_id: string
  /** Future total coin */
  future_total: number
  /** ข้อมูลของสมาชิกที่เราแนะนำ */
  referred_employee: ReferredEmployee
  /** ระดับรายได้ (Level 1 หรือ Level 2) - ถ้า API ส่งมา */
  income_level?: number
}

export interface ReferRewardOrganization {
  organization_id: string
  company_name: string
  company_logo: string
}

export interface ReferredEmployee {
  member_id: string
  user_px: string
  full_name: string
  nick_name: string
  email: string
  phone: string
  profile: string
}
