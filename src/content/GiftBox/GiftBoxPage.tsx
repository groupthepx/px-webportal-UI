'use client';

import { useAcceptGiftMutation, useGetMyGiftsQuery } from '@/lib/features/gift';
import {
    useGetProfileByIdQuery,
} from '@/lib/features/profile';
import { GiftItem } from '@/model/gift';
import GiftAcceptConfirmDialog from './components/GiftAcceptConfirmDialog';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InboxIcon from '@mui/icons-material/Inbox';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RedeemIcon from '@mui/icons-material/Redeem';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import {
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    CircularProgress,
    Container,
    InputAdornment,
    MenuItem,
    Skeleton,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Tooltip,
    Typography,
    Zoom,
    alpha,
    useMediaQuery,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { FC, useMemo, useState } from 'react';

type TabFilter = 'ALL' | 'PENDING' | 'ACCEPTED' | 'EXPIRED';
type SortBy = 'newest' | 'oldest' | 'price_high' | 'price_low';

const GiftBoxPage: FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const primaryMain = theme.palette.primary.main;
    const primaryGradient = theme.colors.gradients.primary;
    const primaryGradientHover = theme.colors.gradients.primaryHover;

    // -------- state --------
    const [activeTab, setActiveTab] = useState<TabFilter>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('newest');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    // -------- profile --------
    const { data: ProfileById, isLoading: isLoadingProfileById } = useGetProfileByIdQuery();
    const memberParamsId =
        !isLoadingProfileById && ProfileById?.data?.member_id
            ? String(ProfileById.data.member_id)
            : '0';

    // -------- gifts query --------
    const { data: giftsData, isLoading: isLoadingGifts } = useGetMyGiftsQuery(
        { member_id: memberParamsId },
        { skip: memberParamsId === '0' }
    );

    const allGifts: GiftItem[] = giftsData?.data || [];

    // -------- mutation --------
    const [acceptGift, { isLoading: isAccepting }] = useAcceptGiftMutation();
    const [acceptingGiftId, setAcceptingGiftId] = useState<string | null>(null);
    const [giftToConfirm, setGiftToConfirm] = useState<GiftItem | null>(null);

    // -------- helpers --------
    const fmtDate = (iso?: string) => {
        if (!iso) return 'N/A';
        try { return format(new Date(iso), 'dd/MM/yyyy HH:mm'); } catch { return 'N/A'; }
    };

    const isExpired = (expiredAt: string) => new Date(expiredAt) < new Date();
    const isGiftExpired = (gift: GiftItem) => gift.status === 'EXPIRED' || isExpired(gift.expired_at);
    const getGiftCoinPrice = (gift: GiftItem) => {
        const directPrice = Number(gift.gift_price ?? 0);
        if (Number.isFinite(directPrice) && directPrice > 0) return directPrice;

        const fallbackPrice = Number(gift.product?.discounted_price ?? gift.product?.product_price ?? 0);
        return Number.isFinite(fallbackPrice) ? fallbackPrice : 0;
    };

    const handleOpenConfirm = (gift: GiftItem) => {
        setGiftToConfirm(gift);
    };

    const handleCloseConfirm = () => {
        if (!isAccepting) {
            setGiftToConfirm(null);
        }
    };

    const handleAcceptGift = async (gift: GiftItem) => {
        try {
            setAcceptingGiftId(gift.gift_id);
            const payload: any = await acceptGift({ gift_id: gift.gift_id }).unwrap();
            if (payload?.status === 200) {
                enqueueSnackbar('รับของขวัญสำเร็จ! 🎉', {
                    variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' }, TransitionComponent: Zoom,
                });
            } else {
                enqueueSnackbar(payload?.message || 'ไม่สามารถรับของขวัญได้', {
                    variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' }, TransitionComponent: Zoom,
                });
            }
        } catch (error: any) {
            enqueueSnackbar(error?.data?.message || 'เกิดข้อผิดพลาดระหว่างรับของขวัญ', {
                variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' }, TransitionComponent: Zoom,
            });
        } finally {
            setAcceptingGiftId(null);
            setGiftToConfirm(null);
        }
    };

    // -------- computed --------
    const counts = useMemo(() => {
        const pending = allGifts.filter(g => g.status === 'PENDING' && !isGiftExpired(g)).length;
        const accepted = allGifts.filter(g => g.status === 'ACCEPTED').length;
        const expired = allGifts.filter(g => isGiftExpired(g) && g.status !== 'ACCEPTED').length;
        return { all: allGifts.length, pending, accepted, expired };
    }, [allGifts]);

    const filteredGifts = useMemo(() => {
        let result = [...allGifts];

        if (activeTab === 'PENDING') result = result.filter(g => g.status === 'PENDING' && !isGiftExpired(g));
        else if (activeTab === 'ACCEPTED') result = result.filter(g => g.status === 'ACCEPTED');
        else if (activeTab === 'EXPIRED') result = result.filter(g => isGiftExpired(g) && g.status !== 'ACCEPTED');

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(g =>
                g.product?.product_name?.toLowerCase().includes(q) ||
                g.message?.toLowerCase().includes(q)
            );
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
                case 'price_high': return (b.gift_price ?? 0) - (a.gift_price ?? 0);
                case 'price_low': return (a.gift_price ?? 0) - (b.gift_price ?? 0);
                default: return 0;
            }
        });

        return result;
    }, [allGifts, activeTab, searchQuery, sortBy]);

    const paginatedGifts = useMemo(() => {
        return filteredGifts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [filteredGifts, page, rowsPerPage]);

    const getStatusConfig = (gift: GiftItem) => {
        const expired = isGiftExpired(gift);
        if (gift.status === 'ACCEPTED') return {
            label: 'รับแล้ว', color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
            icon: <CheckCircleOutlineIcon sx={{ fontSize: 14 }} />,
        };
        if (expired) return {
            label: 'หมดอายุ', color: theme.palette.text.disabled,
            bgColor: alpha(theme.palette.text.disabled, 0.1),
            icon: <BlockIcon sx={{ fontSize: 14 }} />,
        };
        return {
            label: 'รอรับ', color: primaryMain,
            bgColor: alpha(primaryMain, 0.08),
            icon: <ScheduleIcon sx={{ fontSize: 14 }} />,
        };
    };

    const isLoading = isLoadingGifts || isLoadingProfileById;

    // ——— Table header columns ———
    const columns = [
        { id: 'no', label: '#', minWidth: 50, align: 'center' as const },
        { id: 'image', label: 'รูปภาพ', minWidth: 80, align: 'center' as const },
        { id: 'name', label: 'ชื่อสินค้า', minWidth: 160, align: 'left' as const },
        { id: 'price', label: 'มูลค่า (Coin PX)', minWidth: 140, align: 'right' as const },
        { id: 'message', label: 'ข้อความ', minWidth: 140, align: 'left' as const },
        { id: 'sender', label: 'ผู้ส่ง', minWidth: 120, align: 'left' as const },
        { id: 'date', label: 'วันที่ได้รับ', minWidth: 130, align: 'center' as const },
        { id: 'expiry', label: 'หมดอายุ', minWidth: 130, align: 'center' as const },
        { id: 'status', label: 'สถานะ', minWidth: 100, align: 'center' as const },
        { id: 'action', label: 'ดำเนินการ', minWidth: 120, align: 'center' as const },
    ];

    // ——— Skeleton Rows ———
    const renderSkeletonRows = () => (
        <>
            {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                    {columns.map((col) => (
                        <TableCell key={col.id} align={col.align}>
                            {col.id === 'image' ? (
                                <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: 1.5, mx: 'auto' }} />
                            ) : col.id === 'action' ? (
                                <Skeleton variant="rounded" width={90} height={32} sx={{ borderRadius: 2, mx: 'auto' }} />
                            ) : col.id === 'status' ? (
                                <Skeleton variant="rounded" width={70} height={24} sx={{ borderRadius: 3, mx: 'auto' }} />
                            ) : (
                                <Skeleton variant="text" width={col.id === 'no' ? 20 : '80%'} />
                            )}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    );

    // ——— Empty State ———
    const renderEmptyState = () => (
        <TableRow>
            <TableCell colSpan={columns.length} sx={{ border: 0 }}>
                <Box sx={{ textAlign: 'center', py: { xs: 8, md: 10 }, px: 3 }}>
                    <Box
                        sx={{
                            width: { xs: 90, md: 110 },
                            height: { xs: 90, md: 110 },
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${alpha(primaryMain, 0.06)}, ${alpha(primaryMain, 0.12)})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            mx: 'auto', mb: 3,
                        }}
                    >
                        <InboxIcon sx={{ fontSize: { xs: 40, md: 50 }, color: alpha(primaryMain, 0.3) }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}>
                        {activeTab === 'ALL' ? 'ยังไม่มีของขวัญ' : 'ไม่พบรายการ'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, maxWidth: 340, mx: 'auto' }}>
                        {activeTab === 'ALL'
                            ? 'เมื่อมีคนส่งของขวัญให้คุณ จะแสดงรายการที่นี่'
                            : 'ไม่มีรายการที่ตรงกับตัวกรองที่เลือก'}
                    </Typography>
                </Box>
            </TableCell>
        </TableRow>
    );

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
            {/* ——— Hero Header ——— */}
            <Box
                sx={{
                    background: primaryGradient,
                    pt: { xs: 3, sm: 4, md: 5 },
                    pb: { xs: 5, sm: 6, md: 7 },
                    px: { xs: 2, sm: 3 },
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -60, right: -60,
                        width: 200, height: 200,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.06),
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -40, left: -40,
                        width: 160, height: 160,
                        borderRadius: '50%',
                        background: alpha('#fff', 0.04),
                    },
                }}
            >
                <Container maxWidth="lg">
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 2,
                        }}
                    >
                        <Box display="flex" alignItems="center" gap={2}>
                            <Box
                                sx={{
                                    width: { xs: 48, md: 56 }, height: { xs: 48, md: 56 },
                                    borderRadius: 3,
                                    backgroundColor: alpha('#fff', 0.2),
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    backdropFilter: 'blur(4px)',
                                }}
                            >
                                <CardGiftcardIcon sx={{ fontSize: { xs: 28, md: 32 }, color: '#fff' }} />
                            </Box>
                            <Box>
                                <Typography
                                    variant="h4"
                                    sx={{
                                        fontWeight: 800, color: '#fff',
                                        fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' },
                                        lineHeight: 1.2,
                                    }}
                                >
                                    กล่องของขวัญ
                                </Typography>
                                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8), fontWeight: 500, mt: 0.3 }}>
                                    ของขวัญทั้งหมดจากเพื่อนสมาชิก
                                </Typography>
                            </Box>
                        </Box>

                        {/* Stats */}
                        <Box sx={{ display: 'flex', gap: { xs: 1.5, sm: 2 }, flexWrap: 'wrap' }}>
                            {[
                                { label: 'ทั้งหมด', count: counts.all, color: '#fff' },
                                { label: 'รอรับ', count: counts.pending, color: '#FFD54F' },
                                { label: 'รับแล้ว', count: counts.accepted, color: '#A5D6A7' },
                            ].map((stat) => (
                                <Box
                                    key={stat.label}
                                    sx={{
                                        textAlign: 'center',
                                        px: { xs: 1.5, sm: 2 }, py: 1,
                                        borderRadius: 2,
                                        backgroundColor: alpha('#fff', 0.12),
                                        backdropFilter: 'blur(4px)',
                                        minWidth: { xs: 70, sm: 80 },
                                    }}
                                >
                                    <Typography
                                        variant="h4"
                                        sx={{
                                            fontWeight: 800, color: stat.color,
                                            fontSize: { xs: '1.3rem', md: '1.5rem' },
                                        }}
                                    >
                                        {isLoading ? '–' : stat.count}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: alpha('#fff', 0.75), fontWeight: 600 }}>
                                        {stat.label}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Container>
            </Box>

            {/* ——— Main Content ——— */}
            <Container maxWidth="lg" sx={{ mt: { xs: -3, sm: -4 }, pb: 6, position: 'relative', zIndex: 1 }}>
                <Card
                    sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: `0 4px 24px ${alpha(theme.palette.common.black, 0.06)}`,
                    }}
                >
                    {/* Tabs */}
                    <Tabs
                        value={activeTab}
                        onChange={(_, v) => { setActiveTab(v); setPage(0); }}
                        variant={isMobile ? 'scrollable' : 'standard'}
                        scrollButtons="auto"
                        sx={{
                            background: primaryGradient,
                            px: { xs: 0.5, sm: 1.5 },
                            minHeight: 48,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                minHeight: 48,
                                color: alpha('#fff', 0.7),
                                borderRadius: 2,
                                mx: 0.3,
                                py: 0,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    color: '#fff',
                                    backgroundColor: alpha('#fff', 0.1),
                                },
                            },
                            '& .Mui-selected': {
                                color: '#fff !important',
                                fontWeight: 700,
                                backgroundColor: alpha('#fff', 0.18),
                                backdropFilter: 'blur(4px)',
                            },
                            '& .MuiTabs-indicator': {
                                display: 'none',
                            },
                        }}
                    >
                        <Tab label={`ทั้งหมด ${!isLoading ? `(${counts.all})` : ''}`} value="ALL" />
                        <Tab label={`รอรับ ${!isLoading ? `(${counts.pending})` : ''}`} value="PENDING" />
                        <Tab label={`รับแล้ว ${!isLoading ? `(${counts.accepted})` : ''}`} value="ACCEPTED" />
                        <Tab label={`หมดอายุ ${!isLoading ? `(${counts.expired})` : ''}`} value="EXPIRED" />
                    </Tabs>

                    {/* Search + Sort */}
                    <Box
                        sx={{
                            display: 'flex', gap: 1.5,
                            px: { xs: 2, sm: 2.5 }, py: 2,
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'stretch', sm: 'center' },
                            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                        }}
                    >
                        <TextField
                            size="small"
                            placeholder="ค้นหาของขวัญ..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: theme.palette.text.disabled, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.background.default, 0.6),
                                },
                            }}
                        />
                        <TextField
                            select
                            size="small"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortBy)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SortIcon sx={{ color: theme.palette.text.disabled, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                minWidth: { xs: '100%', sm: 180 },
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: alpha(theme.palette.background.default, 0.6),
                                },
                            }}
                        >
                            <MenuItem value="newest">ใหม่ล่าสุด</MenuItem>
                            <MenuItem value="oldest">เก่าสุด</MenuItem>
                            <MenuItem value="price_high">ราคาสูง → ต่ำ</MenuItem>
                            <MenuItem value="price_low">ราคาต่ำ → สูง</MenuItem>
                        </TextField>
                    </Box>

                    {/* Results info */}
                    {!isLoading && filteredGifts.length > 0 && (
                        <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 1.5, pb: 0.5 }}>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                แสดง <strong>{paginatedGifts.length}</strong> จาก {filteredGifts.length} รายการ
                            </Typography>
                        </Box>
                    )}

                    {/* ——— Table ——— */}
                    <TableContainer sx={{ overflowX: 'auto' }}>
                        <Table
                            sx={{
                                minWidth: 900,
                                '& .MuiTableCell-root': {
                                    px: { xs: 1.5, sm: 2 },
                                    py: { xs: 1.5, sm: 2 },
                                    fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.06)}`,
                                },
                            }}
                        >
                            {/* ——— Table Head ——— */}
                            <TableHead>
                                <TableRow
                                    sx={{
                                        background: primaryGradient,
                                        '& .MuiTableCell-head': {
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                            border: 0,
                                            whiteSpace: 'nowrap',
                                            py: 2,
                                        },
                                    }}
                                >
                                    {columns.map((col) => (
                                        <TableCell key={col.id} align={col.align} sx={{ minWidth: col.minWidth }}>
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            {/* ——— Table Body ——— */}
                            <TableBody>
                                {isLoading ? (
                                    renderSkeletonRows()
                                ) : filteredGifts.length === 0 ? (
                                    renderEmptyState()
                                ) : (
                                    paginatedGifts.map((gift, index) => {
                                        const statusConfig = getStatusConfig(gift);
                                        const isPending = gift.status === 'PENDING' && !isGiftExpired(gift);
                                        const isCurrentAccepting = isAccepting && acceptingGiftId === gift.gift_id;
                                        const dimmed = gift.status === 'ACCEPTED' || isGiftExpired(gift);
                                        const giftPrice = getGiftCoinPrice(gift);
                                        const productImg = gift.product?.product_img
                                            ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${gift.product.product_img}`
                                            : '';
                                        const rowNum = page * rowsPerPage + index + 1;

                                        return (
                                            <TableRow
                                                hover
                                                key={gift.gift_id ?? index}
                                                sx={{
                                                    opacity: dimmed ? 0.6 : 1,
                                                    backgroundColor: isPending
                                                        ? alpha(primaryMain, 0.02)
                                                        : 'transparent',
                                                    '&:nth-of-type(even)': {
                                                        backgroundColor: isPending
                                                            ? alpha(primaryMain, 0.04)
                                                            : alpha(theme.palette.action.hover, 0.03),
                                                    },
                                                    transition: 'background-color 0.15s ease',
                                                    '&:hover': {
                                                        backgroundColor: `${alpha(primaryMain, 0.06)} !important`,
                                                    },
                                                }}
                                            >
                                                {/* # */}
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.secondary }}>
                                                        {rowNum}
                                                    </Typography>
                                                </TableCell>

                                                {/* Image */}
                                                <TableCell align="center">
                                                    <Avatar
                                                        variant="rounded"
                                                        src={productImg}
                                                        alt={gift.product?.product_name || 'Gift'}
                                                        sx={{
                                                            width: 56, height: 56,
                                                            borderRadius: 1.5,
                                                            bgcolor: alpha(primaryMain, 0.06),
                                                            mx: 'auto',
                                                            '& img': { objectFit: 'cover' },
                                                        }}
                                                    >
                                                        {!productImg && (
                                                            <RedeemIcon sx={{ fontSize: 24, color: alpha(primaryMain, 0.35) }} />
                                                        )}
                                                    </Avatar>
                                                </TableCell>

                                                {/* Name */}
                                                <TableCell align="left">
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 700,
                                                            color: theme.palette.text.primary,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            maxWidth: 200,
                                                        }}
                                                    >
                                                        {gift.product?.product_name || 'ของขวัญ'}
                                                    </Typography>
                                                </TableCell>

                                                {/* Price */}
                                                <TableCell align="right">
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 800,
                                                            background: primaryGradient,
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {giftPrice.toLocaleString()} Coin PX
                                                    </Typography>
                                                </TableCell>

                                                {/* Message */}
                                                <TableCell align="left">
                                                    <Tooltip title={gift.message || '–'} arrow placement="top">
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                color: theme.palette.text.secondary,
                                                                fontStyle: gift.message ? 'italic' : 'normal',
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                maxWidth: 160,
                                                            }}
                                                        >
                                                            {gift.message || '–'}
                                                        </Typography>
                                                    </Tooltip>
                                                </TableCell>

                                                {/* Sender */}
                                                <TableCell align="left">
                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                        <PersonOutlineIcon sx={{ fontSize: 16, color: theme.palette.text.disabled }} />
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}>
                                                            {gift.created_by?.user_id || '–'}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Date Received */}
                                                <TableCell align="center">
                                                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}>
                                                        {fmtDate(gift.created_at)}
                                                    </Typography>
                                                </TableCell>

                                                {/* Expiry */}
                                                <TableCell align="center">
                                                    <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                                        <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.disabled }} />
                                                        <Typography variant="body2" sx={{ color: theme.palette.text.secondary, whiteSpace: 'nowrap' }}>
                                                            {fmtDate(gift.expired_at)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>

                                                {/* Status */}
                                                <TableCell align="center">
                                                    <Chip
                                                        icon={statusConfig.icon}
                                                        label={statusConfig.label}
                                                        size="small"
                                                        sx={{
                                                            height: 26,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            color: statusConfig.color,
                                                            backgroundColor: statusConfig.bgColor,
                                                            border: `1px solid ${alpha(statusConfig.color, 0.2)}`,
                                                            '& .MuiChip-icon': { color: statusConfig.color },
                                                        }}
                                                    />
                                                </TableCell>

                                                {/* Action */}
                                                <TableCell align="center">
                                                    {isPending ? (
                                                        <Button
                                                            variant="contained"
                                                            size="small"
                                                            disabled={isCurrentAccepting}
                                                            startIcon={
                                                                isCurrentAccepting ? (
                                                                    <CircularProgress size={14} color="inherit" />
                                                                ) : (
                                                                    <CardGiftcardIcon sx={{ fontSize: 16 }} />
                                                                )
                                                            }
                                                            sx={{
                                                                background: primaryGradient,
                                                                color: '#fff',
                                                                fontWeight: 700,
                                                                borderRadius: 2,
                                                                textTransform: 'none',
                                                                px: 2,
                                                                py: 0.6,
                                                                fontSize: '0.8rem',
                                                                whiteSpace: 'nowrap',
                                                                boxShadow: `0 3px 10px ${alpha(primaryMain, 0.3)}`,
                                                                transition: 'all 0.2s ease',
                                                                '&:hover': {
                                                                    background: primaryGradientHover,
                                                                    boxShadow: `0 5px 16px ${alpha(primaryMain, 0.4)}`,
                                                                    transform: 'translateY(-1px)',
                                                                },
                                                                '&:disabled': {
                                                                    background: alpha(primaryMain, 0.3),
                                                                    color: alpha('#fff', 0.6),
                                                                },
                                                            }}
                                                            onClick={() => handleOpenConfirm(gift)}
                                                        >
                                                            {isCurrentAccepting ? 'กำลังรับ...' : 'รับของขวัญ'}
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                                            –
                                                        </Typography>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* ——— Pagination ——— */}
                    {!isLoading && filteredGifts.length > 0 && (
                        <TablePagination
                            component="div"
                            count={filteredGifts.length}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            labelRowsPerPage="แสดง"
                            labelDisplayedRows={({ from, to, count }) =>
                                `${from}–${to} จาก ${count !== -1 ? count : `มากกว่า ${to}`}`
                            }
                            sx={{
                                borderTop: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                                '& .MuiTablePagination-toolbar': {
                                    px: { xs: 2, sm: 2.5 },
                                },
                            }}
                        />
                    )}
                </Card>
            </Container>

            <GiftAcceptConfirmDialog
                open={Boolean(giftToConfirm)}
                gift={giftToConfirm}
                isSubmitting={isAccepting && acceptingGiftId === giftToConfirm?.gift_id}
                onClose={handleCloseConfirm}
                onConfirm={() => {
                    if (giftToConfirm) {
                        handleAcceptGift(giftToConfirm);
                    }
                }}
            />
        </Box>
    );
};

export default GiftBoxPage;
