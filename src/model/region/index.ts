

export interface ProvinceModel {
    id: number
    name_th: string
    name_en: string
    geography_id: number
    created_at: string
    updated_at: string
    deleted_at: any
  }

  export interface DistrictModel {
    id: number
    name_th: string
    name_en: string
    province_id: number
    created_at: string
    updated_at: string
    deleted_at: any
  }

  export interface VillageModel {
    id: number
    zip_code: number
    name_th: string
    name_en: string
    amphure_id: number
    created_at: string
    updated_at: string
    deleted_at: any
  }