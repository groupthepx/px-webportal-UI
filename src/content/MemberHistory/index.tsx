'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import HourglassTopRoundedIcon from '@mui/icons-material/HourglassTopRounded';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded';
import ReplayRoundedIcon from '@mui/icons-material/ReplayRounded';
import SwapHorizRoundedIcon from '@mui/icons-material/SwapHorizRounded';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useMemo, useState } from 'react';

import { useGetGeneralRewardHistoryByMemberQuery, useGetMemberByIdQuery, useGetProfileByIdQuery, useLazyGetRewardHistoryQuery } from '@/lib/features/profile';
import { useGetTransferCoinBalanceListAllQuery } from '@/lib/features/coinpackage';
import { useGetMyLivePointsTransactionsQuery, useGetPxMarketProductHistoryListAllQuery } from '@/lib/features/px_market_product';
import { buildUploadUrl } from '@/content/Home/homeData';
import {
  filterTransactions,
  filterGeneralRewardHistory,
  normalizeStatus,
  normalizeAppName,
  toTransactionRows,
  TransactionFilters,
  TransactionRow,
  TransactionSource,
  TransactionStatus,
  toGeneralMemberTransactionRows,
} from './transactionHistory';

type HistoryAction = {
  title: string;
  description: string;
  href: string;
  icon: typeof HistoryRoundedIcon;
  color: string;
};

const financialActions: HistoryAction[] = [
  { title: 'ประวัติการถอนเงิน', description: 'ตรวจสอบรายการถอนเงินและสถานะ', href: '/profile/withdraw_money', icon: AccountBalanceWalletOutlinedIcon, color: '#0f766e' },
  { title: 'ประวัติการแลกเหรียญ', description: 'ดูรายการแลก PX Coin', href: '/profile/withdraw_coin', icon: SwapHorizRoundedIcon, color: '#db2777' },
  { title: 'ธุรกรรมรวม', description: 'รายรับและรายจ่ายของคุณ', href: '#transactions', icon: HistoryRoundedIcon, color: '#475569' },
];

const rewardActions: HistoryAction[] = [
  { title: 'ประวัติ PX Market', description: 'ดูประวัติการสั่งซื้อและแลกรางวัล', href: '/profile/market_history', icon: LocalMallOutlinedIcon, color: '#0284c7' },
  { title: 'ประวัติของขวัญ', description: 'ดูของขวัญที่ได้รับ', href: '/gift_box', icon: RedeemRoundedIcon, color: '#f59e0b' },
  { title: 'อังเปา', description: 'ดูรายการอังเปาที่ได้รับ', href: '/member/angpao', icon: CardGiftcardOutlinedIcon, color: '#db2777' },
];

const initialFilters: TransactionFilters = {
  appId: 'all',
  type: 'all',
  format: 'all',
  status: 'all',
};

const statusPresentation: Record<TransactionStatus, { label: string; color: string; background: string; icon: typeof CheckCircleOutlineRoundedIcon }> = {
  success: { label: 'สำเร็จ', color: '#16803c', background: '#ecfdf3', icon: CheckCircleOutlineRoundedIcon },
  pending: { label: 'รอดำเนินการ', color: '#a16207', background: '#fef9c3', icon: HourglassTopRoundedIcon },
  rejected: { label: 'ปฏิเสธ', color: '#dc2626', background: '#fef2f2', icon: CancelOutlinedIcon },
  refunded: { label: 'คืนคะแนน', color: '#0369a1', background: '#e0f2fe', icon: ReplayRoundedIcon },
  unknown: { label: 'ไม่ระบุ', color: '#64748b', background: '#f1f5f9', icon: HelpOutlineRoundedIcon },
};

const formatTransactionDate = (value?: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' });
};

const sourceFromScore = (item: Record<string, any>): TransactionSource => {
  const value = [item.source, item.reward_source, item.type, item.detail, item.description, item.remark]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  if (value.includes('admin') || value.includes('แอดมิน')) return 'admin';
  if (value.includes('level') || value.includes('ระดับ')) return 'level';
  return 'live';
};

