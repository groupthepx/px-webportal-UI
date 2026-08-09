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
import { MemberDetailModel } from '@/model/member';
import { useGetMissionByOrganizationsByIdQuery } from '@/lib/features/organization';

interface ResultsProps {

  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel,
  ParamsId : string;
}

const ConquestMissionMember: FC<ResultsProps> = ({ overviewDetailById, memberById, ParamsId }) => {
  const theme = useTheme();

  // const organizationParamsId = memberById && memberById.organization_id || '0';
  const { data: mission } = useGetMissionByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );


  const data = mission && mission.data;

  const maxAmountEnd = data && Math.max(...data.map((item: any) => item.amount_mission)) || 0;


  const missionData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.mission_coin_up_data;


  const myAmount = missionData?.my_amount || 0;

  let filteredMilestones = [];
  let progress = 0;
  let maxAmountEndNew = 0;
  let start = 0; // Initialize start variable

  let coinData = 0;


  if (myAmount > maxAmountEnd) {
    // If myAmount is less than 1,000,000, show the first milestone (the one closest to 0)
    const maxPreviou = data && data.length > 0
      ? data.reduce((max: any, item: any) => item.amount_mission > max.amount_mission ? item : max)
      : null;

    filteredMilestones = data ? [maxPreviou].filter(Boolean) : [];
    progress = (myAmount / maxAmountEnd) * 100 || 0
    maxAmountEndNew = maxAmountEnd;

    coinData = myAmount && maxPreviou && maxPreviou.percent_reward && (maxPreviou.bonus_mission) || 0;


  } else {

    const previousMilestone1 = data && data.filter((item: any) => item.amount_mission <= myAmount) || [];
    const nextMilestone1 = data && data.filter((item: any) => item.amount_mission > myAmount) || [];

    const maxPreviousMilestone = previousMilestone1.length > 0
      ? previousMilestone1.reduce((max: any, item: any) => item.amount_mission > max.amount_mission ? item : max)
      : null;

    const minNextMilestone = nextMilestone1.length > 0
      ? nextMilestone1.reduce((min: any, item: any) => item.amount_mission < min.amount_mission ? item : min)
      : null;

    coinData = myAmount && maxPreviousMilestone && (maxPreviousMilestone.bonus_mission) || 0;

    // console.log("maxPreviousMilestone", maxPreviousMilestone)
    // console.log("minNextMilestone", minNextMilestone)

    progress = maxPreviousMilestone && minNextMilestone
      ? ((myAmount - maxPreviousMilestone.amount_mission) / (minNextMilestone.amount_mission - maxPreviousMilestone.amount_mission)) * 100
      : (myAmount / maxAmountEnd) * 100 || 0;

    start = maxPreviousMilestone ? maxPreviousMilestone.amount_mission : 0;
    maxAmountEndNew = minNextMilestone && minNextMilestone.amount_mission || 0;
    filteredMilestones = [maxPreviousMilestone, minNextMilestone].filter(Boolean);

  }


  const newMillStones = filteredMilestones && filteredMilestones.map((item: any) => {
    return {
      value: item.amount_mission,
      name: item.name_mission,
      bonus_mission: item.bonus_mission,
    };
  }) || [];

  return (
    <Card
      sx={{
        p: { xs: 2, md: 5 }, // Responsive padding

        // borderRadius: 5,
        // boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}>
        ภารกิจพิชิตเข็ม
      </Typography>

      {/* Progress Bar Section */}
      <CardContent
      >

        <Grid container spacing={1} alignItems="center">
          <Grid size={12}
            sx={{
              pl: { xs: 3, md: 6 }, // Responsive padding left
              pr: { xs: 3, md: 6 }, // Responsive padding right
            }}
          >
            {/* Outer track */}
            <Box position="relative" width="100%">
              <Box
                sx={{
                  position: 'absolute',
                  left: `${Math.min(progress, 100)}%`,
                  transform: { xs: 'translateX(-50%) translateY(0%)', md: 'translateX(-50%) translateY(-50%)' },
                  background: theme.colors.gradients.primary, // Use the passed colors prop or fallback
                  color: 'white',
                  padding: { xs: '1px 10px', md: '6px 12px' },
                  borderRadius: '16px',
                  fontSize: { xs: '0.6rem', md: '0.85rem' }, // Responsive font size
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                ยอด {myAmount.toLocaleString() || 0}
              </Box>

              {/* Triangle Pointer */}
              <Box
                sx={{
                  width: 0,
                  height: 0,
                  zIndex: 1,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid #FF4500',
                  position: 'absolute',
                  left: `${Math.min(progress, 100)}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                  top: 22, // Adjusted for better positioning
                }}
              />
            </Box>
            <Box
              position="relative"
              width="100%"
            // height="500px"
            // sx={{
            //   // backgroundColor: theme.palette.grey[300],
            //   borderRadius: '8px',
            //   overflow: 'hidden',
            // }}
            >
              {/* Filled portion up to current progress */}
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${Math.min(progress, 100)}%`,
                  backgroundColor: 'green',
                  transition: 'width 0.3s ease-in-out',
                }}
              />




              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: myAmount >= maxAmountEndNew ? 'green' : theme.palette.grey[300],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'green',
                  },
                  mt: 3, // Adjusted for spacing
                }}
              />

              {/* Milestone circles */}
              {newMillStones && newMillStones.map((milestone: any) => {
                // const milestoneProgress =
                //   (milestone.value / maxAmountEndNew) * 100;

                const milestoneProgress = (milestone.value - start) / (maxAmountEndNew - start) * 100;

                return (
                  <Box
                    key={milestone.value}
                    sx={{
                      position: 'absolute',
                      // Center the circle on the line:
                      left: `calc(${milestoneProgress}% - 10px)`,
                      top: '50%',
                      transform: 'translateY(-50%)',
                    }}
                  >
                    {/* The circle itself */}
                    {/* <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        border: '3px solid #ccc',
                      }}
                    /> */}

                    <Box position="relative" width="100%">
                      <Box
                        sx={{
                          position: 'absolute',
                          left: `${Math.min(progress, 100)}%`,
                          transform: 'translateX(-50%) translateY(-50%)',
                          background: myAmount >= milestone.value ? 'green' : '#ccc', // Use the passed colors prop or fallback
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '16px',
                          fontSize: { xs: '0.6rem', md: '0.7rem' }, // Responsive font size
                          fontWeight: 'bold',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {/* myAmount */}

                        {(milestone.value).toLocaleString()}
                      </Box>

                      {/* Triangle Pointer */}

                    </Box>


                    {/* Milestone percent text below each circle */}
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        top: 23,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        fontSize: { xs: '0.6rem', md: '0.7rem' }, // Responsive font size
                        // fontWeight: 'bold',
                        color: myAmount >= milestone.value ? 'green' : theme.colors.primary.main,
                      }}
                    >
                      + {' '} {milestone.name}  {' '}  {myAmount >= milestone.value ? '✨' : ''}
                      <br />
                      {' '} โบนัส{' '} {milestone.bonus_mission ? milestone.bonus_mission.toLocaleString() : 0} {' '}
                    </Typography>


                  </Box>
                );
              })}

              {/* Current user amount “bubble” */}

            </Box>
          </Grid>




          {/* Bonus Information */}
          <Grid size={12} 
          mt={{
            xs: 6, md: 10
          }}
          >
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }} // Responsive font size
            >
              โบนัส : <strong>{coinData && coinData.toLocaleString() || 0} </strong>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ConquestMissionMember;
