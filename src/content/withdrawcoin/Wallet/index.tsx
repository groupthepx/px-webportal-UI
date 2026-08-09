import React, { useMemo, useCallback } from 'react';
import {
  Typography,
  Box,
  useTheme,
  Button,
  Collapse,
  Alert,
  Skeleton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import CountUp from 'react-countup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { CardBorderBottom } from '../styles';
import { WalletDetailsProps } from '../types';
import {
  ASSETS,
  COUNTUP_DURATION,
  DEFAULT_VALUES,
  MESSAGES,
  BUTTON_LABELS,
  WALLET_LABELS,
} from '../constants';
import { encrypt } from '@/utils/encryption';

/**
 * WalletDetails Component
 * แสดงข้อมูล PX Coin balance และปุ่มสำหรับแลกเป็นเงิน
 * ใช้ React.memo เพื่อป้องกัน unnecessary re-renders
 */
const WalletDetails: React.FC<WalletDetailsProps> = React.memo(({
  overviewDetailById,
  organizationId,
  isLoading = false,
  memberData,
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();



  const memberType = memberData?.data?.member_type === "general_member" || '';

  const balance = memberType
  ? memberData?.data?.member_wallet_non_org[0].wallet.coin || DEFAULT_VALUES.COIN_AMOUNT
  : overviewDetailById?.data?.my_wallet?.wallet?.coin || DEFAULT_VALUES.COIN_AMOUNT;

  // คำนวณ coin balance โดยใช้ useMemo เพื่อ cache ผลลัพธ์
  const coinBalance = balance ;
  
  // = useMemo(() => {
  //   if (memberType) {
  //     // ถ้าเป็น general_member ใช้ member_wallet_non_org
  //     const balance = memberData?.data?.member_wallet_non_org[0]?.wallet?.coin || DEFAULT_VALUES.COIN_AMOUNT;
  //     return Number.parseInt(String(balance), 10);
  //   } else {
  //     // ถ้าไม่ใช่ general_member ให้ sum coins จาก member_wallet array ทั้งหมด
  //     const totalCoin = memberData?.data?.member_wallet?.reduce((sum: number, walletItem: any) => {
  //       const coin = walletItem?.wallet?.coin ?? 0;
  //       return sum + coin;
  //     }, 0) ?? DEFAULT_VALUES.COIN_AMOUNT;
  //     return Number.parseInt(String(totalCoin), 10);
  //   }
  // }, [overviewDetailById, memberType, memberData]);

  // ตรวจสอบว่าปุ่มควร disabled หรือไม่
  const isButtonDisabled = useMemo(() => {
    return !organizationId || organizationId === DEFAULT_VALUES.ORGANIZATION_ID;
  }, [organizationId]);

  // จัดการการคลิกปุ่มแลกเป็นเงิน
  const handleExchangeClick = useCallback(() => {
    // if (memberType ? false : (!organizationId || organizationId === DEFAULT_VALUES.ORGANIZATION_ID )) return;
    
    try {


      const data = memberType ? memberData?.data?.member_type || organizationId : organizationId;
      const encryptedId = encrypt(data);
      router.push(`/profile/exchange_coin/${encryptedId}`);
    } catch (error) {
      console.error('Error encrypting organization ID:', error);
    }
  }, [organizationId, memberData, router, memberType]);

  // แสดง loading skeleton
  if (isLoading) {
    return (
      <CardBorderBottom
        sx={{
          textAlign: 'center',
          borderBlockColor: theme.colors.primary.main,
        }}
      >
        <Box p={3}>
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="text" width="80%" height={60} sx={{ mt: 2 }} />
          <Skeleton variant="rectangular" width="100%" height={48} sx={{ mt: 2, borderRadius: 2.5 }} />
        </Box>
      </CardBorderBottom>
    );
  }

  return (
    <CardBorderBottom
      sx={{
        textAlign: 'center',
        borderBlockColor: theme.colors.primary.main,
      }}
    >
      <Box p={3}>
        {/* Header พร้อม Icon */}
        <Box alignItems="left" textAlign="left">
          <Box 
            display="flex" 
            sx={{ 
              justifyContent: 'left', 
              alignItems: 'center' 
            }}
          >
            <Typography mr={1} variant="body1" gutterBottom>
              <Image
                src={ASSETS.PX_COIN_ICON}
                width={30}
                height={30}
                alt="PX Coin"
                loading="lazy"
              />
            </Typography>
            <Typography variant="h3" gutterBottom>
              {t(WALLET_LABELS.PX_COIN_BALANCE)}
            </Typography>
          </Box>
        </Box>

        {/* แสดงยอด Coin พร้อม CountUp animation */}
        <Box 
          mt={2} 
          display="flex" 
          sx={{ 
            justifyContent: 'center', 
            alignItems: 'center' 
          }}
        >
          <Typography
            variant="h3"
            style={{
              background: theme.colors.gradients.primary,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            <CountUp
              start={0}
              end={coinBalance ? coinBalance : 0}
              duration={COUNTUP_DURATION}
              separator=","
              delay={0}
              decimals={0}
            />
          </Typography>
        </Box>

        {/* ปุ่มแลกเป็นเงิน */}
        <Button
          className="rounded-[10px]"
          color="inherit"
          disabled={memberType ? false : isButtonDisabled}
          variant="contained"
          sx={{
            background: theme.colors.gradients.primary,
            fontWeight: 'bold',
            color: '#ffffff',
            m: 1,
            '&:hover': {
              background: theme.colors.gradients.primaryHover,
            },
            '&:disabled': {
              opacity: 0.6,
            },
          }}
          onClick={handleExchangeClick}
          size="large"
          aria-label={t(BUTTON_LABELS.EXCHANGE_MONEY)}
        >
          {t(BUTTON_LABELS.EXCHANGE_MONEY)}
        </Button>

        {/* แสดง Warning เมื่อยังไม่ได้เลือกบริษัท */}
        {isButtonDisabled && !memberType && (
          <Box>
            <Collapse in={true}>
              <Alert sx={{ mt: 1 }} severity="warning">
                {MESSAGES.SELECT_COMPANY_WARNING}
              </Alert>
            </Collapse>
          </Box>
        )}
      </Box>
    </CardBorderBottom>
  );
});

// ตั้งชื่อ display name สำหรับ debugging
WalletDetails.displayName = 'WalletDetails';

export default WalletDetails;
