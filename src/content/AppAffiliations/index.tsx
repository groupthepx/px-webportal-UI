'use client';

import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { Avatar, Box, Button, Card, Chip, CircularProgress, Container, Divider, LinearProgress, Stack, Typography, alpha, styled, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import StartLive from '@/components/StartLive';
import { encrypt } from '@/utils/encryption';
import { getMemberApplications } from '@/content/Home/homeData';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';

const AppCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  border: `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
  borderRadius: 16,
  background: theme.palette.background.paper,
  boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.06)}`,
  transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '0 0 auto',
    height: 4,
    background: theme.colors.gradients.primary,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    borderColor: alpha(theme.colors.primary.main, 0.35),
    boxShadow: `0 8px 24px ${alpha(theme.palette.common.black, 0.12)}`,
  },
}));

const AppLogo = styled(Avatar)(({ theme }) => ({
  background: theme.palette.common.white,
  border: `6px solid ${alpha(theme.colors.primary.main, 0.1)}`,
  boxShadow: `0 4px 16px ${alpha(theme.palette.common.black, 0.1)}`,
}));

function formatJoinedDate(value: string) {
  if (!value) return 'N/A';
  try {
    return format(new Date(value), 'dd/MM/yyyy');
  } catch {
    return 'N/A';
  }
}

