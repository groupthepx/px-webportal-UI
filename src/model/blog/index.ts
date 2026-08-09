export interface BlogListAllModel {
    data: BlogDetailModel[]
    status: number
    error: boolean
    message: string
  }

  export interface BlogDetailsModel {
    data: BlogDetailModel
    status: number
    error: boolean
    message: string
  }
  
  export interface BlogDetailModel {
    blog_id: string
    blog_title: string
    blog_cover: string
    blog_content: string
    view_count: number
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
  
