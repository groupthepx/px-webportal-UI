export interface UserListModel {
    data: Daum[]
    status: number
    error: boolean
    message: string
  }
  
  export interface Daum {
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
  