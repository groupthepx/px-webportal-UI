export interface ActivityListAllModel {
    data: ActivityDetailModel[]
    status: number
    error: boolean
    message: string
}

export interface ActivityDetailModel {
    activity_id: string
    activity_title: string
    activity_media?: string
    mux_asset_id?: string
    playback_id?: string
    activity_description: string
    created_by_id?: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
    created_by?: CreatedBy
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
