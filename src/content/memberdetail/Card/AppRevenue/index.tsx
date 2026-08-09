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
import { useGetIncomePolicyByOrganizationsByIdQuery } from '@/lib/features/organization';

interface ResultsProps {
  ParamsId: string;
  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel
}

const AppRevenueMember: FC<ResultsProps> = ({ overviewDetailById, memberById, ParamsId }) => {
  const theme = useTheme();
  // const organizationParamsId = memberById && memberById.organization_id || '0';
  const { data: incomePolicy, } = useGetIncomePolicyByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );

  const incomePolicyAppData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.income_policy_app_data;




  const data = incomePolicy && incomePolicy.data;

  const minAmountStart = data && Math.min(...data.map((item: any) => item.amount_start)) || 0;

  // Compute the maximum amount_end
  const maxAmountEnd = data && Math.max(...data.map((item: any) => item.amount_end)) || 0;

  // console.log("minAmountStart", minAmountStart)
  // console.log("maxAmountEnd", maxAmountEnd)

  // const progress = incomePolicyAppData && (incomePolicyAppData.my_amount / maxAmountEnd) * 100 || 0; // Calculate percentage progress


  const myAmount = incomePolicyAppData?.my_amount || 0;
  const coinReward = incomePolicyAppData?.coin_reward || 0;

  // The maximum bar value (in your screenshot, it goes up to 300,000)
  // const maxAmount = 300000;
  let coinBonus = 0;
  let filteredMilestones = [];
  let progress = 0;
  let maxAmountEndNew = 0;
  let start = 0; // Initialize start variable

  if (myAmount > maxAmountEnd) {

    const maxPreviou = data && data.length > 0
      ? data.reduce((max: any, item: any) => item.amount_end > max.amount_end ? item : max)
      : null;

    filteredMilestones = data ? [maxPreviou].filter(Boolean) : [];
    progress = (myAmount / maxAmountEnd) * 100 || 0
    maxAmountEndNew = maxAmountEnd
    coinBonus = myAmount && maxPreviou && maxPreviou.percent_reward && ((maxPreviou.percent_reward * myAmount) / 100) || 0;

  } else {

    const previousMilestone1 = data && data.filter((item: any) => item.amount_end <= myAmount) || [];
    const nextMilestone1 = data && data.filter((item: any) => item.amount_end > myAmount) || [];

    const maxPreviousMilestone = previousMilestone1.length > 0
      ? previousMilestone1.reduce((max: any, item: any) => item.amount_end > max.amount_end ? item : max)
      : null;

    const minNextMilestone = nextMilestone1.length > 0
      ? nextMilestone1.reduce((min: any, item: any) => item.amount_end < min.amount_end ? item : min)
      : null;

    progress = maxPreviousMilestone && minNextMilestone
      ? ((myAmount - maxPreviousMilestone.amount_end) / (minNextMilestone.amount_end - maxPreviousMilestone.amount_end)) * 100
      : (myAmount / maxAmountEnd) * 100 || 0;
    coinBonus = myAmount && maxPreviousMilestone && ((maxPreviousMilestone.percent_reward * myAmount) / 100) || 0;
    start = maxPreviousMilestone ? maxPreviousMilestone.amount_end : 0;
    maxAmountEndNew = minNextMilestone && minNextMilestone.amount_end || 0;
    filteredMilestones = [maxPreviousMilestone, minNextMilestone].filter(Boolean);

  }



  const newMillStones = filteredMilestones && filteredMilestones.map((item: any) => {
    return {
      value: item.amount_end,
      percent: item.percent_reward,
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
        นโยบายรายได้แอป
      </Typography>

      {/* Progress Bar Section */}
      <CardContent>
        <Grid container alignItems="center">
          {/* <Grid size={12}  >
      
            <Box position="relative" width="100%">
              <Box
                sx={{
                  position: 'absolute',
                  left: `${Math.min(progress, 100)}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                  background: theme.colors.gradients.primary, // Use the passed colors prop or fallback
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: { xs: '0.7rem', md: '0.85rem' }, // Responsive font size
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                }}
              >
                ยอด {incomePolicyAppData && incomePolicyAppData.my_amount.toLocaleString() || 0}
              </Box>

   
              <Box
                sx={{
                  width: 0,
                  height: 0,
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

   
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: theme.palette.grey[300],
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'green',
                },
                mt: 3, // Adjusted for spacing
              }}
            />

          </Grid>

     
          <Grid size={12} >
            <Typography
              variant="body2"
              align="right"
              sx={{
                fontSize: { xs: '0.8rem', md: '1rem' }, // Responsive font size
                fontWeight: 600,
                color: 'black',
              }}
            >
              {progress.toFixed(1)}%
            </Typography>
          </Grid> */}


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
                        top: 28,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        // fontWeight: 'bold',
                        color: myAmount >= milestone.value ? 'green' : theme.colors.primary.main,
                      }}
                    >
                      + ได้รับ {' '} {milestone.percent}%  {' '}  {myAmount >= milestone.value ? '✨' : ''}
                    </Typography>
                  </Box>
                );
              })}

              {/* Current user amount “bubble” */}

            </Box>
          </Grid>

          {/* Bonus Information */}
          <Grid size={12} mt={5}>
            <Typography
              variant="body1"
              sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }} // Responsive font size
            >
              รายได้จากแอป: <strong>{coinBonus && coinBonus.toLocaleString() || 0} </strong>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AppRevenueMember;