function TrainingSummary({ app }: { app: ReturnType<typeof getMemberApplications>[number] }) {
  const { totalLessons, completedLessons, passedExams, failedExams } = app.training;
  const completionPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const items = [
    { label: 'สอบผ่าน', value: passedExams, color: '#2563eb' },
    { label: 'สอบไม่ผ่าน', value: failedExams, color: '#dc2626' },
  ];

  return (
    <Box sx={{ mt: 1.25, p: { xs: 1.25, sm: 1.5 }, borderRadius: 1.5, bgcolor: '#f7f8fa', border: '1px solid rgba(15,23,42,.06)' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
        <Typography sx={{ color: 'text.primary', fontSize: { xs: '0.75rem', sm: '0.8rem' }, fontWeight: 600 }}>
          เรียนจบแล้ว {completedLessons} จาก {totalLessons} บทเรียน
        </Typography>
        <Typography sx={{ color: '#16a34a', fontSize: { xs: '0.75rem', sm: '0.8rem' }, fontWeight: 700 }}>
          {completionPercent}%
        </Typography>
      </Stack>
      <LinearProgress
        variant="determinate"
        value={completionPercent}
        sx={{
          mt: 0.75,
          height: 7,
          borderRadius: 99,
          bgcolor: '#e5e7eb',
          '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: '#16a34a' },
        }}
      />
      <Grid container spacing={0.75} sx={{ mt: 1 }}>
        {items.map((item) => (
          <Grid key={item.label} size={{ xs: 6, sm: 6 }}>
            <Box sx={{ minHeight: 48, px: 0.9, py: 0.7, borderRadius: 1, bgcolor: '#fff', borderLeft: `3px solid ${item.color}` }}>
              <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.62rem', sm: '0.68rem' }, lineHeight: 1.2 }}>{item.label}</Typography>
              <Typography sx={{ mt: 0.25, color: item.color, fontSize: { xs: '0.95rem', sm: '1rem' }, lineHeight: 1.1, fontWeight: 700 }}>{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default function AppAffiliations() {
  const theme = useTheme();
  const router = useRouter();
  const [liveDialogOpen, setLiveDialogOpen] = useState(false);
  const [liveAppId, setLiveAppId] = useState('');
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const applications = getMemberApplications(memberResponse?.data);

  if (profileLoading || (memberId !== '0' && memberLoading)) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;

  const openLiveForApp = (appId: string) => {
    setLiveAppId(appId);
    setLiveDialogOpen(true);
  };

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.5}>
          <Box>
            <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 25, md: 32 }, fontWeight: 800 }}>สังกัดของฉัน</Typography>
            <Typography sx={{ mt: .45, color: theme.colors.gray.main, fontSize: 14 }}>รายการ App ที่เชื่อมกับบัญชี VJ ของคุณ</Typography>
          </Box>

          {applications.length === 0 ? (
            <Card elevation={0} sx={{ p: 5, textAlign: 'center', borderRadius: 2.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)' }}>
              <Typography sx={{ fontWeight: 800 }}>ยังไม่มี App ในบัญชี</Typography>
              <Typography sx={{ mt: .5, color: theme.colors.gray.main, fontSize: 13 }}>เมื่อมีการอนุมัติสังกัด รายการจะแสดงที่หน้านี้</Typography>
            </Card>
          ) : (
            <Grid container spacing={{ xs: 1.5, md: 2 }}>
              {applications.map((app) => (
                <Grid key={app.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <AppCard sx={{ bgcolor: app.isActive ? undefined : alpha(theme.colors.gray.main, 0.05) }}>
                    <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1.5 }}>
                        <Chip
                          icon={app.isActive ? <CheckCircleOutlinedIcon sx={{ fontSize: '0.9rem !important' }} /> : <CancelOutlinedIcon sx={{ fontSize: '0.9rem !important' }} />}
                          label={app.isActive ? 'ใช้งาน' : 'ปิดใช้งาน'}
                          size="small"
                          sx={{ height: 24, color: app.isActive ? '#008f37' : '#d32f2f', bgcolor: app.isActive ? '#ddffd0' : '#ffe1e1', fontSize: { xs: '0.7rem', md: '0.75rem' }, fontWeight: 600 }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <AppLogo variant="rounded" src={app.logo || undefined} sx={{ width: { xs: 56, sm: 60, md: 64 }, height: { xs: 56, sm: 60, md: 64 }, mb: 1.5, borderRadius: 1.5 }}>
                          {app.name.slice(0, 1)}
                        </AppLogo>
                        <Typography sx={{ color: theme.colors.primary.main, textAlign: 'center', fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' }, lineHeight: 1.1, fontWeight: 700 }}>{app.name}</Typography>
                        <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: { xs: '0.75rem', md: '0.8125rem' }, fontWeight: 600 }}>เข้าร่วมวันที่: {formatJoinedDate(app.joinedAt)}</Typography>
                      </Box>

                      <Stack spacing={0.5} sx={{ mb: 2 }}>
                        {[
                          { Icon: AccountCircleOutlinedIcon, label: 'User ID', value: app.userId },
                          { Icon: HomeOutlinedIcon, label: 'ไอดีห้อง', value: app.roomId },
                          { Icon: ContactSupportOutlinedIcon, label: 'ไอดีผู้แนะนำ', value: app.referId },
                        ].map(({ Icon, label, value }) => (
                          <Stack key={label} direction="row" spacing={1.25} alignItems="center">
                            <Icon sx={{ color: theme.colors.primary.main, fontSize: { xs: '1rem', md: '1.1rem' } }} />
                            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.875rem' }, lineHeight: 1.25 }}>
                              <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>{label}:</Box> {value}
                            </Typography>
                          </Stack>
                        ))}
                      </Stack>

                      <Box sx={{ p: { xs: 1.5, md: 2 }, border: '1px solid #f3d2c8', borderRadius: 1.5, bgcolor: '#fbf8f7' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', md: '0.75rem' }, fontWeight: 700, mb: 1 }}>รายได้ที่ทำได้</Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box sx={{ width: { xs: 28, md: 30 }, height: { xs: 28, md: 30 }, borderRadius: 1, bgcolor: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.08)' }}>
                            <Image src="/assets/svg/pg/PX_Coin.svg" alt="PX Coin" width={30} height={30} style={{ padding: 3 }} />
                          </Box>
                          <Box>
                            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.7rem', md: '0.75rem' } }}>ยอด PX COIN</Typography>
                            <Typography sx={{ color: '#ef7540', fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' }, lineHeight: 1.1, fontWeight: 700 }}>{app.coinBalance.toLocaleString()}</Typography>
                          </Box>
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #f3d2c8' }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.875rem' } }}>LEVEL</Typography>
                          <Chip
                            label={app.level}
                            variant="outlined"
                            size="small"
                            clickable
                            onClick={() => router.push(`/member/level-progress/${encrypt(app.id)}`)}
                            sx={{ height: 26, color: theme.colors.primary.main, borderColor: theme.colors.primary.main, fontSize: { xs: '0.75rem', md: '0.8125rem' }, fontWeight: 500 }}
                          />
                        </Stack>
                      </Box>

                      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #f3d2c8' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.875rem' }, fontWeight: 700 }}>ความคืบหน้าการเรียน</Typography>
                        <TrainingSummary app={app} />
                      </Box>

                      <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #f3d2c8' }}>
                        <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.8rem', md: '0.875rem' }, fontWeight: 700, mb: 1 }}>กิจกรรมของ App</Typography>
                        <Grid container spacing={1}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<CalendarMonthOutlinedIcon />} href={`/profile/${encrypt(app.id)}`} sx={{ minHeight: 36, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              โบนัสสังกัด
                            </Button>
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Button fullWidth size="small" variant="outlined" startIcon={<SchoolOutlinedIcon />} href={`/profile/vj_star_video/${encrypt(app.id)}`} sx={{ minHeight: 36, fontSize: { xs: '0.7rem', md: '0.75rem' } }}>
                              เข้าเรียน
                            </Button>
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Button fullWidth size="small" variant="contained" startIcon={<LiveTvOutlinedIcon />} onClick={() => openLiveForApp(app.id)} sx={{ minHeight: 36, fontSize: { xs: '0.7rem', md: '0.75rem' }, background: theme.colors.gradients.primary, '&:hover': { background: theme.colors.gradients.primaryHover } }}>
                              ขึ้น Live
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>

                    <Divider />
                  </AppCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
      <StartLive key={liveAppId || 'start-live'} open={liveDialogOpen} onOpenChange={setLiveDialogOpen} initialOrganizationId={liveAppId} hideTrigger />
    </Box>
  );
}
