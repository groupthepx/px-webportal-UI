'use client';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import VerifiedUserRoundedIcon from '@mui/icons-material/VerifiedUserRounded';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Drawer,
  MenuItem,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useSearchParams } from 'next/navigation';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';

import { usePostBankAccountMutation, useUpdateBankAccountMutation } from '@/lib/features/bankaccout';
import { useGetMemberByIdQuery, useGetProfileByIdQuery, useVerifyProfileKycMutation } from '@/lib/features/profile';
import { useUpdateMemberMutation } from '@/lib/features/member';
import { buildUploadUrl, getKycSummary, getMemberDisplayName } from '@/content/Home/homeData';
import { useGetDistrictByIdQuery, useGetProvinceQuery, useGetVillageByIdQuery } from '@/lib/features/region';

type ProfileTab = 'personal' | 'bank' | 'kyc';

const tabFromQuery = (value: string | null): ProfileTab => value === 'bank' || value === 'kyc' ? value : 'personal';
const fieldSx = { '& .MuiInputBase-root': { bgcolor: '#fff' } };

const phoneCountryOptions = [
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

const normalizeCountry = (value?: string | null) => {
  const country = `${value || ''}`.trim().toLowerCase();
  if (country === 'ลาว' || country === 'laos' || country === 'la' || country === '856') return 'ลาว';
  return 'ไทย';
};

function TabPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  if (!active) return null;
  return <Box role="tabpanel" sx={{ pt: 2.5 }}>{children}</Box>;
}

