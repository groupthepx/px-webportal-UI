export interface TransferCoinBalanceListModel {
    data: TransferCoinBalanceDetailModel[]
    status: number
    error: boolean
    message: string
  }
  
  export interface TransferCoinBalanceDetailModel {
    transfer_coin_balance_history_id: string
    balance: number
    coin: number
    status: string
    created_by_id: string
    is_active: boolean
    created_at: string
    updated_at: any
    deleted_at: any
  }
  