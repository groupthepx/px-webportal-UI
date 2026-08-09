'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import {
  useGetMyLiveSessionsQuery,
  useEndLiveSessionMutation,
  useCreateLiveSessionMutation,
} from '@/lib/features/live-session';
import { useGetMyLivePointsQuery } from '@/lib/features/px_market_product';
import {
  LiveSessionHistoryItem,
  getLiveSessionRewardText,
  getLiveSessionStatus,
} from '@/model/live-session';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Fade,
  Link as MuiLink,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import {
  SensorsOutlined,
  StopCircleOutlined,
  ReplayRounded,
  OpenInNewRounded,
  MonetizationOnRounded,
  VisibilityRounded,
  InfoOutlined,
  StarsRounded,
  RedeemRounded,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { extractApiError } from '@/utils/extractApiError';

const fmtDate = (iso?: string | null) => (iso ? format(new Date(iso), 'dd/MM/yyyy HH:mm') : '-');

// Ticking mm:ss countdown seeded from the SERVER's remaining seconds (not the
// browser clock) so a skewed device can't show 00:00 while time is actually
// left. Re-seeds when the polled value changes; ticks down locally in between.
function useCountdown(remainingSeconds?: number) {
  const [left, setLeft] = useState(0);
  useEffect(() => {
    if (remainingSeconds == null) { setLeft(0); return; }
    setLeft(Math.max(0, Math.floor(remainingSeconds)));
    const t = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, [remainingSeconds]);
  return `${String(Math.floor(left / 60)).padStart(2, '0')}:${String(left % 60).padStart(2, '0')}`;
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: 3, p: 2, textAlign: 'center', borderBottom: `4px solid ${color}`, boxShadow: '0 6px 16px rgba(22,28,45,.06)' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

function LiveCard({ item, onEnd, onRelive, busy }: { item: LiveSessionHistoryItem; onEnd: () => void; onRelive: () => void; busy: boolean }) {
  const st = getLiveSessionStatus(item);
  const earned = item.points_earned ?? 0;
  const rewardText = getLiveSessionRewardText(item);
  const rewardColor =
    earned > 0
      ? 'success.main'
      : item.reward_status === 'approved_pending_points'
        ? 'warning.main'
        : item.is_live
          ? 'text.secondary'
          : 'text.disabled';
  const countdown = useCountdown(item.is_live ? item.time_remaining_seconds : undefined);
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 3, overflow: 'hidden', boxShadow: '0 6px 18px rgba(22,28,45,.07)' }}>
      <Box sx={{ height: 4, bgcolor: item.is_live ? '#ef4444' : '#e5e7eb' }} />
      <Box sx={{ p: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1.2}>
          <Avatar src={item.organization?.company_logo || undefined} sx={{ width: 40, height: 40, bgcolor: '#fff2ed', color: '#F1592A', fontWeight: 800 }}>
            {item.organization?.company_name?.charAt(0) || '?'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800 }} noWrap>{item.organization?.company_name || '-'}</Typography>
            <Typography variant="caption" color="text.secondary">{fmtDate(item.started_at)}</Typography>
          </Box>
          {item.is_live ? (
            <Chip size="small" label={`🔴 ${countdown}`} sx={{ bgcolor: '#fee2e2', color: '#dc2626', fontWeight: 900 }} />
          ) : (
            <Chip size="small" color={st.color} label={st.text} />
          )}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2.5} sx={{ mt: 1.5 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <MonetizationOnRounded sx={{ fontSize: 18, color: '#f59e0b' }} />
            <Typography variant="body2" sx={{ fontWeight: 800, color: rewardColor }}>
              {rewardText}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <VisibilityRounded sx={{ fontSize: 18, color: '#94a3b8' }} />
            <Typography variant="body2" color="text.secondary">{item.viewed_count} คนดู</Typography>
          </Stack>
          {item.live_link && (
            <MuiLink href={item.live_link} target="_blank" rel="noopener" sx={{ ml: 'auto', display: 'inline-flex', alignItems: 'center', gap: 0.3, fontSize: 13 }}>
              เปิดลิงก์ <OpenInNewRounded sx={{ fontSize: 15 }} />
            </MuiLink>
          )}
        </Stack>

        {/* หมายเหตุ = the note the VJ typed when creating the live (separate from
            the rejection reason below — the two must never share one field). */}
        {item.note && (
          <Box sx={{ mt: 1.2, p: 1, borderRadius: 1.5, bgcolor: '#f8fafc', border: '1px solid #eef2f7' }}>
            <Typography variant="caption" color="text.secondary">หมายเหตุ: {item.note}</Typography>
          </Box>
        )}

        {item.approval_status === 'rejected' && item.reject_reason && (
          <Box sx={{ mt: 1.2, p: 1, borderRadius: 1.5, bgcolor: '#fef2f2' }}>
            <Typography variant="caption" color="error">เหตุผลที่ปฏิเสธ: {item.reject_reason}</Typography>
          </Box>
        )}

        {item.is_live ? (
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<StopCircleOutlined />}
            disabled={busy}
            onClick={() => {
              // Ending before the window fully elapses forfeits the points — warn
              // with the real remaining time (from the server) before quitting.
              const remain = Math.max(0, Math.floor(item.time_remaining_seconds ?? 0));
              if (remain > 0) {
                const mm = String(Math.floor(remain / 60)).padStart(2, '0');
                const ss = String(remain % 60).padStart(2, '0');
                if (!window.confirm(`⚠️ ยังเหลือเวลาอีก ${mm}:${ss}\nถ้าจบไลฟ์ตอนนี้จะไม่ได้รับคะแนน\n\nต้องการจบไลฟ์เลยหรือไม่?`)) return;
              } else if (!window.confirm('ต้องการจบไลฟ์นี้ใช่หรือไม่?')) {
                return;
              }
              onEnd();
            }}
            sx={{ mt: 1.5, borderRadius: 2, fontWeight: 700 }}
          >
            จบไลฟ์
          </Button>
        ) : item.approval_status !== 'rejected' ? (
          <Button fullWidth variant="text" startIcon={<ReplayRounded />} disabled={busy} onClick={onRelive} sx={{ mt: 1, borderRadius: 2 }}>
            ขึ้นไลฟ์อีกครั้ง (ใช้ค่าเดิม)
          </Button>
        ) : null}
      </Box>
    </Box>
  );
}

