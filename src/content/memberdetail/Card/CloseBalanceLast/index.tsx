import {
  Typography,
  CardContent,
  Card,
  Box,
  styled,
  useTheme,

  TextField,
  IconButton,
  Collapse
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CalendarToday, DirectionsWalkOutlined, EditCalendarOutlined, ExpandLess, ExpandMore, ExtensionOutlined, ModelTrainingOutlined, MonetizationOnOutlined, MovingOutlined, Stars, ZoomIn, ZoomOut } from '@mui/icons-material';
import { FC, useState } from 'react';
import { MemberDetailModel } from '@/model/member';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { differenceInCalendarDays, format } from "date-fns";
import Label from '@/components/Label';
import { useGetMissionByOrganizationsByIdQuery, useGetRankBonusByOrganizationsByIdQuery } from '@/lib/features/organization';

interface ResultsProps {
  member: MemberDetailModel | null;
  overviewDetailById: OverviewDetailListModel;
  ParamsId: string
}



const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    borderRadius: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    width: 80,
    '& fieldset': {
      borderColor: 'white', // normal border color
      color: 'white',
    },

    '&.Mui-disabled fieldset': {
      borderColor: 'white', // disabled border color
      color: 'white',
    },
    '& input': {
      color: 'white !important', // input text color
    },
  },
});

