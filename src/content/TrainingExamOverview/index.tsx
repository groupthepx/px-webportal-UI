'use client';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { getMemberApplications } from '@/content/Home/homeData';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { decrypt, encrypt } from '@/utils/encryption';

type ExamStatus = 'passed' | 'retryable' | 'ready' | 'locked';

type ExamItem = {
  id: string;
  lessonId: string;
  title: string;
  description: string;
  status: ExamStatus;
  score?: string;
  attemptsRemaining?: number;
  maxAttempts?: number;
  isMock?: boolean;
};

const statusConfig: Record<ExamStatus, { label: string; color: string; background: string }> = {
  passed: { label: 'สอบผ่านแล้ว', color: '#16803c', background: '#e9f9e7' },
  retryable: { label: 'ยังไม่ผ่าน · สอบใหม่ได้', color: '#b45309', background: '#fff4d6' },
  ready: { label: 'พร้อมสอบ', color: '#c65b14', background: '#fff0e4' },
  locked: { label: 'ยังไม่เปิดให้สอบ', color: '#5f6368', background: '#f1f2f4' },
};

function decodeRouteValue(value?: string) {
  if (!value) return '';
  try {
    return String(decrypt(decodeURIComponent(value)));
  } catch {
    return decodeURIComponent(value);
  }
}

function buildMockExams(): ExamItem[] {
  return [
    { id: 'mock-passed', lessonId: 'lesson-1', title: 'บทที่ 1 · พื้นฐานการเริ่มต้นเป็น VJ', description: 'ทำข้อสอบผ่านแล้ว ระบบบันทึกผลสำเร็จ', status: 'passed', score: '5/5 คะแนน', isMock: true },
    { id: 'mock-retryable', lessonId: 'lesson-2', title: 'บทที่ 2 · ทักษะการทำงานกับผู้ชม', description: 'สอบยังไม่ผ่าน แต่ยังมีโควตาให้สอบใหม่ตามที่ Admin กำหนด', status: 'retryable', score: '3/5 คะแนน', attemptsRemaining: 2, maxAttempts: 3, isMock: true },
    { id: 'mock-ready', lessonId: 'lesson-3', title: 'บทที่ 3 · แนวทางการทำงานในสถานการณ์จริง', description: 'เรียนครบทุกหัวข้อแล้ว สามารถเข้าสู่หน้าข้อสอบได้', status: 'ready', attemptsRemaining: 3, maxAttempts: 3, isMock: true },
    { id: 'mock-locked', lessonId: 'lesson-4', title: 'บทที่ 4 · ทักษะขั้นสูง', description: 'ต้องเรียนหัวข้อในบทนี้ให้ครบก่อน ระบบจึงจะเปิดข้อสอบ', status: 'locked', isMock: true },
  ];
}

function ExamStatusChip({ status }: { status: ExamStatus }) {
  const config = statusConfig[status];
  const Icon = status === 'passed' ? CheckCircleRoundedIcon : status === 'retryable' ? ReplayRoundedIcon : status === 'locked' ? LockOutlinedIcon : PlayArrowRoundedIcon;
  return <Chip size="small" icon={<Icon sx={{ fontSize: '15px !important' }} />} label={config.label} sx={{ color: config.color, bgcolor: config.background, fontSize: 11.5, fontWeight: 800 }} />;
}

