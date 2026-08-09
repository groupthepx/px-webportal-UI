export interface PXProductHistoryModel {
  data: PXProductHistoryDetail[]
  status: number
  error: boolean
  message: string
}

export interface PXProductHistoryDetail {
  order_id: string
  product_id: string
  gift_id?: string | null
  order_status: string
  organization_id: string
  buy_by_id: string
  pay_currency?: string
  points_used?: number | null
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
  buy_by?: BuyBy
  organization: Organization
}

export interface BuyBy {
  member_id: string
  fbuid: string
  user_id: string
  room_id: string
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
  refer_id: string
  card_number: string
  amount: number
  bank_account_id: string
  card_with_profile_img: string
  vj_active: boolean
  sapphipe: boolean
  group_vj: boolean
  meeting_policy_app: boolean
  meeting_policy_px: boolean
  train_ten_step: boolean
  add_line_vj: boolean
  bonus_time: boolean
  role: string
  status: string
  approved_by_id: any
  is_active: boolean
  created_at: string
  updated_at: string
  deleted_at: any
}

export interface Organization {
  organization_id: string
  company_logo: string
  company_name: string
  details: string
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}
