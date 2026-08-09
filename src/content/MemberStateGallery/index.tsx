'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import StarOutlineRoundedIcon from '@mui/icons-material/StarOutlineRounded';
import TopRatingRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Divider,
  LinearProgress,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useMemo, useRef, useState } from 'react';

import { BonusAvailableCard, ProfileStrip } from '@/content/Home';
import {
  getMemberPortalPreview,
  getMemberStateGallery,
  type MockMemberType,
  type MockState,
  type MockStateTone,
  type MockTransactionRow,
} from '@/mocks/memberStateGallery';

const toneStyles: Record<MockStateTone, { color: string; background: string; border: string; Icon: typeof InfoOutlinedIcon }> = {
  neutral: { color: '#475467', background: '#f2f4f7', border: '#d0d5dd', Icon: LockOutlinedIcon },
  info: { color: '#0369a1', background: '#e0f2fe', border: '#7dd3fc', Icon: InfoOutlinedIcon },
  success: { color: '#16803c', background: '#ecfdf3', border: '#86efac', Icon: CheckCircleOutlineRoundedIcon },
  warning: { color: '#a16207', background: '#fef9c3', border: '#fde68a', Icon: WarningAmberRoundedIcon },
  error: { color: '#dc2626', background: '#fef2f2', border: '#fecaca', Icon: ErrorOutlineRoundedIcon },
  primary: { color: '#7c3aed', background: '#f3e8ff', border: '#d8b4fe', Icon: StarOutlineRoundedIcon },
};

const transactionStatusStyles = {
  success: { label: 'สำเร็จ', color: '#16803c', background: '#ecfdf3' },
  pending: { label: 'รอดำเนินการ', color: '#a16207', background: '#fef9c3' },
  rejected: { label: 'ปฏิเสธ', color: '#dc2626', background: '#fef2f2' },
  refunded: { label: 'คืนเงิน', color: '#0369a1', background: '#e0f2fe' },
};

const quickActionDefinitions = [
  { id: 'live', label: 'ขึ้น Live', description: 'ยืนยันสถานะการขึ้น Live', href: '/home/vj_star_live', icon: RecordVoiceOverRoundedIcon, color: '#ef4444' },
  { id: 'voice', label: 'ห้องเสียง', description: 'เข้าร่วมห้องเสียง', href: '/voice-room', icon: GroupsOutlinedIcon, color: '#7c3aed' },
  { id: 'market', label: 'ตลาด PX', description: 'แลกเหรียญและรางวัล', href: '/px_market', icon: AppsRoundedIcon, color: '#0284c7' },
  { id: 'angpao', label: 'อังเปา', description: 'ดูรายการอังเปา', href: '/member/angpao', icon: CardGiftcardOutlinedIcon, color: '#db2777' },
  { id: 'gift', label: 'ของขวัญ', description: 'ดูของขวัญที่ได้รับ', href: '/gift_box', icon: RedeemRoundedIcon, color: '#f59e0b' },
  { id: 'training', label: 'ห้องเรียนออนไลน์', description: 'เรียนรู้ตาม App', href: '/member/training', icon: SchoolOutlinedIcon, color: '#16a34a' },
  { id: 'bank', label: 'บัญชีธนาคาร', description: 'จัดการบัญชีรับเงิน', href: '/profile?tab=bank', icon: AccountBalanceWalletOutlinedIcon, color: '#0f766e' },
  { id: 'history', label: 'ประวัติ', description: 'ดูรายการย้อนหลัง', href: '/member/history', icon: HistoryRoundedIcon, color: '#475569' },
] as const;

function StateChip({ state }: { state: MockState }) {
  const style = toneStyles[state.tone];
  const Icon = style.Icon;
  return (
    <Chip
      icon={<Icon />}
      label={state.label}
      size="small"
      sx={{
        height: 27,
        color: style.color,
        bgcolor: style.background,
        border: `1px solid ${alpha(style.border, 0.45)}`,
        fontSize: 11.5,
        fontWeight: 700,
        '& .MuiChip-icon': { color: 'inherit', fontSize: 15 },
      }}
    />
  );
}

