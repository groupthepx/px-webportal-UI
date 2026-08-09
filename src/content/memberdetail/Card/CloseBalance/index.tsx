import {
  Typography,
  CardContent,
  Card,
  Box,
  styled,
  useTheme,

  TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CalendarToday, EditCalendarOutlined, Stars } from '@mui/icons-material';
import { FC } from 'react';
import { MemberDetailModel } from '@/model/member';
import Grid from '@mui/material/Grid2';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { format } from "date-fns";
import CountUp from 'react-countup';


interface ResultsProps {
  member: MemberDetailModel | null;
  overviewDetailById: OverviewDetailListModel;
  ParamsId : string;
}

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    borderRadius: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 80,
    '& input': {
      textAlign: 'center',
    },
  },
});

const CloseBalanceMember: FC<ResultsProps> = ({ member, overviewDetailById , ParamsId }) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const closeMonthData = overviewDetailById && overviewDetailById.data && overviewDetailById.data.CloseMonth;


  return (
    <Card sx={{ p: 2 }}>
      {/* Header */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>


        <Typography variant="h6" fontWeight="bold"
          sx={{
            fontSize: { xs: '1rem', md: '1.2rem' },
            color: theme.palette.info.main
          }}>
          {t('ข้อมูลการทำงานปัจจุบัน')}
        </Typography>
      </Box>

      {/* Content Section */}
      <CardContent>
        <Grid container spacing={3}>
          {/* Left Section - Information */}
          <Grid size={{ xs: 12, sm: 6 }} >


            <Typography
              variant='body1'
              mb={2}
            >
              <Stars sx={{ mr: 1 }} color="primary" />
              {t('ยอดวีเจตอนนี้')}:
              <strong
                style={{
                  background: `${theme.colors.gradients.primary}`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <CountUp
                  style={{
                    marginLeft: 5
                  }}
                  start={0}
                  // end={parseInt(`${myCoin}`)}
                  end={parseInt(`${closeMonthData?.current_amount}`)}
                  duration={3}
                  separator=","
                  delay={0}
                  decimals={0}
                  decimal=""
                  prefix=""
                  suffix=" Coin"
                /></strong></Typography>

            <Typography mb={2} variant="body1">
              <CalendarToday sx={{ mr: 1 }} color="primary" />
              {t('อัพเมื่อ')}: <strong>{closeMonthData?.close_date ? `${format(new Date(closeMonthData?.close_date), "dd/MM/yyyy HH:mm:ss ")}` : ''}</strong>
            </Typography>
          </Grid>

          {/* Right Section - Work Time */}
          <Grid size={{ xs: 12, sm: 6 }} textAlign="center">
            <Typography variant="body1" fontWeight="bold">
              {t('เวลาทำงาน')}
            </Typography>
            <Box display="flex" justifyContent="center" alignItems="center" mt={1}>
              <Typography variant="body2" sx={{ mr: 1, color: 'gray' }}>
                วัน:
              </Typography>
              <StyledTextField value={closeMonthData?.amount_date_work || 0} size="small" variant="outlined" />
              <Typography variant="body2" sx={{ mx: 2, color: 'gray' }}>
                เวลา:
              </Typography>
              <StyledTextField value={closeMonthData?.amount_time_work || 0} size="small" variant="outlined" />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CloseBalanceMember;
