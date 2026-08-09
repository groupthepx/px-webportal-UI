'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import AppsRoundedIcon from '@mui/icons-material/AppsRounded';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import StarsRoundedIcon from '@mui/icons-material/StarsRounded';
import TopRatingRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import { alpha, Avatar, Box, Button, Card, CardActionArea, CardContent, Chip, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress, Stack, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import StartLive from '@/components/StartLive';
import PublicHomeV2 from '@/content/public-home-v2';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { useGetMyLivePointsQuery } from '@/lib/features/px_market_product';
import { useGetTopVJListAllQuery } from '@/lib/features/topvj';
import type { TopVJModelDetail } from '@/model/top_vj';
import { encrypt } from '@/utils/encryption';
import { buildUploadUrl, getKycSummary, getMemberApplications, getMemberDisplayName } from './homeData';
import { getLiveShortcutAppId, toggleMissionView, type MissionView } from './homeInteractions';
import { getAppShortcutDestination } from './shortcutRouting';

const quickActions: Array<{ label: string; description: string; href?: string; action?: 'live' | 'affiliate_bonus'; icon: typeof LiveTvOutlinedIcon; color: string; vjOnly?: boolean }> = [
  { label: 'ขึ้น Live', description: 'ยืนยันสถานะการขึ้น Live', action: 'live', icon: LiveTvOutlinedIcon, color: '#ef4444', vjOnly: true },
  { label: 'ห้องเสียง', description: 'เข้าร่วมห้องเสียง', href: '/voice-room', icon: GroupsOutlinedIcon, color: '#7c3aed', vjOnly: true },
  { label: 'ตลาด PX', description: 'แลกเหรียญและรางวัล', href: '/px_market', icon: AppsRoundedIcon, color: '#0284c7' },
  { label: 'อังเปา', description: 'ดูรายการอังเปาที่ได้รับ', href: '/member/angpao', icon: CardGiftcardOutlinedIcon, color: '#db2777' },
  { label: 'ของขวัญ', description: 'ดูของขวัญที่ได้รับ', href: '/gift_box', icon: RedeemRoundedIcon, color: '#f59e0b' },
  { label: 'ห้องเรียนออนไลน์', description: 'เรียนรู้ตาม App ของคุณ', href: '/member/training', icon: SchoolOutlinedIcon, color: '#16a34a', vjOnly: true },
  { label: 'โบนัสสังกัด', description: 'ดูโบนัสของ App ที่สังกัด', action: 'affiliate_bonus', icon: AccountBalanceWalletOutlinedIcon, color: '#0f766e', vjOnly: true },
  { label: 'บัญชีธนาคาร', description: 'จัดการบัญชีสำหรับรับเงิน', href: '/profile?tab=bank', icon: AccountBalanceWalletOutlinedIcon, color: '#0f766e' },
  { label: 'ประวัติ', description: 'ดูรายการย้อนหลัง', href: '/member/history', icon: HistoryRoundedIcon, color: '#475569' },
];

const fallbackTopVjs: Array<Partial<TopVJModelDetail>> = [
  { nick_name: 'Friend', full_name: 'นานา', profile: '' },
  { nick_name: 'Mild', full_name: 'มิลด์', profile: '' },
  { nick_name: 'Pim', full_name: 'พิม', profile: '' },
];

function useAutoScrollRail(railRef: React.MutableRefObject<HTMLDivElement | null>, delay = 4500) {
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    const timer = window.setInterval(() => {
      const step = Math.max(rail.clientWidth * 0.82, 240);
      const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
      rail.scrollTo({ left: atEnd ? 0 : rail.scrollLeft + step, behavior: 'smooth' });
    }, delay);
    return () => window.clearInterval(timer);
  }, [delay, railRef]);
}