function StateCard({ state }: { state: MockState }) {
  const style = toneStyles[state.tone];
  return (
    <Card elevation={0} sx={{ height: '100%', border: `1px solid ${alpha(style.border, 0.75)}`, borderRadius: 2.5, bgcolor: '#fff' }}>
      <CardContent sx={{ p: { xs: 1.5, md: 1.75 } }}>
        <Stack spacing={1}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
            <StateChip state={state} />
            <Typography sx={{ color: '#98a2b3', fontSize: 10.5, fontFamily: 'monospace' }}>{state.id}</Typography>
          </Stack>
          <Typography sx={{ color: '#344054', fontSize: 13, lineHeight: 1.45 }}>{state.description}</Typography>
          {state.progress !== undefined && (
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                <Typography sx={{ color: '#667085', fontSize: 11.5 }}>ความคืบหน้า</Typography>
                <Typography sx={{ color: style.color, fontSize: 11.5, fontWeight: 800 }}>{state.progress}%</Typography>
              </Stack>
              <LinearProgress variant="determinate" value={state.progress} sx={{ height: 7, borderRadius: 4, bgcolor: alpha(style.color, 0.12), '& .MuiLinearProgress-bar': { bgcolor: style.color } }} />
            </Box>
          )}
          {state.meta && <Typography sx={{ color: style.color, fontSize: 12, fontWeight: 700 }}>{state.meta}</Typography>}
        </Stack>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, description, count }: { icon: typeof PersonOutlineRoundedIcon; title: string; description?: string; count?: number }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="flex-start" spacing={1.25} sx={{ mb: 1.25 }}>
      <Box sx={{ width: 36, height: 36, flexShrink: 0, display: 'grid', placeItems: 'center', color: theme.colors.primary.main, bgcolor: alpha(theme.colors.primary.main, 0.1), borderRadius: 1.5 }}>
        <Icon sx={{ fontSize: 20 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          <Typography sx={{ color: '#172033', fontSize: { xs: 17, md: 19 }, fontWeight: 800 }}>{title}</Typography>
          {count !== undefined && <Chip label={`${count} สถานะ`} size="small" sx={{ height: 21, color: theme.colors.primary.main, bgcolor: alpha(theme.colors.primary.main, 0.08), fontSize: 10.5 }} />}
        </Stack>
        {description && <Typography sx={{ mt: 0.25, color: '#667085', fontSize: 12.5, lineHeight: 1.45 }}>{description}</Typography>}
      </Box>
    </Stack>
  );
}

function MockPortalMember({ memberType, memberName, memberId }: { memberType: MockMemberType; memberName: string; memberId: string }) {
  return {
    nick_name: memberName,
    full_name: memberName,
    user_px: memberId,
    profile: '',
    is_active: true,
    kyc_verification: [{ status: memberType === 'vj_member' ? 'approved' : 'pending' }],
  };
}

function AppPreviewCard({ state, index }: { state: MockState; index: number }) {
  const theme = useTheme();
  const appNames = ['Pati', 'TikTok', 'SUGO.', 'VOYA'];
  const appName = state.meta?.split(' · ')[0] || appNames[index % appNames.length];
  const appColor = toneStyles[state.tone].color;
  const progress = state.progress ?? (state.tone === 'success' ? 100 : state.tone === 'warning' ? 57 : 0);
  return (
    <Card elevation={0} sx={{ border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5, overflow: 'hidden', height: '100%' }}>
      <CardContent sx={{ p: { xs: 1.5, md: 1.75 } }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
          <Stack direction="row" alignItems="center" spacing={1} minWidth={0}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: alpha(appColor, 0.12), color: appColor, fontSize: 14, fontWeight: 800 }}>{appName.slice(0, 1)}</Avatar>
            <Box minWidth={0}>
              <Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 800 }}>{appName}</Typography>
              <Typography sx={{ color: theme.colors.gray.main, fontSize: 11.5 }}>แอปสังกัดของ VJ</Typography>
            </Box>
          </Stack>
          <StateChip state={state} />
        </Stack>
        <Typography sx={{ mt: 1.4, color: '#667085', fontSize: 12 }}>{state.description}</Typography>
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 1.2, mb: 0.5 }}>
          <Typography sx={{ color: '#667085', fontSize: 11.5 }}>Level Progress</Typography>
          <Typography sx={{ color: appColor, fontSize: 12, fontWeight: 800 }}>{progress}%</Typography>
        </Stack>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 7, borderRadius: 4, bgcolor: alpha(appColor, 0.1), '& .MuiLinearProgress-bar': { bgcolor: appColor } }} />
        <Button href="/member/profile" size="small" endIcon={<ChevronRightRoundedIcon />} sx={{ mt: 1, px: 0, fontSize: 12 }}>ดูข้อมูล App</Button>
      </CardContent>
    </Card>
  );
}

