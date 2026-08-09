export interface TopVJModelList {
    data: TopVJModelDetail[]
    status: number
    error: boolean
    message: string
  }
  
  export interface TopVJModelDetail {
    _sum: Sum
    member_id: string
    nick_name: string
    full_name: string
    profile: string
    user_id: string
    room_id: string
    organization_id: string
  }
  
  export interface Sum {
    amount: number
  }
  