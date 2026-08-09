export interface MemberListModel {
  data: MemberDetailModel[]
  status: number
  error: boolean
  message: string
}

export interface MemberDataDetailModel {
  data: MemberDetailModel
  status: number
  error: boolean
  message: string
}

export interface MemberDetailModel {
  member_id: string
  fbuid: string
  user_id: string
  user_px: string
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
  updated_at: any
  deleted_at: any
  member_type: string
  kyc_verification: KycVerification[]
  member_wallet: MemberWallet[]
  member_wallet_non_org: MemberWalletNonOrg[]
  member_organization: MemberOrganization[]
  bank_account: BankAccount
  coupon: any[]

}

export interface KycVerification {
  kyc_verification_id: string
  member_id: string
  card_number: string
  card_with_profile_img: string
  f_name: string
  l_name: string
  expire_date: string
  status: string
  rejection_reason: any
  reviewed_by_id: string
  reviewed_at: string
  created_at: string
  updated_at: string
  deleted_at: any
}


export interface MemberWalletNonOrg {
  id: string
  member_id: string
  wallet_id: string
  linked_at: string
  wallet: Wallet
}


export interface MemberWallet {
  id: string
  member_id: string
  organization_id: string
  wallet_id: string
  linked_at: string
  wallet: Wallet
}

export interface Wallet {
  wallet_id: string
  balance: number
  coin: number
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}

export interface MemberOrganization {
  id: string
  member_id: string
  user_id: string
  room_id: string
  live_link?: string
  vj_active: boolean
  sapphipe: boolean
  group_vj: boolean
  meeting_policy_app: boolean
  meeting_policy_px: boolean
  train_ten_step: boolean
  add_line_vj: boolean
  bonus_time: boolean
  organization_id: string
  joined_at: string
  is_active: boolean
  organization: Organization
}

export interface BankAccount {
  bank_account_id: string
  qr_img: string
  bank_name: string
  account_number: string
  account_name: string
  is_active: boolean
  created_at: string
  updated_at: any
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
