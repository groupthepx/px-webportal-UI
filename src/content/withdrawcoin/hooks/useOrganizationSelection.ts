import { useState, useEffect, useCallback } from 'react';
import { decrypt } from '@/utils/encryption';

/**
 * Custom hook สำหรับจัดการการเลือก Organization
 * จัดการ state และ logic ที่เกี่ยวข้องกับการเลือกบริษัท
 */
export const useOrganizationSelection = (encryptedParamsId?: string) => {
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>('');

  // Decrypt และ set organization ID จาก params
  useEffect(() => {
    if (encryptedParamsId) {
      try {
        const decryptedId = decrypt(decodeURIComponent(encryptedParamsId));
        setSelectedOrganizationId(decryptedId !== '0' ? decryptedId : '');
      } catch (error) {
        console.error('Error decrypting organization ID:', error);
        setSelectedOrganizationId('');
      }
    } else {
      setSelectedOrganizationId('');
    }
  }, [encryptedParamsId]);

  // Callback สำหรับเปลี่ยน organization
  const handleOrganizationChange = useCallback((organizationId: string) => {
    setSelectedOrganizationId(organizationId);
  }, []);

  // ตรวจสอบว่ามีการเลือก organization หรือไม่
  const hasSelectedOrganization = selectedOrganizationId !== '' && selectedOrganizationId !== '0';

  return {
    selectedOrganizationId,
    setSelectedOrganizationId: handleOrganizationChange,
    hasSelectedOrganization,
  };
};

