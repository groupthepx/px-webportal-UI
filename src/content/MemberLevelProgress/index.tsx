'use client';

import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HouseRoundedIcon from '@mui/icons-material/HouseRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import { alpha, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';

import BackToPreviousButton from '@/components/BackToPreviousButton';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { decrypt } from '@/utils/encryption';
import { buildUploadUrl, getMemberApplications } from '@/content/Home/homeData';

type ConditionMode = 'auto' | 'manual';
type ConditionKey = 'app' | 'vj-active' | 'training' | 'line-lv1' | 'house-meeting' | 'lesson-1' | 'lesson-2' | 'lesson-3' | 'line-lv2' | 'lesson-4' | 'sapphipe' | 'star-live';

type LevelCondition = {
  key: ConditionKey;
  label: string;
  mode: ConditionMode;
  icon: typeof SchoolRoundedIcon;
};

type LevelDefinition = {
  level: number;
  title: string;
  points: number;
  conditions: LevelCondition[];
};

const levelDefinitions: LevelDefinition[] = [
  {
    level: 1,
    title: 'เริ่มต้นใช้งาน',
    points: 100,
    conditions: [
      { key: 'app', label: 'มี App ทำงาน', mode: 'auto', icon: GroupsRoundedIcon },
      { key: 'vj-active', label: 'ผ่าน VJ', mode: 'auto', icon: CheckCircleRoundedIcon },
      { key: 'training', label: 'ผ่าน VJ / ฝึก 7 วัน', mode: 'manual', icon: SchoolRoundedIcon },
      { key: 'line-lv1', label: 'เข้ากลุ่มไลน์ LV1', mode: 'manual', icon: GroupsRoundedIcon },
    ],
  },
  {
    level: 2,
    title: 'พัฒนาทักษะ VJ',
    points: 100,
    conditions: [
      { key: 'house-meeting', label: 'เข้า House Meeting', mode: 'manual', icon: HouseRoundedIcon },
      { key: 'lesson-1', label: 'จบบทเรียนที่ 1 · แจ็คผู้ฆ่ายักษ์', mode: 'auto', icon: SchoolRoundedIcon },
      { key: 'lesson-2', label: 'จบบทเรียนที่ 2 · แจ็คผู้ฆ่ายักษ์', mode: 'auto', icon: SchoolRoundedIcon },
      { key: 'lesson-3', label: 'จบบทเรียนที่ 3 · แจ็คผู้ฆ่ายักษ์', mode: 'auto', icon: SchoolRoundedIcon },
      { key: 'line-lv2', label: 'เข้ากลุ่มไลน์ LV2', mode: 'manual', icon: GroupsRoundedIcon },
    ],
  },
  {
    level: 3,
    title: 'ยกระดับความสามารถ',
    points: 100,
    conditions: [
      { key: 'lesson-4', label: 'ผ่านบทเรียนทักษะพิเศษอุปกรณ์ไลฟ์', mode: 'auto', icon: SchoolRoundedIcon },
      { key: 'sapphipe', label: 'ได้รับ Sapphire', mode: 'auto', icon: StarRoundedIcon },
    ],
  },
  {
    level: 4,
    title: 'STAR LIVE',
    points: 100,
    conditions: [
      { key: 'star-live', label: 'ขึ้น VJ STAR LIVE', mode: 'manual', icon: LiveTvRoundedIcon },
    ],
  },
];

function decodeAppId(value?: string) {
  if (!value) return '';
  try {
    return String(decrypt(decodeURIComponent(value)));
  } catch {
    return decodeURIComponent(value);
  }
}

function getConditionState(key: ConditionKey, organization: any) {
  const lessonProgress = organization?.lesson_progress || organization?.course_progress || {};
  const completedLessons = organization?.completed_lessons || [];
  const hasLesson = (lessonNo: number) => Boolean(
    lessonProgress?.[String(lessonNo)] ||
    lessonProgress?.[`lesson_${lessonNo}`] ||
    organization?.[`lesson_${lessonNo}_completed`] ||
    completedLessons.includes(lessonNo) ||
    completedLessons.includes(String(lessonNo))
  );

  switch (key) {
    case 'app': return organization?.is_active !== false;
    case 'vj-active': return Boolean(organization?.vj_active);
    case 'training': return Boolean(organization?.train_ten_step);
    case 'line-lv1': return Boolean(organization?.add_line_vj);
    case 'house-meeting': return Boolean(organization?.meeting_policy_app || organization?.meeting_policy_px);
    case 'lesson-1': return hasLesson(1);
    case 'lesson-2': return hasLesson(2);
    case 'lesson-3': return hasLesson(3);
    case 'line-lv2': return Boolean(organization?.group_vj);
    case 'lesson-4': return hasLesson(4);
    case 'sapphipe': return Boolean(organization?.sapphipe);
    case 'star-live': return Boolean(organization?.star_live || organization?.vj_star_live || organization?.star_live_approved);
    default: return false;
  }
}

