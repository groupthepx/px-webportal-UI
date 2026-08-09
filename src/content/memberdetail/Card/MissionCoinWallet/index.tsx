import {
  Typography,
  CardContent,
  Card,
  Box,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { FC } from 'react';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import CountUp from 'react-countup';
import Image from "next/image";
interface ResultsProps {
  overviewDetailById: OverviewDetailListModel;
}

const MissionCoinWallet: FC<ResultsProps> = ({ overviewDetailById }) => {
  const theme = useTheme();
  // const progress = (revenue / goal) * 100; // Calculate percentage progress

  const missionCoinUpData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.current_mission_coin_up_reward;

  // const progress = missionCoinUpData && (missionCoinUpData.my_amount / missionCoinUpData.organization_target_end) * 100 || 0; // Calculate percentage progress

 

  return (

    <>
      {/* Header */}

      <Box alignItems="center" textAlign={"center"}>
        <Typography variant="h4" gutterBottom   fontSize={{ xs: '0.9rem', md: '1rem' }} >
          {'ภารกิจทำยอดรับ Coin PX'}
        </Typography>

      </Box>

      {/* Progress Bar Section */}
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid size={12}  >



            <Box mt={{
            xs: 0,
            md: 2
          }} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
              <Typography mr={1} variant="body1" gutterBottom>
                <Image
                  src="/assets/svg/pg/PX_Coin.svg"
                  width={0}
                  height={0}
                  className="w-5 h-5 sm:w-8 sm:h-8"
                  alt="PX_Coin"
                />{' '}

              </Typography>
              <Box display={'flex'} sx={{ justifyContent: 'left', alignItems: 'center' }} >
                <Typography variant="subtitle1" gutterBottom>

                  {'ยอด PX Coin'} :
                </Typography>
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
                    end={missionCoinUpData ?? 0}
                    duration={3}
                    separator=","
                    delay={0}
                    decimals={0}
                    decimal=""
                    prefix=""
                    suffix=" "
                  />


                </Typography>

              </Box>
            </Box>



          </Grid>

        </Grid>
      </CardContent>
    </>

  );
};

export default MissionCoinWallet;
