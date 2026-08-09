import {
  Box,
  Card,
  IconButton,
  Typography,
  styled,
  useTheme
} from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useRouter } from 'next/navigation';

import CouponBoxItems from '@/components/Coupon';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { encrypt } from '@/utils/encryption';
import Image from "next/image";
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);

interface DetailItem {
  icon: string;
  label: string;

  suffix?: string;
  actionLabel: string;
  onClick: () => void;
}
interface Props {
  ParamsId: string;
  overviewDetailById: OverviewDetailListModel;
}
const AddOnsDetails: FC<Props> = ({
  overviewDetailById,
  ParamsId
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const [openAction, setOpenAction] = useState(false);

  const handleActionOpen = () => {
    setOpenAction(true);
  };
  const handleActionClose = () => {
    setOpenAction(false);
  };

  const handleViewCoupon = () => {
    handleActionOpen()
    // TODO: navigate to friend referrals
  };
  const handleRedeemRewards = () => {
    const encryptedId = ParamsId && encrypt(ParamsId.toString());
    router.push(`/profile/market_history/${encryptedId}`)
    // TODO: navigate to rewards
  };
  const handleViewVJStarVideo = () => {
    const encryptedId = ParamsId && encrypt(ParamsId.toString());
    router.push(`/profile/vj_star_video/${encryptedId}`);
  };
  const details: DetailItem[] = useMemo(
    () => [

      {
        icon: "/assets/svg/pg/coupon.svg",
        label: t('อังเปา'),
        actionLabel: t('รับอังเปา'),
        onClick: handleViewCoupon
      },
      {
        icon: '/assets/svg/pg/px_market.svg',
        label: 'ตลาดPX ',
        actionLabel: t('การแลกของรางวัล'),
        onClick: handleRedeemRewards
      },
      {
        icon: '/assets/svg/pg/golden-trophy.svg',
        label: 'VDO โบนัส VJ Star',
        actionLabel: t('ดูภารกิจ'),
        onClick: handleViewVJStarVideo
      }
    ],
    []
  );


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
          p={{
            xs: 1,
            md: 3
          }}
        // display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        >

          <Box alignItems="center" textAlign={"center"}>


            <Typography variant="h4" gutterBottom>
              {t('ส่วนเสริม')}
            </Typography>

          </Box>
          {details.map(({ icon, label, suffix = '', actionLabel, onClick }) => (
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
                  {label}
                </Typography>

              </Box>
              <IconButton
                onClick={onClick}
                sx={{
                  ml: 2,
                  fontSize: '0.9rem',
                  color: '#F1A12A',
                  textDecoration: 'underline',
                  textUnderlineOffset: 2
                }}
              >
                {actionLabel}
              </IconButton>
            </Box>
          ))}


        </Box>
      </CardBorderBottom>


      <CouponBoxItems openAction={openAction} handleActionClose={handleActionClose} />

    </>
  );
}

export default AddOnsDetails;
