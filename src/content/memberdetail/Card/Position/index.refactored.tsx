/**
 * Position Details Component (Refactored)
 * 
 * ปรับปรุง Performance:
 * - ใช้ utility functions สำหรับ calculations
 * - แยก component ย่อยออกมา (MissionGrid, MissionDialog)
 * - เพิ่ม memoization
 * - ลดขนาด component จาก 528 บรรทัดเหลือประมาณ 150 บรรทัด
 */

import {
  Typography,
  Box,
  Divider,
  useTheme,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, memo, useState, useCallback, useMemo } from 'react';
import CountUp from 'react-countup';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDetailModel } from '@/model/member';
import { useGetMissionByOrganizationsByIdQuery } from '@/lib/features/organization';
import { CardBorderBottom } from '../shared/StyledComponents';
import {
  processMissionData,
  calculatePositionMilestones,
  calculateTotalMissionBonus,
} from '../shared/utils';
import MissionGrid from './components/MissionGrid';
import MissionDialog from './components/MissionDialog';

interface Props {
  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDetailModel;
  ParamsId: string;
}

const PositionDetails: FC<Props> = memo(
  ({ overviewDetailById, memberById, ParamsId }) => {
    const { t }: { t: any } = useTranslation();
    const theme = useTheme();

    // Dialog state
    const [openPreView, setOpenPreView] = useState(false);

    // Fetch mission data
    const { data: mission } = useGetMissionByOrganizationsByIdQuery(
      { id: `${ParamsId}` },
      { skip: ParamsId === '0' }
    );

    // Extract data
    const collectMissions =
      overviewDetailById?.data?.collect_missions ?? [];
    const missionData = overviewDetailById?.data?.mission_coin_up_data;
    const myAmount = missionData?.my_amount ?? 0;

    // Process mission data
    const processedMissions = useMemo(
      () => processMissionData(mission?.data ?? [], 20),
      [mission?.data]
    );

    // Calculate max amount
    const maxAmountEnd = useMemo(() => {
      return mission?.data
        ? Math.max(...mission.data.map((item: any) => item.amount_mission))
        : 0;
    }, [mission?.data]);

    // Calculate milestones
    const { filteredMilestones, coinData } = useMemo(
      () =>
        calculatePositionMilestones(myAmount, processedMissions, maxAmountEnd),
      [myAmount, processedMissions, maxAmountEnd]
    );

    // Calculate total bonus
    const totalBonus = useMemo(
      () => calculateTotalMissionBonus(collectMissions),
      [collectMissions]
    );

    // Dialog handlers
    const handleOpenPreView = useCallback(() => {
      setOpenPreView(true);
    }, []);

    const handleClosePreView = useCallback(() => {
      setOpenPreView(false);
    }, []);

    return (
      <>
        <CardBorderBottom
          sx={{
            borderBlockColor: theme.palette.primary.main,
            textAlign: 'center',
          }}
        >
          <Box
            p={{
              xs: 1,
              md: 3,
            }}
          >
            {/* Header */}
            <Box
              mb={{
                xs: 0,
                md: 2,
              }}
              alignItems="center"
              textAlign="center"
            >
              <Typography variant="h4" gutterBottom>
                {t('ตำแหน่งสะสม')}
              </Typography>
            </Box>

            {/* Mission Grid */}
            {collectMissions.length > 0 && (
              <>
                <MissionGrid
                  collectedMissions={collectMissions}
                  missions={processedMissions}
                  limit={5}
                />

                {/* Total Bonus */}
                <Grid size={12} mt={2}>
                  <Box
                    mt={{
                      xs: 0,
                      md: 2,
                    }}
                    display="flex"
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Typography mr={1} variant="body1" gutterBottom>
                      <Image
                        src="/assets/svg/pg/star.svg"
                        width={0}
                        height={0}
                        className="w-6 h-6 sm:w-8 sm:h-8"
                        alt="Star"
                      />
                    </Typography>
                    <Box
                      display="flex"
                      sx={{ justifyContent: 'left', alignItems: 'center' }}
                    >
                      <Typography
                        variant="h4"
                        fontSize={{ xs: '0.8rem', md: '1rem' }}
                        sx={{
                          background: `${theme.colors.gradients.primary}`,
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        <CountUp
                          style={{ marginLeft: 5 }}
                          start={0}
                          end={totalBonus}
                          duration={3}
                          separator=""
                          delay={0}
                          suffix=" Bonus Coin"
                        />
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                {/* View All Link */}
                <Grid
                  size={12}
                  mt={{
                    xs: 0,
                    md: 2,
                  }}
                >
                  <Divider
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      my: {
                        xs: 1,
                        md: 2,
                      },
                    }}
                  />

                  <Box
                    display="flex"
                    sx={{ justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Box
                      onClick={handleOpenPreView}
                      sx={{
                        cursor: 'pointer',
                        ':hover': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    >
                      <Typography
                        fontSize={{ xs: '0.8rem', md: '1rem' }}
                        variant="h4"
                        color="primary"
                      >
                        ดูทั้งหมด
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </Box>
        </CardBorderBottom>

        {/* Mission Dialog */}
        <MissionDialog
          open={openPreView}
          onClose={handleClosePreView}
          collectedMissions={collectMissions}
          missions={processedMissions}
        />
      </>
    );
  }
);

PositionDetails.displayName = 'PositionDetails';

export default PositionDetails;

