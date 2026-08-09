/**
 * Types และ Interfaces สำหรับ MemberDetail
 * จัดการ type safety และ reusability
 */

import { MemberDetailModel } from '@/model/member';

// ========================================
// Props Interfaces
// ========================================

/**
 * Props สำหรับ MemberDetail Page หลัก
 */
export interface MemberDetailPageProps {
  params: any | null;
}

/**
 * Props สำหรับ Member Management Form
 */
export interface MemberManagementFormProps {
  openAction: boolean;
  handleActionClose: () => void;
  member: MemberDetailModel | null;
  updateMemberComission: any;
}

/**
 * Props สำหรับ Card Components
 */
export interface MemberCardProps {
  member?: MemberDetailModel | null;
  overviewDetailById?: any;
  ParamsId?: string;
  memberById?: MemberDetailModel | null;
}

/**
 * Props สำหรับ Organization Selection
 */
export interface OrganizationSelectionProps {
  memberById: any;
  setOpenActionEdit: (open: boolean) => void;
  coutPxMarketProductHistoryData: number;
}

// ========================================
// Form Values
// ========================================

/**
 * Form values สำหรับแก้ไข member
 */
export interface MemberFormValues {
  profile: string;
  // user_id: string;
  room_id: string;
  nick_name: string;
  full_name: string;
  secu_name: string;
  dob: string;
  province: string;
  subdistrict: string;
  zip_code: string;
  email: string;
  phone: string;
  line: string;
  organization_id?: string;
  submit: null;
}

// ========================================
// Image Crop Types
// ========================================

/**
 * Props สำหรับ Image Cropping
 */
export interface ImageCropState {
  imgSrc: string;
  selectedImage: string | null;
  fileImages: Blob | null;
  openActionCrop: boolean;
}

// ========================================
// Address Types
// ========================================

/**
 * ข้อมูลที่อยู่ (จังหวัด, เขต, ตำบล)
 */
export interface AddressData {
  provinceId: string;
  districtId: string;
}

/**
 * ข้อมูล Province/District/Village จาก API
 */
export interface RegionData {
  id: string;
  name_th: string;
  name_en?: string;
  zip_code?: string;
}

// ========================================
// API Response Types
// ========================================

/**
 * Response structure สำหรับ member overview
 */
export interface MemberOverviewResponse {
  data: {
    LastMonth: any;
    // Add more fields as needed
  };
}

/**
 * Response structure สำหรับ mission
 */
export interface MissionResponse {
  data: Array<{
    mission_id: string;
    border_img?: string;
    // Add more fields as needed
  }>;
}

// ========================================
// Utility Types
// ========================================

/**
 * Loading states สำหรับ async operations
 */
export interface LoadingStates {
  isLoadingProfile: boolean;
  isLoadingMember: boolean;
  isLoadingOverview: boolean;
  isUpdating: boolean;
}

/**
 * Dialog states
 */
export interface DialogStates {
  openAction: boolean;
  openActionEdit: boolean;
  openActionCrop: boolean;
}

