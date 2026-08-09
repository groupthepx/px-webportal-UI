'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Card, Stack, Typography, Button, Skeleton } from '@mui/material';
import { SensorsOutlined, ArrowForwardRounded, RedeemRounded } from '@mui/icons-material';
import { useGetMyLiveSessionsQuery } from '@/lib/features/live-session';
import { useGetMyLivePointsQuery } from '@/lib/features/px_market_product';
import { LiveSessionHistoryItem } from '@/model/live-session';

/**
 * Self-contained "Live points (คะแนน)" summary card for the profile sidebar.
 * Headline is the SPENDABLE balance (earned − spent) from /live-points/me — not a
 * gross sum of earned (which would overcount once points are redeemed). Monthly
 * earned + live count come from the session history. Display only.
 */
export default function LivePointsSummary({ onViewHistory }: { onViewHistory?: () => void }) {
  const router = useRouter();
  const { data: sessRes, isLoading: loadingSessions } = useGetMyLiveSessionsQuery();
  const { data: ptsRes, isLoading: loadingPoints } = useGetMyLivePointsQuery();
  const history: LiveSessionHistoryItem[] = sessRes?.data ?? [];

  const balance = ptsRes?.data?.total_balance ?? 0;
  const totalEarned = ptsRes?.data?.total_earned ?? 0;

  const { monthPoints, monthCount } = useMemo(() => {
    const now = new Date();
    const inMonth = (h: LiveSessionHistoryItem) => {
      const d = h.started_at ? new Date(h.started_at) : null;
      return !!d && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    };
    const monthItems = history.filter(inMonth);
    return {
      monthPoints: monthItems.reduce((s, h) => s + (h.points_earned || 0), 0),
      monthCount: monthItems.length,
    };
  }, [history]);

  if (loadingSessions || loadingPoints) return <Skeleton variant="rounded" height={160} sx={{ borderRadius: 3 }} />;

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 6px 18px rgba(22,28,45,.07)' }}>
      <Box sx={{ background: 'linear-gradient(135deg,#EEA15D 0%,#F1592A 55%,#9F3025 100%)', px: 2.2, py: 1.5, color: '#fff', display: 'flex', alignItems: 'center', gap: 1 }}>
        <SensorsOutlined fontSize="small" />
        <Typography sx={{ fontWeight: 800 }}>คะแนนจากการขึ้นไลฟ์</Typography>
      </Box>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" spacing={1.5}>
          <Box
            onClick={() => router.push('/profile/points_history')}
            sx={{ flex: 1, textAlign: 'center', bgcolor: '#f0fdf4', borderRadius: 2, py: 1.4, cursor: 'pointer', transition: 'all .15s', '&:hover': { bgcolor: '#dcfce7' } }}
          >
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#16a34a' }}>{balance.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">คะแนนคงเหลือ (แตะดูรายการ)</Typography>
          </Box>
          <Box sx={{ flex: 1, textAlign: 'center', bgcolor: '#fff7ed', borderRadius: 2, py: 1.4 }}>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#F1592A' }}>{monthPoints.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">คะแนนเดือนนี้</Typography>
          </Box>
        </Stack>
        <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mt: 1.2 }}>
          รับสะสมทั้งหมด {totalEarned.toLocaleString()} · ขึ้นไลฟ์ {monthCount.toLocaleString()} ครั้งเดือนนี้
        </Typography>
        {balance > 0 && (
          <Button
            fullWidth
            variant="contained"
            startIcon={<RedeemRounded />}
            onClick={() => router.push('/px_market')}
            sx={{ mt: 1.2, borderRadius: 2, fontWeight: 800, background: 'linear-gradient(135deg,#F1592A 0%,#9F3025 100%)', '&:hover': { opacity: 0.95, background: 'linear-gradient(135deg,#F1592A 0%,#9F3025 100%)' } }}
          >
            เอาคะแนนไปแลกของในตลาด
          </Button>
        )}
        {onViewHistory && (
          <Button fullWidth variant="text" endIcon={<ArrowForwardRounded />} onClick={onViewHistory} sx={{ mt: 0.5, borderRadius: 2, fontWeight: 700 }}>
            ดูประวัติการขึ้นไลฟ์ทั้งหมด
          </Button>
        )}
      </Box>
    </Card>
  );
}
