import {

  Typography,
  Card,
  Box,
  CardActionArea,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import CountUp from 'react-countup';

import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDetailModel } from '@/model/member';
import { useGetIncomePolicyByOrganizationsByIdQuery } from '@/lib/features/organization';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);

interface Props {
  memberById: MemberDetailModel
  overviewDetailById: OverviewDetailListModel;
}
const BonusDetails: FC<Props> = ({
  overviewDetailById,
  memberById

}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const myCoin = overviewDetailById && overviewDetailById.data && overviewDetailById.data.my_coin_can_use;



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
              {t('รวมจำนวนโบนัสที่ทำได้รอบปัจจุบัน')}
            </Typography>

          </Box>
          <Box mt={{
            xs: 1,
            md: 2
          }} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
            <Typography mr={1} variant="body1" gutterBottom>
              <Image
                src="/assets/svg/pg/star.svg"
                width={0}
                height={0}
                className="w-6 h-6 sm:w-8 sm:h-8" 
                alt="Wallte"
              />{' '}

            </Typography>
            <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
              {/* <Typography  variant="subtitle1" gutterBottom>

                {t('ยอดเงิน')} :
                </Typography> */}
              <Typography
                variant='h4'
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
                  // end={parseInt(`${myCoin}`)}
                  end={parseInt(`${myCoin}`)}
                  duration={3}
                  separator=","
                  delay={0}
                  decimals={0}
                  decimal=""
                  prefix=""
                  suffix=" Coin"
                /></Typography>
              {/* <Typography ml={1} variant="subtitle1" gutterBottom>

                {t('Coin')}
              </Typography> */}

            </Box>
          </Box>



        </Box>
      </CardBorderBottom>
    </>
  );
}

export default BonusDetails;
