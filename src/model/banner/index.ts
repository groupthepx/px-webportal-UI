export interface BannerModel {
    data: BannerDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface BannerDetailModel {
    banner_id: string
    file_url: string
    file_type: string
    organization_list: string[]
    start_date: string
    start_time: string
    end_date: string
    end_time: string
    is_active: boolean
    created_at: string
    updated_at: string
    deleted_at: any
  }
  