function ActionCard({ action }: { action: HistoryAction }) {
  const Icon = action.icon;
  return (
    <Card elevation={0} sx={{ height: '100%', border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
      <CardActionArea href={action.href} sx={{ height: '100%' }}>
        <CardContent sx={{ p: { xs: 1.75, md: 2 } }}>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', borderRadius: 1.75, color: action.color, bgcolor: alpha(action.color, 0.1), flexShrink: 0 }}>
              <Icon />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ color: '#172033', fontSize: 14, fontWeight: 800 }}>{action.title}</Typography>
              <Typography sx={{ mt: 0.35, color: '#667085', fontSize: 12, lineHeight: 1.4 }}>{action.description}</Typography>
            </Box>
            <ChevronRightRoundedIcon sx={{ ml: 'auto', color: '#98a2b3', flexShrink: 0 }} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={onChange}>
        {children}
      </Select>
    </FormControl>
  );
}

function TransactionFiltersCard({
  rows,
  apps,
  showAppFilter,
  filters,
  onChange,
  onClear,
}: {
  rows: TransactionRow[];
  apps: Array<{ id: string; name: string }>;
  showAppFilter: boolean;
  filters: TransactionFilters;
  onChange: (key: keyof TransactionFilters, value: string) => void;
  onClear: () => void;
}) {
  const theme = useTheme();
  const memberApps = useMemo(() => {
    const appMap = new Map<string, string>(apps.map((app) => [app.id, app.name]));
    rows.forEach((row) => appMap.set(row.appId, row.appName));
    return Array.from(appMap.entries());
  }, [apps, rows]);

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
      <CardContent sx={{ p: { xs: 1.5, md: 2 } }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.25} alignItems={{ xs: 'stretch', md: 'center' }}>
          <Typography sx={{ minWidth: { md: 88 }, color: '#172033', fontSize: 14, fontWeight: 800 }}>กรองข้อมูล</Typography>
          <Grid container spacing={1.25} sx={{ flex: 1 }}>
            {showAppFilter && <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FilterSelect label="แอป" value={filters.appId} onChange={(event) => onChange('appId', event.target.value)}>
                <MenuItem value="all">ทุกแอป</MenuItem>
                {memberApps.map(([id, name]) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
              </FilterSelect>
            </Grid>}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FilterSelect label="ประเภท" value={filters.type} onChange={(event) => onChange('type', event.target.value)}>
                <MenuItem value="all">ทุกประเภท</MenuItem>
                <MenuItem value="income">รายรับ</MenuItem>
                <MenuItem value="expense">รายจ่าย</MenuItem>
              </FilterSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FilterSelect label="รูปแบบ" value={filters.format} onChange={(event) => onChange('format', event.target.value)}>
                <MenuItem value="all">ทุกรูปแบบ</MenuItem>
                <MenuItem value="เงิน">เงิน</MenuItem>
                <MenuItem value="Coin PX">Coin PX</MenuItem>
                <MenuItem value="คะแนน">คะแนน</MenuItem>
              </FilterSelect>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FilterSelect label="สถานะ" value={filters.status} onChange={(event) => onChange('status', event.target.value)}>
                <MenuItem value="all">ทุกสถานะ</MenuItem>
                {Object.entries(statusPresentation).map(([key, status]) => <MenuItem key={key} value={key}>{status.label}</MenuItem>)}
              </FilterSelect>
            </Grid>
          </Grid>
          <Button
            variant="text"
            color="inherit"
            startIcon={<FilterAltOffOutlinedIcon />}
            onClick={onClear}
            sx={{ minWidth: { md: 130 }, color: theme.colors.primary.main, whiteSpace: 'nowrap' }}
          >
            ล้างตัวกรอง
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

function TransactionList({ rows, loading, showAppColumn }: { rows: TransactionRow[]; loading: boolean; showAppColumn: boolean }) {
  const theme = useTheme();
  const stickyAmountSx = {
    position: 'sticky' as const,
    right: 0,
    zIndex: 2,
    minWidth: 112,
    width: 112,
    backgroundColor: '#fff',
    boxShadow: '-5px 0 10px rgba(15, 23, 42, 0.08)',
  };

  return (
    <Card id="transactions" elevation={0} sx={{ border: '1px solid', borderColor: 'rgba(15,23,42,.08)', borderRadius: 2.5 }}>
      <CardContent sx={{ p: { xs: 1.5, md: 2.25 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1}>
          <Box>
            <Typography sx={{ color: '#172033', fontSize: 18, fontWeight: 800 }}>ธุรกรรมรวม</Typography>
            <Typography sx={{ mt: 0.35, color: '#667085', fontSize: 13 }}>{showAppColumn ? 'ประวัติรายรับและรายจ่ายของแต่ละแอปในหน้าเดียว' : 'ประวัติรายรับและรายจ่ายของบัญชีนี้'}</Typography>
          </Box>
          <Chip icon={<HistoryRoundedIcon />} label={`${rows.length} รายการ`} size="small" sx={{ bgcolor: alpha(theme.colors.primary.main, 0.1), color: theme.colors.primary.main }} />
        </Stack>
        <Divider sx={{ my: 1.5 }} />
        {loading ? (
          <Box sx={{ py: 5, display: 'grid', placeItems: 'center' }}><CircularProgress size={28} color="primary" /></Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <HistoryRoundedIcon sx={{ color: '#98a2b3', fontSize: 36 }} />
            <Typography sx={{ mt: 0.75, color: '#667085', fontSize: 14 }}>ไม่พบรายการตามตัวกรอง</Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: 'auto', border: '1px solid #edf0f2', borderRadius: 1.75 }}>
            <Table sx={{ minWidth: showAppColumn ? 1080 : 900, '& .MuiTableCell-root': { px: { xs: 1.25, md: 1.75 }, py: 1.35, whiteSpace: 'nowrap' } }}>
              <TableHead>
                <TableRow sx={{ bgcolor: '#fafbfc' }}>
                  {['วันเวลา', 'ประเภท', ...(showAppColumn ? ['แอป'] : []), 'รูปแบบ', 'รายการ'].map((heading) => (
                    <TableCell key={heading} sx={{ color: '#344054', fontSize: 12.5, fontWeight: 800 }}>{heading}</TableCell>
                  ))}
                  <TableCell sx={{ color: '#344054', fontSize: 12.5, fontWeight: 800 }}>สถานะ</TableCell>
                  <TableCell sx={{ ...stickyAmountSx, zIndex: 4, backgroundColor: '#fafbfc', color: '#344054', fontSize: 12.5, fontWeight: 800 }} align="right">ยอด</TableCell>
                  <TableCell sx={{ color: '#344054', fontSize: 12.5, fontWeight: 800 }}>หมายเหตุ</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const status = statusPresentation[row.status];
                  const StatusIcon = status.icon;
                  const isIncome = row.type === 'income';
                  return (
                    <TableRow key={row.id} hover>
                      <TableCell sx={{ color: '#475467', fontSize: 12.5 }}>{formatTransactionDate(row.createdAt)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={isIncome ? <ArrowUpwardRoundedIcon /> : <ArrowDownwardRoundedIcon />}
                          label={isIncome ? 'รายรับ' : 'รายจ่าย'}
                          size="small"
                          sx={{ height: 26, color: isIncome ? '#16803c' : '#dc2626', bgcolor: isIncome ? '#ecfdf3' : '#fef2f2', fontSize: 11.5, fontWeight: 700, '& .MuiChip-icon': { color: 'inherit', fontSize: 15 } }}
                        />
                      </TableCell>
                      {showAppColumn && <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.8}>
                          <Avatar variant="rounded" src={buildUploadUrl(row.appLogo) || undefined} sx={{ width: 26, height: 26, fontSize: 11, bgcolor: alpha(theme.colors.primary.main, 0.1), color: theme.colors.primary.main }}>{row.appName.slice(0, 1)}</Avatar>
                          <Typography sx={{ color: '#344054', fontSize: 13, fontWeight: 700 }}>{row.appName}</Typography>
                        </Stack>
                      </TableCell>}
                      <TableCell sx={{ color: '#475467', fontSize: 13 }}>{row.format}</TableCell>
                      <TableCell sx={{ color: '#344054', fontSize: 13 }}>{row.item}</TableCell>
                      <TableCell>
                        <Chip icon={<StatusIcon />} label={status.label} size="small" sx={{ height: 26, color: status.color, bgcolor: status.background, fontSize: 11.5, fontWeight: 700, '& .MuiChip-icon': { color: 'inherit', fontSize: 15 } }} />
                      </TableCell>
                      <TableCell align="right" sx={{ ...stickyAmountSx, color: isIncome ? '#16803c' : '#dc2626', fontSize: 13.5, fontWeight: 800 }}>
                        {isIncome ? '+' : '-'}{row.amount.toLocaleString()}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220, color: '#667085', fontSize: 12.5, whiteSpace: 'normal !important' }}>{row.note || '-'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default function MemberHistory() {
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileByIdQuery();
  const memberId = profileResponse?.data?.member_id ? String(profileResponse.data.member_id) : '0';
  const { data: memberResponse, isLoading: isMemberLoading } = useGetMemberByIdQuery({ id: memberId }, { skip: memberId === '0' });
  const { data: transferResponse } = useGetTransferCoinBalanceListAllQuery({ id: memberId }, { skip: memberId === '0' });
  const { data: marketResponse } = useGetPxMarketProductHistoryListAllQuery({ status: '' }, { skip: memberId === '0' });
  const { data: livePointsResponse } = useGetMyLivePointsTransactionsQuery(undefined, { skip: memberId === '0' });
  const { data: generalRewardResponse, isLoading: isGeneralRewardLoading } = useGetGeneralRewardHistoryByMemberQuery(
    { id: memberId },
    { skip: memberId === '0' || memberResponse?.data?.member_type !== 'general_member' },
  );
  const [loadRewardHistory] = useLazyGetRewardHistoryQuery();
  const [appRewardRows, setAppRewardRows] = useState<TransactionRow[]>([]);
  const [isAppRewardLoading, setIsAppRewardLoading] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>(initialFilters);
  const theme = useTheme();

  const member = memberResponse?.data;
  const isGeneralUser = member?.member_type === 'general_member';
  const memberOrganizations = useMemo(() => (member?.member_organization || []).filter((item: any) => item.is_active !== false), [member]);

  useEffect(() => {
    let cancelled = false;
    if (memberId === '0' || memberOrganizations.length === 0) {
      queueMicrotask(() => {
        if (!cancelled) {
          setAppRewardRows([]);
          setIsAppRewardLoading(false);
        }
      });
      return () => { cancelled = true; };
    }

    queueMicrotask(() => {
      if (!cancelled) setIsAppRewardLoading(true);
    });
    Promise.all(memberOrganizations.map(async (organization: any) => {
      try {
        const response = await loadRewardHistory({ id: memberId, organization_id: String(organization.organization_id) }).unwrap();
        const items = Array.isArray(response?.data) ? response.data : [];
        return toTransactionRows(items, {
          source: 'coin',
          format: 'Coin PX',
          appId: String(organization.organization_id),
          appName: organization.organization?.company_name,
          appLogo: organization.organization?.company_logo,
        });
      } catch {
        return [];
      }
    })).then((rows) => {
      if (!cancelled) setAppRewardRows(rows.flat());
    }).finally(() => {
      if (!cancelled) setIsAppRewardLoading(false);
    });

    return () => { cancelled = true; };
  }, [loadRewardHistory, memberId, memberOrganizations]);

  const memberTransfers = (transferResponse?.data || []) as Record<string, any>[];
  const generalRewards = (generalRewardResponse?.data || []) as Record<string, any>[];
  const marketOrders = ((marketResponse?.data || []) as Record<string, any>[]).filter((item) => String(item.buy_by_id || item.member_id || item.buy_by?.member_id || '') === memberId);
  const livePointTransactions = (livePointsResponse?.data || []) as Record<string, any>[];

  const transactions = useMemo(() => {
    const transferRows = memberTransfers.flatMap((item, index) => {
      const organizationId = String(item.organization_id || item.organizationId || '');
      const organization = memberOrganizations.find((candidate: any) => String(candidate.organization_id) === organizationId);
      return toTransactionRows([item], {
        source: 'coin',
        format: 'Coin PX',
        appId: organizationId || undefined,
        appName: organization?.organization?.company_name || (organizationId ? undefined : 'ทั่วไป'),
        appLogo: organization?.organization?.company_logo,
      }).map((row) => ({ ...row, id: row.id || `transfer-${index}` }));
    });
    const marketRows = marketOrders.flatMap((item, index) => toTransactionRows([
      { ...item, item: item.product?.name || item.product_name || 'แลกตลาด PX', id: item.order_id || item.id || `market-${index}` },
    ], {
      source: 'market',
      format: Number(item.points_used || 0) > 0 ? 'คะแนน' : 'Coin PX',
      type: 'expense',
      appId: 'px-market',
      appName: 'ตลาด PX',
    }));
    const scoreRows = livePointTransactions.flatMap((item, index) => toTransactionRows([
      { ...item, id: item.id || item.transaction_id || `score-${index}` },
    ], {
      source: sourceFromScore(item),
      format: 'คะแนน',
      appId: memberOrganizations.find((organization: any) => normalizeAppName(organization.organization?.company_name) === normalizeAppName(item.company_name))?.organization_id,
      appName: item.company_name || undefined,
      appLogo: memberOrganizations.find((organization: any) => normalizeAppName(organization.organization?.company_name) === normalizeAppName(item.company_name))?.organization?.company_logo,
    }));
    const generalRows = isGeneralUser ? toGeneralMemberTransactionRows({
      // Transfer and market records already come from their dedicated APIs.
      // Keep the generic reward ledger for wallet rewards only to avoid duplicates.
      rewards: filterGeneralRewardHistory(generalRewards),
      transfers: memberTransfers,
    }) : [];

    return [...appRewardRows, ...transferRows, ...marketRows, ...scoreRows, ...generalRows]
      .filter((row) => row.amount > 0)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [appRewardRows, generalRewards, isGeneralUser, livePointTransactions, marketOrders, memberOrganizations, memberTransfers]);

  const filteredTransactions = useMemo(() => filterTransactions(transactions, filters), [filters, transactions]);
  const filterApps = useMemo(() => isGeneralUser ? [] : [
    ...memberOrganizations.map((organization: any) => ({
      id: String(organization.organization_id),
      name: organization.organization?.company_name || 'ไม่ระบุแอป',
    })),
    ...(transactions.some((row) => row.appId === 'px-market') ? [{ id: 'px-market', name: 'ตลาด PX' }] : []),
  ], [isGeneralUser, memberOrganizations, transactions]);

  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value } as TransactionFilters));
  };

  if (isProfileLoading || isMemberLoading) {
    return <Box sx={{ minHeight: 'calc(100vh - 160px)', display: 'grid', placeItems: 'center', backgroundColor: '#f7f8fa' }}><CircularProgress color="primary" /></Box>;
  }

  return (
    <Box sx={{ minHeight: 'calc(100vh - 160px)', backgroundColor: '#f7f8fa', py: { xs: 3, md: 5 } }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xs: 2.5, md: 3.5 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
            <Box>
              <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 24, md: 32 }, fontWeight: 800 }}>ประวัติ</Typography>
              <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 14 }}>รวมประวัติการเงิน การสั่งซื้อ และของรางวัลของคุณ</Typography>
            </Box>
            <Button href="/home" variant="outlined" startIcon={<ChevronRightRoundedIcon sx={{ transform: 'rotate(180deg)' }} />}>กลับหน้าหลัก</Button>
          </Stack>

          <Box>
            <Typography sx={{ mb: 1.25, color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ประวัติการเงินรวม</Typography>
            <Grid container spacing={1.5}>{financialActions.map((action) => <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}><ActionCard action={action} /></Grid>)}</Grid>
          </Box>

          <Box>
            <Typography sx={{ mb: 1.25, color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>คำสั่งซื้อและของรางวัลรวม</Typography>
            <Grid container spacing={1.5}>{rewardActions.map((action) => <Grid key={action.title} size={{ xs: 12, sm: 6, md: 4 }}><ActionCard action={action} /></Grid>)}</Grid>
          </Box>

          <TransactionFiltersCard showAppFilter={!isGeneralUser} apps={filterApps} rows={transactions} filters={filters} onChange={handleFilterChange} onClear={() => setFilters(initialFilters)} />
          <TransactionList showAppColumn={!isGeneralUser} rows={filteredTransactions} loading={isAppRewardLoading || isGeneralRewardLoading} />
          {!member && <Typography sx={{ color: theme.colors.gray.main, fontSize: 13 }}>ไม่พบข้อมูลสมาชิกในขณะนี้</Typography>}
        </Stack>
      </Container>
    </Box>
  );
}
