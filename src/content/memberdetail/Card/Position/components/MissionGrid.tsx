/**
 * Mission Grid Component
 * แสดง grid ของ missions ที่ collect แล้ว
 */

import { FC, memo } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';

interface Mission {
  id: string | number;
  url_active: string;
  [key: string]: any;
}

interface CollectedMission {
  collect_mission_id: string;
  mission_id: string | number;
  collect_name_mission: string;
  collect_bonus_position_mission?: number;
}

interface MissionGridProps {
  collectedMissions: CollectedMission[];
  missions: Mission[];
  limit?: number;
  showInDialog?: boolean;
}

const MissionGrid: FC<MissionGridProps> = memo(
  ({ collectedMissions, missions, limit, showInDialog = false }) => {
    const displayMissions = limit
      ? collectedMissions.slice(0, limit)
      : collectedMissions;

    return (
      <Grid
        sx={{
          px: showInDialog ? 4 : { md: 0, xs: 0 },
          p: showInDialog ? 5 : 0,
        }}
        container
        direction="row"
        justifyContent={showInDialog ? 'left' : 'center'}
        alignItems="center"
        spacing={showInDialog ? 4 : 0}
      >
        {displayMissions.map((mission, index) => {
          const missionItem = missions.find((item) => item.id == mission.mission_id);

          if (!missionItem) return null;

          return (
            <Grid
              key={index}
              size={{
                xs: showInDialog ? 6 : 2.4,
                sm: showInDialog ? 4 : 2.4,
                md: showInDialog ? 2 : 2.4,
              }}
            >
              <Box
                sx={{
                  padding: showInDialog ? 2 : 0,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Image
                  src={missionItem.url_active}
                  width={100}
                  height={100}
                  style={{ maxWidth: '100%', height: 'auto' }}
                  alt={mission.collect_mission_id}
                />

                <Typography
                  sx={{
                    fontSize: {
                      xs: '0.6rem',
                      sm: '0.7rem',
                      md: showInDialog ? '0.8rem' : '0.7rem',
                    },
                    textAlign: 'center',
                  }}
                  variant="h4"
                  mt={1}
                >
                  {mission.collect_name_mission}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  }
);

MissionGrid.displayName = 'MissionGrid';

export default MissionGrid;

