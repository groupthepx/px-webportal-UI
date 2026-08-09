export interface PxMarketProductModel {
  data: PxMarketProductDetailModel[]
  status: number
  error: boolean
  message: string
}

export interface PxMarketProductDetailModel {
  product_id: string
  product_img: string
  product_name: string
  product_price: number
  product_price_points?: number | null
  max_sale: number
  current_sale: number
  product_description: string
  sale_start_date: string | null
  sale_end_date: string | null
  discount_percent: number
  discount_start_date: string | null
  discount_end_date: string | null
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
  role_permission: RolePermission
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}

export interface RolePermission {
  VJ_MENU: VjMenu
  BLOG_MENU: BlogMenu
  DASHBOARD: Dashboard
  EXCEL_MENU: ExcelMenu
  CONTACT_MENU: ContactMenu
  ACTIVITY_MENU: ActivityMenu
  WITHDRAW_MENU: WithdrawMenu
  REQUEST_VJ_MENU: RequestVjMenu
  MANAGE_STAFF_MENU: ManageStaffMenu
  MANAGE_REVIEW_MENU: ManageReviewMenu
  MANAGE_ORGANIZATION_MENU: ManageOrganizationMenu
}

export interface VjMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface BlogMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface Dashboard {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ExcelMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ContactMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ActivityMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface WithdrawMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface RequestVjMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ManageStaffMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ManageReviewMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}

export interface ManageOrganizationMenu {
  GET: boolean
  POST: boolean
  PATCH: boolean
  DELETE: boolean
}
