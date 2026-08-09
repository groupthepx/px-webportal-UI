/**
 * Custom Hook: useAddressData
 * จัดการข้อมูลที่อยู่ (Province, District, Village)
 */

import { useEffect, useState, useMemo } from 'react';
import { 
  useGetProvinceQuery, 
  useGetDistrictByIdQuery, 
  useGetVillageByIdQuery 
} from '@/lib/features/region';
import { MemberDetailModel } from '@/model/member';
import { RegionData } from '../types';

interface UseAddressDataProps {
  member: MemberDetailModel | null;
  initialProvinceId?: string;
  initialDistrictId?: string;
}

/**
 * Hook สำหรับจัดการข้อมูลที่อยู่
 */
export const useAddressData = ({ 
  member, 
  initialProvinceId = '', 
  initialDistrictId = '' 
}: UseAddressDataProps) => {
  const [provinceId, setProvinceId] = useState<string>(initialProvinceId);
  const [districtId, setDistrictId] = useState<string>(initialDistrictId);

  // ดึงข้อมูล province
  const { data: provinceData } = useGetProvinceQuery();

  // ดึงข้อมูล district
  const { data: districtData } = useGetDistrictByIdQuery(
    { id: provinceId },
    { skip: provinceId === '' }
  );

  // ดึงข้อมูล village
  const { data: villageData } = useGetVillageByIdQuery(
    { id: districtId },
    { skip: districtId === '' }
  );

  // Set initial values จาก member
  useEffect(() => {
    if (member?.province) {
      setProvinceId(member.province.toString());
    }
    if (member?.subdistrict) {
      setDistrictId(member.subdistrict.toString());
    }
  }, [member]);

  /**
   * Handle province change
   */
  const handleProvinceChange = (newProvinceId: string) => {
    setProvinceId(newProvinceId);
    setDistrictId(''); // Reset district เมื่อเปลี่ยน province
  };

  /**
   * Handle district change
   */
  const handleDistrictChange = (newDistrictId: string) => {
    setDistrictId(newDistrictId);
  };

  // Format province list
  const provinces = useMemo<RegionData[]>(() => 
    Array.isArray(provinceData) ? provinceData : [],
    [provinceData]
  );

  // Format district list
  const districts = useMemo<RegionData[]>(() => 
    Array.isArray(districtData) ? districtData : [],
    [districtData]
  );

  // Format village list
  const villages = useMemo<RegionData[]>(() => 
    Array.isArray(villageData) ? villageData : [],
    [villageData]
  );

  return {
    // States
    provinceId,
    districtId,
    
    // Data
    provinces,
    districts,
    villages,
    
    // Functions
    setProvinceId,
    setDistrictId,
    handleProvinceChange,
    handleDistrictChange,
  };
};

