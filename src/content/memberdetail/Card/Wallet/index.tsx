import {
  Typography,
  Card,
  Box,
  styled,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
  Skeleton,
  alpha,
  Stack,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useMemo, useCallback } from 'react';
import { Warning as WarningIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material';
import CountUp from 'react-countup';
import dayjs from 'dayjs';

import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import { encrypt } from '@/utils/encryption';
import { useGetProfileByIdQuery, useGetMemberByIdQuery } from '@/lib/features/profile';

const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);

interface DetailItem {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  actionLabel: string;
  onClick: () => void;
}

interface Props {
  ParamsId: string;
  overviewDetailById: OverviewDetailListModel;
}

const WalletAllDetails: FC<Props> = ({
  overviewDetailById,
  ParamsId,
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  // ดึงข้อมูล Profile เพื่อเอา member_id
  const { data: profileData } = useGetProfileByIdQuery();
  const memberId = profileData?.data?.member_id || null;

  // ดึงข้อมูล Member เพื่อเอา kyc_verification
  const { data: memberData, isLoading: isLoadingMember } = useGetMemberByIdQuery(
    { id: memberId },
    { skip: !memberId }
  );

  const myWallet = overviewDetailById?.data?.my_wallet?.wallet;
  const kycVerifications = memberData?.data?.kyc_verification || [];

  // ตรวจสอบว่า KYC สำเร็จหรือไม่ (หา KYC ที่ approved และยังไม่หมดอายุ)
  const approvedKyc = useMemo(() => {
    if (!kycVerifications || kycVerifications.length === 0) {
      return null;
    }

    // หา KYC ที่ status = "approved" และไม่ถูกลบ
    const approvedKycs = kycVerifications.filter(
      (kyc: any) => kyc.status === 'approved' && !kyc.deleted_at
    );

    if (approvedKycs.length === 0) {
      return null;
    }

    // เช็คว่ายังไม่หมดอายุ
    const validKyc = approvedKycs.find((kyc: any) => {
      if (!kyc.expire_date) return false;
      const expireDate = dayjs(kyc.expire_date);
      const today = dayjs();
      return expireDate.isAfter(today) || expireDate.isSame(today, 'day');
    });

    return validKyc || null;
  }, [kycVerifications]);

  // หา KYC ที่หมดอายุแล้ว
  const expiredKyc = useMemo(() => {
    if (!kycVerifications || kycVerifications.length === 0) {
      return null;
    }

    const approvedKycs = kycVerifications.filter(
      (kyc: any) => kyc.status === 'approved' && !kyc.deleted_at
    );

    if (approvedKycs.length === 0) {
      return null;
    }

    // หา KYC ที่หมดอายุแล้ว (เรียงจากหมดอายุล่าสุด)
    const expiredKycs = approvedKycs
      .filter((kyc: any) => {
        if (!kyc.expire_date) return false;
        const expireDate = dayjs(kyc.expire_date);
        const today = dayjs();
        return expireDate.isBefore(today);
      })
      .sort((a: any, b: any) => dayjs(b.expire_date).valueOf() - dayjs(a.expire_date).valueOf());

    return expiredKycs[0] || null;
  }, [kycVerifications]);

  const profileVerified = Boolean(approvedKyc);
  const isKycExpired = Boolean(expiredKyc && !approvedKyc);

  const handleWithdraw = useCallback(() => {
    if (!profileVerified) {
      router.push('/profile?tab=kyc');
      return;
    }
    const encryptedId = ParamsId && encrypt(ParamsId.toString());
    router.push(`/profile/withdraw_money/${encryptedId}`)
  }, [profileVerified, ParamsId, router]);

  const handleConvertCoin = useCallback(() => {
    const encryptedId = ParamsId && encrypt(ParamsId.toString());
    router.push(`/profile/withdraw_coin/${encryptedId}`)
  }, [ParamsId, router]);

  const details: DetailItem[] = useMemo(
    () => [
      {
        icon: '/assets/svg/pg/wallte.svg',
        label: t('ยอดเงิน'),
        value: myWallet?.balance || 0,
        suffix: ' ฿',
        actionLabel: t('ถอน'),
        onClick: handleWithdraw
      },
      {
        icon: '/assets/svg/pg/PX_Coin.svg',
        label: t('ยอด PX Coin'),
        value: myWallet?.coin || 0,
        actionLabel: t('แลกเป็นเงิน'),
        onClick: handleConvertCoin
      }
    ],
    [myWallet, t, handleWithdraw, handleConvertCoin]
  );

  // Loading state
  if (isLoadingMember) {
    return (
      <CardBorderBottom
        style={{ borderBlockColor: theme.colors.primary.main }}
        sx={{ textAlign: 'center' }}
      >
        <Box p={{ xs: 1, md: 3 }}>
          <Skeleton variant="text" width="60%" height={32} sx={{ mx: 'auto' }} />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 1 }} />
          <Skeleton variant="rectangular" height={60} sx={{ mt: 2, borderRadius: 1 }} />
        </Box>
      </CardBorderBottom>
    );
  }

  return (
    <>
      <CardBorderBottom
        style={{ borderBlockColor: theme.colors.primary.main }}
        sx={{ textAlign: 'center' }}
      >
        <Box p={{ xs: 1, md: 3 }}>
          <Box alignItems="center" textAlign="center">
            <Typography variant="h4" gutterBottom>
              {t('จำนวนโบนัสที่ใช้ได้')}
            </Typography>
          </Box>

          {/* แสดง Alert ตามสถานะ KYC */}
          {isKycExpired && expiredKyc ? (
            <Alert 
              severity="error" 
              icon={<WarningIcon />}
              sx={{ 
                mt: 2, 
                mb: 1, 
                borderRadius: 2,
                backgroundColor: alpha(theme.palette.error.main, 0.1),
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="body2" fontWeight={600} color="error.main">
                  {t('การยืนยันตัวตนหมดอายุแล้ว')}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                  <Typography variant="caption" color="error.dark">
                    {t('หมดอายุเมื่อ')}: {dayjs(expiredKyc.expire_date).format('DD/MM/YYYY')}
                  </Typography>
                </Stack>
                <Typography variant="caption" color="error.main" fontWeight={500}>
                  {t('กรุณาส่งคำขอยืนยันตัวตนใหม่ก่อนทำการถอนเงิน')}
                </Typography>
              </Stack>
            </Alert>
          ) : !profileVerified ? (
            <Alert 
              severity="warning" 
              sx={{ 
                mt: 2, 
                mb: 1, 
                borderRadius: 2,
                fontSize: '0.75rem',
              }}
            >
              {t('กรุณายืนยันตัวตน (KYC) ก่อนทำการถอนเงิน')}
            </Alert>
          ) : <></>}

          {details.map(({ icon, label, value, suffix = '', actionLabel, onClick }) => {
            const isWithdrawButton = label === t('ยอดเงิน');
            const isDisabled = isWithdrawButton && !profileVerified;

            return (
              <Box
                key={label}
                mt={2}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box mt={2} display="flex" alignItems="center">
                  <Box mr={1}>
                    <Image src={icon} width={32} height={32} alt={label} />
                  </Box>
                  <Typography variant="subtitle1">
                    {label}:
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      ml: 1,
                      background: theme.colors.gradients.primary,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    <CountUp end={value} duration={1.5} separator="," suffix={suffix} />
                  </Typography>
                </Box>
                <Tooltip
                  title={
                    isDisabled 
                      ? isKycExpired 
                        ? t('การยืนยันตัวตนหมดอายุ กรุณาส่งคำขอใหม่')
                        : t('กรุณายืนยันตัวตน (KYC) ก่อนถอนเงิน')
                      : ''
                  }
                  arrow
                  placement="top"
                >
                  <span>
                    <IconButton
                      onClick={isDisabled ? () => router.push('/profile?tab=kyc') : onClick}
                      sx={{
                        ml: 2,
                        fontSize: '0.9rem',
                        color: '#F1A12A',
                        textDecoration: 'underline',
                        textUnderlineOffset: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          color: '#E09420',
                          backgroundColor: alpha('#F1A12A', 0.1),
                        },
                      }}
                    >
                      {actionLabel}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            );
          })}
        </Box>
      </CardBorderBottom>
    </>
  );
}

export default WalletAllDetails;