export default function LiveHistoryPage() {
  const router = useRouter();
  const { data: historyRes, isLoading, isFetching } = useGetMyLiveSessionsQuery();
  const { data: pointsRes } = useGetMyLivePointsQuery();
  const pointsBalance = pointsRes?.data?.total_balance ?? 0;
  const [endLive, { isLoading: isEnding }] = useEndLiveSessionMutation();
  const [createLive, { isLoading: isCreating }] = useCreateLiveSessionMutation();
  const history: LiveSessionHistoryItem[] = historyRes?.data ?? [];

  const summary = useMemo(() => {
    const now = new Date();
    // All three stats use the SAME timeframe (this month) so the header is
    // internally consistent — previously count was monthly but points/rate were
    // all-time, which read as contradictory.
    const monthItems = history.filter((h) => {
      const d = h.started_at ? new Date(h.started_at) : null;
      return !!d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const count = monthItems.length;
    const points = monthItems.reduce((s, h) => s + (h.points_earned || 0), 0);
    const decided = monthItems.filter((h) => h.approval_status === 'approved' || h.approval_status === 'rejected').length;
    const approved = monthItems.filter((h) => h.approval_status === 'approved').length;
    const rate = decided ? Math.round((approved / decided) * 100) : 0;
    const lifetimePoints = history.reduce((s, h) => s + (h.points_earned || 0), 0);
    return { count, points, rate, lifetimePoints };
  }, [history]);

  // Status filter (display only) + incremental "load more".
  const [filter, setFilter] = useState<'all' | 'earned' | 'pending' | 'rejected'>('all');
  const [visible, setVisible] = useState(10);

  // Segmented filter tabs — each carries its own count + accent so the bar
  // doubles as an at-a-glance breakdown of the history.
  const tabs = useMemo(
    () =>
      [
        { key: 'all', label: 'ทั้งหมด', count: history.length, grad: 'linear-gradient(135deg,#F1592A,#9F3025)', shadow: 'rgba(241,89,42,.32)' },
        { key: 'earned', label: 'ได้คะแนน', count: history.filter((h) => (h.points_earned ?? 0) > 0).length, grad: 'linear-gradient(135deg,#34d399,#16a34a)', shadow: 'rgba(22,163,74,.32)' },
        { key: 'pending', label: 'รออนุมัติ', count: history.filter((h) => h.approval_status === 'pending').length, grad: 'linear-gradient(135deg,#fbbf24,#f59e0b)', shadow: 'rgba(245,158,11,.32)' },
        { key: 'rejected', label: 'ถูกปฏิเสธ', count: history.filter((h) => h.approval_status === 'rejected').length, grad: 'linear-gradient(135deg,#f87171,#dc2626)', shadow: 'rgba(220,38,38,.32)' },
      ] as const,
    [history],
  );

  const filtered = useMemo(() => {
    if (filter === 'earned') return history.filter((h) => (h.points_earned ?? 0) > 0);
    if (filter === 'rejected') return history.filter((h) => h.approval_status === 'rejected');
    if (filter === 'pending') return history.filter((h) => h.approval_status === 'pending');
    return history;
  }, [history, filter]);
  const pickFilter = (f: typeof filter) => { setFilter(f); setVisible(10); };

  const handleEnd = async (id: string) => {
    // Confirmation (incl. the "ends early → no points" warning) is handled in the
    // LiveCard button, which knows each session's real remaining time.
    try {
      await endLive({ id }).unwrap();
      enqueueSnackbar('จบไลฟ์เรียบร้อย', { variant: 'success' });
    } catch (e: any) {
      enqueueSnackbar(extractApiError(e, 'จบไลฟ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'), { variant: 'error' });
    }
  };

  const handleRelive = async (item: LiveSessionHistoryItem) => {
    try {
      const res = await createLive({ organization_id: item.organization_id, live_link: item.live_link }).unwrap();
      enqueueSnackbar(res?.message || 'ยืนยันขึ้นไลฟ์สำเร็จ', { variant: 'success' });
    } catch (e: any) {
      enqueueSnackbar(extractApiError(e, 'ขึ้นไลฟ์ไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'), { variant: 'error' });
    }
  };

  const busy = isEnding || isCreating;

  return (
    <Box sx={{ position: 'relative', zIndex: 5, flex: 1, bgcolor: '#F7F8F9', minHeight: '100%' }}>
      <Fade in timeout={800}>
        <div><PageHeader textHeader="หน้าหลัก / ประวัติการขึ้นไลฟ์" /></div>
      </Fade>
      <Container sx={{ maxWidth: 'sm', py: 2, px: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <SensorsOutlined color="error" />
          <Typography color="primary" variant="h4" sx={{ fontWeight: 800 }}>ประวัติการขึ้นไลฟ์</Typography>
        </Stack>

        {/* Summary — all three are "this month" so the frame is consistent */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 1.2 }}>
          <StatBox label="ครั้งเดือนนี้" value={summary.count} color="#F1592A" />
          <StatBox label="คะแนนเดือนนี้" value={summary.points.toLocaleString()} color="#22c55e" />
          <StatBox label="% อนุมัติเดือนนี้" value={`${summary.rate}%`} color="#38bdf8" />
        </Stack>
        {(pointsBalance > 0 || summary.lifetimePoints > 0) && (
          <Box
            sx={{
              mb: 2,
              borderRadius: 3,
              overflow: 'hidden',
              background: 'linear-gradient(135deg,#fff7ed 0%,#ffffff 62%)',
              border: '1px solid #ffe3cf',
              boxShadow: '0 8px 20px rgba(241,89,42,.08)',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 1.8 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  flexShrink: 0,
                  borderRadius: '15px',
                  display: 'grid',
                  placeItems: 'center',
                  color: '#fff',
                  background: 'linear-gradient(135deg,#fbbf24,#f59e0b)',
                  boxShadow: '0 6px 14px rgba(245,158,11,.4)',
                }}
              >
                <StarsRounded />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                  คะแนนคงเหลือ · ใช้แลกของได้
                </Typography>
                <Stack direction="row" alignItems="baseline" spacing={0.6}>
                  <Typography sx={{ fontWeight: 900, fontSize: 26, lineHeight: 1.15, color: '#16a34a' }}>
                    {pointsBalance.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary' }}>คะแนน</Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  รับสะสมทั้งหมด {summary.lifetimePoints.toLocaleString()} คะแนน
                </Typography>
              </Box>
              {pointsBalance > 0 && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<RedeemRounded />}
                  onClick={() => router.push('/px_market')}
                  sx={{
                    flexShrink: 0,
                    borderRadius: 2,
                    fontWeight: 800,
                    whiteSpace: 'nowrap',
                    px: 1.6,
                    background: 'linear-gradient(135deg,#F1592A 0%,#9F3025 100%)',
                    '&:hover': { opacity: 0.95, background: 'linear-gradient(135deg,#F1592A 0%,#9F3025 100%)' },
                  }}
                >
                  แลกของ
                </Button>
              )}
            </Stack>
          </Box>
        )}

        {/* How points work (the 30-min rule) */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start', bgcolor: '#f0f7ff', border: '1px solid #d6e8ff', borderRadius: 2, p: 1.3, mb: 2.5 }}>
          <InfoOutlined sx={{ color: '#2563eb', fontSize: 18, mt: '1px' }} />
          <Typography variant="caption" sx={{ color: '#334155', lineHeight: 1.6 }}>
            ไลฟ์ต้องครบ <b>30 นาที</b> ถึงได้รับคะแนน · จบก่อนเวลาจะไม่ได้รับ · คะแนนจะเข้าอัตโนมัติเมื่อไลฟ์ครบเวลา
          </Typography>
        </Box>

        {/* Status filter — segmented pill control with per-tab counts */}
        {history.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              gap: 0.5,
              p: 0.5,
              mb: 2.5,
              bgcolor: '#fff',
              borderRadius: 999,
              border: '1px solid #eef1f4',
              boxShadow: '0 4px 12px rgba(22,28,45,.05)',
            }}
          >
            {tabs.map(({ key, label, count, grad, shadow }) => {
              const active = filter === key;
              return (
                <Box
                  key={key}
                  role="button"
                  onClick={() => pickFilter(key)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    cursor: 'pointer',
                    userSelect: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 0.5,
                    px: 1,
                    py: 0.9,
                    borderRadius: 999,
                    fontWeight: 800,
                    fontSize: 13,
                    whiteSpace: 'nowrap',
                    color: active ? '#fff' : 'text.secondary',
                    background: active ? grad : 'transparent',
                    boxShadow: active ? `0 5px 14px ${shadow}` : 'none',
                    transition: 'all .2s ease',
                    '&:hover': { bgcolor: active ? undefined : '#f5f6f8' },
                  }}
                >
                  {label}
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 18,
                      height: 18,
                      px: 0.5,
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      lineHeight: 1,
                      bgcolor: active ? 'rgba(255,255,255,.28)' : '#eef1f4',
                      color: active ? '#fff' : 'text.secondary',
                    }}
                  >
                    {count}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}

        {/* List */}
        {isLoading || isFetching ? (
          <Stack spacing={1.5}>
            {[1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={140} sx={{ borderRadius: 3 }} />)}
          </Stack>
        ) : history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <SensorsOutlined sx={{ fontSize: 56, opacity: 0.3 }} />
            <Typography sx={{ mt: 1 }}>ยังไม่มีประวัติการขึ้นไลฟ์</Typography>
          </Box>
        ) : filtered.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            <Typography>ไม่มีรายการในหมวดนี้</Typography>
          </Box>
        ) : (
          <>
            <Stack spacing={1.5}>
              {filtered.slice(0, visible).map((item) => (
                <LiveCard key={item.live_session_id} item={item} busy={busy} onEnd={() => handleEnd(item.live_session_id)} onRelive={() => handleRelive(item)} />
              ))}
            </Stack>
            {filtered.length > visible && (
              <Button fullWidth variant="outlined" onClick={() => setVisible((v) => v + 10)} sx={{ mt: 2, borderRadius: 2, fontWeight: 700 }}>
                โหลดเพิ่ม ({(filtered.length - visible).toLocaleString()} รายการ)
              </Button>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
