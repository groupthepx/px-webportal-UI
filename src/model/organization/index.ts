export interface OrganizationListModel {
  data: OrganizationDetailModel[]
  status: number
  error: boolean
  message: string
}

export interface OrganizationDetailDataModel {
  data: OrganizationDetailModel
  status: number
  error: boolean
  message: string
}


export interface OrganizationDetailModel {
  organization_id: string
  company_logo: string
  company_name: string
  details: string
  is_active: boolean
  created_at: string
  updated_at: any
  deleted_at: any
}
