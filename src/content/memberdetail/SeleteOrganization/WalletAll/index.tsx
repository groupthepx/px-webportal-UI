import React, { FC, useMemo } from 'react';
import {
  Typography,
  Card,
  Box,
  styled,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import CountUp from 'react-countup';
import dayjs from 'dayjs';
import { KycVerification } from '@/model/member';

const CardBorderBottom = styled(Card)(({ theme }) => `
  border-bottom: 5px solid ${theme.palette.primary.main};
`);

interface DetailItem {
  icon: string;
  label: string;
  value: number;
  suffix?: string;
  actionLabel: string;
  onClick: () => void;
}

interface Props {
  walletBalance: number;
  pxCoin: number;
  friendBonus: number;
  marketPoints: number;
  kycVerifications?: KycVerification[];
}

const WalletDetails: FC<Props> = ({ walletBalance, pxCoin, friendBonus, marketPoints, kycVerifications = [] }) => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  // ตรวจสอบว่า KYC สำเร็จหรือไม่ (หา KYC ที่ approved และยังไม่หมดอายุ)
  const profileVerified = useMemo(() => {
    if (!kycVerifications || kycVerifications.length === 0) {
      return false;
    }

    // หา KYC ที่ status = "approved" และไม่ถูกลบ
    const approvedKycs = kycVerifications.filter(
      (kyc) => kyc.status === 'approved' && !kyc.deleted_at
    );

    if (approvedKycs.length === 0) {
      return false;
    }

    // เช็คว่ายังไม่หมดอายุ
    const validKyc = approvedKycs.find((kyc) => {
      if (!kyc.expire_date) return false;
      const expireDate = dayjs(kyc.expire_date);
      const today = dayjs();
      return expireDate.isAfter(today) || expireDate.isSame(today, 'day');
    });

    return Boolean(validKyc);
  }, [kycVerifications]);

  const handleWithdraw = () => {
    if (!profileVerified) {
      router.push('/profile?tab=kyc');
      return;
    }
    router.push(`/profile/withdraw_money`)
    // TODO: implement withdraw
  };
  const handleConvertCoin = () => {
    router.push(`/profile/withdraw_coin`)
    // TODO: implement coin conversion
  };
  const handleViewFriends = () => {
    // TODO: navigate to friend referrals
    router.push(`/profile/friend_history`)
  };
  const handleRedeemRewards = () => {
    router.push(`/profile/market_history`)
    // TODO: navigate to rewards
  };


  const details: DetailItem[] = useMemo(
    () => [
      {
        icon: '/assets/svg/pg/wallte.svg',
        label: t('ยอดเงิน'),
        value: walletBalance,
        suffix: ' ฿',
        actionLabel: t('ถอน'),
        onClick: handleWithdraw
      },
      {
        icon: '/assets/svg/pg/PX_Coin.svg',
        label: t('ยอด PX Coin'),
        value: pxCoin,
        actionLabel: 'แลก',
        onClick: handleConvertCoin
      },
      // {
      //   icon: '/assets/svg/pg/bonus_friend.svg',
      //   label: t('โบนัสแนะนำเพื่อน'),
      //   value: friendBonus,
      //   actionLabel: t('เพื่อนที่แนะนำ'),
      //   onClick: handleViewFriends
      // },
      {
        icon: '/assets/svg/pg/px_market.svg',
        label: 'ตลาดPX ',
        value: marketPoints,
        actionLabel: t('การแลกของรางวัล'),
        onClick: handleRedeemRewards
      }
    ],
    [walletBalance, pxCoin, marketPoints, t, handleWithdraw, handleConvertCoin, handleRedeemRewards]
  );

  return (
    <Box
      p={{
        xs: 1,
        md: 3
      }}
    // display="flex"
    // alignItems="center"
    // justifyContent="space-between"
    >
      <Typography variant="h4" gutterBottom>
        {t('จำนวนโบนัสที่ใช้ได้')}
      </Typography>

      {!profileVerified && (
        <Alert 
          severity="warning" 
          sx={{ mt: 2, mb: 1, fontSize: '0.75rem' }}
        >
          {t('กรุณายืนยันตัวตน (KYC) ก่อนทำการถอนเงิน')}
        </Alert>
      )}

      {details.map(({ icon, label, value, suffix = '', actionLabel, onClick }) => (
        <Box
          key={label}
          mt={2}
          display="flex"
          alignItems="center"
          justifyContent={'space-between'}
        >
          <Box mt={2}
            display="flex"
            alignItems="center" >
            <Box mr={1}>
              <Image src={icon} width={32} height={32} alt={label} />
            </Box>
            <Typography variant="subtitle1">
              {label} {label != 'ตลาดPX ' ? ':' : ''}
            </Typography>
            {label != 'ตลาดPX ' ?
              <Typography
                variant="h4"
                sx={{
                  ml: 1,
                  background: `${theme.colors.gradients.primary}`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                <CountUp end={value} duration={1.5} separator="," suffix={suffix} />
              </Typography> : ''}

          </Box>
          {actionLabel ? (
            <Tooltip
              title={
                label === t('ยอดเงิน') && !profileVerified
                  ? t('กรุณายืนยันตัวตน (KYC) ก่อนถอนเงิน')
                  : ''
              }
              arrow
              placement="top"
            >
              <span>
                <IconButton
                  onClick={label === t('ยอดเงิน') && !profileVerified ? () => router.push('/profile?tab=kyc') : onClick}
                  sx={{
                    ml: 2,
                    fontSize: '0.9rem',
                    color: '#F1A12A',
                    textDecoration: 'underline',
                    textUnderlineOffset: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#F1A12A',
                    },
                  }}
                >
                  {actionLabel}
                </IconButton>
              </span>
            </Tooltip>
          ) : (
            ''
          )}

        </Box>
      ))}
    </Box>
  );
};

export default WalletDetails;
