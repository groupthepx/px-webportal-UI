'use client';

import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import { Alert, Avatar, Box, Button, Card, CardContent, Container, Divider, MenuItem, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import Logo from '@/components/Logo';
import { HEADER_LOGO } from '@/constants/svg';
import { useGetDistrictByIdQuery, useGetProvinceQuery, useGetVillageByIdQuery } from '@/lib/features/region';

type Gender = 'หญิง' | 'ชาย' | 'ไม่ระบุ';
type YesNo = 'Yes' | 'No';
type AddressCountry = 'ไทย' | 'ลาว';
type PhoneCountryCode = '+66' | '+856';
type SearchParamsLike = { get: (name: string) => string | null };

type RecruitmentRegisterValues = {
  nickname: string;
  fullName: string;
  gender: Gender;
  phoneCountryCode: PhoneCountryCode;
  phone: string;
  email: string;
  dob: string;
  previousVj: YesNo;
  specialSkill: string;
  socialLink: string;
  referralPxId: string;
  lineId: string;
  wantsVjIncome: YesNo;
  vjIncomeReason: string;
  addressCountry: AddressCountry;
  province: string;
  district: string;
  subdistrict: string;
  zipCode: string;
  addressDetail: string;
  note: string;
};

const phoneCountryOptions: Array<{ code: PhoneCountryCode; label: string }> = [
  { code: '+66', label: 'ไทย +66' },
  { code: '+856', label: 'ลาว +856' },
];

const laoAddressOptions = {
  provinces: ['นครหลวงเวียงจันทน์', 'หลวงพระบาง', 'จำปาสัก', 'สะหวันนะเขต'],
  districts: {
    นครหลวงเวียงจันทน์: ['จันทบุรี', 'ศรีสัตตนาค', 'ไซเสดถา'],
    หลวงพระบาง: ['หลวงพระบาง', 'จอมเพ็ด', 'ปากอู'],
    จำปาสัก: ['ปากเซ', 'ปทุมพร', 'โพนทอง'],
    สะหวันนะเขต: ['ไกสอนพมวิหาน', 'อุทุมพร', 'สองคอน'],
  } as Record<string, string[]>,
  villages: {
    จันทบุรี: ['หาดสาด', 'สีหอม'],
    ศรีสัตตนาค: ['ดงป่าลาน', 'โพนสว่าง'],
    ไซเสดถา: ['นาไฮ', 'อุดมผล'],
    หลวงพระบาง: ['โพนไซ', 'วัดใหม่'],
    จอมเพ็ด: ['ปากเซือง', 'บ้านจอมเพ็ด'],
    ปากอู: ['ปากอู', 'บ้านถ้ำ'],
    ปากเซ: ['หลักสอง', 'โพนกุง'],
    ปทุมพร: ['หนองบัว', 'บ้านท่า'],
    โพนทอง: ['โพนทอง', 'บ้านใหม่'],
    ไกสอนพมวิหาน: ['โพนสว่าง', 'นาแก'],
    อุทุมพร: ['อุทุมพร', 'บ้านดง'],
    สองคอน: ['สองคอน', 'บ้านคำ'],
  } as Record<string, string[]>,
};

const initialValues: RecruitmentRegisterValues = {
  nickname: '',
  fullName: '',
  gender: 'หญิง',
  phoneCountryCode: '+66',
  phone: '',
  email: '',
  dob: '',
  previousVj: '' as YesNo,
  specialSkill: '',
  socialLink: '',
  referralPxId: '',
  lineId: '',
  wantsVjIncome: 'Yes',
  vjIncomeReason: '',
  addressCountry: '' as AddressCountry,
  province: '',
  district: '',
  subdistrict: '',
  zipCode: '',
  addressDetail: '',
  note: '',
};

const fieldSx = {
  '& .MuiInputBase-root': { bgcolor: '#fff' },
};

const sourceLabels: Record<string, string> = {
  facebook: 'เฟซบุ๊ก',
  fb: 'เฟซบุ๊ก',
  google: 'กูเกิล',
  line: 'ไลน์',
  tiktok: 'ติ๊กต็อก',
  broker: 'โบรคเกอร์',
  whatsapp: 'วอตส์แอป',
};

function resolveApplySource(searchParams: SearchParamsLike) {
  const rawSource = searchParams.get('source')
    || searchParams.get('utm_source')
    || searchParams.get('ref')
    || searchParams.get('referral_source');

  if (rawSource) {
    const normalized = rawSource.trim().toLowerCase();
    return sourceLabels[normalized] || rawSource.trim();
  }

  if (typeof document !== 'undefined') {
    const referrer = document.referrer.toLowerCase();
    if (referrer.includes('facebook.com') || referrer.includes('fb.com')) return 'เฟซบุ๊ก';
    if (referrer.includes('google.')) return 'กูเกิล';
    if (referrer.includes('tiktok.com')) return 'ติ๊กต็อก';
    if (referrer.includes('line.me')) return 'ไลน์';
    if (referrer.includes('whatsapp.com')) return 'วอตส์แอป';
  }

  return 'เว็บไซต์';
}

export default function RecruitmentRegister() {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [form, setForm] = useState<RecruitmentRegisterValues>(initialValues);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [provinceId, setProvinceId] = useState('');
  const [districtId, setDistrictId] = useState('');

  const { data: provinceData } = useGetProvinceQuery();
  const { data: districtData } = useGetDistrictByIdQuery(
    { id: provinceId },
    { skip: provinceId === '' || form.addressCountry !== 'ไทย' },
  );
  const { data: villageData } = useGetVillageByIdQuery(
    { id: districtId },
    { skip: districtId === '' || form.addressCountry !== 'ไทย' },
  );

  const thaiProvinces = Array.isArray(provinceData) ? provinceData : [];
  const thaiDistricts = Array.isArray(districtData) ? districtData : [];
  const thaiVillages = Array.isArray(villageData) ? villageData : [];
  const laoDistricts = laoAddressOptions.districts[form.province] || [];
  const laoVillages = laoAddressOptions.villages[form.district] || [];
  const profilePreview = useMemo(() => (profileFile ? URL.createObjectURL(profileFile) : ''), [profileFile]);
  const applySource = useMemo(() => resolveApplySource(searchParams), [searchParams]);

  const updateForm = <K extends keyof RecruitmentRegisterValues>(key: K, value: RecruitmentRegisterValues[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  useEffect(() => () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  }, [profilePreview]);

  const handleProfileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setProfileFile(event.target.files?.[0] || null);
  };

  const handleCountryChange = (nextCountry: AddressCountry) => {
    setForm((current) => ({
      ...current,
      addressCountry: nextCountry,
      phoneCountryCode: nextCountry === 'ไทย' ? '+66' : '+856',
      province: '',
      district: '',
      subdistrict: '',
      zipCode: '',
    }));
    setProvinceId('');
    setDistrictId('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const missingRequiredField = !form.nickname.trim()
      || !form.fullName.trim()
      || !form.gender
      || !form.phone.trim()
      || !form.email.trim()
      || !form.dob
      || !form.previousVj
      || !form.lineId.trim()
      || !form.addressCountry
      || !form.province;

    if (missingRequiredField) {
      setFormError('กรุณากรอกชื่อเล่น ชื่อจริง เพศ เบอร์โทร อีเมล วันเกิด ประวัติ VJ, LINE ID ประเทศ และจังหวัดให้ครบถ้วน');
      return;
    }

    setFormError('');
    setSubmitting(true);
    // UI-only ตามที่กำหนด: ยังไม่ส่งข้อมูลเข้าฐานข้อมูลจริง
    router.push('/register/success');
  };

  const isThaiAddress = form.addressCountry === 'ไทย';

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f8fa', pb: 5 }}>
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid rgba(15,23,42,.08)' }}>
        <Container maxWidth="xl" sx={{ minHeight: { xs: 64, md: 76 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Logo imageSrc={HEADER_LOGO} />
          <Button size={mobile ? 'small' : 'medium'} startIcon={<ArrowBackIosNewOutlinedIcon />} onClick={() => router.push('/home')} sx={{ color: theme.colors.gray.main, fontWeight: 700 }}>
            กลับหน้าหลัก
          </Button>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 5 }, px: { xs: 1.5, sm: 3 } }}>
        <Stack spacing={{ xs: 2, md: 3 }}>
          <Box>
            <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 25, md: 36 }, fontWeight: 800 }}>สมัครเป็น VJ</Typography>
            <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 14 }}>กรุณากรอกข้อมูลสำหรับสมัครเข้าร่วมครอบครัว PX</Typography>
          </Box>

          <Card elevation={0} sx={{ border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5 }}>
            <CardContent component="form" onSubmit={handleSubmit} sx={{ p: { xs: 1.75, sm: 3, md: 4 } }}>
              {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}

              <Stack spacing={3}>
                <Box>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <Avatar src={profilePreview || undefined} sx={{ width: 76, height: 76, bgcolor: '#202020', fontSize: 28 }}>
                      {(form.nickname || form.fullName || 'P').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ mb: 1, fontSize: 18, fontWeight: 800 }}>รูปโปรไฟล์ผู้สมัคร</Typography>
                      <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />} sx={{ borderRadius: 2 }}>
                        อัปโหลด Profile (ตัวเลือก)
                        <input hidden type="file" accept="image/*" onChange={handleProfileChange} />
                      </Button>
                      {profileFile && <Typography sx={{ mt: 0.75, color: theme.colors.gray.main, fontSize: 12 }}>{profileFile.name}</Typography>}
                    </Box>
                  </Stack>
                </Box>

                <Divider />

                <Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ข้อมูลพื้นฐาน</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required label="ชื่อเล่น" value={form.nickname} onChange={(event) => updateForm('nickname', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth required label="ชื่อจริงและนามสกุล" value={form.fullName} onChange={(event) => updateForm('fullName', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField select fullWidth required label="เพศ" value={form.gender} onChange={(event) => updateForm('gender', event.target.value as Gender)} sx={fieldSx}><MenuItem value="หญิง">หญิง</MenuItem><MenuItem value="ชาย">ชาย</MenuItem><MenuItem value="ไม่ระบุ">ไม่ระบุ</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 8 }}>
                    <Stack direction="row" spacing={1}>
                      <TextField select label="รหัสประเทศ" value={form.phoneCountryCode} onChange={(event) => updateForm('phoneCountryCode', event.target.value as PhoneCountryCode)} sx={{ ...fieldSx, width: { xs: 132, sm: 150 }, flexShrink: 0 }}>
                        {phoneCountryOptions.map((option) => <MenuItem key={option.code} value={option.code}>{option.label}</MenuItem>)}
                      </TextField>
                      <TextField fullWidth required label="เบอร์โทรศัพท์" value={form.phone} onChange={(event) => updateForm('phone', event.target.value)} sx={fieldSx} />
                    </Stack>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth required type="email" label="อีเมล" value={form.email} onChange={(event) => updateForm('email', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth required type="date" label="วันเกิด" value={form.dob} onChange={(event) => updateForm('dob', event.target.value)} slotProps={{ inputLabel: { shrink: true } }} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth required label="ID Line" value={form.lineId} onChange={(event) => updateForm('lineId', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField select fullWidth required label="เคยเป็น VJ มาก่อนไหม?" value={form.previousVj} onChange={(event) => updateForm('previousVj', event.target.value as YesNo)} sx={fieldSx}><MenuItem value="">เลือกคำตอบ</MenuItem><MenuItem value="Yes">Yes</MenuItem><MenuItem value="No">No</MenuItem></TextField></Grid>
                </Grid>

                <Divider />

                <Stack direction="row" spacing={1} alignItems="center"><LocationOnOutlinedIcon color="primary" /><Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ข้อมูลที่อยู่</Typography></Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField select fullWidth required label="ประเทศ" value={form.addressCountry} onChange={(event) => handleCountryChange(event.target.value as AddressCountry)} sx={fieldSx}><MenuItem value="">เลือกประเทศ</MenuItem><MenuItem value="ไทย">ไทย</MenuItem><MenuItem value="ลาว">ลาว</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField select fullWidth required disabled={!form.addressCountry} label={isThaiAddress ? 'จังหวัด' : form.addressCountry === 'ลาว' ? 'แขวง' : 'จังหวัด / แขวง'} value={form.province} onChange={(event) => { const value = event.target.value; const selected = thaiProvinces.find((item: any) => `${item.name_th}` === value); updateForm('province', value); updateForm('district', ''); updateForm('subdistrict', ''); updateForm('zipCode', ''); setProvinceId(selected?.id ? `${selected.id}` : ''); setDistrictId(''); }} sx={fieldSx}>
                      <MenuItem value="">{isThaiAddress ? 'เลือกจังหวัด' : form.addressCountry === 'ลาว' ? 'เลือกแขวง' : 'เลือกประเทศก่อน'}</MenuItem>
                      {isThaiAddress ? thaiProvinces.map((item: any) => <MenuItem key={item.id} value={item.name_th}>{item.name_th}</MenuItem>) : form.addressCountry === 'ลาว' ? laoAddressOptions.provinces.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>) : null}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField select fullWidth disabled={!form.province} label={isThaiAddress ? 'อำเภอ / เขต (ตัวเลือก)' : form.addressCountry === 'ลาว' ? 'เมือง (ตัวเลือก)' : 'อำเภอ / เขต (ตัวเลือก)'} value={form.district} onChange={(event) => { const value = event.target.value; const selected = thaiDistricts.find((item: any) => `${item.name_th}` === value); updateForm('district', value); updateForm('subdistrict', ''); updateForm('zipCode', ''); setDistrictId(selected?.id ? `${selected.id}` : ''); }} sx={fieldSx}>
                      <MenuItem value="">{isThaiAddress ? 'เลือกอำเภอ / เขต' : form.addressCountry === 'ลาว' ? 'เลือกเมือง' : 'เลือกจังหวัดก่อน'}</MenuItem>
                      {isThaiAddress ? thaiDistricts.map((item: any) => <MenuItem key={item.id} value={item.name_th}>{item.name_th}</MenuItem>) : form.addressCountry === 'ลาว' ? laoDistricts.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>) : null}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <TextField select fullWidth disabled={!form.district} label={isThaiAddress ? 'ตำบล และ รหัสไปรษณีย์ (ตัวเลือก)' : form.addressCountry === 'ลาว' ? 'บ้าน (ตัวเลือก)' : 'ตำบล (ตัวเลือก)'} value={form.subdistrict} onChange={(event) => { const value = event.target.value; const selected = thaiVillages.find((item: any) => `${item.name_th}` === value); updateForm('subdistrict', value); if (isThaiAddress) updateForm('zipCode', selected?.zip_code ? `${selected.zip_code}` : ''); }} sx={fieldSx}>
                      <MenuItem value="">{isThaiAddress ? 'เลือกตำบล และ รหัสไปรษณีย์' : form.addressCountry === 'ลาว' ? 'เลือกบ้าน' : 'เลือกอำเภอก่อน'}</MenuItem>
                      {isThaiAddress ? thaiVillages.map((item: any) => <MenuItem key={item.id} value={item.name_th}>{item.name_th} , {item.zip_code}</MenuItem>) : form.addressCountry === 'ลาว' ? laoVillages.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>) : null}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth label="รหัสไปรษณีย์" value={form.zipCode} onChange={(event) => updateForm('zipCode', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, md: 4 }}><TextField fullWidth label="ที่อยู่เพิ่มเติม" value={form.addressDetail} onChange={(event) => updateForm('addressDetail', event.target.value)} sx={fieldSx} /></Grid>
                </Grid>

                <Divider />

                <Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ข้อมูลการสรรหา</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="ความสามารถพิเศษ (ตัวเลือก)" value={form.specialSkill} onChange={(event) => updateForm('specialSkill', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, md: 6 }}><TextField fullWidth label="ลิงก์โซเชียลที่มีผู้ติดตาม (ตัวเลือก)" value={form.socialLink} onChange={(event) => updateForm('socialLink', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth label="PX ID ผู้แนะนำ (ตัวเลือก)" value={form.referralPxId} onChange={(event) => updateForm('referralPxId', event.target.value)} sx={fieldSx} /></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField select fullWidth label="ต้องการหารายได้จากการเป็นวีเจหรือไม่" value={form.wantsVjIncome} onChange={(event) => updateForm('wantsVjIncome', event.target.value as YesNo)} sx={fieldSx}><MenuItem value="Yes">Yes</MenuItem><MenuItem value="No">No</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 6, md: 4 }}><TextField fullWidth label="แหล่งที่มาของการสมัคร" value={applySource} InputProps={{ readOnly: true }} helperText="ระบบกำหนดจากลิงก์ที่ใช้สมัคร" sx={fieldSx} /></Grid>
                  {form.wantsVjIncome === 'No' && <Grid size={12}><TextField fullWidth multiline minRows={2} label="เหตุผลอื่นๆ" value={form.vjIncomeReason} onChange={(event) => updateForm('vjIncomeReason', event.target.value)} sx={fieldSx} /></Grid>}
                  <Grid size={12}><TextField fullWidth multiline minRows={3} label="หมายเหตุ (ตัวเลือก)" value={form.note} onChange={(event) => updateForm('note', event.target.value)} sx={fieldSx} /></Grid>
                </Grid>

                <Stack direction={{ xs: 'column-reverse', sm: 'row' }} justifyContent="flex-end" spacing={1.25}>
                  <Button variant="outlined" onClick={() => router.push('/home')} disabled={submitting}>ยกเลิก</Button>
                  <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting ? undefined : <CheckCircleOutlineRoundedIcon />} sx={{ minWidth: 150, background: theme.colors.gradients.primary }}>ส่งใบสมัคร</Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
