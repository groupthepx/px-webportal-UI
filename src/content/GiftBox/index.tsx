'use client';

import { useAcceptGiftMutation, useGetMyGiftsQuery } from '@/lib/features/gift';
import {
    useGetProfileByIdQuery,
} from '@/lib/features/profile';
import { GiftItem } from '@/model/gift';
import GiftAcceptConfirmDialog from './components/GiftAcceptConfirmDialog';
import { Close } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import RedeemIcon from '@mui/icons-material/Redeem';
import ScheduleIcon from '@mui/icons-material/Schedule';
import {
    Avatar,
    Box,
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogContent,
    Divider,
    IconButton,
    Skeleton,
    Stack,
    Typography,
    Zoom,
    alpha,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { enqueueSnackbar } from 'notistack';
import { FC, useState } from 'react';

interface Props {
    openAction: boolean;
    handleActionClose: () => void;
}

const GiftBoxItems: FC<Props> = ({ openAction, handleActionClose }) => {
    const theme = useTheme();
    const router = useRouter();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // -------- colors from theme --------
    const primaryMain = theme.palette.primary.main;
    const primaryGradient = theme.colors.gradients.primary;
    const primaryGradientHover = theme.colors.gradients.primaryHover;

    // -------- profile --------
    const { data: ProfileById, isLoading: isLoadingProfileById } = useGetProfileByIdQuery();
    const memberParamsId =
        !isLoadingProfileById && ProfileById?.data?.member_id
            ? String(ProfileById.data.member_id)
            : '0';

    // -------- gifts query --------
    const {
        data: giftsData,
        isLoading: isLoadingGifts,
    } = useGetMyGiftsQuery(
        { member_id: memberParamsId },
        { skip: memberParamsId === '0' }
    );

    const gifts: GiftItem[] = giftsData?.data || [];
    const pendingCount = gifts.filter(g => g.status === 'PENDING' && new Date(g.expired_at) >= new Date()).length;

    // -------- mutation --------
    const [acceptGift, { isLoading: isAccepting }] = useAcceptGiftMutation();
    const [acceptingGiftId, setAcceptingGiftId] = useState<string | null>(null);
    const [giftToConfirm, setGiftToConfirm] = useState<GiftItem | null>(null);

    // -------- helpers --------
    const fmtDate = (iso?: string) => {
        if (!iso) return 'N/A';
        try {
            return format(new Date(iso), 'dd/MM/yyyy HH:mm');
        } catch {
            return 'N/A';
        }
    };

    const isExpired = (expiredAt: string) => new Date(expiredAt) < new Date();
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
                    variant: 'success',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    TransitionComponent: Zoom,
                });
                handleActionClose();
            } else {
                enqueueSnackbar(payload?.message || 'ไม่สามารถรับของขวัญได้', {
                    variant: 'error',
                    anchorOrigin: { vertical: 'top', horizontal: 'right' },
                    TransitionComponent: Zoom,
                });
            }
        } catch (error: any) {
            enqueueSnackbar(error?.data?.message || 'เกิดข้อผิดพลาดระหว่างรับของขวัญ', {
                variant: 'error',
                anchorOrigin: { vertical: 'top', horizontal: 'right' },
                TransitionComponent: Zoom,
            });
        } finally {
            setAcceptingGiftId(null);
            setGiftToConfirm(null);
        }
    };

    const getStatusConfig = (gift: GiftItem) => {
        const expired = gift.status === 'EXPIRED' || isExpired(gift.expired_at);
        if (gift.status === 'ACCEPTED') return {
            label: 'รับแล้ว',
            color: theme.palette.success.main,
            bgColor: alpha(theme.palette.success.main, 0.1),
            icon: <CheckCircleOutlineIcon sx={{ fontSize: 16 }} />,
        };
        if (expired) return {
            label: 'หมดอายุ',
            color: theme.palette.text.disabled,
            bgColor: alpha(theme.palette.text.disabled, 0.1),
            icon: <BlockIcon sx={{ fontSize: 16 }} />,
        };
        return {
            label: 'รอรับ',
            color: primaryMain,
            bgColor: alpha(primaryMain, 0.08),
            icon: <ScheduleIcon sx={{ fontSize: 16 }} />,
        };
    };

    // ——————— Skeleton Loader ———————
    const renderSkeletons = () => (
        <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
                <Box
                    key={i}
                    sx={{
                        display: 'flex',
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    }}
                >
                    <Skeleton variant="rounded" width={isMobile ? 64 : 80} height={isMobile ? 64 : 80} sx={{ borderRadius: 2 }} />
                    <Box flex={1}>
                        <Skeleton variant="text" width="60%" height={24} />
                        <Skeleton variant="text" width="40%" height={20} />
                        <Skeleton variant="text" width="30%" height={18} sx={{ mt: 1 }} />
                    </Box>
                </Box>
            ))}
        </Stack>
    );

    // ——————— Empty State ———————
    const renderEmptyState = () => (
        <Box
            sx={{
                textAlign: 'center',
                py: { xs: 6, md: 8 },
                px: 3,
            }}
        >
            <Box
                sx={{
                    width: { xs: 80, md: 100 },
                    height: { xs: 80, md: 100 },
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${alpha(primaryMain, 0.08)}, ${alpha(primaryMain, 0.15)})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                }}
            >
                <RedeemIcon sx={{ fontSize: { xs: 36, md: 44 }, color: alpha(primaryMain, 0.4) }} />
            </Box>
            <Typography
                variant="h6"
                sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 1,
                }}
            >
                ยังไม่มีของขวัญ
            </Typography>
            <Typography
                variant="body2"
                sx={{ color: theme.palette.text.secondary, maxWidth: 280, mx: 'auto' }}
            >
                เมื่อมีคนส่งของขวัญให้คุณ จะแสดงรายการที่นี่
            </Typography>
        </Box>
    );

    // ——————— Gift Card ———————
    const renderGiftCard = (gift: GiftItem, index: number) => {
        const statusConfig = getStatusConfig(gift);
        const isPending = gift.status === 'PENDING' && !isExpired(gift.expired_at);
        const isCurrentAccepting = isAccepting && acceptingGiftId === gift.gift_id;
        const giftPrice = getGiftCoinPrice(gift);
        const productImg = gift.product?.product_img
            ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${gift.product.product_img}`
            : '';

        return (
            <Box
                key={gift.gift_id ?? index}
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: { xs: 1.5, sm: 2 },
                    p: { xs: 2, sm: 2.5 },
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
                    backgroundColor: isPending
                        ? alpha(primaryMain, 0.03)
                        : theme.palette.background.paper,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                        backgroundColor: isPending
                            ? alpha(primaryMain, 0.06)
                            : alpha(theme.palette.action.hover, 0.04),
                        boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.06)}`,
                        transform: 'translateY(-1px)',
                    },
                    opacity: gift.status === 'ACCEPTED' || gift.status === 'EXPIRED' || isExpired(gift.expired_at) ? 0.65 : 1,
                }}
            >
                {/* Product Image */}
                <Avatar
                    variant="rounded"
                    src={productImg}
                    alt={gift.product?.product_name || 'Gift'}
                    sx={{
                        width: { xs: '100%', sm: 80 },
                        height: { xs: 160, sm: 80 },
                        borderRadius: 2.5,
                        bgcolor: alpha(primaryMain, 0.06),
                        flexShrink: 0,
                        '& img': {
                            objectFit: 'cover',
                        },
                    }}
                >
                    {!productImg && (
                        <RedeemIcon sx={{ fontSize: { xs: 40, sm: 32 }, color: alpha(primaryMain, 0.35) }} />
                    )}
                </Avatar>

                {/* Content */}
                <Box flex={1} minWidth={0}>
                    {/* Top row: Name + Status */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            justifyContent: 'space-between',
                            flexDirection: { xs: 'column', sm: 'row' },
                            gap: 0.5,
                            mb: 0.5,
                        }}
                    >
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 700,
                                color: theme.palette.text.primary,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: { xs: '100%', sm: '60%' },
                            }}
                        >
                            {gift.product?.product_name || 'ของขวัญ'}
                        </Typography>

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
                                '& .MuiChip-icon': {
                                    color: statusConfig.color,
                                },
                            }}
                        />
                    </Box>

                    {/* Price */}
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: 700,
                            color: primaryMain,
                            mb: gift.message ? 0.5 : 0.75,
                        }}
                    >
                        {giftPrice.toLocaleString()} Coin PX
                    </Typography>

                    {/* Message */}
                    {gift.message && (
                        <Typography
                            variant="body2"
                            sx={{
                                color: theme.palette.text.secondary,
                                fontStyle: 'italic',
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                lineHeight: 1.5,
                                fontSize: '0.8rem',
                            }}
                        >
                            &quot;{gift.message}&quot;
                        </Typography>
                    )}

                    {/* Meta: Sender + Expiry */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: { xs: 0.5, sm: 2 },
                            alignItems: 'center',
                            mb: isPending ? 1.5 : 0,
                        }}
                    >
                        {gift.created_by?.user_id && (
                            <Box display="flex" alignItems="center" gap={0.3}>
                                <PersonOutlineIcon sx={{ fontSize: 14, color: theme.palette.text.disabled }} />
                                <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                    {gift.created_by.user_id}
                                </Typography>
                            </Box>
                        )}
                        <Box display="flex" alignItems="center" gap={0.3}>
                            <AccessTimeIcon sx={{ fontSize: 14, color: theme.palette.text.disabled }} />
                            <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                                หมดอายุ {fmtDate(gift.expired_at)}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Accept Button */}
                    {isPending && (
                        <Button
                            variant="contained"
                            size={isMobile ? 'medium' : 'small'}
                            fullWidth={isMobile}
                            disabled={isCurrentAccepting}
                            startIcon={
                                isCurrentAccepting ? (
                                    <CircularProgress size={16} color="inherit" />
                                ) : (
                                    <CardGiftcardIcon sx={{ fontSize: 18 }} />
                                )
                            }
                            sx={{
                                background: primaryGradient,
                                color: '#fff',
                                fontWeight: 700,
                                borderRadius: 2,
                                textTransform: 'none',
                                px: { xs: 2, sm: 3 },
                                py: 0.8,
                                fontSize: '0.85rem',
                                boxShadow: `0 4px 14px ${alpha(primaryMain, 0.35)}`,
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: primaryGradientHover,
                                    boxShadow: `0 6px 20px ${alpha(primaryMain, 0.45)}`,
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
                    )}
                </Box>
            </Box>
        );
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={openAction}
            onClose={handleActionClose}
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: isMobile ? 0 : 4,
                    maxHeight: isMobile ? '100vh' : '85vh',
                    m: isMobile ? 0 : 2,
                    overflow: 'hidden',
                },
            }}
        >
            {/* ——— Header ——— */}
            <Box
                sx={{
                    background: primaryGradient,
                    px: { xs: 2.5, sm: 3 },
                    py: { xs: 2, sm: 2.5 },
                    position: 'relative',
                }}
            >
                <IconButton
                    aria-label="close"
                    onClick={handleActionClose}
                    sx={{
                        position: 'absolute',
                        right: { xs: 8, sm: 12 },
                        top: { xs: 8, sm: 12 },
                        color: alpha('#fff', 0.8),
                        backgroundColor: alpha('#fff', 0.15),
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                            backgroundColor: alpha('#fff', 0.25),
                        },
                        width: 36,
                        height: 36,
                    }}
                >
                    <Close sx={{ fontSize: 20 }} />
                </IconButton>

                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: 2.5,
                            backgroundColor: alpha('#fff', 0.2),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backdropFilter: 'blur(4px)',
                        }}
                    >
                        <CardGiftcardIcon sx={{ fontSize: 26, color: '#fff' }} />
                    </Box>
                    <Box>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 800,
                                color: '#fff',
                                lineHeight: 1.3,
                                fontSize: { xs: '1.1rem', sm: '1.25rem' },
                            }}
                        >
                            กล่องของขวัญ
                        </Typography>
                        <Typography
                            variant="caption"
                            sx={{
                                color: alpha('#fff', 0.8),
                                fontWeight: 500,
                            }}
                        >
                            {pendingCount > 0
                                ? `${pendingCount} รายการรอรับ`
                                : 'ของขวัญจากเพื่อนสมาชิก'}
                        </Typography>
                    </Box>
                </Box>
            </Box>

            {/* ——— Content ——— */}
            <DialogContent
                sx={{
                    p: { xs: 2, sm: 2.5 },
                    '&::-webkit-scrollbar': {
                        width: 6,
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'transparent',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: alpha(theme.palette.text.disabled, 0.2),
                        borderRadius: 3,
                    },
                }}
            >
                {isLoadingGifts || isLoadingProfileById ? (
                    renderSkeletons()
                ) : gifts.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <Stack spacing={1.5}>
                        {gifts.map((gift, index) => renderGiftCard(gift, index))}
                    </Stack>
                )}
            </DialogContent>

            {/* ——— Footer ——— */}
            {gifts.length > 0 && (
                <>
                    <Divider />
                    <Box
                        sx={{
                            px: { xs: 2.5, sm: 3 },
                            py: { xs: 1.5, sm: 2 },
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: alpha(theme.palette.background.default, 0.5),
                        }}
                    >
                        <Typography variant="caption" sx={{ color: theme.palette.text.disabled }}>
                            ทั้งหมด {gifts.length} รายการ
                        </Typography>
                        <Box display="flex" gap={1}>
                            <Button
                                size="small"
                                onClick={() => {
                                    handleActionClose();
                                    router.push('/gift_box');
                                }}
                                sx={{
                                    color: primaryMain,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: alpha(primaryMain, 0.08),
                                    },
                                }}
                            >
                                ดูทั้งหมด
                            </Button>
                            <Button
                                size="small"
                                onClick={handleActionClose}
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': {
                                        backgroundColor: alpha(theme.palette.text.secondary, 0.08),
                                    },
                                }}
                            >
                                ปิด
                            </Button>
                        </Box>
                    </Box>
                </>
            )}

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
        </Dialog>
    );
};

export default GiftBoxItems;
