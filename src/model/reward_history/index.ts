export interface RewardHistoryListModel {
    data: RewardHistoryDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface RewardHistoryDetailModel {
    add_reward_history_id: string
    status: string
    amount: number
    member_reward_type: string
    mission_coin_up_detail?: string
    mission_coin_up?: number
    bonus_mission_detail?: string
    bonus_mission?: number
    vj_active_detail?: string
    vj_active?: number
    rank_bonus_detail?: string
    rank_bonus?: number
    coin_up_from_excel_detail?: string
    coin_up_from_excel?: number
    collect_mission_detail: any
    collect_mission: any
    coupon_detail?: string
    coupon_amount?: number
    coupon_id?: string
    member_id: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
    created_by: CreatedBy
  }
  
  export interface CreatedBy {
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
    wallet_id: string
    bank_account_id?: string
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
    organization_id: string
    status: string
    approved_by_id: any
    is_active: boolean
    created_at: string
    updated_at?: string
    deleted_at: any
  }
  