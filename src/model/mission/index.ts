export interface MissionListModel {
    data: MissionDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface MissionDetailModel {
    mission_id: string
    name_mission: string
    amount_mission: number
    bonus_mission: number
    bonus_position_mission: number
    organization_id: string
    created_by_id: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
    organization: any
    created_by: CreatedBy
  }
  
  export interface CreatedBy {
    admin_id: string
    fbuid: string
    user_id: string
    email: string
    phone: string
    profile: string
    line: string
    role: string
    role_permission: any
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
  }
  