function LevelCard({ definition, organization }: { definition: LevelDefinition; organization: any }) {
  const theme = useTheme();
  const statuses = definition.conditions.map((condition) => ({ ...condition, completed: getConditionState(condition.key, organization) }));
  const completedCount = statuses.filter((condition) => condition.completed).length;
  const progress = Math.round((completedCount / statuses.length) * 100);
  const levelComplete = progress === 100;

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: levelComplete ? alpha('#16a34a', 0.35) : 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
      <CardContent sx={{ p: { xs: 1.75, md: 2.25 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', color: '#fff', background: levelComplete ? '#16a34a' : theme.colors.gradients.primary, fontSize: 13, fontWeight: 800 }}>{definition.level}</Box>
              <Typography sx={{ color: theme.colors.black.main, fontSize: 17, fontWeight: 800 }}>Level {definition.level}</Typography>
              <Chip size="small" label={levelComplete ? 'ผ่านแล้ว' : 'กำลังดำเนินการ'} sx={{ color: levelComplete ? '#16a34a' : '#b45309', bgcolor: levelComplete ? '#ecfdf3' : '#fff7ed', fontSize: 11 }} />
            </Stack>
            <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 13 }}>{definition.title}</Typography>
            <Typography sx={{ mt: 0.35, color: levelComplete ? '#16a34a' : theme.colors.gray.main, fontSize: 12, fontWeight: levelComplete ? 800 : 500 }}>
              {levelComplete ? `ได้รับแล้ว ${definition.points} คะแนน` : `ผ่าน Level นี้จะได้รับ ${definition.points} คะแนน`}
            </Typography>
          </Box>
          <Typography sx={{ color: levelComplete ? '#16a34a' : theme.colors.primary.main, fontSize: 15, fontWeight: 800 }}>{progress}%</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progress} sx={{ mt: 1.5, height: 7, borderRadius: 4, bgcolor: '#edf0f3', '& .MuiLinearProgress-bar': { bgcolor: levelComplete ? '#16a34a' : theme.colors.primary.main } }} />
        <Stack divider={<Divider flexItem />} sx={{ mt: 1.25 }}>
          {statuses.map((condition) => {
            const Icon = condition.icon;
            return <Stack key={condition.key} direction="row" alignItems="center" spacing={1.1} sx={{ py: 1 }}><Box sx={{ display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 1.25, color: condition.completed ? '#16a34a' : '#98a2b3', bgcolor: condition.completed ? '#ecfdf3' : '#f2f4f7', flexShrink: 0 }}><Icon sx={{ fontSize: 17 }} /></Box><Box sx={{ minWidth: 0, flex: 1 }}><Typography sx={{ color: theme.colors.black.main, fontSize: 13, fontWeight: 600 }}>{condition.label}</Typography><Typography sx={{ mt: 0.15, color: theme.colors.gray.main, fontSize: 11 }}>{condition.mode === 'auto' ? 'อัตโนมัติ' : 'อนุมัติด้วยมือ'}</Typography></Box><Chip size="small" icon={condition.completed ? <CheckCircleRoundedIcon /> : <SyncRoundedIcon />} label={condition.completed ? 'สำเร็จ' : 'รอดำเนินการ'} sx={{ color: condition.completed ? '#16a34a' : '#b45309', bgcolor: condition.completed ? '#ecfdf3' : '#fff7ed', fontSize: 11, flexShrink: 0 }} /></Stack>;
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default function MemberLevelProgress() {
  const params = useParams<{ appId: string }>();
  const appId = useMemo(() => decodeAppId(params?.appId), [params?.appId]);
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const theme = useTheme();
  const member = memberResponse?.data;
  const applications = getMemberApplications(member);
  const application = applications.find((item) => String(item.id) === appId);
  const organization = member?.member_organization?.find((item: any) => String(item.organization_id) === appId);

  if (profileLoading || (memberId !== '0' && memberLoading)) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;

  if (!application || !organization) {
    return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center', bgcolor: '#f7f8fa', p: 3 }}><Stack alignItems="center" spacing={1.5}><Typography sx={{ fontSize: 18, fontWeight: 800 }}>ไม่พบข้อมูล App</Typography><Button href="/home" variant="outlined">กลับหน้าหลัก</Button></Stack></Box>;
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={{ xs: 2.5, md: 3 }}>
          <BackToPreviousButton fallbackHref="/home" />
          <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)' }}>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar src={buildUploadUrl(application.logo) || undefined} sx={{ width: 58, height: 58, bgcolor: alpha(application.statusColor, 0.1), color: application.statusColor, fontWeight: 800 }}>{application.name.slice(0, 1)}</Avatar>
                  <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 21, fontWeight: 800 }}>ความคืบหน้า Level</Typography><Typography sx={{ mt: 0.3, color: theme.colors.gray.main, fontSize: 14 }}>{application.name}</Typography></Box>
                </Stack>
                <Chip label={`${application.level} · ${application.progress}%`} sx={{ color: application.statusColor, bgcolor: alpha(application.statusColor, 0.1), fontWeight: 700 }} />
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}><Typography sx={{ color: theme.colors.gray.main, fontSize: 13 }}>User ID: {application.userId}</Typography><Typography sx={{ color: theme.colors.gray.main, fontSize: 13 }}>ไอดีห้อง: {application.roomId}</Typography></Stack>
            </CardContent>
          </Card>

          <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 19, fontWeight: 800 }}>เงื่อนไขการเลื่อน Level</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 13 }}>แสดงตามเงื่อนไขที่ตั้งไว้ในระบบ Back Office และแยกตาม App นี้</Typography></Box>
          <Grid container spacing={1.5}>{levelDefinitions.map((definition) => <Grid key={definition.level} size={{ xs: 12, md: 6 }}><LevelCard definition={definition} organization={organization} /></Grid>)}</Grid>
        </Stack>
      </Container>
    </Box>
  );
}
