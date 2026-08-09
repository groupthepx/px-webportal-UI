'use client';

import {
  Typography,
  Card,
  Box,
  styled,
  useTheme,
  Button,
  Avatar,
  IconButton,
  Dialog,
  Paper,
  Chip,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useState } from 'react';
import CountUp from 'react-countup';
import { MemberDetailModel } from '@/model/member';

import { Close, Visibility, Star, People, PersonAddDisabled, Block, Warning } from '@mui/icons-material';
import { useGetReferRewardHistoryByMemberQuery, useGetRewardHistoryMemberReferMissionQuery } from '@/lib/features/profile';
import BonusFriendsHistoryTable from './Table';
import { OverviewDetailListModel } from '@/model/overview_detail';

const CompactCard = styled(Card)(({ theme }) => ({
  background: '#ffffff',
  borderRadius: theme.general.borderRadiusLg,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `${theme.colors.primary.main}`,
  }
}));

const TitleTypography = styled(Typography)(() => ({
  color: '#000000',
  fontWeight: 700,
  letterSpacing: '-0.01em',
}));

const SubtitleTypography = styled(Typography)(() => ({
  color: '#666666',
  fontWeight: 500,
}));

const SuspendedAlert = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #fff3cd 0%, #fff8e1 100%)',
  border: '2px solid #ffc107',
  borderRadius: theme.general.borderRadiusLg,
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(255, 193, 7, 0.3)',
  animation: 'alertPulse 2s ease-in-out infinite',
  '@keyframes alertPulse': {
    '0%, 100%': {
      boxShadow: '0 4px 20px rgba(255, 193, 7, 0.3)',
      transform: 'scale(1)',
    },
    '50%': {
      boxShadow: '0 6px 30px rgba(255, 193, 7, 0.5)',
      transform: 'scale(1.01)',
    },
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #ff9800 0%, #ffc107 50%, #ff9800 100%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 2s linear infinite',
  },
  '@keyframes shimmer': {
    '0%': {
      backgroundPosition: '200% 0',
    },
    '100%': {
      backgroundPosition: '-200% 0',
    },
  },
}));

const BonusDisplay = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
  borderRadius: theme.general.borderRadius,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  padding: theme.spacing(2),
  textAlign: 'center',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    background: 'linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)',
    transform: 'scale(1.01)',
  }
}));

const BonusTypography = styled(Typography)(() => ({
  background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  fontWeight: 800,
  letterSpacing: '-0.02em',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  background: '#000000',
  color: '#ffffff',
  fontWeight: 600,
  borderRadius: theme.general.borderRadiusLg,
  padding: theme.spacing(1, 2),
  textTransform: 'none',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fontSize: '0.875rem',
  '&:hover': {
    background: '#333333',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  },
  '&.Mui-disabled': {
    background: '#e9ecef',
    color: '#adb5bd',
  }
}));

const StatChip = styled(Chip)(() => ({
  background: '#f8f9fa',
  color: '#495057',
  fontWeight: 600,
  fontSize: '0.75rem',
  height: 24,
  border: '1px solid rgba(0, 0, 0, 0.08)',
  '& .MuiChip-icon': {
    color: '#495057',
    fontSize: '0.875rem',
  }
}));

const SuspendedIcon = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #ff9800 0%, #ffc107 100%)',
  boxShadow: '0 4px 16px rgba(255, 152, 0, 0.4)',
  animation: 'iconBounce 2s ease-in-out infinite',
  '@keyframes iconBounce': {
    '0%, 100%': {
      transform: 'translateY(0) rotate(0deg)',
    },
    '25%': {
      transform: 'translateY(-4px) rotate(-5deg)',
    },
    '75%': {
      transform: 'translateY(4px) rotate(5deg)',
    },
  },
}));

interface ResultsProps {
  memberById: MemberDetailModel | null;
  organizationParamsId: string;
  overviewDetailById: OverviewDetailListModel;
}

