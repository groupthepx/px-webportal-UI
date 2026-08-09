export interface ReviewListAllModel {
    data: ReviewDetail[]
    status: number
    error: boolean
    message: string
  }
  
  export interface ReviewDetail {
    review_id: string
    reviewer_media: string
    reviewer: string
    review_career: string
    review_star: number
    review_description: string
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
  