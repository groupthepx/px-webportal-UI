/**
 * Custom Hook สำหรับจัดการข้อมูล Region (จังหวัด, อำเภอ, ตำบล)
 * รวม logic การ fetch และ format ข้อมูล region ไว้ใน hook เดียว
 */

import { useMemo, useEffect, useState } from 'react';
import {
  useGetProvinceQuery,
  useGetDistrictByIdQuery,
  useGetVillageByIdQuery,
} from '@/lib/features/region';

interface RegionData {
  provinceName: string;
  subDistrictName: string;
  villageDataName: string;
  isLoading: boolean;
}

/**
 * Hook สำหรับดึงและ format ข้อมูล region
 * @param provinceId - ID ของจังหวัด
 * @param districtId - ID ของอำเภอ
 * @param zipCode - รหัสไปรษณีย์
 * @returns Object ที่มีข้อมูล region ที่ format แล้ว
 */
export const useRegionData = (
  provinceId?: string,
  districtId?: string,
  zipCode?: string
): RegionData => {
  const [provinceIdState, setProvinceIdState] = useState<string>('');
  const [districtIdState, setDistrictIdState] = useState<string>('');

  // Fetch province data
  const { data: provinceData, isLoading: isLoadingProvince } = useGetProvinceQuery();

  // Fetch district data
  const { data: districtData, isLoading: isLoadingDistrict } = useGetDistrictByIdQuery(
    { id: `${provinceIdState}` },
    { skip: provinceIdState === '' }
  );

  // Fetch village data
  const { data: villageData, isLoading: isLoadingVillage } = useGetVillageByIdQuery(
    { id: `${districtIdState}` },
    { skip: districtIdState === '' }
  );

  // Update internal state when props change
  useEffect(() => {
    if (provinceId && provinceId !== '') {
      setProvinceIdState(provinceId);
    }
    if (districtId && districtId !== '') {
      setDistrictIdState(districtId);
    }
  }, [provinceId, districtId]);

  // Memoize province name
  const provinceName = useMemo(() => {
    if (!provinceData || !Array.isArray(provinceData) || !provinceId) return '';
    const province = provinceData.find(p => p.id === parseInt(provinceId));
    return province?.name_th || '';
  }, [provinceData, provinceId]);

  // Memoize sub-district name
  const subDistrictName = useMemo(() => {
    if (!districtData || !Array.isArray(districtData) || !districtId) return '';
    const district = districtData.find(d => d.id === parseInt(districtId));
    return district?.name_th || '';
  }, [districtData, districtId]);

  // Memoize village data name
  const villageDataName = useMemo(() => {
    if (!villageData || !Array.isArray(villageData) || !zipCode) return '';
    const village = villageData.find(v => v.id === parseInt(zipCode));
    return village ? `${village.name_th}, ${village.zip_code}` : '';
  }, [villageData, zipCode]);

  // Check if any data is loading
  const isLoading = isLoadingProvince || isLoadingDistrict || isLoadingVillage;

  return {
    provinceName,
    subDistrictName,
    villageDataName,
    isLoading,
  };
};