const BonusFriendsDetails: FC<ResultsProps> = ({
  memberById,
  organizationParamsId,
  overviewDetailById
}) => {
  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  const memberId = memberById?.member_id ?? '';
  const canOpen = Boolean(organizationParamsId && memberId);

  const { data: getRewardHistoryMemberRefer } =
    useGetRewardHistoryMemberReferMissionQuery(
      { organization_id: `${organizationParamsId}`, id: `${memberId}` },
      { skip: organizationParamsId === '0' || !memberId }
    );
  const { data: getReferRewardHistory, isLoading: isLoadingReferHistory } = useGetReferRewardHistoryByMemberQuery(
    { member_id: memberId },
    { skip: !memberId }
  );

  const memberReferDetail = getReferRewardHistory?.data || [];
  const referBonus: number = memberReferDetail.reduce(
    (acc: number, cur: any) => acc + Number(cur?.refer_bonus ?? 0),
    0
  );


  const [openActionMember, setOpenAcMembertion] = useState(false);
  const handleActionMemberClose = () => setOpenAcMembertion(false);
  const handleActionMemberOpen = () => setOpenAcMembertion(true);

  // Refer Permission Management
  const allowRefer = overviewDetailById?.data?.my_organization?.allow_refer ?? false;
  const [allowReferState, setAllowReferState] = useState(allowRefer);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');


  // Sync state with prop changes
  useEffect(() => {
    setAllowReferState(allowRefer);
  }, [allowRefer]);


  return (
    <>
      <CompactCard>
        <Box p={{ xs: 2, md: 2.5 }}>
          {/* Header Section */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              variant="rounded"
              alt="reward"
              src="/assets/svg/pg/bonus_friend.svg"
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                backgroundColor: '#f8f9fa',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}
            />

            <Box flex={1} ml={2}>
              <TitleTypography variant="h6" fontSize={{ xs: '1rem', md: '1.1rem' }}>
                โบนัสแนะนำเพื่อน
              </TitleTypography>

              <Box display="flex" alignItems="center" mt={0.5}>
                <StatChip
                  icon={<People fontSize="small" />}
                  label={`${memberReferDetail.length} คน`}
                  size="small"
                  sx={{ mr: 0.5 }}
                />
              </Box>
            </Box>
          </Box>


          {/* Suspended Alert - Preview what user sees when suspended */}
          {!allowReferState && (
            <SuspendedAlert elevation={0} sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={{ xs: 1.5, md: 2 }}>
                <SuspendedIcon>
                  <Block sx={{ fontSize: 32, color: '#ffffff' }} />
                </SuspendedIcon>
                <Box flex={1}>
                  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                    <Warning sx={{ fontSize: 20, color: '#ff9800' }} />
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      fontSize={{ xs: '0.95rem', md: '1rem' }}
                      sx={{ color: '#f57c00' }}
                    >
                      ฟังก์ชันถูกระงับชั่วคราว
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontSize={{ xs: '0.8rem', md: '0.85rem' }}
                    sx={{
                      color: '#e65100',
                      fontWeight: 500,
                      lineHeight: 1.6
                    }}
                  >
                    ขออภัย ฟังก์ชันโบนัสแนะนำของบัญชีของคุณถูกระงับชั่วคราว โปรดติดต่อผู้ดูแลระบบ
                  </Typography>
                  <Box mt={1.5} display="flex" alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip
                      icon={<PersonAddDisabled sx={{ fontSize: 16 }} />}
                      label="ไม่สามารถแนะนำเพื่อนได้"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 152, 0, 0.15)',
                        color: '#f57c00',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        border: '1px solid #ff9800',
                      }}
                    />
                    {/* <Chip
                      label="👁️ ตัวอย่างที่ผู้ใช้เห็น"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        color: '#666',
                        fontWeight: 500,
                        fontSize: '0.7rem',
                        border: '1px solid rgba(0, 0, 0, 0.1)',
                      }}
                    /> */}
                  </Box>
                </Box>
              </Box>
            </SuspendedAlert>
          )}

          {/* Bonus Display Section */}
          {allowReferState &&
            <BonusDisplay>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <Star sx={{ color: '#000000', fontSize: { xs: 18, md: 20 }, mr: 1 }} />
                <BonusTypography variant="h4" fontSize={{ xs: '1.5rem', md: '1.8rem' }}>
                  <CountUp
                    start={0}
                    end={referBonus}
                    duration={1.5}
                    separator=","
                    decimals={0}
                  />
                </BonusTypography>
              </Box>
              <SubtitleTypography variant="body2" fontSize={{ xs: '0.8rem', md: '0.85rem' }}>
                {t('Coin')}
              </SubtitleTypography>
            </BonusDisplay>
          }

          {/* Action Button */}
          {allowReferState && <Box display="flex" justifyContent="center" mt={2}>
            <ActionButton
              variant="contained"
              startIcon={<Visibility />}
              onClick={handleActionMemberOpen}
              disabled={!canOpen}
              size="small"
              sx={{ minWidth: 120 }}
            >
              ดูรายละเอียด
            </ActionButton>
          </Box>}
        </Box>
      </CompactCard>
      {/* Dialog: รายละเอียดแบบป๊อปอัพ */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openActionMember}
        onClose={handleActionMemberClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: theme.general.borderRadiusLg,
            background: '#ffffff'
          }
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleActionMemberClose}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
            }
          }}
        >
          <Close />
        </IconButton>

        <Box p={3}>
          <TitleTypography variant="h5" mb={2}>
            ประวัติโบนัสแนะนำเพื่อน
          </TitleTypography>
          <BonusFriendsHistoryTable memberReferDetail={memberReferDetail} />
        </Box>
      </Dialog>
    </>
  );
};

export default BonusFriendsDetails;