function ExamCard({ exam, appId }: { exam: ExamItem; appId: string }) {
  const theme = useTheme();
  const router = useRouter();
  const config = statusConfig[exam.status];
  const canOpen = exam.status === 'ready' || exam.status === 'retryable';

  const openExam = () => {
    if (!canOpen) return;
    router.push(`/member/training/${encodeURIComponent(encrypt(appId))}/exam/${encodeURIComponent(encrypt(exam.lessonId))}`);
  };

  return (
    <Card elevation={0} sx={{ height: '100%', borderRadius: 2.5, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`, borderLeft: `4px solid ${config.color}` }}>
      <CardContent sx={{ p: { xs: 1.75, sm: 2.25 } }}>
        <Stack spacing={1.5} height="100%">
          <Stack direction="row" spacing={1.25} alignItems="flex-start">
            <Box sx={{ width: 40, height: 40, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: 1.5, color: config.color, bgcolor: config.background }}>
              {exam.status === 'locked' ? <LockOutlinedIcon /> : <QuizOutlinedIcon />}
            </Box>
            <Box minWidth={0} flex={1}>
              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography sx={{ color: theme.colors.black.main, fontSize: 15, fontWeight: 800, lineHeight: 1.35 }}>{exam.title}</Typography>
                {exam.isMock && <Chip size="small" label="ตัวอย่าง" sx={{ height: 20, color: '#64748b', bgcolor: '#f1f5f9', fontSize: 10.5 }} />}
              </Stack>
              <Typography sx={{ mt: 0.55, color: theme.colors.gray.main, fontSize: 12.5, lineHeight: 1.6 }}>{exam.description}</Typography>
            </Box>
          </Stack>

          <ExamStatusChip status={exam.status} />

          <Box sx={{ minHeight: 42 }}>
            {exam.score && <Typography sx={{ color: theme.colors.black.main, fontSize: 13, fontWeight: 700 }}>{exam.score}</Typography>}
            {typeof exam.attemptsRemaining === 'number' && (
              <Stack direction="row" justifyContent="space-between" sx={{ mt: exam.score ? 0.75 : 0 }}>
                <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>โควตาสอบคงเหลือ</Typography>
                <Typography sx={{ color: exam.status === 'retryable' ? '#b45309' : theme.colors.primary.main, fontSize: 12, fontWeight: 800 }}>{exam.attemptsRemaining}/{exam.maxAttempts} ครั้ง</Typography>
              </Stack>
            )}
          </Box>

          <Box flex={1} />
          <Button fullWidth variant={canOpen ? 'contained' : 'outlined'} disabled={!canOpen} startIcon={exam.status === 'retryable' ? <ReplayRoundedIcon /> : exam.status === 'ready' ? <PlayArrowRoundedIcon /> : exam.status === 'passed' ? <CheckCircleRoundedIcon /> : <LockOutlinedIcon />} onClick={openExam} sx={{ borderRadius: 1.5, fontSize: 12.5 }}>
            {exam.status === 'retryable' ? 'ทำข้อสอบใหม่' : exam.status === 'ready' ? 'เริ่มทำข้อสอบ' : exam.status === 'passed' ? 'สอบผ่านแล้ว' : 'เรียนให้ครบก่อน'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function TrainingExamOverview() {
  const theme = useTheme();
  const router = useRouter();
  const routeParams = useParams<{ appId?: string }>();
  const appId = useMemo(() => decodeRouteValue(routeParams?.appId), [routeParams?.appId]);
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const application = getMemberApplications(memberResponse?.data).find((item) => item.id === appId);
  const [showMockCases, setShowMockCases] = useState(true);
  const exams = showMockCases ? buildMockExams() : [];

  if (profileLoading || (memberId !== '0' && memberLoading)) {
    return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  const training = application?.training;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 2.5, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={2.25}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button variant="text" startIcon={<ArrowBackRoundedIcon />} onClick={() => router.back()} sx={{ minWidth: 0, px: 0.5, color: theme.colors.gray.main, fontSize: 12.5 }}>กลับ</Button>
          </Stack>

          <Card elevation={0} sx={{ borderRadius: 2.5, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}` }}>
            <CardContent sx={{ p: { xs: 2, md: 2.75 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <Avatar src={application?.logo || undefined} variant="rounded" sx={{ width: 56, height: 56, bgcolor: alpha(theme.colors.primary.main, 0.1), color: theme.colors.primary.main, fontWeight: 800 }}>{application?.name?.slice(0, 1) || 'A'}</Avatar>
                  <Box>
                    <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 20, md: 24 }, fontWeight: 800 }}>ข้อสอบของ {application?.name || 'App ของคุณ'}</Typography>
                    <Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 13 }}>รวมรายการข้อสอบตามบทเรียนของ App นี้</Typography>
                  </Box>
                </Stack>
                <Button variant={showMockCases ? 'contained' : 'outlined'} onClick={() => setShowMockCases((current) => !current)} sx={{ borderRadius: 1.5, fontSize: 12.5 }}>{showMockCases ? 'ซ่อนตัวอย่างทุกสถานะ' : 'แสดงตัวอย่างทุกสถานะ'}</Button>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={1}>
                {[
                  ['บทเรียนทั้งหมด', training?.totalLessons || 0, '#475569'],
                  ['สอบผ่าน', training?.passedExams || 0, '#16803c'],
                  ['สอบไม่ผ่าน', training?.failedExams || 0, '#b45309'],
                  ['ยังไม่เปิดสอบ', training?.remainingLessons || 0, '#5f6368'],
                ].map(([label, value, color]) => (
                  <Grid item xs={6} sm={3} key={label as string}>
                    <Box sx={{ p: 1.25, borderRadius: 1.5, bgcolor: alpha(color as string, 0.06), border: `1px solid ${alpha(color as string, 0.12)}` }}>
                      <Typography sx={{ color: 'text.secondary', fontSize: 11 }}>{label}</Typography>
                      <Typography sx={{ mt: 0.25, color: color as string, fontSize: 21, fontWeight: 800 }}>{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Box>
            <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>รายการข้อสอบ</Typography>
            <Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 12.5 }}>ตรวจสอบสถานะและสิทธิ์สอบของแต่ละบทเรียน</Typography>
          </Box>

          {exams.length === 0 ? (
            <Card elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 2.5, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}` }}>
              <QuizOutlinedIcon sx={{ color: theme.colors.primary.main, fontSize: 48 }} />
              <Typography sx={{ mt: 1, fontSize: 16, fontWeight: 800 }}>ยังไม่มีข้อมูลข้อสอบ</Typography>
              <Typography sx={{ mt: 0.4, color: 'text.secondary', fontSize: 13 }}>เมื่อเชื่อมต่อข้อมูลข้อสอบจริง รายการจะแสดงที่หน้านี้</Typography>
            </Card>
          ) : (
            <Grid container spacing={1.5}>
              {exams.map((exam) => <Grid item xs={12} md={6} key={exam.id}><ExamCard exam={exam} appId={appId} /></Grid>)}
            </Grid>
          )}

          <Card elevation={0} sx={{ borderRadius: 2.5, border: `1px solid ${alpha(theme.colors.primary.main, 0.18)}`, bgcolor: alpha(theme.colors.primary.main, 0.035) }}>
            <CardContent sx={{ p: 2 }}>
              <Stack direction="row" spacing={1} alignItems="flex-start"><ErrorOutlineRoundedIcon sx={{ color: theme.colors.primary.main, mt: 0.1 }} /><Box><Typography sx={{ color: theme.colors.black.main, fontSize: 13.5, fontWeight: 800 }}>รูปแบบคำถามในข้อสอบ</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 12.5, lineHeight: 1.65 }}>ข้อสอบรองรับการเลือกคำตอบ 1 ข้อ, เลือกคำตอบหลายข้อ และคำถามแบบถูก / ผิด</Typography></Box></Stack>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </Box>
  );
}
