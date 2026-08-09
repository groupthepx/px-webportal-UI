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

interface ResultsProps {

  overviewDetailById: OverviewDetailListModel;
}

const MissionCoinMember: FC<ResultsProps> = ({ overviewDetailById }) => {
  const theme = useTheme();
  // const progress = (revenue / goal) * 100; // Calculate percentage progress

  const missionCoinUpData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.mission_coin_up_data;

  const progress = missionCoinUpData && (missionCoinUpData.my_amount / missionCoinUpData.organization_target_end) * 100 || 0; // Calculate percentage progress



  return (
   
      <>
      {/* Header */}
      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1rem', md: '1.2rem' } }}>
        ภารกิจทำยอดรับCoin PX
      </Typography>

      {/* Progress Bar Section */}
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid size={12}  >
            {/* Tooltip with Gradient Background */}
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
                ยอด {missionCoinUpData && missionCoinUpData.my_amount.toLocaleString() || 0}
              </Box>

              {/* Triangle Pointer */}
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

            {/* Progress Bar */}
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

          {/* Percentage Display */}
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
          </Grid>

        </Grid>
      </CardContent>
      </>
 
  );
};

export default MissionCoinMember;
