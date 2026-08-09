/**
 * Application Constants
 * ======================================
 * Constants ที่ใช้ทั่วทั้ง application
 */

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://px-api.mooo.com',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  LANGUAGE: 'language',
  THEME: 'theme',
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
  TIME_ONLY: 'HH:mm',
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  PHONE_LENGTH: 10,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Z-Index Layers
export const Z_INDEX = {
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
} as const;

// Debounce Delays
export const DEBOUNCE = {
  SEARCH: 300,
  RESIZE: 150,
  SCROLL: 100,
} as const;

// Toast/Snackbar Duration
export const NOTIFICATION_DURATION = {
  SHORT: 2000,
  MEDIUM: 4000,
  LONG: 6000,
} as const;

// Routes that don't need authentication
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/about',
  '/activity',
  '/article',
  '/px_market',
] as const;

// Status Colors
export const STATUS_COLORS = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  completed: 'info',
  cancelled: 'default',
} as const;

// Social Media Links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://www.facebook.com/pxgroup',
  LINE: 'https://line.me/R/ti/p/@pxgroup',
  INSTAGRAM: 'https://www.instagram.com/pxgroup',
  YOUTUBE: 'https://www.youtube.com/pxgroup',
  TIKTOK: 'https://www.tiktok.com/@pxgroup',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง',
  UNAUTHORIZED: 'กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ',
  FORBIDDEN: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
  NOT_FOUND: 'ไม่พบข้อมูลที่ต้องการ',
  SERVER_ERROR: 'เกิดข้อผิดพลาดของระบบ กรุณาติดต่อผู้ดูแลระบบ',
  VALIDATION_ERROR: 'กรุณากรอกข้อมูลให้ถูกต้องและครบถ้วน',
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVE_SUCCESS: 'บันทึกข้อมูลเรียบร้อยแล้ว',
  UPDATE_SUCCESS: 'อัปเดตข้อมูลเรียบร้อยแล้ว',
  DELETE_SUCCESS: 'ลบข้อมูลเรียบร้อยแล้ว',
  UPLOAD_SUCCESS: 'อัปโหลดไฟล์เรียบร้อยแล้ว',
  SEND_SUCCESS: 'ส่งข้อมูลเรียบร้อยแล้ว',
} as const;

// Default Values
export const DEFAULT_AVATAR = '/assets/image/default-avatar.png';
export const DEFAULT_COVER = '/assets/image/cover_lading.png';
export const DEFAULT_LOGO = '/assets/svg/logo.svg';

// Feature Flags (สำหรับ enable/disable features)
export const FEATURES = {
  DARK_MODE: false,
  NOTIFICATIONS: true,
  CHAT: false,
  ANALYTICS: process.env.NODE_ENV === 'production',
} as const;

export default {
  API_CONFIG,
  STORAGE_KEYS,
  DATE_FORMATS,
  PAGINATION,
  FILE_UPLOAD,
  VALIDATION,
  ANIMATION,
  Z_INDEX,
  DEBOUNCE,
  NOTIFICATION_DURATION,
  PUBLIC_ROUTES,
  STATUS_COLORS,
  SOCIAL_MEDIA,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
};

