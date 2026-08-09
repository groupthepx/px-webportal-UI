import {
  Typography,
  CardContent,
  Card,
  Box,
  useTheme,
  LinearProgress,
  Chip,
} from '@mui/material';
import { FC } from 'react';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDetailModel } from '@/model/member';
import { useGetOrganizationsByIdQuery, useGetVJMissionByOrganizationsByIdQuery } from '@/lib/features/organization';

interface ResultsProps {

  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel,
  ParamsId : string;
}

const VJMissionMember: FC<ResultsProps> = ({ overviewDetailById, memberById, ParamsId }) => {
  const theme = useTheme();
  // const progress = (revenue / goal) * 100; // Calculate percentage progress


  // const organizationParamsId = memberById && memberById.organization_id || '0';
  const { data: vJMission } = useGetVJMissionByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );

  const vJMissionDetail = vJMission && vJMission?.data.length > 0 && vJMission?.data[0] || null

  const maxAmountEnd = vJMissionDetail && vJMissionDetail.amount_target || 0;




  const vJmissionData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vj_mission_data;

  const myAmount = vJmissionData?.my_amount || 0;
  const myWorkDate = vJmissionData?.my_work_date || 0;
  const targetWorkDate =
    vJmissionData?.organization_target_work_date ||
    (vJMissionDetail && vJMissionDetail.bonus_vj_date_scope) ||
    0;
  const isCurrentRoundPass = vJmissionData?.vj_active_current_round ?? false;

  // const progress = vJmissionData && (vJmissionData.my_amount / vJmissionData.organization_target) * 100 || 0; // Calculate percentage progress

  const progress = (myAmount / maxAmountEnd) * 100;

  const workDateProgress = targetWorkDate > 0
    ? Math.min((myWorkDate / targetWorkDate) * 100, 100)
    : 0;

  const amountShortBy = Math.max(maxAmountEnd - myAmount, 0);
  const workDateShortBy = Math.max(targetWorkDate - myWorkDate, 0);

  const milestoneProgress = (maxAmountEnd / maxAmountEnd) * 100

  return (

    <>
      {/* Header */}
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '0.9rem', md: '1.2rem' } }}>
          ภารกิจVJ Active
        </Typography>
        <Chip
          size="small"
          label={isCurrentRoundPass ? 'รอบนี้: ผ่านครบเงื่อนไข' : 'รอบนี้: ยังไม่ครบเงื่อนไข'}
          sx={{
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: isCurrentRoundPass ? 'green' : '#d32f2f',
          }}
        />
      </Box>

      {!isCurrentRoundPass && (amountShortBy > 0 || workDateShortBy > 0) && (
        <Typography variant="body2" sx={{ mt: 0.5, color: '#d32f2f' }}>
          ยังขาด:
          {amountShortBy > 0 && (
            <> ยอดอีก <strong>{amountShortBy.toLocaleString()}</strong></>
          )}
          {amountShortBy > 0 && workDateShortBy > 0 && ' และ'}
          {workDateShortBy > 0 && (
            <> วันทำงานอีก <strong>{workDateShortBy}</strong> วัน</>
          )}
          {' '}เพื่อให้ผ่าน VJ Active รอบนี้
        </Typography>
      )}

      {/* Progress Bar Section */}
      <CardContent>
        <Grid container spacing={1} alignItems="center">
          <Grid size={12}
             sx={{
              // pl: { xs: 3, md: 6 }, // Responsive padding left
              pr: { xs: 3, md: 6 }, // Responsive padding right
            }} >
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
            <Box
              position="relative"
              width="100%"

            >

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
                  backgroundColor: myAmount >= maxAmountEnd ? 'green' : theme.palette.grey[300],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'green',
                  },
                  mt: 3, // Adjusted for spacing
                }}
              />

              {/* Milestone circles */}
              {/* {newMillStones && newMillStones.map((milestone: any) => { */}
              {/* const milestoneProgress =
                  (milestone.value / maxAmountEnd) * 100;
                return ( */}
              <Box

                sx={{
                  position: 'absolute',
                  // Center the circle on the line:
                  left: `calc(${milestoneProgress}% - 10px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              >


                <Box position="relative" width="100%">
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${Math.min(progress, 100)}%`,
                      transform: 'translateX(-50%) translateY(-50%)',
                      background: myAmount >= maxAmountEnd ? 'green' : '#ccc', // Use the passed colors prop or fallback
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '16px',
                      fontSize: { xs: '0.6rem', md: '0.7rem' }, // Responsive font size
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                    }}
                  >

                    {(maxAmountEnd).toLocaleString()}
                  </Box>

                </Box>


              </Box>


            </Box>
          </Grid>

          {/* Work-date progress (วันทำงาน) — รอบปัจจุบัน */}
          {targetWorkDate > 0 && (
            <Grid size={12} sx={{ pr: { xs: 3, md: 6 }, mt: 4 }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' } }}
                >
                  วันทำงานรอบนี้
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: '0.75rem', md: '0.85rem' },
                    color: myWorkDate >= targetWorkDate ? 'green' : '#d32f2f',
                  }}
                >
                  {myWorkDate} / {targetWorkDate} วัน
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={workDateProgress}
                sx={{
                  height: 8,
                  borderRadius: 5,
                  backgroundColor: theme.palette.grey[300],
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      myWorkDate >= targetWorkDate ? 'green' : '#d32f2f',
                  },
                }}
              />
            </Grid>
          )}

        </Grid>
      </CardContent>
    </>

  );
};

export default VJMissionMember;
