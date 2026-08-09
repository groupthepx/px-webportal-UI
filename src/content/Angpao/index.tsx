'use client';

import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { Alert, Avatar, Box, Button, Card, Chip, CircularProgress, Container, Stack, Typography, alpha, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { useUpdateClaimCouponMoveMutation, useUpdateClaimCouponMoveNonOrgMutation } from '@/lib/features/coupon';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';

const formatDate = (value?: string) => {
  if (!value) return '-';
  try { return format(new Date(value), 'dd/MM/yyyy HH:mm'); } catch { return '-'; }
};

export default function AngpaoPage() {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const { data: profileResponse, isLoading: profileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: memberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const { data: organizationsResponse } = useGetOrganizationListAllQuery();
  const [claimCoupon, { isLoading: isClaiming }] = useUpdateClaimCouponMoveMutation();
  const [claimCouponNonOrg] = useUpdateClaimCouponMoveNonOrgMutation();
  const member = memberResponse?.data;
  const coupons = member?.coupon ?? [];
  const organizationMap = useMemo(() => new Map((organizationsResponse?.data ?? []).map((item: any) => [String(item.organization_id), item])), [organizationsResponse]);

  const handleClaim = async (coupon: any) => {
    try {
      if (member?.member_type === 'vj_member') {
        await claimCoupon({ data: { coupon_id: coupon.coupon_id, member_id: memberId, organization_id: coupon.organization_id } }).unwrap();
      } else {
        await claimCouponNonOrg({ data: { coupon_id: coupon.coupon_id, member_id: memberId } }).unwrap();
      }
      setMessage('รับอังเปาสำเร็จแล้ว');
    } catch {
      setMessage('ไม่สามารถรับอังเปาได้ กรุณาลองใหม่อีกครั้ง');
    }
  };

  if (profileLoading || (memberId !== '0' && memberLoading)) return <Box sx={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', bgcolor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}><Box><Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 24, md: 30 }, fontWeight: 800 }}>อังเปา</Typography><Typography sx={{ mt: 0.35, color: theme.colors.gray.main, fontSize: 14 }}>รายการอังเปาที่ได้รับและประวัติการรับ</Typography></Box><Button href="/member/history" variant="outlined" startIcon={<HistoryRoundedIcon />}>ประวัติ</Button></Stack>
          {message && <Alert severity={message.startsWith('รับ') ? 'success' : 'error'} onClose={() => setMessage('')}>{message}</Alert>}
          {coupons.length === 0 ? <Card elevation={0} sx={{ p: 5, borderRadius: 2.5, border: '1px solid', borderColor: 'rgba(15,23,42,.08)', textAlign: 'center' }}><Avatar sx={{ mx: 'auto', mb: 1.5, width: 64, height: 64, bgcolor: '#fff1e7', color: theme.colors.primary.main }}><CardGiftcardRoundedIcon /></Avatar><Typography sx={{ color: theme.colors.black.main, fontWeight: 800 }}>ยังไม่มีรายการอังเปา</Typography><Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 13 }}>เมื่อได้รับอังเปา รายการจะแสดงที่หน้านี้</Typography></Card> : <Grid container spacing={1.5}>{coupons.map((coupon: any, index: number) => { const claimed = String(coupon.status) === 'claimed'; const org = member?.member_type === 'general_member' ? undefined : organizationMap.get(String(coupon.organization_id)) as any; return <Grid key={coupon.coupon_id || index} size={12}><Card elevation={0} sx={{ p: { xs: 1.75, md: 2.25 }, borderRadius: 2.5, bgcolor: claimed ? '#f1f5f9' : '#fff8eb', border: '1px solid', borderColor: claimed ? '#e2e8f0' : '#f7c86a', opacity: claimed ? .75 : 1 }}><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }}><Avatar variant="rounded" src={claimed ? '/assets/svg/pg/redpacket-gray.svg' : '/assets/svg/pg/redpacket.svg'} sx={{ width: 58, height: 58, bgcolor: alpha('#f59e0b', .12) }}><CardGiftcardRoundedIcon /></Avatar><Box sx={{ flex: 1, minWidth: 0 }}><Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap><Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>{Number(coupon.amount || 0).toLocaleString()} Coin</Typography><Chip size="small" label={claimed ? 'รับแล้ว' : 'พร้อมรับ'} icon={claimed ? <CheckCircleRoundedIcon /> : undefined} sx={{ color: claimed ? '#64748b' : '#b45309', bgcolor: claimed ? '#e2e8f0' : '#ffedb5', fontSize: 11 }} /></Stack><Typography sx={{ mt: .5, color: theme.colors.gray.main, fontSize: 13 }}>{org?.company_name || 'อังเปาจากระบบ PX'}</Typography><Typography sx={{ mt: .25, color: theme.colors.gray.main, fontSize: 12 }}>{formatDate(coupon.created_at)}</Typography></Box><Button variant="contained" disabled={claimed || isClaiming} onClick={() => handleClaim(coupon)} sx={{ minWidth: { xs: '100%', sm: 120 }, background: claimed ? '#cbd5e1' : theme.colors.gradients.primary }}>{claimed ? 'รับแล้ว' : 'รับอังเปา'}</Button></Stack></Card></Grid>; })}</Grid>}
        </Stack>
      </Container>
    </Box>
  );
}
