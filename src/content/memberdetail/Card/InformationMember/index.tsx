/**
 * Information Member Component (Refactored)
 * 
 * ปรับปรุง Performance:
 * - ใช้ custom hook สำหรับ region data
 * - ลด inline styles
 * - แยก logic ออกจาก component
 * - เพิ่ม memoization
 */

import {
  Typography,
  CardContent,
  Box,
  Avatar,
  Button,
  Link,
  Stack,
  Chip,
  alpha,
  Paper,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  Beenhere,
  EditCalendar,
  EditOutlined,
  Email,
  InsertPhotoOutlined,
  LocalPhone,
  Person,
  PersonPinCircleOutlined,
  Place,
  CheckCircle,
  Pending,
  AccessTime,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { FC, memo, useState, useCallback, useEffect, useMemo } from 'react';
import { MemberDetailModel } from '@/model/member';
import Image from 'next/image';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import Label from '@/components/Label';
import ImagePreview from '@/components/ImagePreview';
import ProfileCard from '@/components/ProfileCard';
import { AvatarWrapperProfile } from '../shared/StyledComponents';
import { useRegionData } from '../shared/hooks';
import { enqueueSnackbar } from 'notistack';
import ProfileKycDialog from './components/ProfileKycDialog';
import { useVerifyProfileKycMutation, useGetPendingKycVerificationsQuery } from '@/lib/features/profile';
import { extractApiError } from '@/utils/extractApiError';


interface ResultsProps {
  member: MemberDetailModel | null;
  status?: boolean;
  setOpenActionEdit: (open: boolean) => void;
  border_img?: string;
}

const InformationMember: FC<ResultsProps> = memo(
  ({ member, status, setOpenActionEdit, border_img }) => {
    const { t }: { t: any } = useTranslation();

    const profileImageUrl = member?.profile
      ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${member.profile}`
      : '';

    // หา KYC ที่ approved และยังไม่หมดอายุ
    const approvedKyc = useMemo(() => {
      if (!member?.kyc_verification || member.kyc_verification.length === 0) {
        return null;
      }

      // หา KYC ที่ status = "approved"
      const approvedKycs = member.kyc_verification.filter(
        (kyc) => kyc.status === 'approved' && !kyc.deleted_at
      );

      if (approvedKycs.length === 0) {
        return null;
      }

      // เช็คว่ายังไม่หมดอายุ
      const validKyc = approvedKycs.find((kyc) => {
        if (!kyc.expire_date) return false;
        const expireDate = dayjs(kyc.expire_date);
        const today = dayjs();
        return expireDate.isAfter(today) || expireDate.isSame(today, 'day');
      });

      return validKyc || null;
    }, [member?.kyc_verification]);

    // หา KYC ที่หมดอายุแล้ว (approved แต่ expire_date < today)
    const expiredKyc = useMemo(() => {
      if (!member?.kyc_verification || member.kyc_verification.length === 0) {
        return null;
      }

      // หา KYC ที่ status = "approved" และหมดอายุแล้ว
      const approvedKycs = member.kyc_verification.filter(
        (kyc) => kyc.status === 'approved' && !kyc.deleted_at
      );

      if (approvedKycs.length === 0) {
        return null;
      }

      // หา KYC ที่หมดอายุแล้ว (เรียงจากหมดอายุล่าสุด)
      const expiredKycs = approvedKycs
        .filter((kyc) => {
          if (!kyc.expire_date) return false;
          const expireDate = dayjs(kyc.expire_date);
          const today = dayjs();
          return expireDate.isBefore(today);
        })
        .sort((a, b) => dayjs(b.expire_date).valueOf() - dayjs(a.expire_date).valueOf());

      return expiredKycs[0] || null;
    }, [member?.kyc_verification]);

    const isKycExpired = Boolean(expiredKyc && !approvedKyc);

    const cardImageUrl = approvedKyc?.card_with_profile_img
      ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${approvedKyc.card_with_profile_img}`
      : member?.card_with_profile_img
      ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${member.card_with_profile_img}`
      : '';

    const profileVerified = Boolean(approvedKyc);

    const [imagePreview, setImagePreview] = useState<string>('');
    const [openImagePreview, setOpenImagePreview] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [cardNumberInput, setCardNumberInput] = useState(approvedKyc?.card_number ?? member?.card_number ?? '');
    const [firstName, setFirstName] = useState(approvedKyc?.f_name ?? '');
    const [lastName, setLastName] = useState(approvedKyc?.l_name ?? '');
    const [issuedDate, setIssuedDate] = useState('');
    const [expiresDate, setExpiresDate] = useState(
      approvedKyc?.expire_date ? dayjs(approvedKyc.expire_date).format('DD/MM/YYYY') : ''
    );
    const [cardFile, setCardFile] = useState<File | null>(null);
    const [verifyProfile, { isLoading: isSubmitting }] = useVerifyProfileKycMutation();
    const [filePreviewUrl, setFilePreviewUrl] = useState(cardImageUrl);

    // ตรวจสอบ pending KYC verification
    const { data: pendingKycData, isLoading: isLoadingPendingKyc } = useGetPendingKycVerificationsQuery(
      { memberId: member?.member_id || '' },
      { skip: !member?.member_id || profileVerified } // ข้ามถ้าไม่มี member_id หรือยืนยันแล้ว
    );


    const pendingKyc = pendingKycData?.data?.[0] || null;
    const hasPendingKyc = Boolean(pendingKyc && !profileVerified);
    const rejectedKyc = useMemo(
      () => member?.kyc_verification?.find((kyc) => kyc.status === 'rejected' && !kyc.deleted_at) || null,
      [member?.kyc_verification]
    );

    // Fetch region data using custom hook
    const { provinceName, subDistrictName, villageDataName } = useRegionData(
      member?.province,
      member?.subdistrict,
      member?.zip_code
    );

    // Image preview handlers
    const handleOpen = useCallback((url: string) => {
      setImagePreview(url);
      setOpenImagePreview(true);
    }, []);

    const handleClose = useCallback(() => {
      setOpenImagePreview(false);
    }, []);

    const handleOpenDialog = useCallback(() => {
      setDialogOpen(true);

      // ถ้ามี approved KYC ให้แสดงข้อมูลจาก approved
      if (approvedKyc) {
        setCardNumberInput(approvedKyc.card_number);
        setFirstName(approvedKyc.f_name);
        setLastName(approvedKyc.l_name);
        setExpiresDate(approvedKyc.expire_date ? dayjs(approvedKyc.expire_date).format('DD/MM/YYYY') : '');
        const approvedCardUrl = approvedKyc.card_with_profile_img
          ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${approvedKyc.card_with_profile_img}`
          : cardImageUrl;
        setFilePreviewUrl(approvedCardUrl);
        setCardFile(null);
        setIssuedDate('');
      } else if (pendingKyc) {
        // ถ้ามี pending KYC ให้แสดงข้อมูลจาก pending
        setCardNumberInput(pendingKyc.card_number || (member?.card_number ?? ''));
        setFirstName(pendingKyc.f_name || '');
        setLastName(pendingKyc.l_name || '');
        setExpiresDate(pendingKyc.expire_date ? dayjs(pendingKyc.expire_date).format('DD/MM/YYYY') : '');
        const pendingCardUrl = pendingKyc.card_with_profile_img
          ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${pendingKyc.card_with_profile_img}`
          : cardImageUrl;
        setFilePreviewUrl(pendingCardUrl);
        setCardFile(null);
        setIssuedDate('');
      } else if (rejectedKyc) {
        setCardNumberInput(rejectedKyc.card_number || (member?.card_number ?? ''));
        setFirstName((rejectedKyc as any).f_name || '');
        setLastName((rejectedKyc as any).l_name || '');
        setExpiresDate((rejectedKyc as any).expire_date ? dayjs((rejectedKyc as any).expire_date).format('DD/MM/YYYY') : '');
        const rejectedCardUrl = rejectedKyc.card_with_profile_img
          ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${rejectedKyc.card_with_profile_img}`
          : cardImageUrl;
        setFilePreviewUrl(rejectedCardUrl);
        setCardFile(null);
        setIssuedDate('');
      } else {
        setCardNumberInput(member?.card_number ?? '');
        setFirstName('');
        setLastName('');
        setIssuedDate('');
        setExpiresDate('');
        setCardFile(null);
        setFilePreviewUrl(cardImageUrl);
      }
    }, [member, cardImageUrl, pendingKyc, rejectedKyc, approvedKyc]);

    const handleCloseDialog = useCallback(() => {
      setDialogOpen(false);
    }, []);

    const handleFileChange = useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setCardFile(file ?? null);
        if (file) {
          setFilePreviewUrl(URL.createObjectURL(file));
        } else {
          setFilePreviewUrl(cardImageUrl);
        }
      },
      [cardImageUrl]
    );

    const handleSubmitVerify = async () => {
      if (!member?.member_id) {
        enqueueSnackbar(t('ไม่สามารถยืนยันได้ในขณะนี้'), { variant: 'warning' });
        return;
      }

      if (!cardFile) {
        enqueueSnackbar(t('กรุณาอัปโหลดรูปบัตรก่อนยืนยัน'), { variant: 'warning' });
        return;
      }

      if (!cardNumberInput || !firstName || !lastName || !expiresDate) {
        enqueueSnackbar(t('กรุณากรอกข้อมูลให้ครบถ้วน'), { variant: 'warning' });
        return;
      }

      const formData = new FormData();
      
      formData.append('member_id', member.member_id);
      formData.append('card_number', cardNumberInput);
      formData.append('card_with_profile_img', cardFile);
      formData.append('f_name', firstName);
      formData.append('l_name', lastName);
      formData.append('expire_date', expiresDate);

      try {
        const payload = await verifyProfile(formData).unwrap();
        enqueueSnackbar(payload.message || t('ส่งคำขอยืนยันเรียบร้อยแล้ว'), {
          variant: 'success',
        });
        setDialogOpen(false);
      } catch (error: any) {
        enqueueSnackbar(extractApiError(error, t('ไม่สามารถยืนยันได้ขณะนี้ กรุณาลองใหม่อีกครั้ง')), { variant: 'error' });
      }

    };

    useEffect(() => {
      if (approvedKyc) {
        setCardNumberInput(approvedKyc.card_number);
        setFirstName(approvedKyc.f_name);
        setLastName(approvedKyc.l_name);
        setExpiresDate(approvedKyc.expire_date ? dayjs(approvedKyc.expire_date).format('DD/MM/YYYY') : '');
      } else {
        setCardNumberInput(member?.card_number ?? '');
      }
    }, [member, approvedKyc]);

    useEffect(() => {
      if (!cardFile) {
        setFilePreviewUrl(cardImageUrl);
      }
      }, [cardImageUrl, cardFile]);

    return (
      <>
        <Box>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box pl={3} pt={2}>
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}
              >
                {t('ข้อมูลทั่วไป')}
              </Typography>
            </Box>

            {!status && (
              <Box pr={3} pt={2}>
                <Button
                  onClick={() => setOpenActionEdit(true)}
                  color="secondary"
                  startIcon={<EditOutlined />}
                >
                  แก้ไข
                </Button>
              </Box>
            )}
          </Box>

          {/* Content */}
          <CardContent>
            <Grid direction="row" container spacing={3}>
              {/* Profile Section */}
              <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Box
                  px={5}
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                  }}
                >
                  {border_img ? (
                    <ProfileCard
                      iconsCard={border_img}
                      name={member?.secu_name ?? 'N/A'}
                      imageSrc={profileImageUrl}
                      width={120}
                      height={120}
                    />
                  ) : (
                    <AvatarWrapperProfile sx={{ mt: 3 }}>
                      <Avatar sx={{ mx: 'auto' }} src={profileImageUrl}>
                        <InsertPhotoOutlined />
                      </Avatar>
                    </AvatarWrapperProfile>
                  )}

                  <Typography
                    sx={{ fontWeight: 'bold', mt: 2 }}
                    variant="h4"
                    gutterBottom
                  >
                    {member?.secu_name}
                  </Typography>

                  <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
                    User PX: {member?.user_px ?? 'N/A'}
                  </Typography>

                  {/* <Typography sx={{ fontWeight: 'bold' }} variant="subtitle1" gutterBottom>
                    รหัสผู้แนะนำ: {member?.refer_id ?? 'N/A'}
                  </Typography> */}
                </Box>
              </Grid>

              {/* Details Section */}
              <Grid size={{ xs: 12, sm: 12, md: 8 }}>
                <Grid direction="row" container spacing={status ? 0 : 3}>
                  {/* Left Column */}
                  <Grid size={{ xs: 12, sm: status ? 12 : 6, md: status ? 12 : 6 }}>
                    <Typography mb={2} variant="body1" gutterBottom>
                      <Person sx={{ mr: 1 }} color="primary" />
                      {t('ชื่อเตัม')}: {member?.full_name ?? 'N/A'}
                    </Typography>

                    <Typography mb={2} variant="body1" gutterBottom>
                      <Email sx={{ mr: 1 }} color="primary" />
                      {t('อีเมว')}: {member?.email ?? 'N/A'}
                    </Typography>

                    <Typography mb={2} variant="body1" gutterBottom>
                      <LocalPhone sx={{ mr: 1 }} color="primary" />
                      {t('โทร')}: {member?.phone ?? 'N/A'}
                    </Typography>

                    <Typography mb={2} variant="body1" gutterBottom>
                      <PersonPinCircleOutlined sx={{ mr: 1 }} color="primary" />
                      {t('สถานะ')}:
                      {member?.is_active ? (
                        <b style={{ marginLeft: '10px' }}>
                          <Label color="success">ใช้งาน</Label>
                        </b>
                      ) : (
                        <b style={{ marginLeft: '10px' }}>
                          <Label color="error">แบน</Label>
                        </b>
                      )}
                    </Typography>
                   
                    <Typography mb={2} variant="body1" gutterBottom>
                      <EditCalendar sx={{ mr: 1 }} color="primary" />
                      {t('วันเกิด')}:{' '}
                      {member?.dob ? format(new Date(member.dob), 'dd/MM/yyyy') : 'N/A'}
                    </Typography>

                  
                  </Grid>

                  {/* Right Column */}
                  <Grid size={{ xs: 12, sm: status ? 12 : 6, md: status ? 12 : 6 }}>
                    <Typography mb={2} variant="body1" gutterBottom>
                      <Place sx={{ mr: 1 }} color="primary" />
                      {t('ที่อยู่')}: {provinceName}, {subDistrictName}, {villageDataName}
                    </Typography>
                    <Box display="flex" sx={{ justifyContent: 'left', alignItems: 'center' }}>
                      <Typography mr={1} mb={2} variant="body1" gutterBottom>
                        <Image
                          src="/assets/svg/LINE_logo_primary.svg"
                          width={25}
                          height={25}
                          alt="LINE Logo"
                        />
                      </Typography>
                      <Typography mb={2} variant="body1" gutterBottom>
                        {t('ไอดีลาย')}: {member?.line ?? '@N/A'}
                      </Typography>
                    </Box>
                

                    {/* KYC Verification Section */}
                    <Paper
                      elevation={0}
                      sx={{
                   
                        p: 1.75,
                        borderRadius: 2,
                        border: `1px solid ${alpha('#000', 0.08)}`,
                        backgroundColor: (theme) =>
                          profileVerified
                            ? alpha(theme.palette.success.main, 0.04)
                            : hasPendingKyc
                              ? alpha(theme.palette.warning.main, 0.04)
                              : alpha(theme.palette.primary.main, 0.02),
                        width: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: (theme) => theme.shadows[2],
                        },
                      }}
                    >
                      <Stack spacing={1.5}>
                        {/* Section Header */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Beenhere sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: 600,
                              color: 'text.primary',
                              fontSize: '0.8125rem',
                            }}
                          >
                            {t('ข้อมูลยืนยันตัวตน (KYC)')}
                          </Typography>
                        </Stack>

                        <Divider sx={{ borderColor: alpha('#000', 0.1) }} />

                        {/* Status Section */}
                        <Stack spacing={1.5} display="flex" justifyContent="center" alignItems="center">

                          {profileVerified ? (
                            <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                              {/* Status Chip */}
                              <Chip
                                icon={<CheckCircle sx={{ fontSize: 16 }} />}
                                label={t('โปรไฟล์ยืนยันแล้ว')}
                                color="success"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  height: 28,
                                  '& .MuiChip-icon': {
                                    fontSize: 16,
                                  },
                                }}
                              />
                              
                              {/* วันที่อนุมัติ */}
                              {approvedKyc?.reviewed_at && (
                                <Box
                                  sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    backgroundColor: (theme) => alpha(theme.palette.success.main, 0.08),
                                    border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.15)}`,
                                  }}
                                >
                                  <Stack direction="row" alignItems="center" spacing={0.75}>
                                    <AccessTime sx={{ fontSize: 14, color: 'success.main' }} />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'success.main',
                                        fontSize: '0.7rem',
                                        fontWeight: 500,
                                      }}
                                    >
                                      {t('อนุมัติเมื่อ')}: {dayjs(approvedKyc.reviewed_at).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          ) : hasPendingKyc ? (
                            <Stack spacing={1.5} display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%' }}>
                              <Chip
                                icon={<Pending sx={{ fontSize: 16 }} />}
                                label={t('กำลังตรวจสอบ')}
                                color="warning"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  width: 'fit-content',
                                  fontSize: '0.75rem',
                                  height: 28,
                                  '& .MuiChip-icon': {
                                    fontSize: 16,
                                  },
                                }}
                              />
                              {pendingKyc?.created_at && (
                                <Box
                                  sx={{
                                    px: 1.25,
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    backgroundColor: (theme) =>
                                      alpha(theme.palette.warning.main, 0.1),
                                    border: `1px solid ${alpha('#000', 0.08)}`,
                                    width: 'fit-content',
                                  }}
                                >
                                  <Stack direction="row" alignItems="center" spacing={0.75}>
                                    <AccessTime
                                      sx={{
                                        fontSize: 14,
                                        color: 'warning.main',
                                      }}
                                    />
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'warning.main',
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                      }}
                                    >
                                      {t('ส่งเมื่อ')}:{' '}
                                      {dayjs(pendingKyc.created_at).format('DD/MM/YYYY HH:mm')}
                                    </Typography>
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          ) : isKycExpired ? (
                            // แสดงสถานะหมดอายุ
                            <Stack spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                              <Chip
                                icon={<AccessTime sx={{ fontSize: 16 }} />}
                                label={t('การยืนยันหมดอายุ')}
                                color="error"
                                size="small"
                                sx={{
                                  fontWeight: 600,
                                  fontSize: '0.75rem',
                                  height: 28,
                                  '& .MuiChip-icon': {
                                    fontSize: 16,
                                  },
                                }}
                              />
                              {expiredKyc && (
                                <Box
                                  sx={{
                                    px: 1.5,
                                    py: 0.75,
                                    borderRadius: 1.5,
                                    backgroundColor: (theme) => alpha(theme.palette.error.main, 0.08),
                                    border: (theme) => `1px solid ${alpha(theme.palette.error.main, 0.15)}`,
                                  }}
                                >
                                  <Stack spacing={0.5}>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                      <Person sx={{ fontSize: 14, color: 'error.main' }} />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'error.main',
                                          fontSize: '0.7rem',
                                          fontWeight: 600,
                                        }}
                                      >
                                        {expiredKyc.f_name} {expiredKyc.l_name}
                                      </Typography>
                                    </Stack>
                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                      <AccessTime sx={{ fontSize: 14, color: 'error.main' }} />
                                      <Typography
                                        variant="caption"
                                        sx={{
                                          color: 'error.main',
                                          fontSize: '0.65rem',
                                        }}
                                      >
                                        {t('หมดอายุเมื่อ')}: {dayjs(expiredKyc.expire_date).format('DD/MM/YYYY')}
                                      </Typography>
                                    </Stack>
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          ) : (
                            <Chip
                              icon={<Pending sx={{ fontSize: 16 }} />}
                              label={t('โปรไฟล์ยังไม่ยืนยัน')}
                              color="warning"
                              variant="outlined"
                              size="small"
                              sx={{
                                fontWeight: 600,
                                width: 'fit-content',
                                fontSize: '0.75rem',
                                height: 28,
                                '& .MuiChip-icon': {
                                  fontSize: 16,
                                },
                              }}
                            />
                          )}

                          {/* Action Button */}
                          <Box>
                            <Button
                              size="small"
                              variant={
                                hasPendingKyc ? 'outlined' : profileVerified ? 'outlined' : isKycExpired ? 'contained' : 'contained'
                              }
                              color={
                                hasPendingKyc ? 'warning' : profileVerified ? 'success' : isKycExpired ? 'error' : 'primary'
                              }
                              disabled={isLoadingPendingKyc}
                              sx={{
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 2.5,
                                py: 0.75,
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                boxShadow: !hasPendingKyc && !profileVerified ? 1 : 0,
                                '&:hover': {
                                  boxShadow: !hasPendingKyc && !profileVerified ? 2 : 0,
                                },
                              }}
                              onClick={handleOpenDialog}
                            >
                              {profileVerified
                                ? t('ดูหลักฐาน')
                                : hasPendingKyc
                                  ? t('ดูสถานะการตรวจสอบ')
                                  : isKycExpired
                                    ? t('ส่งคำขอใหม่')
                                    : t('ส่งคำขอยืนยัน')}
                            </Button>
                          </Box>
                        </Stack>


                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Box>

        {/* Image Preview Dialog */}
        <ImagePreview
          open={openImagePreview}
          handleClose={handleClose}
          imagePreviews={imagePreview}
        />

        <ProfileKycDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitVerify}
          cardImageSrc={
            filePreviewUrl ||
            (pendingKyc?.card_with_profile_img
              ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${pendingKyc.card_with_profile_img}`
              : cardImageUrl)
          }
          cardFile={cardFile}
          cardNumber={cardNumberInput}
          firstName={firstName}
          lastName={lastName}
          issuedDate={issuedDate}
          expiresDate={expiresDate}
          onCardNumberChange={(value) => setCardNumberInput(value)}
          onFirstNameChange={(value) => setFirstName(value)}
          onLastNameChange={(value) => setLastName(value)}
          onIssuedDateChange={(value) => setIssuedDate(value)}
          onExpiresDateChange={(value) => setExpiresDate(value)}
          onFileChange={handleFileChange}
          profileVerified={profileVerified}
          isSubmitting={isSubmitting}
          handleImagePreview={(url) => handleOpen(url)}
          hasPendingKyc={hasPendingKyc}
          pendingKycData={pendingKyc}
          rejectedKycData={rejectedKyc}
          isKycExpired={isKycExpired}
          expiredKycData={expiredKyc}
          t={t}
        />
      </>
    );
  }
);

InformationMember.displayName = 'InformationMember';

export default InformationMember;
