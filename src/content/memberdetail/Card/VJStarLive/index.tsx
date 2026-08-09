import {
  Typography,
  CardContent,
  Card,
  Box,
  Button,
  useTheme,
  Avatar,
  LinearProgress,
} from '@mui/material';
import { FC } from 'react';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import CountUp from 'react-countup';
import Image from "next/image";
// Sample mission structure
interface Mission {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'locked';
}

interface VJStarLiveMemberProps {

  overviewDetailById: OverviewDetailListModel;
}

const VJStarLiveMember: FC<VJStarLiveMemberProps> = ({ overviewDetailById }) => {
  const theme = useTheme();

  const missionVideo = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.all_vdo || null
  const missionsVdoDataMyProgress = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.my_progress || []
  return (
    <Card
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, mb: 2 }}
      >
        โบนัส VJ Star Live ภารกิจ แจกผู้ชายักษ์
      </Typography>

      {/* Mission Section */}
      <CardContent>
        <div className="grid h-full grid-cols-12 gap-2">
          {missionVideo && missionVideo
          .filter((mission: any) => mission.is_unlock === true)
          .map(function (mission: any, index: number) {
            const missionsAllProgress = missionsVdoDataMyProgress.find(m => m.vdo_id === mission.vdo_id);
            const progressColor =
              (missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0) === 100 ? 'green' : (missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0) != 0 ?
                'orange' :
                theme.palette.grey[400];
            return <Box
              className="h-full md:col-span-3 col-span-12" key={mission.vdo_id}
              sx={{
                alignItems: { xs: 'center', md: 'center' },
                justifyContent: { xs: 'start', md: 'start' },
                display: 'flex',
                flexDirection: 'column',
                backgroundColor:
                  mission.is_unlock
                    ? '#fff5eb'
                    : '#f5f5f5',
                p: { xs: 1.5, md: 2 },
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: mission.is_unlock ? '0px 2px 6px rgba(0, 0, 0, 0.1)' : 'none',

              }}

            >
              <Box


              >
                {/* Mission Title */}
                <Typography fontWeight="bold" fontSize={{ xs: '0.9rem', md: '1rem' }}>
                  {mission.vdo_title}
                </Typography>

                {/* Mission Icon */}
                <Box mt={1} mb={1}

                >
                  <Avatar
                    variant="rounded"
                    alt="reward"
                    src={
                      !mission.is_unlock
                        ? "/assets/svg/pg/golden-trophy-locked.svg"
                        : "/assets/svg/pg/golden-trophy.svg"
                    }
                    sx={{
                      width: { xs: 100, md: 150 },
                      height: { xs: 100, md: 150 },
                    }}
                  />
                  <LinearProgress
                    variant="determinate"
                    value={missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0}
                    sx={{
                      height: 6,
                      borderRadius: 5,
                      backgroundColor: theme.palette.grey[300],
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: progressColor,
                      },
                    }}
                  />
                </Box>

                {/* Status Text */}
                <Box mt={1} mb={1}

                >
                  <Typography
                    fontSize="0.9rem"
                    fontWeight="bold"
                    sx={{
                      color:
                        mission.is_unlock && missionsAllProgress && missionsAllProgress.progress === 100
                          ? 'green'
                          : mission.is_unlock
                            ? 'orange'
                            : 'gray',
                    }}
                  >

                    {mission.is_unlock && missionsAllProgress && missionsAllProgress.progress === 100
                      ? 'สำเร็จ'
                      : mission.is_unlock
                        ? 'กำลังดำเนิน'
                        : 'ยังไม่ได้รับอนุญาต'}
                  </Typography>
                </Box>
                {/* Unlock Button for Locked Missions */}
                {/* {!mission.is_unlock && (

                  <Box

                    sx={{
                      p: { xs: 1.5, md: 2 },
                    }}  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        //  console.log('missionsAllProgress',missionsAllProgress);
                        setVdoDeatil(mission)
                        handleActionOpen()
                      }}
                      fullWidth
                      sx={{
                        mt: 1,
                        backgroundColor: '#FF9800',
                        color: 'white',
                        // borderRadius: 2,
                        '&:hover': {
                          backgroundColor: '#E68900',
                        },
                      }}
                    >
                      Unlock
                    </Button>

                  </Box>

                )} */}

                {mission.is_unlock && (
                  <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >

                    <Typography mr={1} variant="body1" gutterBottom>
                      <Image
                        src="/assets/svg/pg/star.svg"
                        width={25}
                        height={25}
                        alt="Wallte"
                      />{' '}

                    </Typography>
                    <Typography
                      variant='h4'
                      style={{
                        background: `${theme.colors.gradients.primary}`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }} >
                      <CountUp

                        start={0}
                        end={mission.vdo_bonus ? mission.vdo_bonus : 0}
                        duration={3}
                        separator=""
                        delay={0}
                        decimals={0}
                        decimal=""
                        prefix=""
                        suffix=""
                      />

                    </Typography>
                    <Typography ml={1} variant="subtitle1" gutterBottom>

                      {'Coin'}
                    </Typography>

                  </Box >
                )}
              </Box>
            </Box>
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default VJStarLiveMember;
