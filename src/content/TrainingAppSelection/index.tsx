'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import { Avatar, Box, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, Container, Stack, Typography, alpha, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';

import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { encrypt } from '@/utils/encryption';
import { getMemberApplications } from '@/content/Home/homeData';

function TrainingStats({ app }: { app: ReturnType<typeof getMemberApplications>[number] }) {
  const stats = [
    { label: 'บทเรียนทั้งหมด', value: app.training.totalLessons, color: '#475569' },
    { label: 'เรียนเสร็จแล้ว', value: app.training.completedLessons, color: '#16a34a' },
    { label: 'สอบผ่าน', value: app.training.passedExams, color: '#0284c7' },
    { label: 'สอบไม่ผ่าน', value: app.training.failedExams, color: '#dc2626' },
    { label: 'เหลือต้องเรียน', value: app.training.remainingLessons, color: '#d97706' },
  ];

  return (
    <Grid container spacing={.75} sx={{ mt: 1.75 }}>
      {stats.map((stat) => (
        <Grid key={stat.label} size={{ xs: 6, sm: 2.4 }}>
          <Box sx={{ px: 1, py: 1, height: '100%', borderRadius: 1.5, bgcolor: alpha(stat.color, .06), border: `1px solid ${alpha(stat.color, .12)}` }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 10.5, lineHeight: 1.25 }}>{stat.label}</Typography>
            <Typography sx={{ mt: .25, color: stat.color, fontSize: 18, fontWeight: 800 }}>{stat.value}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}

export default function TrainingAppSelection() {
  const theme = useTheme();
  const router = useRouter();
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const applications = getMemberApplications(memberResponse?.data);

  if (profileLoading || (memberId !== '0' && memberLoading)) {
    return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" spacing={1.2} alignItems="center">
              <Box sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 2, color: '#fff', background: theme.colors.gradients.primary }}><SchoolRoundedIcon /></Box>
              <Box><Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 24, md: 30 }, fontWeight: 800 }}>เลือก App เพื่อเข้าเรียน</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 14 }}>ดูสรุปการเรียนของแต่ละ App ก่อนเข้าสู่บทเรียน</Typography></Box>
            </Stack>
          </Box>

          {applications.length === 0 ? (
            <Card elevation={0} sx={{ p: 3, borderRadius: 2.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)', textAlign: 'center' }}>
              <Typography sx={{ color: theme.colors.gray.main, fontSize: 14 }}>ยังไม่มี App ที่สามารถเข้าเรียนได้</Typography>
              <Button sx={{ mt: 2 }} href="/member/profile">ดูข้อมูลสังกัด</Button>
            </Card>
          ) : (
            <Grid container spacing={1.5}>
              {applications.map((app) => (
                <Grid key={app.id} size={{ xs: 12 }}>
                  <Card elevation={0} sx={{ border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
                    <CardActionArea onClick={() => router.push(`/profile/vj_star_video/${encrypt(app.id)}`)}>
                      <CardContent sx={{ p: 2.25 }}>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Avatar src={app.logo || undefined} sx={{ width: 52, height: 52, bgcolor: alpha(app.statusColor, 0.1), color: app.statusColor, fontWeight: 800 }}>{app.name.slice(0, 1)}</Avatar>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography sx={{ color: theme.colors.black.main, fontSize: 16, fontWeight: 800 }}>{app.name}</Typography>
                            <Stack direction="row" spacing={.75} flexWrap="wrap" useFlexGap sx={{ mt: .75 }}>
                              <Chip label={app.level} size="small" sx={{ color: app.statusColor, bgcolor: alpha(app.statusColor, 0.1), fontSize: 11 }} />
                              <Chip label={app.status} size="small" icon={<CheckCircleOutlineRoundedIcon />} sx={{ color: app.statusColor, bgcolor: alpha(app.statusColor, 0.1), fontSize: 11 }} />
                            </Stack>
                          </Box>
                          <ArrowForwardRoundedIcon sx={{ color: theme.colors.primary.main }} />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.75 }}><Typography sx={{ color: theme.colors.gray.main, fontSize: 13 }}>ความคืบหน้าการเรียน</Typography><Typography sx={{ color: app.progress >= 100 ? '#16a34a' : theme.colors.primary.main, fontSize: 13, fontWeight: 800 }}>{app.progress}%</Typography></Stack>
                        <Box sx={{ mt: .75, height: 7, borderRadius: 999, bgcolor: '#edf0f3', overflow: 'hidden' }}><Box sx={{ width: `${app.progress}%`, height: '100%', borderRadius: 999, bgcolor: app.progress >= 100 ? '#16a34a' : theme.colors.primary.main }} /></Box>
                        <TrainingStats app={app} />
                      </CardContent>
                    </CardActionArea>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ px: 2.25, pb: 2.25 }}>
                      <Button fullWidth variant="contained" startIcon={<SchoolRoundedIcon />} onClick={() => router.push(`/profile/vj_star_video/${encrypt(app.id)}`)}>เข้าเรียน</Button>
                      <Button fullWidth variant="outlined" startIcon={<QuizOutlinedIcon />} onClick={() => router.push(`/member/training/${encodeURIComponent(encrypt(app.id))}/exams`)}>ดูข้อสอบทั้งหมด</Button>
                    </Stack>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid rgba(15,23,42,.08)', bgcolor: '#fff' }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start"><ErrorOutlineRoundedIcon sx={{ color: '#d97706', mt: .15 }} /><Box><Typography sx={{ fontSize: 14, fontWeight: 800 }}>การสอบจะเปิดเมื่อเรียนครบทุกหัวข้อ</Typography><Typography sx={{ mt: .35, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.6 }}>ในแต่ละบทเรียนอาจมีหลายวิดีโอ ระบบจะเปิดปุ่มเข้าสอบเมื่อทุกหัวข้อของบทนั้นมีสถานะเรียนเสร็จแล้ว</Typography></Box></Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
