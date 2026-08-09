/**
 * App Revenue Component (Refactored)
 * 
 * ปรับปรุง Performance:
 * - ใช้ utility functions สำหรับ calculations
 * - แยก MilestoneMarker เป็น component ย่อย
 * - เพิ่ม memoization
 * - ลด inline styles
 */

import {
  Typography,
  CardContent,
  Card,
  Box,
  useTheme,
  LinearProgress,
} from '@mui/material';
import { FC, memo, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDetailModel } from '@/model/member';
import { useGetIncomePolicyByOrganizationsByIdQuery } from '@/lib/features/organization';
import {
  calculateIncomePolicyProgress,
  calculateMilestoneProgress,
} from '../shared/utils';

interface MilestoneMarkerProps {
  milestone: {
    value: number;
    percent: number;
  };
  start: number;
  maxAmountEnd: number;
  myAmount: number;
  theme: any;
}

// Component สำหรับแสดง milestone marker
const MilestoneMarker: FC<MilestoneMarkerProps> = memo(
  ({ milestone, start, maxAmountEnd, myAmount, theme }) => {
    const milestoneProgress = calculateMilestoneProgress(
      milestone.value,
      start,
      maxAmountEnd
    );

    const isAchieved = myAmount >= milestone.value;

    return (
      <Box
        sx={{
          position: 'absolute',
          left: `calc(${milestoneProgress}% - 10px)`,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        <Box position="relative" width="100%">
          <Box
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%) translateY(-50%)',
              background: isAchieved ? 'green' : '#ccc',
              color: 'white',
              padding: '2px 6px',
              borderRadius: '16px',
              fontSize: { xs: '0.6rem', md: '0.7rem' },
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
            }}
          >
            {milestone.value.toLocaleString()}
          </Box>
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: 28,
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            color: isAchieved ? 'green' : theme.palette.primary.main,
          }}
        >
          + ได้รับ {milestone.percent}% {isAchieved ? '✨' : ''}
        </Typography>
      </Box>
    );
  }
);

MilestoneMarker.displayName = 'MilestoneMarker';

interface ResultsProps {
  ParamsId: string;
  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel;
}

const AppRevenueMember: FC<ResultsProps> = memo(
  ({ overviewDetailById, memberById, ParamsId }) => {
    const theme = useTheme();

    // Fetch income policy data
    const { data: incomePolicy } = useGetIncomePolicyByOrganizationsByIdQuery(
      { id: `${ParamsId}` },
      { skip: ParamsId === '0' }
    );

    const incomePolicyAppData =
      overviewDetailById?.data?.income_policy_app_data;
    const myAmount = incomePolicyAppData?.my_amount ?? 0;

    // Calculate progress and milestones using utility function
    const { progress, coinBonus, filteredMilestones, start, maxAmountEndNew } =
      useMemo(
        () => calculateIncomePolicyProgress(myAmount, incomePolicy?.data ?? []),
        [myAmount, incomePolicy?.data]
      );

    return (
      <Card
        sx={{
          p: { xs: 2, md: 5 },
        }}
      >
        {/* Header */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}
        >
          นโยบายรายได้แอป
        </Typography>

        {/* Progress Bar Section */}
        <CardContent>
          <Grid container alignItems="center">
            <Grid
              size={12}
              sx={{
                pl: { xs: 3, md: 6 },
                pr: { xs: 3, md: 6 },
              }}
            >
              {/* Current Amount Indicator */}
              <Box position="relative" width="100%">
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${Math.min(progress, 100)}%`,
                    transform: {
                      xs: 'translateX(-50%) translateY(0%)',
                      md: 'translateX(-50%) translateY(-50%)',
                    },
                    background: theme.colors.gradients.primary,
                    color: 'white',
                    padding: { xs: '1px 10px', md: '6px 12px' },
                    borderRadius: '16px',
                    fontSize: { xs: '0.6rem', md: '0.85rem' },
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ยอด {myAmount.toLocaleString()}
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
                    top: 22,
                  }}
                />
              </Box>

              {/* Progress Bar */}
              <Box position="relative" width="100%">
                {/* Filled portion */}
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
                    backgroundColor:
                      myAmount >= maxAmountEndNew
                        ? 'green'
                        : theme.palette.grey[300],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: 'green',
                    },
                    mt: 3,
                  }}
                />

                {/* Milestone Markers */}
                {filteredMilestones.map((milestone) => (
                  <MilestoneMarker
                    key={milestone.value}
                    milestone={milestone}
                    start={start}
                    maxAmountEnd={maxAmountEndNew}
                    myAmount={myAmount}
                    theme={theme}
                  />
                ))}
              </Box>
            </Grid>

            {/* Bonus Information */}
            <Grid size={12} mt={5}>
              <Typography
                variant="body1"
                sx={{ fontSize: { xs: '0.85rem', md: '1rem' } }}
              >
                รายได้จากแอป: <strong>{coinBonus.toLocaleString()}</strong>
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
);

AppRevenueMember.displayName = 'AppRevenueMember';

export default AppRevenueMember;

