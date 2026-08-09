export interface ConstactListAllModel {
    data: ConstactDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface ConstactDetailModel {
    contact_id: string
    contact_title: string
    contact_content: string
    contact_order: number
    created_by_id: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
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
  