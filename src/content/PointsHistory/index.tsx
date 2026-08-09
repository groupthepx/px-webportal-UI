'use client';

import PageHeader from '@/components/PageHeader';
import {
  useGetMyLivePointsQuery,
  useGetMyLivePointsTransactionsQuery,
} from '@/lib/features/px_market_product';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Box, Container, Fade, Skeleton, Stack, Typography } from '@mui/material';
import { StarsRounded, TrendingUpRounded, TrendingDownRounded } from '@mui/icons-material';
import { format } from 'date-fns';

const fmtDate = (iso?: string | null) => (iso ? format(new Date(iso), 'dd/MM/yyyy HH:mm') : '-');

interface Txn {
  type: 'earn' | 'spend';
  points: number;
  created_at: string;
  company_name?: string | null;
  detail: string;
  status: string; // earned | active | refunded
}

function StatBox({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Box sx={{ flex: 1, bgcolor: '#fff', borderRadius: 3, p: 2, textAlign: 'center', borderBottom: `4px solid ${color}`, boxShadow: '0 6px 16px rgba(22,28,45,.06)' }}>
      <Typography variant="h4" sx={{ fontWeight: 900, color }}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

function TxnRow({ t, showApp }: { t: Txn; showApp: boolean }) {
  const isEarn = t.type === 'earn';
  const refunded = t.status === 'refunded';
  // Refunded spends were returned — show muted so they don't read as a real spend.
  const color = refunded ? '#94a3b8' : isEarn ? '#16a34a' : '#dc2626';
  return (
    <Box sx={{ bgcolor: '#fff', borderRadius: 3, p: 1.6, boxShadow: '0 4px 14px rgba(22,28,45,.05)', display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 38, height: 38, borderRadius: '50%', bgcolor: isEarn ? '#f0fdf4' : '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {isEarn ? <TrendingUpRounded sx={{ color: '#16a34a' }} /> : <TrendingDownRounded sx={{ color: '#dc2626' }} />}
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontWeight: 700 }} noWrap>
          {t.detail}{refunded ? ' (คืนแล้ว)' : ''}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fmtDate(t.created_at)}{showApp && t.company_name ? ` · ${t.company_name}` : ''}
        </Typography>
      </Box>
      <Typography sx={{ fontWeight: 900, color, textDecoration: refunded ? 'line-through' : 'none' }}>
        {t.points > 0 ? `+${t.points.toLocaleString()}` : t.points.toLocaleString()}
      </Typography>
    </Box>
  );
}

export default function PointsHistoryPage() {
  const { data: profileResponse } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const { data: ptsRes, isLoading: loadingPts } = useGetMyLivePointsQuery();
  const { data: txRes, isLoading, isFetching } = useGetMyLivePointsTransactionsQuery();
  const txns: Txn[] = txRes?.data ?? [];
  const showApp = memberResponse?.data?.member_type !== 'general_member';
  const balance = ptsRes?.data?.total_balance ?? 0;
  const earned = ptsRes?.data?.total_earned ?? 0;
  const spent = ptsRes?.data?.total_spent ?? 0;

  return (
    <Box sx={{ position: 'relative', zIndex: 5, flex: 1, bgcolor: '#F7F8F9', minHeight: '100%' }}>
      <Fade in timeout={800}>
        <div><PageHeader textHeader="หน้าหลัก / คะแนนของฉัน" /></div>
      </Fade>
      <Container sx={{ maxWidth: 'sm', py: 2, px: { xs: 1.5, sm: 2 } }}>
        <Stack direction="row" alignItems="center" gap={1} mb={2}>
          <StarsRounded sx={{ color: '#16a34a' }} />
          <Typography variant="h4" sx={{ fontWeight: 800 }}>คะแนนของฉัน</Typography>
        </Stack>

        {loadingPts ? (
          <Skeleton variant="rounded" height={92} sx={{ borderRadius: 3, mb: 2.5 }} />
        ) : (
          <Stack direction="row" spacing={1.5} sx={{ mb: 2.5 }}>
            <StatBox label="คงเหลือ (ใช้แลกได้)" value={balance.toLocaleString()} color="#16a34a" />
            <StatBox label="รับสะสม" value={earned.toLocaleString()} color="#F1592A" />
            <StatBox label="ใช้ไป" value={spent.toLocaleString()} color="#38bdf8" />
          </Stack>
        )}

        <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>รายการเคลื่อนไหว</Typography>

        {isLoading || isFetching ? (
          <Stack spacing={1.2}>
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 3 }} />)}
          </Stack>
        ) : txns.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <StarsRounded sx={{ fontSize: 56, opacity: 0.3 }} />
            <Typography sx={{ mt: 1 }}>ยังไม่มีรายการเคลื่อนไหวคะแนน</Typography>
          </Box>
        ) : (
          <Stack spacing={1.2}>
            {txns.map((t, i) => <TxnRow key={i} t={t} showApp={showApp} />)}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