export default function ProfileSettings() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<ProfileTab>(tabFromQuery(searchParams.get('tab')));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [personal, setPersonal] = useState({
    full_name: '',
    nick_name: '',
    gender: '',
    secu_name: '',
    dob: '',
    country: '',
    province: '',
    subdistrict: '',
    zip_code: '',
    email: '',
    phone: '',
    phone_country_code: '+66',
    line: '',
  });
  const [bank, setBank] = useState({ bank_name: '', account_number: '', account_name: '' });
  const [editingBank, setEditingBank] = useState(false);
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [kyc, setKyc] = useState({ card_number: '', f_name: '', l_name: '', expire_date: '' });
  const [kycFile, setKycFile] = useState<File | null>(null);

  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading, refetch } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const member = memberResponse?.data;
  const { data: provinceData } = useGetProvinceQuery();
  const thaiProvinces = Array.isArray(provinceData) ? provinceData : [];
  const isThaiAddress = personal.country === 'ไทย';
  const selectedProvince = thaiProvinces.find((item: any) => `${item.id}` === `${personal.province}` || item.name_th === personal.province);
  const provinceId = isThaiAddress && selectedProvince?.id ? `${selectedProvince.id}` : '';
  const { data: districtData } = useGetDistrictByIdQuery(
    { id: provinceId },
    { skip: !provinceId || !isThaiAddress },
  );
  const thaiDistricts = Array.isArray(districtData) ? districtData : [];
  const selectedDistrict = thaiDistricts.find((item: any) => `${item.id}` === `${personal.subdistrict}` || item.name_th === personal.subdistrict);
  const districtId = isThaiAddress && selectedDistrict?.id ? `${selectedDistrict.id}` : '';
  const { data: villageData } = useGetVillageByIdQuery(
    { id: districtId },
    { skip: !districtId || !isThaiAddress },
  );
  const thaiVillages = Array.isArray(villageData) ? villageData : [];
  const thaiPostalCodes = Array.from(new Set(thaiVillages.map((item: any) => `${item.zip_code}`).filter(Boolean)));
  const laoDistricts = laoAddressOptions.districts[personal.province] || [];
  const [updateMember] = useUpdateMemberMutation();
  const [postBankAccount] = usePostBankAccountMutation();
  const [updateBankAccount] = useUpdateBankAccountMutation();
  const [verifyKyc] = useVerifyProfileKycMutation();
  const kycSummary = getKycSummary(member);
  const profilePreview = useMemo(() => (profileFile ? URL.createObjectURL(profileFile) : ''), [profileFile]);

  useEffect(() => setActiveTab(tabFromQuery(searchParams.get('tab'))), [searchParams]);

  useEffect(() => {
    if (!member) return;
    setPersonal({
      full_name: member.full_name || '',
      nick_name: member.nick_name || '',
      gender: (member as any).gender || '',
      secu_name: member.secu_name || '',
      dob: member.dob ? String(member.dob).slice(0, 10) : '',
      country: normalizeCountry(member.country),
      province: member.province || '',
      subdistrict: member.subdistrict || '',
      zip_code: member.zip_code || '',
      email: member.email || '',
      phone: member.phone || '',
      phone_country_code: (member as any).phone_country_code || ((member.phone || '').startsWith('+856') ? '+856' : '+66'),
      line: member.line || '',
    });
    setBank({ bank_name: member.bank_account?.bank_name || '', account_number: member.bank_account?.account_number || '', account_name: member.bank_account?.account_name || '' });
    const latestKyc = (member.kyc_verification || []).find((item: any) => !item.deleted_at);
    setKyc({ card_number: latestKyc?.card_number || member.card_number || '', f_name: latestKyc?.f_name || member.full_name?.split(' ')[0] || '', l_name: latestKyc?.l_name || member.full_name?.split(' ').slice(1).join(' ') || '', expire_date: latestKyc?.expire_date ? String(latestKyc.expire_date).slice(0, 10) : '' });
  }, [member]);

  useEffect(() => () => {
    if (profilePreview) URL.revokeObjectURL(profilePreview);
  }, [profilePreview]);

  const displayName = getMemberDisplayName(member, 'VJ Member');
  const hasBankAccount = Boolean(member?.bank_account?.bank_account_id);
  const latestKyc = useMemo(() => (member?.kyc_verification || []).find((item: any) => !item.deleted_at), [member]);
  const kycImageUrl = buildUploadUrl(latestKyc?.card_with_profile_img || member?.card_with_profile_img);
  const kycLocked = kycSummary.state === 'approved';

  const selectTab = (nextTab: ProfileTab) => {
    setActiveTab(nextTab);
    window.history.replaceState(null, '', `/profile?tab=${nextTab}`);
    setMessage(null);
    setMobileDrawerOpen(false);
  };

  const cancelPersonalEdit = () => {
    setProfileFile(null);
    setEditingPersonal(false);
    if (!member) return;
    setPersonal({
      full_name: member.full_name || '',
      nick_name: member.nick_name || '',
      gender: (member as any).gender || '',
      secu_name: member.secu_name || '',
      dob: member.dob ? String(member.dob).slice(0, 10) : '',
      country: normalizeCountry(member.country),
      province: member.province || '',
      subdistrict: member.subdistrict || '',
      zip_code: member.zip_code || '',
      email: member.email || '',
      phone: member.phone || '',
      phone_country_code: (member as any).phone_country_code || ((member.phone || '').startsWith('+856') ? '+856' : '+66'),
      line: member.line || '',
    });
  };

  const profileNavigation = (
    <List sx={{ p: 1 }}>
      {[
        { value: 'personal' as ProfileTab, label: 'ข้อมูลส่วนตัว', icon: <PersonOutlineRoundedIcon /> },
        { value: 'bank' as ProfileTab, label: 'บัญชีธนาคาร', icon: <AccountBalanceRoundedIcon /> },
        { value: 'kyc' as ProfileTab, label: 'ข้อมูล KYC', icon: <VerifiedUserRoundedIcon /> },
      ].map((item) => (
        <ListItemButton
          key={item.value}
          selected={activeTab === item.value}
          onClick={() => selectTab(item.value)}
          sx={{
            mb: 0.5,
            minHeight: 48,
            borderRadius: 1.5,
            '&.Mui-selected': {
              color: theme.colors.primary.main,
              bgcolor: alpha(theme.colors.primary.main, 0.1),
              '& .MuiListItemIcon-root': { color: theme.colors.primary.main },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38 }}>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: 700 }} />
        </ListItemButton>
      ))}
    </List>
  );

  const savePersonal = async () => {
    if (!member?.member_id) return;
    setSaving(true);
    try {
      const formData = new FormData();
      const editableFields = ['full_name', 'nick_name', 'gender', 'secu_name', 'dob', 'country', 'province', 'subdistrict', 'zip_code'] as const;
      editableFields.forEach((key) => formData.append(key, personal[key]));
      if (profileFile) formData.append('profile', profileFile);
      await updateMember({ id: String(member.member_id), member: formData as any }).unwrap();
      await refetch();
      setProfileFile(null);
      setEditingPersonal(false);
      setMessage({ type: 'success', text: 'บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว' });
    } catch {
      setMessage({ type: 'error', text: 'ไม่สามารถบันทึกข้อมูลส่วนตัวได้ กรุณาลองใหม่อีกครั้ง' });
    } finally { setSaving(false); }
  };

  const saveBank = async () => {
    if (!member?.member_id || !bank.bank_name || !bank.account_number || !bank.account_name) {
      setMessage({ type: 'error', text: 'กรุณากรอกข้อมูลบัญชีธนาคารให้ครบถ้วน' });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(bank).forEach(([key, value]) => formData.append(key, value));
      formData.append('member_id', String(member.member_id));
      if (qrFile) formData.append('qr_img', qrFile);
      if (hasBankAccount) await updateBankAccount({ id: String(member.bank_account.bank_account_id), bank: formData as any }).unwrap();
      else await postBankAccount({ bank: formData as any }).unwrap();
      await refetch();
      setQrFile(null);
      setEditingBank(false);
      setMessage({ type: 'success', text: 'บันทึกข้อมูลบัญชีธนาคารเรียบร้อยแล้ว' });
    } catch {
      setMessage({ type: 'error', text: 'ไม่สามารถบันทึกบัญชีธนาคารได้ กรุณาลองใหม่อีกครั้ง' });
    } finally { setSaving(false); }
  };

  const cancelBankEdit = () => {
    setQrFile(null);
    setEditingBank(false);
    setBank({
      bank_name: member?.bank_account?.bank_name || '',
      account_number: member?.bank_account?.account_number || '',
      account_name: member?.bank_account?.account_name || '',
    });
  };

  const submitKyc = async () => {
    if (kycLocked || kycSummary.state === 'pending') return;
    if (!member?.member_id || !kycFile || !kyc.card_number || !kyc.f_name || !kyc.l_name || !kyc.expire_date) {
      setMessage({ type: 'error', text: 'กรุณากรอกข้อมูล KYC และแนบรูปบัตรให้ครบถ้วน' });
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('member_id', String(member.member_id));
      formData.append('card_number', kyc.card_number);
      formData.append('card_with_profile_img', kycFile);
      formData.append('f_name', kyc.f_name);
      formData.append('l_name', kyc.l_name);
      formData.append('expire_date', kyc.expire_date);
      await verifyKyc(formData).unwrap();
      await refetch();
      setKycFile(null);
      setMessage({ type: 'success', text: 'ส่งข้อมูล KYC เรียบร้อยแล้ว กรุณารอทีมงานตรวจสอบ' });
    } catch {
      setMessage({ type: 'error', text: 'ไม่สามารถส่งข้อมูล KYC ได้ กรุณาลองใหม่อีกครั้ง' });
    } finally { setSaving(false); }
  };

  if (profileLoading || (memberId !== '0' && memberLoading)) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <Box>
            <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 25, md: 32 }, fontWeight: 800 }}>ข้อมูลโปรไฟล์</Typography>
            <Typography sx={{ mt: .45, color: theme.colors.gray.main, fontSize: 14 }}>จัดการข้อมูลส่วนตัว บัญชีธนาคาร และการยืนยันตัวตน</Typography>
          </Box>
          {message && <Alert severity={message.type} onClose={() => setMessage(null)}>{message.text}</Alert>}
          {isMobile && <Button variant="outlined" startIcon={<MenuRoundedIcon />} onClick={() => setMobileDrawerOpen(true)} sx={{ alignSelf: 'flex-start' }}>เมนูโปรไฟล์</Button>}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: { xs: 0, md: 2 } }}>
            {!isMobile && <Box sx={{ width: 240, flexShrink: 0, bgcolor: '#fff', border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5 }}>{profileNavigation}</Box>}
            <Drawer
              anchor="left"
              open={mobileDrawerOpen}
              onClose={() => setMobileDrawerOpen(false)}
              sx={{ '& .MuiDrawer-paper': { width: 270, boxSizing: 'border-box', pt: 2 } }}
            >
              <Typography sx={{ px: 2, pb: 1, color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ข้อมูลโปรไฟล์</Typography>
              {profileNavigation}
            </Drawer>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)' }}>
                <CardContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
                  <TabPanel active={activeTab === 'personal'}>
                    <Stack spacing={2.5}>
                      <Card variant="outlined" sx={{ borderRadius: 2 }}>
                        <CardContent>
                          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                            <Avatar
                              src={profilePreview || buildUploadUrl(member?.profile) || undefined}
                              sx={{ width: 80, height: 80, bgcolor: '#fff1e7', color: theme.colors.primary.main, fontSize: 28, fontWeight: 800 }}
                            >
                              {displayName.slice(0, 1)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography sx={{ fontSize: 20, fontWeight: 800 }}>{displayName}</Typography>
                              <Typography sx={{ mt: .25, color: theme.colors.gray.main, fontSize: 13 }}>PX ID: {member?.user_px || '-'}</Typography>
                              {editingPersonal && (
                                <Button component="label" variant="outlined" size="small" startIcon={<CloudUploadOutlinedIcon />} sx={{ mt: 1 }}>
                                  เปลี่ยนรูปโปรไฟล์
                                  <input hidden type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setProfileFile(event.target.files?.[0] || null)} />
                                </Button>
                              )}
                              {profileFile && <Typography sx={{ mt: .5, color: theme.colors.gray.main, fontSize: 12 }}>{profileFile.name}</Typography>}
                            </Box>
                            <Stack direction="row" spacing={1}>
                              <Button variant={editingPersonal ? 'contained' : 'outlined'} startIcon={editingPersonal ? <SaveRoundedIcon /> : <EditRoundedIcon />} onClick={editingPersonal ? savePersonal : () => setEditingPersonal(true)} disabled={saving} sx={editingPersonal ? { background: theme.colors.gradients.primary } : undefined}>
                                {editingPersonal ? 'บันทึก' : 'แก้ไขข้อมูล'}
                              </Button>
                              {editingPersonal && <Button variant="outlined" onClick={cancelPersonalEdit} disabled={saving}>ยกเลิก</Button>}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>

                      <Box>
                        <Typography sx={{ mb: 1.25, color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ข้อมูลพื้นฐาน</Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                          <TextField label="ชื่อจริงและนามสกุล" value={personal.full_name} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, full_name: event.target.value })} sx={fieldSx} />
                          <TextField label="ชื่อเล่น" value={personal.nick_name} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, nick_name: event.target.value })} sx={fieldSx} />
                          <TextField select label="เพศ" value={personal.gender} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, gender: event.target.value })} sx={fieldSx}>
                            <MenuItem value="">เลือกเพศ</MenuItem>
                            <MenuItem value="หญิง">หญิง</MenuItem>
                            <MenuItem value="ชาย">ชาย</MenuItem>
                            <MenuItem value="ไม่ระบุ">ไม่ระบุ</MenuItem>
                          </TextField>
                          <TextField label="ชื่อสำหรับเอกสาร" value={personal.secu_name} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, secu_name: event.target.value })} sx={fieldSx} />
                          <TextField label="วันเกิด" type="date" value={personal.dob} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, dob: event.target.value })} InputLabelProps={{ shrink: true }} sx={fieldSx} />
                        </Box>
                      </Box>

                      <Divider />

                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.25 }}>
                          <LocationOnOutlinedIcon color="primary" />
                          <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ข้อมูลที่อยู่</Typography>
                        </Stack>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                          <TextField select label="ประเทศ" value={personal.country} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, country: event.target.value, province: '', subdistrict: '', zip_code: '' })} sx={fieldSx}>
                            <MenuItem value="ไทย">ไทย</MenuItem>
                            <MenuItem value="ลาว">ลาว</MenuItem>
                          </TextField>
                          <TextField
                            select
                            label={isThaiAddress ? 'จังหวัด' : 'แขวง'}
                            value={personal.province}
                            disabled={!editingPersonal || !personal.country}
                            onChange={(event) => setPersonal({ ...personal, province: event.target.value, subdistrict: '', zip_code: '' })}
                            sx={fieldSx}
                          >
                            <MenuItem value="">เลือก{isThaiAddress ? 'จังหวัด' : 'แขวง'}</MenuItem>
                            {isThaiAddress
                              ? thaiProvinces.map((item: any) => <MenuItem key={item.id} value={`${item.id}`}>{item.name_th}</MenuItem>)
                              : laoAddressOptions.provinces.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                            {personal.province && selectedProvince && `${selectedProvince.id}` !== `${personal.province}` && <MenuItem value={personal.province}>{selectedProvince.name_th}</MenuItem>}
                          </TextField>
                          <TextField
                            select
                            label={isThaiAddress ? 'เขต/อำเภอ' : 'เมือง'}
                            value={personal.subdistrict}
                            disabled={!editingPersonal || !personal.province}
                            onChange={(event) => setPersonal({ ...personal, subdistrict: event.target.value, zip_code: '' })}
                            sx={fieldSx}
                          >
                            <MenuItem value="">เลือก{isThaiAddress ? 'เขต/อำเภอ' : 'เมือง'}</MenuItem>
                            {isThaiAddress
                              ? thaiDistricts.map((item: any) => <MenuItem key={item.id} value={`${item.id}`}>{item.name_th}</MenuItem>)
                              : laoDistricts.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}
                            {personal.subdistrict && selectedDistrict && `${selectedDistrict.id}` !== `${personal.subdistrict}` && <MenuItem value={personal.subdistrict}>{selectedDistrict.name_th}</MenuItem>}
                          </TextField>
                          {isThaiAddress ? (
                            <TextField
                              select
                              label="รหัสไปรษณีย์"
                              value={personal.zip_code}
                              disabled={!editingPersonal || !districtId}
                              onChange={(event) => setPersonal({ ...personal, zip_code: event.target.value })}
                              sx={fieldSx}
                            >
                              <MenuItem value="">เลือกรหัสไปรษณีย์</MenuItem>
                              {thaiPostalCodes.map((zipCode) => <MenuItem key={zipCode} value={zipCode}>{zipCode}</MenuItem>)}
                            </TextField>
                          ) : (
                            <TextField label="รหัสไปรษณีย์" value={personal.zip_code} disabled={!editingPersonal} onChange={(event) => setPersonal({ ...personal, zip_code: event.target.value })} sx={fieldSx} />
                          )}
                        </Box>
                      </Box>

                      <Divider />

                      <Box>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                          <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ข้อมูลติดต่อ</Typography>
                        </Stack>
                        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.25, color: theme.colors.gray.main, fontSize: 12 }}>
                          <InfoOutlinedIcon sx={{ fontSize: 16 }} /> อีเมล เบอร์โทรศัพท์ และ LINE ID แก้ไขได้โดย Admin เท่านั้น เนื่องจากใช้สำหรับเข้าสู่ระบบและการแจ้งเตือน
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                          <TextField label="อีเมล" value={personal.email} disabled sx={fieldSx} />
                          <Stack direction="row" spacing={1}>
                            <TextField select label="รหัสประเทศ" value={personal.phone_country_code} disabled sx={{ ...fieldSx, width: { xs: 132, sm: 150 }, flexShrink: 0 }}>
                              {phoneCountryOptions.map((option) => <MenuItem key={option.code} value={option.code}>{option.label}</MenuItem>)}
                            </TextField>
                            <TextField fullWidth label="เบอร์โทรศัพท์" value={personal.phone} disabled sx={fieldSx} />
                          </Stack>
                          <TextField label="LINE ID" value={personal.line} disabled sx={fieldSx} />
                        </Box>
                      </Box>
                    </Stack>
                  </TabPanel>
                  <TabPanel active={activeTab === 'bank'}>
                    <Stack spacing={2}>
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between">
                        <Alert sx={{ flex: 1 }} severity={hasBankAccount ? 'success' : 'info'} icon={hasBankAccount ? <CheckCircleRoundedIcon /> : undefined}>{hasBankAccount ? 'มีบัญชีธนาคารที่บันทึกไว้แล้ว คุณสามารถแก้ไขข้อมูลได้' : 'เพิ่มบัญชีธนาคารเพื่อรองรับการถอนเงินและรับรายได้'}</Alert>
                        {!editingBank && <Button variant="outlined" startIcon={<EditRoundedIcon />} onClick={() => setEditingBank(true)}>{hasBankAccount ? 'แก้ไข' : 'เพิ่มบัญชี'}</Button>}
                      </Stack>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                        <TextField label="ธนาคาร" value={bank.bank_name} disabled={!editingBank} onChange={(event) => setBank({ ...bank, bank_name: event.target.value })} sx={fieldSx} />
                        <TextField label="ชื่อบัญชี" value={bank.account_name} disabled={!editingBank} onChange={(event) => setBank({ ...bank, account_name: event.target.value })} sx={fieldSx} />
                        <TextField label="เลขที่บัญชี" value={bank.account_number} disabled={!editingBank} onChange={(event) => setBank({ ...bank, account_number: event.target.value })} sx={fieldSx} />
                        <Button component="label" variant="outlined" disabled={!editingBank} sx={{ minHeight: 56, justifyContent: 'flex-start', textTransform: 'none' }}>อัปโหลด QR บัญชี{qrFile ? `: ${qrFile.name}` : ''}<input hidden type="file" accept="image/*" onChange={(event: ChangeEvent<HTMLInputElement>) => setQrFile(event.target.files?.[0] || null)} /></Button>
                      </Box>
                      {member?.bank_account?.qr_img && <Box><Typography sx={{ mb: 1, color: theme.colors.gray.main, fontSize: 12 }}>รูปภาพ QR บัญชีธนาคาร</Typography><Box component="img" src={buildUploadUrl(member.bank_account.qr_img)} alt="QR บัญชีธนาคาร" sx={{ display: 'block', width: 180, height: 180, objectFit: 'contain', border: '1px solid rgba(15,23,42,.1)', borderRadius: 2, bgcolor: '#fff', p: 1 }} /></Box>}
                      {editingBank && <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button variant="outlined" startIcon={<CloseRoundedIcon />} onClick={cancelBankEdit} disabled={saving}>ยกเลิก</Button>
                        <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={saveBank} disabled={saving} sx={{ background: theme.colors.gradients.primary }}>บันทึกบัญชีธนาคาร</Button>
                      </Stack>}
                    </Stack>
                  </TabPanel>
                  <TabPanel active={activeTab === 'kyc'}>
                    <Stack spacing={2}>
                      <Card variant="outlined" sx={{ borderRadius: 2, bgcolor: alpha(kycSummary.color, .04), borderColor: alpha(kycSummary.color, .2) }}><CardContent><Stack direction="row" spacing={1.25} alignItems="center"><VerifiedUserRoundedIcon sx={{ color: kycSummary.color }} /><Box><Typography sx={{ color: kycSummary.color, fontWeight: 800 }}>{kycSummary.label}</Typography><Typography sx={{ mt: .3, color: theme.colors.gray.main, fontSize: 13 }}>{kycSummary.detail}</Typography></Box></Stack></CardContent></Card>
                      {latestKyc?.status === 'pending' && <Alert severity="warning">ระบบได้รับข้อมูลแล้ว กรุณารอทีมงานตรวจสอบ</Alert>}
                      {latestKyc?.status === 'rejected' && <Alert severity="error"><Typography sx={{ fontWeight: 800 }}>เหตุผลที่ไม่ผ่านการตรวจสอบ</Typography><Typography sx={{ mt: 0.5 }}>{latestKyc.rejection_reason || 'กรุณาตรวจสอบข้อมูลและส่งข้อมูลใหม่อีกครั้ง'}</Typography></Alert>}
                      {kycLocked && <Alert severity="success">ข้อมูล KYC ได้รับการยืนยันแล้ว ไม่สามารถแก้ไขข้อมูลหรือส่งเอกสารใหม่ได้</Alert>}
                      {kycImageUrl && <Box><Typography sx={{ mb: 1, color: theme.colors.gray.main, fontSize: 13, fontWeight: 700 }}>รูปบัตรประชาชน</Typography><Box component="img" src={kycImageUrl} alt="รูปบัตรประชาชน" sx={{ display: 'block', width: '100%', maxWidth: 420, maxHeight: 260, objectFit: 'contain', objectPosition: 'left center', border: '1px solid rgba(15,23,42,.1)', borderRadius: 2, bgcolor: '#fff', p: 1 }} /></Box>}
                      <Divider /><Typography sx={{ fontSize: 18, fontWeight: 800 }}>{kycLocked ? 'ข้อมูลการยืนยันตัวตน' : latestKyc?.status === 'rejected' ? 'ส่งข้อมูล KYC ใหม่' : 'ส่งข้อมูล KYC'}</Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                        <TextField label="เลขบัตรประชาชน" value={kyc.card_number} disabled={kycLocked} onChange={(event) => setKyc({ ...kyc, card_number: event.target.value })} sx={fieldSx} />
                        <TextField label="วันหมดอายุบัตร" type="date" value={kyc.expire_date} disabled={kycLocked} onChange={(event) => setKyc({ ...kyc, expire_date: event.target.value })} InputLabelProps={{ shrink: true }} sx={fieldSx} />
                        <TextField label="ชื่อบนบัตร" value={kyc.f_name} disabled={kycLocked} onChange={(event) => setKyc({ ...kyc, f_name: event.target.value })} sx={fieldSx} />
                        <TextField label="นามสกุลบนบัตร" value={kyc.l_name} disabled={kycLocked} onChange={(event) => setKyc({ ...kyc, l_name: event.target.value })} sx={fieldSx} />
                        <Button component="label" variant="outlined" disabled={kycLocked} sx={{ minHeight: 56, justifyContent: 'flex-start', textTransform: 'none' }}>อัปโหลดรูปบัตรประชาชน{kycFile ? `: ${kycFile.name}` : ''}<input hidden type="file" accept="image/*" disabled={kycLocked} onChange={(event: ChangeEvent<HTMLInputElement>) => setKycFile(event.target.files?.[0] || null)} /></Button>
                      </Box>
                      <Button variant="contained" startIcon={<SaveRoundedIcon />} onClick={submitKyc} disabled={saving || kycSummary.state === 'pending' || kycLocked} sx={{ alignSelf: 'flex-start', background: theme.colors.gradients.primary }}>{kycLocked ? 'ยืนยันแล้ว' : latestKyc?.status === 'rejected' ? 'ส่งข้อมูล KYC ใหม่' : 'ส่งข้อมูล KYC'}</Button>
                    </Stack>
                  </TabPanel>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
