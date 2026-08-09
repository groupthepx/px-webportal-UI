/**
 * Constants สำหรับ MemberDetail Module
 * รวม validation schemas, default values, และค่าคงที่ต่างๆ
 */

import * as Yup from 'yup';
import { MemberFormValues } from '../types';

// ========================================
// Validation Schemas
// ========================================

/**
 * Validation schema สำหรับ Member Form
 */
export const memberFormValidationSchema = Yup.object().shape({
  // user_id: Yup.string().required('กรุณากรอกไอดีผู้ใช้'),
  email: Yup.string()
    .email('ข้อมูลไม่ถูกต้อง')
    .required('กรุณากรอกอีเมล'),
  profile: Yup.mixed().test(
    'file-required',
    'กรุณาอัปโหลดรูปภาพโปรไฟล์',
    function () {
      // การตรวจสอบจะทำใน component level
      return true;
    }
  ),
});

// ========================================
// Default Values
// ========================================

/**
 * Default values สำหรับ Member Form
 */
export const getDefaultMemberFormValues = (member: any | null): MemberFormValues => ({
  profile: '',
  // user_id: member?.user_id || '',
  room_id: member?.room_id || '',
  nick_name: member?.nick_name || '',
  full_name: member?.full_name || '',
  secu_name: member?.secu_name || '',
  dob: member?.dob || '',
  province: member?.province || '',
  subdistrict: member?.subdistrict || '',
  zip_code: member?.zip_code || '',
  email: member?.email || '',
  phone: member?.phone || '',
  line: member?.line || '',
  submit: null,
});

// ========================================
// Image Crop Settings
// ========================================

/**
 * การตั้งค่า image crop
 */
export const IMAGE_CROP_CONFIG = {
  aspect: 1 / 1,
  unit: 'px' as const,
  defaultCrop: {
    x: 0,
    y: 0,
    width: 500,
    height: 500,
  },
  quality: 0.9,
  type: 'image/png',
};

/**
 * การตั้งค่า avatar
 */
export const AVATAR_CONFIG = {
  size: {
    xs: 72,
    sm: 88,
    md: 96,
    lg: 120,
  },
  borderRadius: 'rounded',
};

// ========================================
// Grid Layout
// ========================================

/**
 * การตั้งค่า grid layout
 */
export const GRID_SPACING = {
  xs: 1.5,
  sm: 2,
  md: 3,
};

export const GRID_SIZES = {
  main: {
    xs: 12,
    md: 8.5,
  },
  sidebar: {
    xs: 12,
    md: 3.5,
  },
  fullWidth: {
    xs: 12,
    md: 12,
  },
  half: {
    xs: 12,
    sm: 6,
  },
  quarter: {
    xs: 12,
    sm: 4,
  },
};

// ========================================
// Animation Settings
// ========================================

/**
 * การตั้งค่า fade animation
 */
export const FADE_TIMEOUT = 1000;

/**
 * การตั้งค่า snackbar
 */
export const SNACKBAR_CONFIG = {
  anchorOrigin: {
    vertical: 'top' as const,
    horizontal: 'right' as const,
  },
};

// ========================================
// Messages
// ========================================

/**
 * ข้อความต่างๆ ที่ใช้ในระบบ
 */
export const MESSAGES = {
  success: {
    update: 'อัพเดทข้อมูลสำเร็จ',
    create: 'เพิ่มข้อมูลสำเร็จ',
  },
  error: {
    update: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่',
    create: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่',
    general: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง',
  },
  loading: {
    fetching: 'กำลังโหลดข้อมูล...',
    updating: 'กำลังอัพเดทข้อมูล...',
  },
};

// ========================================
// Field Labels
// ========================================

/**
 * Labels สำหรับฟิลด์ต่างๆ
 */
export const FIELD_LABELS = {
  userId: 'ไอดีผู้ใช้*',
  roomId: 'ไอดีห้อง*',
  nickName: 'ชื่อเล่น*',
  fullName: 'ชื่อจริง*',
  secuName: 'ชื่อคลับ*',
  dob: 'วันเกิด*',
  email: 'อีเมล*',
  phone: 'เบอร์โทร',
  line: 'Line ID',
  province: 'จังหวัด*',
  district: 'เขต*',
  village: 'ตำบล และ รหัสไปรษณีย์*',
  addressInfo: 'ข้อมูลที่อยู่',
};

// ========================================
// Dialog Titles
// ========================================

/**
 * หัวข้อ dialog ต่างๆ
 */
export const DIALOG_TITLES = {
  editMember: 'แก้ไข VJ',
  memberDetail: 'รายละเอียดผู้ใช้',
  cropImage: 'ปรับรูปภาพ',
};

// ========================================
// Button Labels
// ========================================

/**
 * Labels สำหรับปุ่มต่างๆ
 */
export const BUTTON_LABELS = {
  save: 'บันทึก',
  cancel: 'ยกเลิก',
  edit: 'แก้ไข',
  delete: 'ลบ',
  viewHistory: 'ดูประวัติ ยอด+โบนัส',
  upload: 'อัปโหลด',
};

// ========================================
// API Config
// ========================================

/**
 * การตั้งค่า API
 */
export const API_CONFIG = {
  skipWhenZero: (id: string) => id === '0',
};

