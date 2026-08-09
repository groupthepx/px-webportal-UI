/**
 * Mission Dialog Component
 * แสดง dialog สำหรับดู missions ทั้งหมด
 */

import { FC, memo } from 'react';
import { Dialog, DialogTitle, IconButton, Typography, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import MissionGrid from './MissionGrid';

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

interface MissionDialogProps {
  open: boolean;
  onClose: () => void;
  collectedMissions: CollectedMission[];
  missions: Mission[];
}

const MissionDialog: FC<MissionDialogProps> = memo(
  ({ open, onClose, collectedMissions, missions }) => {
    return (
      <Dialog fullWidth maxWidth="md" open={open} onClose={onClose}>
        <DialogTitle>
          <Typography
            variant="h3"
            color="primary"
            gutterBottom
            sx={{
              textAlign: 'center',
            }}
          >
            ตำแหน่งสะสม
          </Typography>
        </DialogTitle>

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>

        <Box>
          <MissionGrid
            collectedMissions={collectedMissions}
            missions={missions}
            showInDialog={true}
          />
        </Box>
      </Dialog>
    );
  }
);

MissionDialog.displayName = 'MissionDialog';

export default MissionDialog;