export function ProfileStrip({ member }: { member: any }) {
  const theme = useTheme();
  const { data: session } = useSession();
  const kyc = getKycSummary(member);
  const displayName = getMemberDisplayName(member, session?.user?.name || 'VJ Member');

  return (
    <Box sx={{ p: { xs: 2.25, md: 3 }, borderRadius: 3, color: '#fff', background: theme.colors.gradients.primary, boxShadow: `0 14px 30px ${alpha(theme.colors.primary.main, 0.22)}` }}>
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar src={buildUploadUrl(member?.profile) || undefined} sx={{ width: 58, height: 58, bgcolor: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 24, fontWeight: 800 }}>
            {displayName.slice(0, 1).toUpperCase()}
          </Avatar>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 800 }}>{displayName}</Typography>
            <Typography sx={{ mt: 0.25, color: 'rgba(255,255,255,.8)', fontSize: 13 }}>PX ID: {member?.user_px || '-'}</Typography>
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip aria-label="สถานะ KYC" label={kyc.label} size="small" icon={kyc.state === 'approved' ? <CheckCircleRoundedIcon /> : undefined} onClick={() => window.location.assign('/profile?tab=kyc')} sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.18)', cursor: 'pointer' }} />
          <Chip label={member?.is_active === false ? 'บัญชีปิดใช้งาน' : 'บัญชีใช้งานอยู่'} size="small" sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,.18)' }} />
        </Stack>
      </Stack>
    </Box>
  );
}

