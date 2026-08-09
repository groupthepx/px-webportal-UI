export interface CoinBalancePackagesListModel {
    data: CoinBalancePackagesDeatilModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface CoinBalancePackagesDeatilModel {
    coin_balance_package_id: string
    balance: number
    coin: number
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
  }
  