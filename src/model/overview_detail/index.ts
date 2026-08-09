export interface OverviewDetailListModel {
    data: OverviewDetailDetailModel
    status: number
    error: boolean
    message: string
  }
  
  export interface OverviewDetailDetailModel {
    CloseMonth: CloseMonth
    LastMonth: LastCloseMonth
    collect_missions: CollectMission[]
    LastRewardDetail: LastRewardDetail
    income_policy_app_data: IncomePolicyAppData
    mission_coin_up_data: MissionCoinUpData
    mission_data: MissionData
    vj_mission_data: VjMissionData
    vdo_data: VdoData
    my_wallet: MyWallet
    my_coin_can_use: number
    current_mission_coin_up_reward: number
    my_position_mission_data: number
    My_Rank: MyRank[]
    RankLastMonth: MyRank[]
    VJ_Active : boolean
    SAPPHIPE : boolean
    coupon: Coupon[]
    my_organization: MyOrganization
  }
  export interface MyOrganization {
    id: string
    member_id: string
    user_id: string
    room_id: string
    vj_active: boolean
    sapphipe: boolean
    group_vj: boolean
    meeting_policy_app: boolean
    meeting_policy_px: boolean
    train_ten_step: boolean
    add_line_vj: boolean
    bonus_time: boolean
    non_vj_active: number
    organization_id: string
    refer_id: string
    allow_refer: boolean
    joined_at: string
    is_active: boolean
    organization: Organization
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
  export interface Coupon {
    coupon_id: string
    title: string
    description: string
    amount: number
    status: string
    expire_date: any
    created_by_id: string
    is_active: boolean
    created_at: string
    updated_at: string
    member_id: string
  }

  export interface CollectMission {
    collect_mission_id: string
    mission_id: string
    member_id: string
    collect_name_mission: string
    collect_amount_mission: number
    collect_bonus_position_mission: number
    collect_mission_status: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
  }
  
  
  export interface LastRewardDetail {
    add_reward_history_id: string
    status: string
    amount: number
    mission_coin_up_detail: string
    mission_coin_up: number
    bonus_mission_detail: string
    bonus_mission: number
    vj_active_detail: string
    vj_active: number
    rank_bonus_detail: string
    rank_bonus: number
    coin_up_from_excel_detail: string
    coin_up_from_excel: number
    member_id: string
    is_active: boolean
    created_at: string
    updated_at: string
    deleted_at: any
  }

  export interface MyRank {
    member_id: string
    profile: string
    nick_name: string
    full_name: string
    amount: number
    member : any
    member_amount: MemberAmount[]
  }


  export interface MemberAmount {
  member_amount_id: string
  member_id: string
  organization_id: string
  amount: number
  created_at: string
}
  export interface CloseMonth {
    last_update: string
    current_amount: number
    close_date: string
    amount_date_work: number
    amount_time_work: number
  }

  export interface LastCloseMonth {

    last_update: string
    current_amount: number
    close_date_start: string
    close_date_end: string
    vj_active_status: boolean
    bonus_mission_name: any
    rank_name: any
    amount_date_work: number
    amount_time_work: number
    last_collect_mission : any
      current_collect_mission: CurrentCollectMission

  
}
  
export interface CurrentCollectMission {
  collect_mission_id: string
  mission_id: string
  member_id: string
  collect_name_mission: string
  collect_amount_mission: number
  collect_bonus_position_mission: number
  collect_mission_status: string
  excel_upload_id: string
  organization_id: string
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}

  export interface IncomePolicyAppData {
    my_amount: number
    organization_target_start: number
    organization_target_end: number
    coin_reward: number
  }
  
  export interface MissionCoinUpData {
    my_amount: number
    organization_target_start: number
    organization_target_end: number
    coin_reward: number
  }
  
  export interface MissionData {
    my_amount: number
    organization_target: number
    coin_reward: number
  }
  
  export interface VjMissionData {
    my_amount: number
    organization_target: number
    coin_reward: number
    my_work_date: number
    organization_target_work_date: number
    vj_active_current_round: boolean
  }
  
  export interface VdoData {
    my_progress: MyProgress[]
    all_vdo: Vdo[]
  }
  

  export interface MyProgress {
    id: string
    member_id: string
    vdo_id: string
    progress: number
    last_watched_at: string
    vdo: Vdo
  }

  export interface Vdo {
    vdo_id: string
    vdo_rank: number
    vdo_title: string
    vdo_bonus: number
    mux_asset_id: string
    playback_id: string
    cover_image?: string | null
    thumbnail?: string | null
    organization_id: string
    vdo_category_id?: string | null
    vdo_category?: VdoCategory | null
    created_by_id: string
    is_unlock: boolean
    is_active: boolean
    is_public?: boolean | null
    created_at: string
    updated_at: any
    deleted_at: any
  }

  export interface VdoCategory {
    vdo_category_id: string
    organization_id: string
    name: string
    sort_order: number
    is_active: boolean
  }


  export interface MyWallet {
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
  
