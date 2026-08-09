export interface IncomePolicyListModel {
    data: IncomePolicyDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface IncomePolicyDetailModel {
    income_policy_id: string
    order_number: number
    percent_reward: number
    amount_start: number
    amount_end: number
    income_start: number
    income_end: number
    organization_id: string
    created_by_id: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
    organization: Organization
    created_by: CreatedBy
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
  