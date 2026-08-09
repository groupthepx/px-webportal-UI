import DialogCustomStatus from '@/components/DialogCustomStatus';
import { LoadingDialog } from '@/components/Loading';
import Texts from '@/components/Texts';
import { DEFAULT_VALUES } from '@/content/withdrawcoin/constants';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';
import { useGetMemberByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { useGetPxMarketProductListAllQuery, usePostOrderPxMarketProductMutation, usePostOrderPxMarketProductNonOrganizationMutation, usePostOrderRedeemPointsMutation, usePostOrderRedeemPointsNonOrganizationMutation, useGetMyLivePointsQuery } from '@/lib/features/px_market_product';
import { OrganizationDetailModel } from '@/model/organization';
import { PxMarketProductDetailModel } from '@/model/px_market_product';
import wait from '@/utils/wait';
import { extractApiError } from '@/utils/extractApiError';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Card,
    CardMedia,
    Chip,
    CircularProgress,
    Container,
    Dialog,
    LinearProgress,
    Skeleton,
    Slide,
    TextField,
    Typography,
    alpha,
    styled,
    useMediaQuery,
    useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { TransitionProps } from '@mui/material/transitions';
import { Formik } from 'formik';
import Image from 'next/image';
import { ReactElement, Ref, forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import CountUp from 'react-countup';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

// --- Countdown Hook ---
const useCountdown = (targetDate: string | null) => {
    const calcTimeLeft = useCallback(() => {
        if (!targetDate) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        const diff = new Date(targetDate).getTime() - Date.now();
        if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        return {
            days: Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((diff / (1000 * 60)) % 60),
            seconds: Math.floor((diff / 1000) % 60),
            isExpired: false,
        };
    }, [targetDate]);

    const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [calcTimeLeft]);

    return timeLeft;
};

// --- Countdown Display Components ---
const CountdownBox = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <Box sx={{ textAlign: 'center', minWidth: { xs: 28, sm: 36 } }}>
        <Box sx={{
            background: alpha(color, 0.08),
            border: `1px solid ${alpha(color, 0.12)}`,
            borderRadius: '8px',
            px: { xs: 0.4, sm: 0.8 },
            py: { xs: 0.2, sm: 0.4 },
        }}>
            <Typography sx={{
                fontSize: { xs: '0.85rem', sm: '1rem' },
                fontWeight: 800,
                color: color,
                lineHeight: 1.2,
                fontVariantNumeric: 'tabular-nums',
            }}>
                {String(value).padStart(2, '0')}
            </Typography>
        </Box>
        <Typography sx={{
            fontSize: { xs: '0.48rem', sm: '0.55rem' },
            color: 'text.disabled',
            fontWeight: 500,
            mt: 0.2,
            textTransform: 'uppercase',
            letterSpacing: 0.3,
        }}>
            {label}
        </Typography>
    </Box>
);

const CountdownSeparator = ({ color }: { color: string }) => (
    <Typography sx={{
        fontSize: { xs: '0.8rem', sm: '0.95rem' },
        fontWeight: 700,
        color: alpha(color, 0.35),
        lineHeight: 1,
        mb: { xs: 1, sm: 1.2 },
    }}>
        :
    </Typography>
);

