/**
 * BasicInfoFields Component
 * ฟิลด์พื้นฐานสำหรับข้อมูล member
 */

import { FC, memo } from 'react';
import { TextField, FormControl, InputAdornment, Box, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Phone } from '@mui/icons-material';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { LOGO_LINE_WHITE } from '@/constants/svg';
import { FIELD_LABELS } from '../../constants';

interface BasicInfoFieldsProps {
  values: any;
  errors: any;
  touched: any;
  handleChange: (e: any) => void;
  handleBlur: (e: any) => void;
  setFieldValue: (field: string, value: any) => void;
}

/**
 * Component สำหรับแสดงฟิลด์ข้อมูลพื้นฐาน
 */
const BasicInfoFields: FC<BasicInfoFieldsProps> = memo(({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}) => {
  const theme = useTheme();
  const { t }: { t: any } = useTranslation();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      {/* User ID */}
      {/* <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.user_id && errors.user_id)}
          fullWidth
          disabled
          helperText={touched.user_id && typeof errors.user_id === 'string' ? errors.user_id : ''}
          label={t(FIELD_LABELS.userId)}
          name="user_id"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.user_id}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid> */}

      {/* Email */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          disabled
          error={Boolean(touched.email && errors.email)}
          label={t(FIELD_LABELS.email)}
          name="email"
          onBlur={handleBlur}
          helperText={
            (touched.email && typeof errors.email === 'string' && errors.email) || ''
          }
          onChange={(e: any) => {
            setFieldValue('email', e.target.value);
          }}
          value={values.email}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>

      {/* Nick Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.nick_name && errors.nick_name)}
          fullWidth
          helperText={touched.nick_name && typeof errors.nick_name === 'string' ? errors.nick_name : ''}
          label={t(FIELD_LABELS.nickName)}
          name="nick_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.nick_name}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>

      {/* Full Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.full_name && errors.full_name)}
          fullWidth
          helperText={touched.full_name && typeof errors.full_name === 'string' ? errors.full_name : ''}
          label={t(FIELD_LABELS.fullName)}
          name="full_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.full_name}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>

      {/* Secu Name */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.secu_name && errors.secu_name)}
          fullWidth
          helperText={touched.secu_name && typeof errors.secu_name === 'string' ? errors.secu_name : ''}
          label={t(FIELD_LABELS.secuName)}
          name="secu_name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.secu_name}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>

      {/* Date of Birth */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl 
          fullWidth 
          variant="outlined" 
          size={mobile ? 'small' : 'medium'} 
          error={touched.dob && Boolean(errors.dob)}
        >
          <DatePicker
            label={FIELD_LABELS.dob}
            format="YYYY/MM/DD"
            value={values.dob ? dayjs(values.dob, 'YYYY/MM/DD') : null}
            onChange={(date) => {
              const formattedDate = date ? dayjs(`${date}`) : null;
              setFieldValue('dob', formattedDate);
            }}
            slotProps={{
              textField: {
                name: 'dob',
                onBlur: handleBlur,
                helperText: touched.dob && errors.dob ? String(errors.dob) : '',
                error: touched.dob && Boolean(errors.dob),
                size: mobile ? 'small' : 'medium',
              },
            }}
          />
        </FormControl>
      </Grid>

      {/* Line ID */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.line && errors.line)}
          fullWidth
          helperText={touched.line && typeof errors.line === 'string' ? errors.line : ''}
          label={t(FIELD_LABELS.line)}
          name="line"
          placeholder={t('@example*')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Box
                    component="span"
                    sx={{
                      width: '100%',
                      maxWidth: { xs: '20px', sm: '25px', md: '30px' },
                      mr: { xs: 1, sm: 1.5, md: 2 },
                    }}
                  >
                    <Image
                      src={LOGO_LINE_WHITE}
                      layout="responsive"
                      width={500}
                      height={500}
                      alt="Logo"
                    />
                  </Box>
                </InputAdornment>
              ),
            },
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.line}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>

      {/* Phone */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          error={Boolean(touched.phone && errors.phone)}
          fullWidth
          helperText={touched.phone && typeof errors.phone === 'string' ? errors.phone : ''}
          label={t(FIELD_LABELS.phone)}
          name="phone"
          placeholder={t('+66-000-000')}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Phone />
                </InputAdornment>
              ),
            },
          }}
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.phone}
          variant="outlined"
          size={mobile ? 'small' : 'medium'}
        />
      </Grid>
    </>
  );
});

BasicInfoFields.displayName = 'BasicInfoFields';

export default BasicInfoFields;

