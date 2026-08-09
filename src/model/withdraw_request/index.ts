export interface WithdrawRequestListModel {
    data: WithdrawRequestDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface WithdrawRequestDetailModel {
    withdraw_request_id: string
    title: string
    withdraw_count: number
    status: string
    created_by_id?: string
    organization_id: string
    approved_by_id: any
    description_approved: any
    is_active: boolean
    created_at: string
    description: string
    updated_at: any
    deleted_at: any
    created_by?: CreatedBy
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
    card_with_profile_img: string
    role: string
    organization_id: string
    status: string
    approved_by_id: any
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
  }
  