export function BonusAvailableCard({ walletBalance, pxCoin, points = 0, withdrawEnabled }: { walletBalance: number; pxCoin: number; points?: number; withdrawEnabled: boolean }) {
  const theme = useTheme();
  const details: Array<{ icon?: string; Icon?: typeof StarsRoundedIcon; label: string; value: string; actionLabel: string; href: string }> = [
    { icon: '/assets/svg/pg/wallte.svg', label: 'ยอดเงิน', value: `${walletBalance.toLocaleString()} ฿`, actionLabel: withdrawEnabled ? 'ถอน' : 'ยืนยัน KYC', href: withdrawEnabled ? '/profile/withdraw_money' : '/profile?tab=kyc' },
    { icon: '/assets/svg/pg/PX_Coin.svg', label: 'ยอด PX Coin', value: pxCoin.toLocaleString(), actionLabel: 'แลก', href: '/profile/withdraw_coin' },
    { Icon: StarsRoundedIcon, label: 'คะแนนที่ใช้ได้', value: points.toLocaleString(), actionLabel: 'ไปตลาด PX', href: '/px_market' },
  ];

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5, borderBottom: `4px solid ${theme.colors.primary.main}` }}>
      <CardContent sx={{ p: { xs: 1.75, md: 2.25 } }}>
        <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>จำนวนโบนัสที่ใช้ได้</Typography>
        <Stack spacing={1.25} sx={{ mt: 1.25 }}>
          {details.map((item) => (
            <Stack key={item.label} direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
                {item.Icon ? <item.Icon sx={{ width: 32, height: 32, color: '#16a34a', flexShrink: 0 }} /> : <Box component="img" src={item.icon} alt={item.label} sx={{ width: 32, height: 32, objectFit: 'contain', flexShrink: 0 }} />}
                <Typography sx={{ color: theme.colors.gray.dark, fontSize: 13 }}>{item.label}{item.value ? ' :' : ''}</Typography>
                {item.value && <Typography sx={{ color: theme.colors.primary.main, fontSize: 18, fontWeight: 800, whiteSpace: 'nowrap' }}>{item.value}</Typography>}
              </Stack>
              <Button href={item.href} size="small" sx={{ minWidth: 'auto', px: 0.5, color: theme.colors.primary.main, textDecoration: 'underline', textUnderlineOffset: 2, fontSize: 12, flexShrink: 0 }}>{item.actionLabel}</Button>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}

function MemberHomeDashboard() {
  const theme = useTheme();
  const { data: session } = useSession();
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileByIdQuery();
  const { data: livePointsResponse } = useGetMyLivePointsQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: isMemberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const member = memberResponse?.data;
  const isGeneralUser = member?.member_type === 'general_member';
  const visibleQuickActions = quickActions.filter((item) => !item.vjOnly || !isGeneralUser);
  const applications = useMemo(() => getMemberApplications(member), [member]);
  const applicationIds = useMemo(() => applications.map((application) => application.id), [applications]);
  const kyc = getKycSummary(member);
  const [liveDialogOpen, setLiveDialogOpen] = useState(false);
  const [liveAppId, setLiveAppId] = useState<string | undefined>();
  const [dailyMissionOpen, setDailyMissionOpen] = useState(false);
  const [missionView, setMissionView] = useState<MissionView>('none');
  const topVjRailRef = useRef<HTMLDivElement | null>(null);
  const { data: topVjResponse } = useGetTopVJListAllQuery();
  const topVjs = (topVjResponse?.data?.length ? topVjResponse.data : fallbackTopVjs).slice(0, 6);
  const displayName = getMemberDisplayName(member, session?.user?.name || 'VJ Member');
  const walletBalance = member?.member_wallet_non_org?.length
    ? member.member_wallet_non_org.reduce((total: number, item: any) => total + Number(item.wallet?.balance || 0), 0)
    : (member?.member_wallet || []).reduce((total: number, item: any) => total + Number(item.wallet?.balance || 0), 0);
  const pxCoin = member?.member_wallet_non_org?.length
    ? member.member_wallet_non_org.reduce((total: number, item: any) => total + Number(item.wallet?.coin || 0), 0)
    : (member?.member_wallet || []).reduce((total: number, item: any) => total + Number(item.wallet?.coin || 0), 0);
  const availablePoints = Number(livePointsResponse?.data?.total_balance || 0);

  const handleLiveShortcut = () => {
    setLiveAppId(getLiveShortcutAppId(applicationIds));
    setLiveDialogOpen(true);
  };

  const getShortcutHref = (item: (typeof quickActions)[number]) => {
    if (item.action !== 'affiliate_bonus' && item.label !== 'ห้องเรียนออนไลน์') return item.href || '#';
    const action = item.action === 'affiliate_bonus' ? 'affiliate_bonus' : 'training';
    const destination = getAppShortcutDestination(action, applicationIds);
    return destination.mode === 'direct'
      ? action === 'training'
        ? `/profile/vj_star_video/${encodeURIComponent(encrypt(destination.appId))}`
        : `/profile/${encodeURIComponent(encrypt(destination.appId))}`
      : destination.href;
  };

  useAutoScrollRail(topVjRailRef, 5000);

  if (isProfileLoading || (memberId !== '0' && isMemberLoading)) {
    return <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'grid', placeItems: 'center', backgroundColor: '#f7f8fa' }}><CircularProgress color="primary" /></Box>;
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', backgroundColor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2.5, md: 3.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2}>
            <Box>
              <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 24, md: 32 }, fontWeight: 800 }}>สวัสดีครับ, {displayName}</Typography>
              <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: { xs: 14, md: 16 } }}>ภาพรวมการทำงานและสิ่งที่ต้องทำของคุณ</Typography>
            </Box>
            <Button href="/public" variant="outlined" startIcon={<ChevronRightRoundedIcon />} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' } }}>ดูข้อมูลทั่วไป</Button>
          </Stack>

          <ProfileStrip member={member} />

          <BonusAvailableCard walletBalance={walletBalance} pxCoin={pxCoin} points={availablePoints} withdrawEnabled={kyc.state === 'approved'} />

          {!isGeneralUser && <Box>
            <Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ภารกิจของคุณ</Typography>
            <Typography sx={{ mt: 0.35, mb: 1.25, color: theme.colors.gray.main, fontSize: 13 }}>เลือกภารกิจที่ต้องการติดตาม</Typography>
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
                  <CardActionArea component="button" onClick={() => setDailyMissionOpen(true)} sx={{ height: '100%', textAlign: 'left' }}>
                    <CardContent sx={{ p: { xs: 1.75, md: 2 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 1.75, color: '#d97706', bgcolor: '#fff7ed' }}><EventAvailableOutlinedIcon /></Box>
                        <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 15, fontWeight: 800 }}>ภารกิจรายวัน</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 12 }}>ติดตามสิ่งที่ต้องทำในแต่ละวัน</Typography></Box>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: missionView === 'star_live' ? theme.colors.primary.main : 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
                  <CardActionArea component="button" onClick={() => setMissionView(toggleMissionView(missionView, 'star_live'))} aria-expanded={missionView === 'star_live'} sx={{ height: '100%', textAlign: 'left' }}>
                    <CardContent sx={{ p: { xs: 1.75, md: 2 } }}>
                      <Stack direction="row" alignItems="center" spacing={1.25}>
                        <Box sx={{ display: 'grid', placeItems: 'center', width: 44, height: 44, borderRadius: 1.75, color: '#f59e0b', bgcolor: '#fff7ed' }}><TopRatingRoundedIcon /></Box>
                        <Box><Typography sx={{ color: theme.colors.black.main, fontSize: 15, fontWeight: 800 }}>ภารกิจ VJ Star Live</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 12 }}>ติดตามความคืบหน้าแยกตาม App</Typography></Box>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>

            {missionView === 'star_live' && <Card elevation={0} sx={{ mt: 1.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
              <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}><Box><Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ภารกิจ VJ Star Live</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 13 }}>ติดตามภารกิจแยกตามสังกัด</Typography></Box><Button href="/member/profile" size="small" endIcon={<ChevronRightRoundedIcon />}>ดูสังกัด</Button></Stack>
                {applications.length === 0 ? <Typography sx={{ mt: 2, color: theme.colors.gray.main, fontSize: 14 }}>ยังไม่มีข้อมูลสังกัดในระบบ</Typography> : <Stack spacing={1} sx={{ mt: 2 }}>{applications.map((app) => <Box key={app.id} component="a" href={`/member/level-progress/${encodeURIComponent(encrypt(app.id))}`} sx={{ display: 'block', px: 1, py: 1, borderRadius: 1.5, color: 'inherit', textDecoration: 'none', transition: 'background-color .2s ease', '&:hover': { backgroundColor: alpha(theme.colors.primary.main, 0.06) } }}><Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}><Stack direction="row" alignItems="center" spacing={1}><Avatar src={app.logo || undefined} sx={{ width: 32, height: 32, bgcolor: alpha(app.statusColor, 0.12), color: app.statusColor, fontSize: 12, fontWeight: 800 }}>{app.name.slice(0, 1)}</Avatar><Box><Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 700 }}>{app.name}</Typography><Typography sx={{ color: theme.colors.gray.main, fontSize: 12 }}>{app.level} · {app.status}</Typography></Box></Stack><Stack direction="row" alignItems="center" spacing={1}><Typography sx={{ color: app.statusColor, fontSize: 14, fontWeight: 800 }}>{app.progress}%</Typography><ChevronRightRoundedIcon sx={{ color: theme.colors.primary.main }} /></Stack></Stack><LinearProgress variant="determinate" value={app.progress} sx={{ mt: 0.75, height: 7, borderRadius: 4, '& .MuiLinearProgress-bar': { backgroundColor: app.statusColor } }} /></Box>)}</Stack>}
              </CardContent>
            </Card>}
          </Box>}

          <Box>
            <Typography sx={{ mb: 1.25, color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ทางลัดการใช้งาน</Typography>
            <Grid container spacing={1.5}>
              {visibleQuickActions.map((item) => {
                const Icon = item.icon;
                const content = <CardContent sx={{ p: { xs: 1.5, md: 1.75 } }}><Box sx={{ display: 'grid', placeItems: 'center', width: 42, height: 42, mb: 1.25, borderRadius: 1.75, color: item.color, bgcolor: alpha(item.color, 0.1) }}><Icon /></Box><Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 800, lineHeight: 1.3 }}>{item.label}</Typography><Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 11.5, lineHeight: 1.35 }}>{item.description}</Typography></CardContent>;
                return <Grid key={item.label} size={{ xs: 6, sm: 4, md: 2 }}><Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>{item.action === 'live' ? <CardActionArea component="button" onClick={handleLiveShortcut} sx={{ height: '100%', textAlign: 'left' }}>{content}</CardActionArea> : <CardActionArea href={getShortcutHref(item)} sx={{ height: '100%' }}>{content}</CardActionArea>}</Card></Grid>;
              })}
            </Grid>
          </Box>

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.25 }}><Stack direction="row" alignItems="center" spacing={1}><TopRatingRoundedIcon sx={{ color: '#f59e0b' }} /><Typography sx={{ color: theme.colors.black.main, fontSize: 20, fontWeight: 800 }}>ท็อปวีเจ STAR LIVE</Typography></Stack><Button href="/home/vj_star_live" size="small" endIcon={<ChevronRightRoundedIcon />}>ดูทั้งหมด</Button></Stack>
            <Box ref={topVjRailRef} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, gap: 1.5, overflowX: 'auto', pb: 1, scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}>{topVjs.map((vj: Partial<TopVJModelDetail>, index: number) => { const name = vj.nick_name || vj.full_name || 'VJ'; const profileUrl = buildUploadUrl(vj.profile); return <Card key={vj.member_id || `${name}-${index}`} elevation={0} sx={{ minWidth: { xs: 210, sm: 250 }, border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5, overflow: 'hidden', bgcolor: '#fff' }}><CardActionArea href="/home/vj_star_live"><Box sx={{ position: 'relative', width: '100%', aspectRatio: '1 / 1.18', bgcolor: '#fff8f3', overflow: 'hidden' }}><Box sx={{ position: 'absolute', top: '24%', left: '50%', transform: 'translateX(-50%)', width: '52%', height: '48%', overflow: 'hidden', borderRadius: 1.5, bgcolor: '#172033', color: '#fff', display: 'grid', placeItems: 'center', zIndex: 0 }}>{profileUrl ? <Box component="img" src={profileUrl} alt={name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Typography sx={{ fontSize: 36, fontWeight: 900 }}>{name.slice(0, 1)}</Typography>}<Box sx={{ position: 'absolute', left: 5, right: 5, bottom: 5, color: '#fff', textAlign: 'left', textShadow: '0 1px 3px rgba(0,0,0,.7)' }}><Typography sx={{ fontSize: 8, lineHeight: 1.2 }}>ไอดีห้อง: {vj.room_id || '-'}</Typography><Typography sx={{ fontSize: 8, lineHeight: 1.2 }}>User ID: {vj.user_id || '-'}</Typography></Box></Box><Box component="img" src="/assets/image/bg_top_vj.png" alt="กรอบท็อปวีเจ" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} /><Typography sx={{ position: 'absolute', left: '50%', bottom: '7%', transform: 'translateX(-50%)', zIndex: 2, color: '#fff', fontSize: 14, fontWeight: 900, whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(0,0,0,.8)' }}>{name}</Typography></Box></CardActionArea></Card>; })}</Box>
          </Box>
        </Stack>
      </Container>
      <Dialog open={dailyMissionOpen} onClose={() => setDailyMissionOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>ภารกิจรายวัน</DialogTitle>
        <DialogContent><Typography sx={{ color: theme.colors.gray.main, fontSize: 14 }}>ฟังก์ชันภารกิจรายวันกำลังพัฒนา</Typography></DialogContent>
        <DialogActions><Button onClick={() => setDailyMissionOpen(false)}>ปิด</Button></DialogActions>
      </Dialog>
      <StartLive key={liveAppId || 'start-live'} open={liveDialogOpen} onOpenChange={setLiveDialogOpen} initialOrganizationId={liveAppId} hideTrigger />
    </Box>
  );
}

export default function HomeRouter() {
  const { status } = useSession();
  if (status === 'loading') return <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'grid', placeItems: 'center', backgroundColor: '#f7f8fa' }}><CircularProgress color="primary" /></Box>;
  return status === 'authenticated' ? <MemberHomeDashboard /> : <PublicHomeV2 />;
}
