import {

  Typography,
  Card,
  Box,
  CardActionArea,
  styled,
  useTheme,
  IconButton,
  Button,
  Collapse,
  Alert,
  Tooltip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useCallback, useMemo } from 'react';
import { ArrowForwardOutlined, MoveToInboxOutlined } from '@mui/icons-material';
import dayjs from 'dayjs';
import CountUp from 'react-countup';

import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import { encrypt } from '@/utils/encryption';
import { MemberDataDetailModel } from '@/model/member';
import { DEFAULT_VALUES } from '@/content/withdrawcoin/constants';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);


interface Props {

  overviewDetailById: OverviewDetailListModel;
  ParamsId: string
  coinData: any
  memberData: MemberDataDetailModel | null;
}
const WalletDetails: FC<Props> = ({
  overviewDetailById,
  ParamsId,
  coinData,
  memberData
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const Wallet = coinData && coinData.find((c: any) => c.organization_id === ParamsId)

  const myWallet = Wallet ? Wallet.wallet.balance : 0;
  // overviewDetailById && overviewDetailById.data && overviewDetailById.data.my_wallet;
  // console.log(myWallet);
  // console.log(Wallet ? Wallet.wallet.balance : 0);

  const memberType = memberData?.data?.member_type === "general_member" || '';

  // ตรวจสอบว่า KYC สำเร็จหรือไม่ (หา KYC ที่ approved และยังไม่หมดอายุ)
  const approvedKyc = useMemo(() => {
    const kycList = memberData?.data?.kyc_verification;
    if (!kycList || kycList.length === 0) {
      return null;
    }

    // หา KYC ที่ status = "approved" และไม่ถูกลบ
    const approvedKycs = kycList.filter(
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
  }, [memberData]);

  const profileVerified = Boolean(approvedKyc);

  const walletBalance = useMemo(() => {
    const balance = memberType
      ? memberData?.data?.member_wallet_non_org[0].wallet.balance || DEFAULT_VALUES.COIN_AMOUNT
      : myWallet || DEFAULT_VALUES.COIN_AMOUNT;

    return parseInt(String(balance), 10);
  }, [overviewDetailById, memberType, memberData]);


  const coinBalance = useMemo(() => {
    if (memberType) {
      // ถ้าเป็น general_member ใช้ member_wallet_non_org
      const balance = memberData?.data?.member_wallet_non_org[0]?.wallet?.balance || DEFAULT_VALUES.COIN_AMOUNT;
      return Number.parseInt(String(balance), 10);
    } else {
      // ถ้าไม่ใช่ general_member ให้ sum coins จาก member_wallet array ทั้งหมด
      const totalCoin = memberData?.data?.member_wallet?.reduce((sum: number, walletItem: any) => {
        const balance = walletItem?.wallet?.balance ?? 0;
        return sum + balance;
      }, 0) ?? DEFAULT_VALUES.COIN_AMOUNT;
      return Number.parseInt(String(totalCoin), 10);
    }
  }, [overviewDetailById, memberType, memberData]);


  const isButtonDisabled = useMemo(() => {
    return !ParamsId || ParamsId === DEFAULT_VALUES.ORGANIZATION_ID;
  }, [ParamsId]);


  const handleWthdrawClick = useCallback(() => {
    if (!profileVerified) {
      router.push('/profile?tab=kyc');
      return;
    }

    // if (memberType ? false : (!ParamsId || ParamsId === DEFAULT_VALUES.ORGANIZATION_ID)) return;

    try {

      const data = memberType ? memberData?.data?.member_type || ParamsId : ParamsId;
      const encryptedId = encrypt(data);
      router.push(`/profile/withdraw_money/from/${encryptedId}`);
    } catch (error) {
      console.error('Error encrypting organization ID:', error);
    }
  }, [ParamsId, memberData, router, memberType, profileVerified]);


  return (
    <>
      <CardBorderBottom
        style={{
          borderBlockColor: `${theme.colors.primary.main}`,

        }}

        sx={{
          // borderBottomColor: `${theme.colors.primary.main}`,

          textAlign: 'center'
        }}
      // onClick={() => {
      //   // router.push(`${GENERAL_DASHBOARD_PATH}/approval/forget`)
      // }} 
      >

        <Box
          p={3}
        // display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        >

          <Box alignItems="left" textAlign={"left"}>


            <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >
              <Typography mr={1} variant="body1" gutterBottom>
                <Image
                  src="/assets/svg/pg/wallte.svg"
                  width={30}
                  height={30}
                  alt="withdraw_money"
                />{' '}

              </Typography>

              <Typography variant="h3" gutterBottom>
                {t('ยอดเงิน')}
              </Typography>



            </Box>

          </Box>

          <Box mt={2} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >

            <Typography
              variant='h3'
              style={{
                background: `${theme.colors.gradients.primary}`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }} >
              <CountUp
                style={{
                  marginLeft: 5
                }}
                start={0}
                end={coinBalance ? coinBalance : 0}
                duration={3}
                separator=","
                delay={0}
                decimals={0}
                decimal=""
                prefix=""
                suffix=" ฿"
              />
            </Typography>
          </Box>

          {!profileVerified && (
            <Collapse in={true}>
              <Alert sx={{ mt: 1, mb: 1 }} severity="warning">
                {t('กรุณายืนยันตัวตน (KYC) ก่อนทำการถอนเงิน')}
              </Alert>
            </Collapse>
          )}

          <Tooltip
            title={
              !profileVerified
                ? t('กรุณายืนยันตัวตน (KYC) ก่อนทำการถอนเงิน')
                // : isButtonDisabled
                // ? t('กรุณาเลือกบริษัทที่ต้องการถอนเงิน')
                : ''
            }
            arrow
            placement="top"
          >
            <span>
              <Button
                className="rounded-[10px]"
                color="inherit"
                variant="contained"
                sx={{
                  // width: '625px',
                  // height: '320px',
                  background: theme.colors.gradients.primary,
                  fontWeight: 'bold',
                  color: '#ffffff',
                  m: 1,
                  width: '100%',
                  '&:hover': {
                    background: theme.colors.gradients.primaryHover,
                  },
                }}
                onClick={handleWthdrawClick}
                size='large'
              >
                {!profileVerified ? t('ไปยืนยัน KYC') : t('ถอนเงิน')}
              </Button>
            </span>
          </Tooltip>
          {/* {isButtonDisabled && !memberType && (
            <Box>
              <Collapse in={true}>
                <Alert sx={{ mt: 1 }} severity="warning">
                  {'กรุณาเลือกบริษัทที่ต้องการถอนเงิน'}
                </Alert>
              </Collapse>
            </Box>
          )} */}
        </Box>
      </CardBorderBottom>
    </>
  );
}

export default WalletDetails;