const CountdownRow = ({ endDate, icon, color, label }: {
    endDate: string | null;
    icon: React.ReactNode;
    color: string;
    label: string;
}) => {
    const { days, hours, minutes, seconds, isExpired } = useCountdown(endDate);
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
    if (isExpired || !endDate) return null;

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 0.8 },
            mt: 1,
            p: { xs: 0.6, sm: 0.8 },
            borderRadius: '10px',
            backgroundColor: alpha(color, 0.02),
            border: `1px solid ${alpha(color, 0.06)}`,
        }}>
            {icon}
            <Box sx={{ flex: 1 }}>
                <Typography sx={{
                    fontSize: { xs: '0.52rem', sm: '0.6rem' },
                    color: 'text.secondary',
                    fontWeight: 600,
                    mb: 0.3,
                    letterSpacing: 0.3,
                }}>
                    {label}
                </Typography>
                <Box display="flex" alignItems="flex-start" gap={{ xs: 0.3, sm: 0.5 }}>
                    {days > 0 && (
                        <>
                            <CountdownBox value={days} label="วัน" color={color} />
                            <CountdownSeparator color={color} />
                        </>
                    )}
                    <CountdownBox value={hours} label="ชม." color={color} />
                    {!isMobile && (
                        <>
                            <CountdownSeparator color={color} />
                            <CountdownBox value={minutes} label="นาที" color={color} />
                            <CountdownSeparator color={color} />
                            <CountdownBox value={seconds} label="วินาที" color={color} />
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

// --- Helper functions ---
const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const isDiscountActive = (item: PxMarketProductDetailModel): boolean => {
    if (!item.discount_percent || item.discount_percent <= 0) return false;
    if (!item.discount_start_date || !item.discount_end_date) return false;
    const now = new Date();
    return now >= new Date(item.discount_start_date) && now <= new Date(item.discount_end_date);
};

const getDiscountedPrice = (item: PxMarketProductDetailModel): number => {
    return Math.round(item.product_price * (1 - item.discount_percent / 100));
};

const isSaleExpired = (item: PxMarketProductDetailModel): boolean => {
    if (!item.sale_end_date) return false;
    return new Date() > new Date(item.sale_end_date);
};

const isSaleNotStarted = (item: PxMarketProductDetailModel): boolean => {
    if (!item.sale_start_date) return false;
    return new Date() < new Date(item.sale_start_date);
};
// --- End helper functions ---

const DialogWrapper = styled(Dialog)(
    () => `
      .MuiDialog-paper {
        overflow: visible;
      }
        `
);

const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const TypographyH1 = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(24),
    textAlign: 'center',
    [theme.breakpoints.up('sm')]: {
        fontSize: theme.typography.pxToRem(32),
    },
    [theme.breakpoints.up('md')]: {
        fontSize: theme.typography.pxToRem(40),
    }
}));

// Premium styled progress bar
const StyledLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 6,
    borderRadius: 3,
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    '& .MuiLinearProgress-bar': {
        borderRadius: 3,
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
    },
}));

