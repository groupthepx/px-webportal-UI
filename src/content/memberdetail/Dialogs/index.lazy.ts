/**
 * Lazy-loaded Dialog Components
 * Dialogs ไม่จำเป็นต้องโหลดทันทีเมื่อเข้าหน้า
 * โหลดเฉพาะเมื่อผู้ใช้เปิด dialog
 */

import { lazy } from 'react';

// Member Management Form - โหลดเมื่อคลิกแก้ไข
export const MemberManagementForm = lazy(() => 
  import('../From').then(module => ({ 
    default: module.default 
  }))
);

// Select Organization Page - โหลดเมื่อ ParamsId === '0'
export const SelectOrganizationPage = lazy(() => 
  import('../SeleteOrganization/index.refactored').then(module => ({ 
    default: module.default 
  }))
);

