/**
 * Constants สำหรับ Withdraw Coin module
 */

// Animation & Transition
export const FADE_TIMEOUT = 2000;
export const INTERSECTION_THRESHOLD = 0.2;
export const COUNTUP_DURATION = 3;

// UI Sizing
export const AVATAR_SIZE = {
  SMALL: 24,
  MEDIUM: 50,
  LARGE: 100,
} as const;

export const AUTOCOMPLETE_WIDTH = {
  MOBILE: '100%',
  DESKTOP: 300,
} as const;

// Table Configuration
export const TABLE_PAGINATION_OPTIONS = [5, 10, 25, 50, 100] as const;

// Image Paths
export const ASSETS = {
  PX_COIN_ICON: '/assets/svg/pg/PX_Coin.svg',
  PLACEHOLDER_IMAGE: 'https://placehold.co/500x500/EEE/31343C',
} as const;

// Status Labels
export const TRANSFER_STATUS_LABELS = {
  Success: 'สำเร็จ',
  Reject: 'ไม่สำเร็จ',
  Pending: 'รอดำเนินการ',
} as const;

export const TRANSFER_STATUS_COLORS = {
  Success: 'success',
  Reject: 'error',
  Pending: 'warning',
} as const;

// Messages
export const MESSAGES = {
  NO_DATA: 'ไม่มีข้อมูล',
  SELECT_COMPANY_WARNING: 'กรุณาเลือกบริษัทที่ต้องแลกเป็นเงินก่อน',
  SELECT_COMPANY_PLACEHOLDER: 'เลือก บริษัท',
  COMPANY_LABEL: 'บริษัท',
} as const;

// Page Headers
export const PAGE_HEADERS = {
  MAIN: 'รายระเอืยดผู้ใช้ / PX Coin',
  HISTORY: 'ประวัติการแลกเปลี่ยนเงิน',
} as const;

// Table Headers
export const TABLE_HEADERS = {
  REQUEST_DATE: 'วันที่ร่องขอ',
  COIN_AMOUNT: 'ยอดถอน ( Coin )',
  THB_AMOUNT: 'ยอดถอน ( THB )',
  STATUS: 'สถานะการถอน',
} as const;

// Button Labels
export const BUTTON_LABELS = {
  EXCHANGE_MONEY: 'แลกเป็นเงิน',
} as const;

// Wallet Labels
export const WALLET_LABELS = {
  PX_COIN_BALANCE: 'ยอด PX Coin',
} as const;

// Default Values
export const DEFAULT_VALUES = {
  ORGANIZATION_ID: '0',
  MEMBER_ID: '0',
  COIN_AMOUNT: 0,
} as const;