// Premium product card
const ProductCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 16,
    border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
    overflow: 'hidden',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}`,
    '&:hover': {
        transform: 'translateY(-6px)',
        boxShadow: `0 12px 32px ${alpha(theme.palette.common.black, 0.12)}`,
        borderColor: alpha(theme.palette.primary.main, 0.15),
    },
    [theme.breakpoints.down('sm')]: {
        borderRadius: 12,
        '&:hover': {
            transform: 'none',
            boxShadow: `0 2px 12px ${alpha(theme.palette.common.black, 0.04)}`,
        },
    },
}));

// Info row styled container
const InfoRow = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 8px',
    borderRadius: 6,
    backgroundColor: alpha(theme.palette.grey[500], 0.04),
    marginTop: 4,
}));

export default function PXMarketPageData() {
    const { t } = useTranslation();
    const theme = useTheme();
    const { data: ProductList, isLoading } = useGetPxMarketProductListAllQuery();

    // Filter out expired products (sale_end_date has passed)
    const activeProducts = useMemo(() => {
        if (!ProductList?.data) return [];
        return ProductList.data.filter((item: PxMarketProductDetailModel) => !isSaleExpired(item));
    }, [ProductList]);

    const [pxMarketProduct, setPxMarketProductDetail] = useState<PxMarketProductDetailModel | null>(null);

    const [coin, setCoin] = useState<number>(0);

    const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery();
    const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';
    const { data: memberById, isLoading: isLoadingMemberById } = useGetMemberByIdQuery(
        { id: `${memberParamsId}` },
        { skip: memberParamsId === '0' }
    );

    const { data: organizationListAll } = useGetOrganizationListAllQuery();

    const coinData = memberById && memberById.data && memberById.data.member_wallet ? memberById.data.member_wallet : [];

    const memberType = memberById?.data?.member_type === "general_member" || '';

    const coinBalance = useMemo(() => {
        const balance = memberType
            ? memberById?.data?.member_wallet_non_org[0].wallet.coin || DEFAULT_VALUES.COIN_AMOUNT
            : coinData || DEFAULT_VALUES.COIN_AMOUNT;
        return parseInt(String(balance), 10);
    }, [coinData, memberType, memberById]);

    const organizationData = organizationListAll?.data?.filter((item: any) => item.is_active === true);

    const coinOrgIds = coinData.map((c: any) => c.organization_id);
    const filteredOrgs = organizationData && organizationData.filter((org: OrganizationDetailModel) =>
        coinOrgIds.includes(org.organization_id)
    );

    const [openAction, setOpenAction] = useState(false);

    const handleActionOpen = () => { setOpenAction(true); };
    const handleActionClose = () => { setOpenAction(false); };

    const [
        postOrderPxMarketProductComission,
        { isLoading: isPosting },
    ] = usePostOrderPxMarketProductMutation();

    const [
        postOrderPxMarketProductNonOrganizationComission,
        { isLoading: isPostingNonOrganization },
    ] = usePostOrderPxMarketProductNonOrganizationMutation();

    // ── Live points (คะแนน) — separate currency from PX Coin ──
    const [postRedeemPoints, { isLoading: isRedeemingPoints }] = usePostOrderRedeemPointsMutation();
    const [postRedeemPointsNonOrg, { isLoading: isRedeemingPointsNonOrg }] = usePostOrderRedeemPointsNonOrganizationMutation();
    const { data: livePointsRes } = useGetMyLivePointsQuery();
    const NON_ORG_ID = "00000000-0000-0000-0000-000000000000";
    // org_id -> balance map from /live-points/me
    const pointsByOrg = useMemo(() => {
        const map: Record<string, number> = {};
        (livePointsRes?.data?.by_org ?? []).forEach((o: any) => { map[o.organization_id] = o.balance || 0; });
        return map;
    }, [livePointsRes]);
    // Which currency the user is paying with in the dialog ('coin' | 'points')
    const [payCurrency, setPayCurrency] = useState<'coin' | 'points'>('coin');

    const [openSeverity, setOpenSeverity] = useState(false);
    const [severity, setSeverity] = useState<'success' | 'error'>('success');
    const [errorMessage, setErrorMessage] = useState<string>('');

    const handleOpenSuccess = (msg?: string) => { setSeverity('success'); setErrorMessage(msg || ''); setOpenSeverity(true); };
    const handleOpenError = (msg?: string) => { setSeverity('error'); setErrorMessage(msg || ''); setOpenSeverity(true); };
    const handleClose = () => { setOpenSeverity(false); };

    // Total spendable points (across orgs) + optional "points-redeemable only" filter — display only.
    const totalPoints = livePointsRes?.data?.total_balance ?? 0;
    const [pointsOnly, setPointsOnly] = useState(false);
    const displayProducts = pointsOnly
        ? activeProducts.filter((p: PxMarketProductDetailModel) => (p.product_price_points ?? 0) > 0)
        : activeProducts;

    return (
        <>
            <LoadingDialog open={isPosting || isPostingNonOrganization || isRedeemingPoints || isRedeemingPointsNonOrg} />

            <Container maxWidth="lg">
                <TypographyH1
                    sx={{
                        fontWeight: 700,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1,
                    }}
                >
                    {t('ตลาด PX')}
                </TypographyH1>
                <Typography
                    align="center"
                    variant="body2"
                    sx={{ color: 'text.secondary', mb: 1.5 }}
                >
                    {t('แลก PX Coin หรือคะแนน เป็นของรางวัลสุดพิเศษ')}
                </Typography>

                {/* Your points balance + redeemable filter (display only) */}
                {totalPoints > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: { xs: 2, sm: 3 } }}>
                        <Chip
                            label={`คะแนนคงเหลือ: ${totalPoints.toLocaleString()}`}
                            sx={{ bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 800 }}
                        />
                        <Chip
                            label="เฉพาะที่แลกด้วยคะแนนได้"
                            onClick={() => setPointsOnly((v) => !v)}
                            color={pointsOnly ? 'success' : 'default'}
                            variant={pointsOnly ? 'filled' : 'outlined'}
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>
                )}

                <Grid container spacing={{ xs: 1.5, sm: 2.5 }} sx={{ mb: { xs: 2, sm: 3 } }}>
                    {(isLoading && isLoadingMemberById ? Array.from({ length: 8 }) : displayProducts).map((item: PxMarketProductDetailModel, i: number) => {
                        const discountActive = item ? isDiscountActive(item) : false;
                        const notStarted = item ? isSaleNotStarted(item) : false;
                        const isSoldOut = item ? item.current_sale >= item.max_sale : false;
                        const buttonDisabled = isSoldOut || notStarted;
                        const stockPercent = item ? Math.min((item.current_sale / item.max_sale) * 100, 100) : 0;

                        return (
                            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={i}>
                                <ProductCard>
                                    {/* Image Section */}
                                    {isLoading && isLoadingMemberById ? (
                                        <Skeleton variant="rectangular" sx={{ width: '100%', pt: '75%', borderRadius: 0 }} />
                                    ) : (
                                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                                            <CardMedia
                                                component="img"
                                                image={item?.product_img ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + item?.product_img : ''}
                                                alt={item?.product_name || 'product'}
                                                sx={{
                                                    objectFit: 'cover',
                                                    width: '100%',
                                                    aspectRatio: '4/3',
                                                    transition: 'transform 0.4s ease',
                                                    '&:hover': { transform: 'scale(1.05)' },
                                                }}
                                            />
                                            {/* Gradient overlay at bottom of image */}
                                            <Box sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '40%',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)',
                                                pointerEvents: 'none',
                                            }} />

                                            {/* Discount badge */}
                                            {item?.discount_percent > 0 && (
                                                <Chip
                                                    icon={<LocalOfferIcon sx={{ fontSize: 14, color: '#fff !important' }} />}
                                                    label={`-${item.discount_percent}%`}
                                                    size="small"
                                                    sx={{
                                                        position: 'absolute',
                                                        top: { xs: 6, sm: 10 },
                                                        left: { xs: 6, sm: 10 },
                                                        background: discountActive
                                                            ? 'linear-gradient(135deg, #FF4757 0%, #FF6B81 100%)'
                                                            : 'linear-gradient(135deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 100%)',
                                                        color: '#fff',
                                                        fontWeight: 800,
                                                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                                                        height: { xs: 24, sm: 28 },
                                                        borderRadius: '8px',
                                                        boxShadow: discountActive
                                                            ? '0 2px 8px rgba(255,71,87,0.35)'
                                                            : '0 2px 8px rgba(0,0,0,0.15)',
                                                        '& .MuiChip-icon': { ml: '4px' },
                                                        letterSpacing: 0.5,
                                                        backdropFilter: 'blur(4px)',
                                                    }}
                                                />
                                            )}

                                            {/* Sold out overlay */}
                                            {isSoldOut && (
                                                <Box sx={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    backgroundColor: alpha('#000', 0.5),
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backdropFilter: 'blur(2px)',
                                                }}>
                                                    <Typography sx={{
                                                        color: '#fff',
                                                        fontWeight: 900,
                                                        fontSize: { xs: '1rem', sm: '1.25rem' },
                                                        letterSpacing: 3,
                                                        textTransform: 'uppercase',
                                                        textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                                    }}>
                                                        SOLD OUT
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    {/* Content Section */}
                                    <Box sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        {isLoading && isLoadingMemberById ? (
                                            <>
                                                <Skeleton width="80%" height={24} />
                                                <Skeleton width="50%" height={28} sx={{ mt: 1 }} />
                                                <Skeleton width="100%" height={6} sx={{ mt: 2, borderRadius: 1 }} />
                                                <Skeleton width="100%" height={36} sx={{ mt: 2, borderRadius: 2 }} />
                                            </>
                                        ) : (
                                            <>
                                                {/* Product Name */}
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 600,
                                                        fontSize: { xs: '0.85rem', sm: '1.05rem' },
                                                        lineHeight: 1.3,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        color: 'text.primary',
                                                        mb: 1,
                                                    }}
                                                >
                                                    {item?.product_name}
                                                </Typography>

                                                {/* Price Section */}
                                                <Box sx={{ mt: 1.5 }}>
                                                    {discountActive ? (
                                                        <>
                                                            {/* Discounted price — hero display */}
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <Box sx={{
                                                                    width: { xs: 24, sm: 28 },
                                                                    height: { xs: 24, sm: 28 },
                                                                    position: 'relative',
                                                                    flexShrink: 0,
                                                                }}>
                                                                    <Image src="/assets/svg/pg/PX_Coin.svg" fill alt="PX Coin" style={{ objectFit: 'contain' }} />
                                                                </Box>
                                                                <Typography sx={{
                                                                    color: '#E53935',
                                                                    fontSize: { xs: '1.35rem', sm: '1.6rem' },
                                                                    fontWeight: 900,
                                                                    lineHeight: 1,
                                                                    letterSpacing: '-0.02em',
                                                                }}>
                                                                    <CountUp end={getDiscountedPrice(item)} duration={1.5} separator="," />
                                                                </Typography>
                                                            </Box>

                                                            {/* Original price + discount badge */}
                                                            <Box display="flex" alignItems="center" gap={0.8} sx={{ mt: 0.5 }}>
                                                                <Typography sx={{
                                                                    textDecoration: 'line-through',
                                                                    color: 'text.disabled',
                                                                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                                    fontWeight: 400,
                                                                }}>

                                                                    {item.product_price.toLocaleString()}
                                                                </Typography>
                                                                <Chip
                                                                    label={`-${item.discount_percent}%`}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 18,
                                                                        fontSize: '0.65rem',
                                                                        fontWeight: 800,
                                                                        color: '#E53935',
                                                                        backgroundColor: alpha('#E53935', 0.08),
                                                                        border: `1px solid ${alpha('#E53935', 0.15)}`,
                                                                        '& .MuiChip-label': { px: 0.6, py: 0 },
                                                                        borderRadius: '4px',
                                                                    }}
                                                                />
                                                                <Typography sx={{
                                                                    color: '#E53935',
                                                                    fontSize: { xs: '0.68rem', sm: '0.75rem' },
                                                                    fontWeight: 600,
                                                                }}>
                                                                    ประหยัด {(item.product_price - getDiscountedPrice(item)).toLocaleString()}
                                                                </Typography>
                                                            </Box>
                                                        </>
                                                    ) : (
                                                        /* Normal price */
                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                            <Box sx={{
                                                                width: { xs: 24, sm: 28 },
                                                                height: { xs: 24, sm: 28 },
                                                                position: 'relative',
                                                                flexShrink: 0,
                                                            }}>
                                                                <Image src="/assets/svg/pg/PX_Coin.svg" fill alt="PX Coin" style={{ objectFit: 'contain' }} />
                                                            </Box>
                                                            <Typography sx={{
                                                                fontWeight: 800,
                                                                color: theme.palette.primary.main,
                                                                fontSize: { xs: '1.35rem', sm: '1.6rem' },
                                                                lineHeight: 1,
                                                                letterSpacing: '-0.02em',
                                                            }}>
                                                                <CountUp end={item?.product_price || 0} duration={1.5} separator="," />
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>

                                                {/* Points price (redeem with คะแนน) */}
                                                {item?.product_price_points != null && item.product_price_points > 0 && (
                                                    <Box display="flex" alignItems="center" gap={0.5} sx={{ mt: 0.6 }}>
                                                        <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.78rem' }, color: 'text.secondary' }}>หรือ</Typography>
                                                        <Typography sx={{ fontSize: { xs: '0.95rem', sm: '1.05rem' }, fontWeight: 800, color: '#16a34a' }}>
                                                            {item.product_price_points.toLocaleString()}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: { xs: '0.7rem', sm: '0.78rem' }, color: '#16a34a', fontWeight: 700 }}>คะแนน</Typography>
                                                    </Box>
                                                )}

                                                {/* Stock Progress */}
                                                <Box sx={{ mt: 1.5 }}>
                                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                                            แลกแล้ว {item?.current_sale}/{item?.max_sale}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{
                                                            color: stockPercent >= 80 ? 'error.main' : 'text.secondary',
                                                            fontWeight: 600,
                                                            fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                                        }}>
                                                            {stockPercent >= 80 && !isSoldOut ? 'ใกล้หมด!' : `${Math.round(stockPercent)}%`}
                                                        </Typography>
                                                    </Box>
                                                    <StyledLinearProgress
                                                        variant="determinate"
                                                        value={stockPercent}
                                                        sx={{
                                                            '& .MuiLinearProgress-bar': {
                                                                background: stockPercent >= 80
                                                                    ? 'linear-gradient(90deg, #FF4757 0%, #FF6B81 100%)'
                                                                    : `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                                                            },
                                                        }}
                                                    />
                                                </Box>

                                                {/* Discount countdown */}
                                                {discountActive && item?.discount_end_date && (
                                                    <CountdownRow
                                                        endDate={item.discount_end_date}
                                                        icon={<LocalOfferIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: '#E53935' }} />}
                                                        color="#E53935"
                                                        label="ส่วนลดสิ้นสุดใน"
                                                    />
                                                )}

                                                {/* Sale countdown */}
                                                {item?.sale_end_date && !isSoldOut && (
                                                    <CountdownRow
                                                        endDate={item.sale_end_date}
                                                        icon={<AccessTimeIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: theme.palette.primary.main }} />}
                                                        color={theme.palette.primary.main}
                                                        label="เหลือเวลาแลก"
                                                    />
                                                )}

                                                {/* Action Button */}
                                                <Button
                                                    fullWidth
                                                    variant="contained"
                                                    startIcon={!buttonDisabled ? <ShoppingCartIcon sx={{ fontSize: '16px !important' }} /> : undefined}
                                                    onClick={() => {
                                                        if (item) {
                                                            setPxMarketProductDetail(item);
                                                            setPayCurrency('coin');
                                                            handleActionOpen();
                                                        }
                                                    }}
                                                    disabled={buttonDisabled}
                                                    sx={{
                                                        mt: 1.5,
                                                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                                                        fontWeight: 700,
                                                        py: { xs: 0.8, sm: 1 },
                                                        borderRadius: { xs: '8px', sm: '10px' },
                                                        textTransform: 'none',
                                                        letterSpacing: 0.5,
                                                        background: buttonDisabled
                                                            ? alpha(theme.palette.grey[400], 0.3)
                                                            : `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                                        color: buttonDisabled ? 'text.disabled' : '#fff',
                                                        boxShadow: buttonDisabled
                                                            ? 'none'
                                                            : `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                                                        transition: 'all 0.25s ease',
                                                        "&:hover": {
                                                            background: buttonDisabled
                                                                ? alpha(theme.palette.grey[400], 0.3)
                                                                : `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                                            boxShadow: buttonDisabled
                                                                ? 'none'
                                                                : `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                                                            transform: buttonDisabled ? 'none' : 'translateY(-1px)',
                                                        },
                                                        "&:disabled": {
                                                            background: alpha(theme.palette.grey[400], 0.3),
                                                            color: 'text.disabled',
                                                        },
                                                    }}
                                                >
                                                    {isSoldOut ? 'SOLD OUT' : notStarted ? 'ยังไม่เปิดแลก' : 'แลกเลย!'}
                                                </Button>
                                            </>
                                        )}
                                    </Box>
                                </ProductCard>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>

            {/* Confirmation Dialog */}
            <DialogWrapper
                open={openAction}
                maxWidth="sm"
                fullWidth
                TransitionComponent={Transition}
                onClose={handleActionClose}
                sx={{
                    '& .MuiDialog-paper': {
                        mx: { xs: 1, sm: 2 },
                        my: { xs: 1, sm: 2 },
                        maxHeight: { xs: '95vh', sm: 'auto' },
                        borderRadius: { xs: '16px', sm: '20px' },
                        boxShadow: `0 24px 48px ${alpha(theme.palette.common.black, 0.15)}`,
                    }
                }}
            >
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    p={{ xs: 2, sm: 4, md: 5 }}
                >
                    {/* Icon */}
                    <Box sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 2,
                    }}>
                        <ShoppingCartIcon sx={{ fontSize: 30, color: 'primary.main' }} />
                    </Box>

                    {/* Header Title */}
                    <Typography
                        align="center"
                        sx={{
                            fontSize: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },
                            fontWeight: 700,
                            lineHeight: { xs: 1.3, sm: 1.25, md: 1.2 },
                            color: 'text.primary',
                        }}
                    >
                        {t("ยืนยันการแลกของรางวัล")}
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        align="center"
                        sx={{
                            pt: 1,
                            pb: { xs: 2, sm: 3 },
                            px: { xs: 1, sm: 4 },
                            fontSize: { xs: '0.875rem', sm: '1rem' },
                            fontWeight: 'normal',
                            lineHeight: 1.5,
                        }}
                        color="text.secondary"
                    >
                        {t("หากใช้ Coin PX ในการแลก เหรียญของคุณจะหายไป")}
                    </Typography>

                    <Formik
                        initialValues={{
                            product_id: 0,
                            member_id: "",
                            organization_id: "",
                            submit: null,
                        }}
                        validationSchema={Yup.object().shape({
                            organization_id: !memberType ? Yup.string().required(t('กรุณาเลือก บริษัท')) : Yup.string(),
                        })}
                        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                            try {
                                await wait(1000);
                                setStatus({ success: true });
                                setSubmitting(false);

                                const productId = pxMarketProduct?.product_id;
                                let rsp: any;
                                if (payCurrency === 'points') {
                                    // Pay with LIVE POINTS (คะแนน)
                                    rsp = memberType
                                        ? await postRedeemPointsNonOrg({ product: { member_id: memberParamsId, product_id: productId } })
                                        : await postRedeemPoints({ product: { member_id: memberParamsId, product_id: productId, organization_id: values.organization_id } });
                                } else {
                                    // Pay with PX Coin (existing flow)
                                    rsp = memberType
                                        ? await postOrderPxMarketProductNonOrganizationComission({ product: { ...values, member_id: memberParamsId, product_id: productId } })
                                        : await postOrderPxMarketProductComission({ product: { ...values, member_id: memberParamsId, product_id: productId } });
                                }

                                if (rsp && rsp.data && rsp.data.status === 201) {
                                    setCoin(0);
                                    handleActionClose();
                                    handleOpenSuccess(payCurrency === 'points' ? (rsp?.data?.message || 'แลกด้วยคะแนนสำเร็จ') : undefined);
                                } else {
                                    const msg = extractApiError(rsp, 'ไม่สามารถแลกของรางวัลได้ กรุณาลองใหม่');
                                    handleActionClose();
                                    handleOpenError(msg);
                                }
                            } catch (err: any) {
                                const msg = extractApiError(err, 'เกิดข้อผิดพลาดในการแลกของรางวัล กรุณาลองใหม่อีกครั้ง');
                                setStatus({ success: false });
                                setErrors({ submit: msg });
                                setSubmitting(false);
                                handleActionClose();
                                handleOpenError(msg);
                            }
                        }}
                    >
                        {({ errors, handleSubmit, isSubmitting, touched, setFieldValue, values }) => (
                            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                                <Grid container spacing={{ xs: 1, sm: 2 }}>
                                    {/* Currency selector — only when the product also has a points price */}
                                    {pxMarketProduct?.product_price_points != null && pxMarketProduct.product_price_points > 0 && (
                                        <Grid size={12}>
                                            <Texts>{'เลือกวิธีจ่าย'}</Texts>
                                            <Box display="flex" gap={1.5} sx={{ mt: 1 }}>
                                                <Button
                                                    fullWidth
                                                    variant={payCurrency === 'coin' ? 'contained' : 'outlined'}
                                                    onClick={() => setPayCurrency('coin')}
                                                    sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', flexDirection: 'column', py: 1 }}
                                                >
                                                    <span>PX Coin</span>
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{(pxMarketProduct.product_price ?? 0).toLocaleString()}</span>
                                                </Button>
                                                <Button
                                                    fullWidth
                                                    variant={payCurrency === 'points' ? 'contained' : 'outlined'}
                                                    color="success"
                                                    onClick={() => setPayCurrency('points')}
                                                    sx={{ borderRadius: '10px', fontWeight: 700, textTransform: 'none', flexDirection: 'column', py: 1 }}
                                                >
                                                    <span>คะแนน</span>
                                                    <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{pxMarketProduct.product_price_points.toLocaleString()}</span>
                                                </Button>
                                            </Box>
                                        </Grid>
                                    )}

                                    {/* Company Selection */}
                                    {!memberType &&
                                        <Grid size={12} sx={{ mt: { xs: 1, sm: 2 } }}>
                                            <Texts>
                                                {'บริษัท'}
                                            </Texts>
                                            <Autocomplete
                                                sx={{
                                                    mt: 1,
                                                    '& .MuiOutlinedInput-root': {
                                                        fontSize: { xs: '0.875rem', sm: '1rem' },
                                                        borderRadius: '10px',
                                                    }
                                                }}
                                                autoHighlight
                                                value={
                                                    organizationData?.find((item: any) => `${item.organization_id}` === `${values.organization_id}`) ||
                                                    null
                                                }
                                                onChange={(_event, newValue: any) => {
                                                    const coinDetail = coinData?.find((item: any) => `${item.organization_id}` === `${newValue?.organization_id}`);
                                                    const mycoin = coinDetail && coinDetail.wallet && coinDetail.wallet.coin;
                                                    setCoin(mycoin || 0);
                                                    setFieldValue('organization_id', newValue?.organization_id ? `${newValue?.organization_id}` : '');
                                                }}
                                                getOptionLabel={(option) => option.company_name || ''}
                                                options={filteredOrgs?.filter((item: any) => item.is_active === true) || []}
                                                renderOption={(props, option) => (
                                                    <Box
                                                        component="li"
                                                        {...props}
                                                        key={option.organization_id}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="flex-start"
                                                        sx={{ py: { xs: 1, sm: 1.5 } }}
                                                    >
                                                        <Avatar
                                                            sx={{
                                                                mr: { xs: 1, sm: 1.5 },
                                                                width: { xs: 32, sm: 40 },
                                                                height: { xs: 32, sm: 40 }
                                                            }}
                                                            src={
                                                                option.company_logo
                                                                    ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${option.company_logo}`
                                                                    : 'https://placehold.co/500x500/EEE/31343C'
                                                            }
                                                        />
                                                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                                                            {option.company_name}
                                                        </Typography>
                                                    </Box>
                                                )}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        size="small"
                                                        placeholder={'เลือก บริษัท'}
                                                        name="organization_id"
                                                        error={Boolean(touched.organization_id && errors.organization_id)}
                                                        helperText={touched.organization_id && errors.organization_id}
                                                    />
                                                )}
                                            />
                                        </Grid>}

                                    {/* Balance Display (coin or points, per selected currency) */}
                                    {(values.organization_id || memberType) && (
                                        <Grid size={12} sx={{ mt: { xs: 2, sm: 3 } }}>
                                            {payCurrency === 'points' ? (
                                                (() => {
                                                    const orgIdForPoints = memberType ? NON_ORG_ID : values.organization_id;
                                                    const pointsBalance = pointsByOrg[orgIdForPoints] ?? 0;
                                                    const price = pxMarketProduct?.product_price_points ?? 0;
                                                    const insufficient = pointsBalance < price;
                                                    return (
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            justifyContent="center"
                                                            flexDirection={{ xs: 'column', sm: 'row' }}
                                                            gap={{ xs: 0.5, sm: 2 }}
                                                            sx={{ p: { xs: 2, sm: 3 }, background: alpha('#16a34a', 0.06), borderRadius: '12px', border: `1px solid ${alpha('#16a34a', 0.18)}` }}
                                                        >
                                                            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, fontWeight: 500 }}>
                                                                ยอดคะแนนของคุณ :
                                                            </Typography>
                                                            <Typography sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }, fontWeight: 800, ml: { xs: 0, sm: 1 }, color: insufficient ? 'error.main' : '#16a34a' }}>
                                                                {pointsBalance.toLocaleString()}
                                                            </Typography>
                                                            {insufficient && (
                                                                <Typography color="error" variant="caption" sx={{ fontWeight: 700 }}>คะแนนไม่เพียงพอ</Typography>
                                                            )}
                                                        </Box>
                                                    );
                                                })()
                                            ) : (
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="center"
                                                    flexDirection={{ xs: 'column', sm: 'row' }}
                                                    gap={{ xs: 1, sm: 2 }}
                                                    sx={{
                                                        p: { xs: 2, sm: 3 },
                                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.04)} 0%, ${alpha(theme.palette.primary.light, 0.08)} 100%)`,
                                                        borderRadius: '12px',
                                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                                    }}
                                                >
                                                    <Box display="flex" alignItems="center">
                                                        <Box sx={{ width: { xs: 20, sm: 24 }, height: { xs: 20, sm: 24 }, position: 'relative' }}>
                                                            <Image src="/assets/svg/pg/PX_Coin.svg" fill alt="PX Coin" style={{ objectFit: 'contain' }} />
                                                        </Box>
                                                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem' }, ml: { xs: 0.5, sm: 1 }, fontWeight: 500 }}>
                                                            ยอด PX Coin ของคุณ :
                                                        </Typography>
                                                    </Box>
                                                    <Typography
                                                        color='primary'
                                                        sx={{
                                                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                                                            fontWeight: 700,
                                                            ml: { xs: 0, sm: 1 }
                                                        }}
                                                    >
                                                        {(coinBalance ? coinBalance : 0 || 0).toLocaleString()}
                                                    </Typography>
                                                </Box>
                                            )}
                                        </Grid>
                                    )}
                                </Grid>

                                {/* Action Buttons */}
                                <Box
                                    display="flex"
                                    flexDirection={{ xs: 'column', sm: 'row' }}
                                    gap={{ xs: 1.5, sm: 2 }}
                                    sx={{ mt: { xs: 3, sm: 4 }, width: '100%' }}
                                >
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            px: { xs: 2, sm: 4 },
                                            py: { xs: 1, sm: 1.5 },
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            width: { xs: '100%', sm: 'auto' },
                                            flex: { xs: 'none', sm: 1 },
                                            order: { xs: 2, sm: 1 },
                                            borderColor: alpha(theme.palette.divider, 0.3),
                                            '&:hover': {
                                                borderColor: theme.palette.primary.main,
                                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                                            },
                                        }}
                                        onClick={handleActionClose}
                                    >
                                        {t('ยกเลิก')}
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={
                                            Boolean(errors.submit) || isSubmitting ||
                                            (!memberType ? !values.organization_id : false) ||
                                            (payCurrency === 'points' &&
                                                (pointsByOrg[memberType ? NON_ORG_ID : values.organization_id] ?? 0) < (pxMarketProduct?.product_price_points ?? 0))
                                        }
                                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                        sx={{
                                            px: { xs: 2, sm: 4 },
                                            py: { xs: 1, sm: 1.5 },
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            fontSize: { xs: '0.875rem', sm: '1rem' },
                                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                            color: "#fff",
                                            boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.35)}`,
                                            "&:hover": {
                                                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                                boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.45)}`,
                                            },
                                            "&:disabled": {
                                                background: alpha(theme.palette.grey[400], 0.3),
                                                color: 'text.disabled',
                                            },
                                            width: { xs: '100%', sm: 'auto' },
                                            flex: { xs: 'none', sm: 1 },
                                            order: { xs: 1, sm: 2 },
                                        }}
                                    >
                                        {payCurrency === 'points' ? t('แลกด้วยคะแนน') : t('แลกเลย!')}
                                    </Button>
                                </Box>
                            </form>
                        )}
                    </Formik>
                </Box>
            </DialogWrapper>

            <DialogCustomStatus
                open={openSeverity}
                onClickClose={handleClose}
                severity={severity}
                textTitle={errorMessage || undefined}
            />
        </>
    );
}
