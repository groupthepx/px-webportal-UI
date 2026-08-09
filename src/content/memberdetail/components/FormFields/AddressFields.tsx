/**
 * AddressFields Component
 * ฟิลด์ที่อยู่ (จังหวัด, เขต, ตำบล)
 */

import { FC, memo } from 'react';
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { AddLocation } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { FIELD_LABELS } from '../../constants';
import { RegionData } from '../../types';

interface AddressFieldsProps {
  values: any;
  errors: any;
  touched: any;
  setFieldValue: (field: string, value: any) => void;
  provinces: RegionData[];
  districts: RegionData[];
  villages: RegionData[];
  onProvinceChange: (provinceId: string) => void;
  onDistrictChange: (districtId: string) => void;
}

/**
 * Component สำหรับแสดงฟิลด์ที่อยู่
 */
const AddressFields: FC<AddressFieldsProps> = memo(({
  values,
  errors,
  touched,
  setFieldValue,
  provinces,
  districts,
  villages,
  onProvinceChange,
  onDistrictChange,
}) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* Address Section Title */}
      <Grid size={12} style={{ textAlign: 'left' }}>
        <Typography variant={mobile ? 'h5' : 'h4'} sx={{ mt: { xs: 2, sm: 3 } }}>
          <AddLocation
            sx={{
              mr: 1,
              fontSize: mobile ? '1.2rem' : '1.5rem',
            }}
          />
          {t(FIELD_LABELS.addressInfo)}
        </Typography>
      </Grid>

      {/* Province */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth variant="outlined" size={mobile ? 'small' : 'medium'}>
          <InputLabel>{t(FIELD_LABELS.province)}</InputLabel>
          <Select
            value={values.province}
            onChange={(e: any) => {
              const newValue = e.target.value;
              if (newValue) {
                setFieldValue('province', `${newValue}`);
                onProvinceChange(`${newValue}`);
              } else {
                setFieldValue('province', '');
                onProvinceChange('');
              }
              // Reset dependent fields
              setFieldValue('subdistrict', '');
              setFieldValue('zip_code', '');
            }}
            sx={{ textAlign: 'left' }}
            label={t(FIELD_LABELS.province)}
          >
            <MenuItem value="">
              {t('เลือกจังหวัด')}
            </MenuItem>
            {provinces.map((data, index) => (
              <MenuItem key={index} value={data.id}>
                {data.name_th}
              </MenuItem>
            ))}
          </Select>
          {touched.province && errors.province && (
            <FormHelperText sx={{ color: 'red' }}>
              {errors.province}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* District */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth variant="outlined" size={mobile ? 'small' : 'medium'}>
          <InputLabel>{t(FIELD_LABELS.district)}</InputLabel>
          <Select
            value={values.subdistrict}
            onChange={(e: any) => {
              const newValue = e.target.value;
              if (newValue) {
                setFieldValue('subdistrict', `${newValue}`);
                onDistrictChange(`${newValue}`);
              } else {
                setFieldValue('subdistrict', '');
                onDistrictChange('');
              }
              // Reset zip code
              setFieldValue('zip_code', '');
            }}
            sx={{ textAlign: 'left' }}
            label={t(FIELD_LABELS.district)}
          >
            <MenuItem value="">
              {t('เลือกเขต')}
            </MenuItem>
            {districts.map((data, index) => (
              <MenuItem key={index} value={data.id}>
                {data.name_th}
              </MenuItem>
            ))}
          </Select>
          {touched.subdistrict && errors.subdistrict && (
            <FormHelperText sx={{ color: 'red' }}>
              {errors.subdistrict}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>

      {/* Village & Zip Code */}
      <Grid size={{ xs: 12, sm: 4 }}>
        <FormControl fullWidth variant="outlined" size={mobile ? 'small' : 'medium'}>
          <InputLabel>{t(FIELD_LABELS.village)}</InputLabel>
          <Select
            value={values.zip_code}
            onChange={(e: any) => {
              const newValue = e.target.value;
              if (newValue) {
                setFieldValue('zip_code', `${newValue}`);
              } else {
                setFieldValue('zip_code', '');
              }
            }}
            sx={{ textAlign: 'left' }}
            label={t(FIELD_LABELS.village)}
          >
            <MenuItem value="">
              {t('เลือก ตำบล และ รหัสไปรษณีย์')}
            </MenuItem>
            {villages.map((data, index) => (
              <MenuItem key={index} value={data.id}>
                {data.name_th}, {data.zip_code}
              </MenuItem>
            ))}
          </Select>
          {touched.zip_code && errors.zip_code && (
            <FormHelperText sx={{ color: 'red' }}>
              {errors.zip_code}
            </FormHelperText>
          )}
        </FormControl>
      </Grid>
    </>
  );
});

AddressFields.displayName = 'AddressFields';

export default AddressFields;