const CloseBalanceLastMember: FC<ResultsProps> = ({ member, overviewDetailById, ParamsId }) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();


  const [open, setOpen] = useState(true);
  const toggleOpen = () => setOpen(!open);

  const closeMonthData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.LastMonth;
  const closeMonthLastRewardDetaila = overviewDetailById && overviewDetailById.data && overviewDetailById.data.LastRewardDetail;


  const start = closeMonthData?.close_date_start ? new Date(closeMonthData.close_date_start) : null;
  const end = closeMonthData?.close_date_end ? new Date(closeMonthData.close_date_end) : null;

  const days = start && end ? differenceInCalendarDays(end, start) + 1 : null;


  const { data: rankBonus } = useGetRankBonusByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );

  const { data: mission } = useGetMissionByOrganizationsByIdQuery(
    { id: `${ParamsId}` },
    { skip: ParamsId === '0' }
  );
  const missionItem = mission && mission.data;

  const rankBonusData = rankBonus && rankBonus.data || null;

  const rankBonusDetail = rankBonusData && rankBonusData.find((data: any) => `${data.number_rank}` === `${closeMonthData?.rank_name}`) || null;


  const missionItemDetail = missionItem && missionItem.find((data: any) => `${data.name_mission}` === `${closeMonthData?.bonus_mission_name}`) || null;


  // console.log("closeMonthData", closeMonthData);


  return (

    <>
      <Collapse in={open}>
        <Box
        >
          <Card sx={{ p: 2, background: theme.colors.gradients.primary }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography fontWeight="bold" color='white' sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, }}>
                {t('ข้อมูลการปิดยอดรอบที่ผ่านมา')}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton
                  sx={{
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                  }}
                  onClick={toggleOpen} size="small" color="secondary">
                  {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
            </Box>

            <CardContent>
              <Grid container spacing={3}>
                {/* Left Section - Information */}
                <Grid size={{ xs: 12, sm: 6 }} >
                  {/* <Typography color='white'  mb={2} variant="body1">
              <EditCalendarOutlined sx={{ mr: 1 }} />
              {t('อัพเดทข้อมูลวันที่')}: <strong>    {closeMonthData?.last_update ? `${format(new Date(closeMonthData?.last_update), "dd/MM/yyyy HH:mm:ss ")}` : ''} </strong>
            </Typography> */}
                  <Typography color='white' mb={2} variant="body1">
                    <Stars sx={{ mr: 1, }} />
                    {t('ยอดวีเจครั้งที่แล้ว')}: <strong>{closeMonthData?.current_amount.toLocaleString() || ''} ({closeMonthData?.amount_date_work} วัน)</strong>
                  </Typography>
                  <Typography color='white' mb={2} variant="body1">
                    <CalendarToday sx={{ mr: 1 }} />
                    {t('วันตัดยอด')}: <strong>{closeMonthData?.close_date_start ? `${format(new Date(closeMonthData?.close_date_start), "dd/MM/yyyy ")}` : ''} - {closeMonthData?.close_date_end ? `${format(new Date(closeMonthData?.close_date_end), "dd/MM/yyyy ")}` : ''}</strong>
                  </Typography>

                  <Typography color='white' mb={2} variant="body1">
                    <MonetizationOnOutlined sx={{ mr: 1 }} />
                    {t('ภารกิจทำยอดรับ Coin PX')}: <strong>{closeMonthLastRewardDetaila?.mission_coin_up ? closeMonthLastRewardDetaila?.mission_coin_up.toLocaleString() : ''}</strong>
                  </Typography>
                  {/* <Typography color='white'   mb={2} variant="body1">
              <CalendarToday sx={{ mr: 1   }} />
              {t('นโยบายรายได้แอป')}: <strong>{ closeMonthLastRewardDetaila?.bonus_mission ? closeMonthLastRewardDetaila?.bonus_mission.toLocaleString() : 0 || '0'}</strong>
            </Typography> */}
                  <Typography color='white' mb={2} variant="body1">
                    <DirectionsWalkOutlined sx={{ mr: 1 }} />
                    {t('ภารกิจ VJ Active')}:
                    {closeMonthData?.vj_active_status ? <strong>
                      ผ่าน
                    </strong> : <strong>
                      ไม่ผ่าน
                    </strong>}





                    {/* <strong>{closeMonthLastRewardDetaila?.vj_active ? closeMonthLastRewardDetaila?.vj_active.toLocaleString() : 0 || '0'}</strong> */}
                  </Typography>
                  <Typography color='white' mb={2} variant="body1">
                    <ExtensionOutlined sx={{ mr: 1 }} />
                    {t('ภารกิจพิชิตเข็ม')}: <strong>{closeMonthData?.bonus_mission_name || ''}     {missionItemDetail && missionItemDetail.bonus_mission ? `   โบนัส ${missionItemDetail.bonus_mission.toLocaleString()} ` : ''} </strong>
                  </Typography>
                  <Typography color='white' mb={2} variant="body1">
                    <ModelTrainingOutlined sx={{ mr: 1 }} />
                    {t('ได้รับโบนัสการแข่งขัน')}:<strong>{closeMonthData?.rank_name ? `อันดับ ${closeMonthData?.rank_name}` : ''}

                      {/* {rankBonusDetail && rankBonusDetail.bonus_rank ? `   ได้รับโบนัส ${rankBonusDetail.bonus_rank.toLocaleString()} ` : ''} */}
                    </strong>
                  </Typography>

                  {/* <Typography color='white' mb={2} variant="body1">
                    <MovingOutlined sx={{ mr: 1 }} />
                    {t('ยอดจากไฟล์')}:<strong>{closeMonthLastRewardDetaila?.coin_up_from_excel ? closeMonthLastRewardDetaila?.coin_up_from_excel.toLocaleString() : 0 || '0'}</strong>
                  </Typography> */}
                  <Typography color='white' mb={2} variant="body1">
                    <MovingOutlined sx={{ mr: 1 }} />
                    {t('โบนัสสะสมตำแหน่ง / เข็ม')}:<strong>{closeMonthData?.last_collect_mission ? closeMonthData?.last_collect_mission.toLocaleString() : ''}</strong>
                  </Typography>




                </Grid>

                {/* Right Section - Work Time */}
                <Grid size={{ xs: 12, sm: 6 }} textAlign="center">
                  <Typography color='white' variant="body1" fontWeight="bold">
                    {t('เวลาทำงาน')}
                  </Typography>
                  <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
                    <Typography color='white' sx={{

                      mr: 1,
                    }} variant="body2" >
                      วัน:
                    </Typography>
                    <StyledTextField value={closeMonthData?.amount_date_work || 0} size="small" variant="outlined" />
                    <Typography color='white' sx={{

                      mx: 2
                    }} variant="body2" >
                      เวลา:
                    </Typography>
                    <StyledTextField
                      value={closeMonthData?.amount_time_work || 0} size="small" variant="outlined" />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>


          </Card>
        </Box>
      </Collapse>


      <Box

      >
        {!open && (
          <Card sx={{
            p: 2
            ,
            background: theme.colors.gradients.primary,
            // background: 'linear-gradient(180deg,rgba(238,161,93,0) 0%, rgba(241,89,42,0.4) 100%)', 
          }}>
            {/* Header */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              {/* <Typography variant="h5" fontWeight="bold">
          {t('ข้อมูลการปิดยอดล่าสุด')}
        </Typography> */}

              <Typography fontWeight="bold" color='white' sx={{ fontSize: { xs: '1rem', md: '1.2rem' }, }}>
                {t('ข้อมูลการปิดยอดรอบที่ผ่านมา')}
              </Typography>

              <Box display="flex" justifyContent="flex-end" mb={1}>
                <IconButton sx={{
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }} onClick={toggleOpen} size="small" >
                  {open ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </Box>
            </Box>

            {/* Content Section */}

          </Card>
        )}
      </Box>
    </>
  );
};

export default CloseBalanceLastMember;