function TransactionTable({ rows, isVj }: { rows: MockTransactionRow[]; isVj: boolean }) {
  return (
    <TableContainer sx={{ overflowX: 'auto', border: '1px solid #edf0f2', borderRadius: 2 }}>
      <Table sx={{ minWidth: 760, '& .MuiTableCell-root': { px: 1.5, py: 1.25, whiteSpace: 'nowrap' } }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#fafbfc' }}>
            {['วันเวลา', 'ประเภท', ...(isVj ? ['แอป'] : []), 'รูปแบบ', 'รายการ', 'สถานะ', 'ยอด'].map((heading) => <TableCell key={heading} sx={{ color: '#344054', fontSize: 12, fontWeight: 800 }}>{heading}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            const status = transactionStatusStyles[row.status];
            const income = row.type === 'income';
            return (
              <TableRow key={row.id} hover>
                <TableCell sx={{ color: '#667085', fontSize: 12 }}>{row.date}</TableCell>
                <TableCell><Chip icon={income ? <ArrowUpwardRoundedIcon /> : <ArrowDownwardRoundedIcon />} label={income ? 'รายรับ' : 'รายจ่าย'} size="small" sx={{ height: 25, color: income ? '#16803c' : '#dc2626', bgcolor: income ? '#ecfdf3' : '#fef2f2', fontSize: 11, '& .MuiChip-icon': { color: 'inherit', fontSize: 14 } }} /></TableCell>
                {isVj && <TableCell sx={{ color: '#344054', fontSize: 12.5, fontWeight: 700 }}>{row.appName}</TableCell>}
                <TableCell sx={{ color: '#475467', fontSize: 12.5 }}>{row.format}</TableCell>
                <TableCell sx={{ color: '#344054', fontSize: 12.5 }}>{row.item}</TableCell>
                <TableCell><Chip label={status.label} size="small" sx={{ height: 25, color: status.color, bgcolor: status.background, fontSize: 11, fontWeight: 700 }} /></TableCell>
                <TableCell align="right" sx={{ color: income ? '#16803c' : '#dc2626', fontSize: 13, fontWeight: 800 }}>{income ? '+' : '-'}{row.amount.toLocaleString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function TopVjPreview() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const topVjs = ['Friend', 'Mild', 'Pim', 'Nana'];
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}>
        <Stack direction="row" alignItems="center" spacing={1}><TopRatingRoundedIcon sx={{ color: '#f59e0b' }} /><Typography sx={{ color: '#172033', fontSize: 19, fontWeight: 800 }}>ท็อปวีเจ STAR LIVE</Typography></Stack>
        <Button href="/home/vj_star_live" size="small" endIcon={<ChevronRightRoundedIcon />}>ดูทั้งหมด</Button>
      </Stack>
      <Box ref={railRef} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 1.5, overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>
        {topVjs.map((name) => (
          <Card key={name} elevation={0} sx={{ minWidth: { xs: 180, sm: 210 }, border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5, overflow: 'hidden', bgcolor: '#fff' }}>
            <CardActionArea href="/home/vj_star_live">
              <Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1.05', bgcolor: '#fff8f3', overflow: 'hidden' }}>
                <Box sx={{ position: 'absolute', top: '16%', left: '50%', transform: 'translateX(-50%)', width: '55%', height: '57%', overflow: 'hidden', borderRadius: 2, bgcolor: '#172033', color: '#fff', display: 'grid', placeItems: 'center' }}><Typography sx={{ fontSize: 38, fontWeight: 900 }}>{name.slice(0, 1)}</Typography></Box>
                <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 62%, rgba(241,89,42,.88) 100%)' }} />
                <Typography sx={{ position: 'absolute', left: '50%', bottom: '8%', transform: 'translateX(-50%)', color: '#fff', fontSize: 14, fontWeight: 900, whiteSpace: 'nowrap' }}>{name}</Typography>
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

export default function MemberStateGallery() {
  const [memberType, setMemberType] = useState<MockMemberType>('vj_member');
  const [stateTab, setStateTab] = useState(0);
  const gallery = useMemo(() => getMemberStateGallery(memberType), [memberType]);
  const portalPreview = useMemo(() => getMemberPortalPreview(memberType), [memberType]);
  const isVj = memberType === 'vj_member';
  const theme = useTheme();
  const mockMember = MockPortalMember({ memberType, memberName: gallery.memberName, memberId: gallery.memberId });

  const visibleActions = quickActionDefinitions.filter((item) => portalPreview.quickActions.includes(item.id));

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 2.5, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2.5, md: 3.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5}>
            <Box>
              <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 24, md: 32 }, fontWeight: 800 }}>หน้าหลักสมาชิก</Typography>
                <Chip label="Mock Preview" size="small" sx={{ color: theme.colors.primary.main, bgcolor: alpha(theme.colors.primary.main, 0.1), fontSize: 10.5, fontWeight: 800 }} />
              </Stack>
              <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: { xs: 13, md: 15 } }}>หน้าตาเดียวกับ Web Portal จริง พร้อมตัวอย่างทุกสถานะสำหรับ Dev</Typography>
            </Box>
            <ToggleButtonGroup value={memberType} exclusive onChange={(_event, value) => value && setMemberType(value)} size="small" sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, bgcolor: '#fff' }}>
              <ToggleButton value="vj_member" sx={{ px: 1.5, fontSize: 11.5, fontWeight: 700 }}>VJ User</ToggleButton>
              <ToggleButton value="general_member" sx={{ px: 1.5, fontSize: 11.5, fontWeight: 700 }}>General User</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Card elevation={0} sx={{ border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5, bgcolor: '#fff' }}>
            <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
              <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={1.5}>
                <Stack direction="row" alignItems="center" spacing={1}><InfoOutlinedIcon sx={{ color: theme.colors.primary.main }} /><Box><Typography sx={{ color: '#344054', fontSize: 13, fontWeight: 700 }}>กำลังดูตัวอย่าง</Typography><Typography sx={{ color: '#667085', fontSize: 12 }}>{gallery.memberLabel} · ข้อมูลจำลอง ไม่เชื่อม API จริง</Typography></Box></Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>{gallery.pageLinks.slice(0, 3).map((page) => <Button key={page.href} href={page.href} target="_blank" rel="noreferrer" size="small" endIcon={<OpenInNewRoundedIcon />} sx={{ fontSize: 11 }}>{page.label}</Button>)}</Stack>
              </Stack>
            </CardContent>
          </Card>

          <ProfileStrip member={mockMember} />

          <BonusAvailableCard walletBalance={isVj ? 1250 : 350} pxCoin={isVj ? 5747 : 30} withdrawEnabled={true} />

          <Box>
            <Typography sx={{ mb: 1.25, color: theme.colors.black.main, fontSize: 19, fontWeight: 800 }}>ทางลัดการใช้งาน</Typography>
            <Grid container spacing={1.5}>
              {visibleActions.map((item) => {
                const Icon = item.icon;
                return <Grid key={item.id} size={{ xs: 6, sm: 4, md: 3 }}><Card elevation={0} sx={{ height: '100%', border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5 }}><CardActionArea href={item.href} sx={{ height: '100%' }}><CardContent sx={{ p: { xs: 1.5, md: 1.75 } }}><Box sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, mb: 1.25, borderRadius: 1.75, color: item.color, bgcolor: alpha(item.color, 0.1) }}><Icon /></Box><Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 800, lineHeight: 1.3 }}>{item.label}</Typography><Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 11.5, lineHeight: 1.35 }}>{item.description}</Typography></CardContent></CardActionArea></Card></Grid>;
              })}
            </Grid>
          </Box>

          {isVj && (
            <Card elevation={0} sx={{ border: '1px solid rgba(15,23,42,.08)', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 1.75, md: 2.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}><Box><Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ภารกิจ VJ Star Live</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 13 }}>ติดตามภารกิจแยกตามสังกัด</Typography></Box><Button href="/member/profile" size="small" endIcon={<ChevronRightRoundedIcon />}>ดูสังกัด</Button></Stack>
                <Grid container spacing={1.5} sx={{ mt: 0.5 }}>{gallery.appStates.map((state, index) => <Grid key={state.id} size={{ xs: 12, sm: 6 }}><AppPreviewCard state={state} index={index} /></Grid>)}</Grid>
              </CardContent>
            </Card>
          )}

          <TopVjPreview />

          <Divider />
          <Box>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1} sx={{ mb: 1 }}>
              <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 19, fontWeight: 800 }}>ตัวอย่างทุกสถานะของระบบ</Typography><Typography sx={{ mt: 0.25, color: theme.colors.gray.main, fontSize: 12.5 }}>เลือกดูสถานะที่ Dev ต้องรองรับในหน้าจอจริง</Typography></Box>
              <Chip label={`${gallery.memberLabel} · ${portalPreview.sections.length} ส่วน`} size="small" sx={{ color: theme.colors.primary.main, bgcolor: alpha(theme.colors.primary.main, 0.08), fontSize: 11 }} />
            </Stack>
            <Tabs value={stateTab} onChange={(_event, value) => setStateTab(value)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 42, '& .MuiTab-root': { minHeight: 42, px: 1.5, fontSize: 12.5, fontWeight: 700 } }}>
              <Tab label="บัญชีและ KYC" />
              {isVj && <Tab label="App / Training / Level" />}
              <Tab label="กระเป๋าและธุรกรรม" />
              <Tab label="แจ้งเตือนและห้องเสียง" />
            </Tabs>
          </Box>

          {stateTab === 0 && <Stack spacing={2.5}><Box><SectionTitle icon={PersonOutlineRoundedIcon} title="สถานะ KYC" description="ทุกสถานะที่ Profile และ Home ต้องรองรับ" count={gallery.kycStates.length} /><Grid container spacing={1.25}>{gallery.kycStates.map((state) => <Grid key={state.id} size={{ xs: 12, sm: 6, md: 3 }}><StateCard state={state} /></Grid>)}</Grid></Box><Box><SectionTitle icon={PersonOutlineRoundedIcon} title={isVj ? 'สถานะบัญชี VJ' : 'สถานะบัญชี General User'} description={isVj ? 'ตัวอย่างสถานะบัญชีที่เกี่ยวกับการเข้าสู่ระบบ' : 'General User ไม่มี App สังกัด และใช้เฉพาะฟังก์ชันส่วนกลาง'} count={gallery.appStates.length} /><Grid container spacing={1.25}>{gallery.appStates.map((state) => <Grid key={state.id} size={{ xs: 12, sm: 6, md: isVj ? 3 : 12 }}><StateCard state={state} /></Grid>)}</Grid></Box></Stack>}

          {stateTab === 1 && isVj && <Stack spacing={2.5}><Box><SectionTitle icon={SchoolOutlinedIcon} title="บทเรียนและข้อสอบ" description="ล็อกบทเรียน, พร้อมสอบ, ผ่าน, สอบใหม่ได้ และหมดโควตา" count={gallery.trainingStates.length} /><Grid container spacing={1.25}>{gallery.trainingStates.map((state) => <Grid key={state.id} size={{ xs: 12, sm: 6, md: 4 }}><StateCard state={state} /></Grid>)}</Grid></Box><Box><SectionTitle icon={StarOutlineRoundedIcon} title="ความคืบหน้า Level" description="Level 1-4 แยกตาม App พร้อมคะแนน 100 คะแนนต่อ Level" count={gallery.levelStates.length} /><Grid container spacing={1.25}>{gallery.levelStates.map((state) => <Grid key={state.id} size={{ xs: 12, sm: 6, md: 3 }}><StateCard state={state} /></Grid>)}</Grid></Box></Stack>}

          {stateTab === 2 && <Box><SectionTitle icon={AccountBalanceWalletOutlinedIcon} title="กระเป๋า PX / อังเปา / ของขวัญ / คะแนน" description="แสดงสถานะการรับและรายการธุรกรรมตาม member_type" count={gallery.rewardStates.length} /><Grid container spacing={1.25} sx={{ mb: 2 }}>{gallery.rewardStates.map((state) => <Grid key={state.id} size={{ xs: 12, sm: 6, md: 3 }}><StateCard state={state} /></Grid>)}</Grid><Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}><HistoryRoundedIcon sx={{ color: theme.colors.primary.main }} /><Typography sx={{ color: '#172033', fontSize: 18, fontWeight: 800 }}>ธุรกรรมรวม</Typography><Chip label={isVj ? 'แยกตาม App' : 'กระเป๋า PX ไม่ระบุ App'} size="small" sx={{ fontSize: 10.5 }} /></Stack><TransactionTable rows={gallery.transactionRows} isVj={isVj} /></Box>}

          {stateTab === (isVj ? 3 : 2) && <Grid container spacing={{ xs: 2.5, md: 3 }}><Grid size={{ xs: 12, md: 7 }}><SectionTitle icon={NotificationsNoneRoundedIcon} title="แจ้งเตือน" description="แจ้งเตือนแยกรายการ พร้อมสถานะอ่านแล้วและ Deep Link" count={gallery.notificationStates.length} /><Stack spacing={1}>{gallery.notificationStates.map((item) => { const style = toneStyles[item.tone]; const Icon = style.Icon; return <Card key={item.id} elevation={0} sx={{ border: '1px solid rgba(15,23,42,.08)', borderLeft: `4px solid ${style.color}`, borderRadius: 2 }}><CardContent sx={{ p: 1.5 }}><Stack direction="row" alignItems="center" spacing={1.25}><Box sx={{ width: 34, height: 34, display: 'grid', placeItems: 'center', color: style.color, bgcolor: style.background, borderRadius: 1.5, flexShrink: 0 }}><Icon sx={{ fontSize: 19 }} /></Box><Box sx={{ minWidth: 0, flex: 1 }}><Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap"><Typography sx={{ color: '#172033', fontSize: 13.5, fontWeight: 800 }}>{item.label}</Typography><Chip label={item.unread ? 'ยังไม่อ่าน' : 'อ่านแล้ว'} size="small" sx={{ height: 20, color: item.unread ? '#b42318' : '#667085', bgcolor: item.unread ? '#fef3f2' : '#f2f4f7', fontSize: 10.5 }} /></Stack><Typography sx={{ mt: 0.25, color: '#667085', fontSize: 12 }}>{item.description}</Typography></Box><Button href={item.href} size="small" endIcon={<OpenInNewRoundedIcon />} sx={{ minWidth: 'auto', fontSize: 11.5 }}>ดู</Button></Stack></CardContent></Card>; })}</Stack></Grid><Grid size={{ xs: 12, md: 5 }}><SectionTitle icon={GroupsOutlinedIcon} title="ห้องเสียง" description="ฟังก์ชันส่วนกลางที่ VJ User และ General User เข้าได้" count={gallery.voiceStates.length} /><Stack spacing={1.25}>{gallery.voiceStates.map((state) => <StateCard key={state.id} state={state} />)}</Stack><Button href="/voice-room" variant="contained" startIcon={<GroupsOutlinedIcon />} sx={{ mt: 1.5, borderRadius: 1.5 }}>เปิดหน้าห้องเสียง</Button></Grid></Grid>}

          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}><Typography sx={{ color: '#667085', fontSize: 12 }}>Mock Preview · {gallery.memberLabel} · ใช้เป็น reference สำหรับ Frontend Integration</Typography><Typography sx={{ color: '#98a2b3', fontSize: 11 }}>ข้อมูลจำลองเท่านั้น ไม่ถูกส่งเข้า API</Typography></Stack>
        </Stack>
      </Container>
    </Box>
  );
}
