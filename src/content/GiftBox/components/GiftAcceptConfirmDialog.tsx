import { GiftItem } from '@/model/gift';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import RedeemIcon from '@mui/icons-material/Redeem';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
    alpha,
    useTheme,
} from '@mui/material';
import { FC } from 'react';

interface Props {
    open: boolean;
    gift: GiftItem | null;
    isSubmitting: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const GiftAcceptConfirmDialog: FC<Props> = ({
    open,
    gift,
    isSubmitting,
    onClose,
    onConfirm,
}) => {
    const theme = useTheme();
    const primaryMain = theme.palette.primary.main;
    const productImg = gift?.product?.product_img
        ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${gift.product.product_img}`
        : '';
    const giftPrice = (() => {
        const directPrice = Number(gift?.gift_price ?? 0);
        if (Number.isFinite(directPrice) && directPrice > 0) return directPrice;

        const fallbackPrice = Number(gift?.product?.discounted_price ?? gift?.product?.product_price ?? 0);
        return Number.isFinite(fallbackPrice) ? fallbackPrice : 0;
    })();

    return (
        <Dialog
            open={open}
            onClose={(_event, reason) => {
                if (isSubmitting && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
                    return;
                }
                onClose();
            }}
            fullWidth
            maxWidth="xs"
            disableEscapeKeyDown={isSubmitting}
        >
            <DialogTitle sx={{ pb: 1.5 }}>
                ยืนยันรับของขวัญ
            </DialogTitle>

            <DialogContent sx={{ pt: 1 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 3,
                        backgroundColor: alpha(primaryMain, 0.04),
                        border: `1px solid ${alpha(primaryMain, 0.1)}`,
                    }}
                >
                    <Avatar
                        variant="rounded"
                        src={productImg}
                        alt={gift?.product?.product_name || 'Gift'}
                        sx={{
                            width: 72,
                            height: 72,
                            borderRadius: 2,
                            bgcolor: alpha(primaryMain, 0.08),
                            '& img': {
                                objectFit: 'cover',
                            },
                        }}
                    >
                        {!productImg && (
                            <RedeemIcon sx={{ fontSize: 30, color: alpha(primaryMain, 0.35) }} />
                        )}
                    </Avatar>

                    <Box minWidth={0}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {gift?.product?.product_name || 'ของขวัญ'}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: primaryMain,
                                fontWeight: 700,
                                mt: 0.5,
                            }}
                        >
                            {giftPrice.toLocaleString()} Coin PX
                        </Typography>
                        {gift?.message && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: theme.palette.text.secondary,
                                    fontStyle: 'italic',
                                    mt: 0.75,
                                    wordBreak: 'break-word',
                                }}
                            >
                                &quot;{gift.message}&quot;
                            </Typography>
                        )}
                    </Box>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: theme.palette.text.secondary,
                        mt: 2,
                        lineHeight: 1.6,
                    }}
                >
                    เมื่อยืนยันแล้ว ระบบจะบันทึกการรับของขวัญมูลค่า {giftPrice.toLocaleString()} Coin PX ทันที
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
                <Button
                    onClick={onClose}
                    disabled={isSubmitting}
                    variant="outlined"
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
                >
                    ยกเลิก
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={!gift || isSubmitting}
                    variant="contained"
                    startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <CardGiftcardIcon />}
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
                >
                    {isSubmitting ? 'กำลังยืนยัน...' : 'ยืนยันรับของขวัญ'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GiftAcceptConfirmDialog;
