'use client';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import { alpha, Button, SxProps, Theme } from '@mui/material';
import { useRouter } from 'next/navigation';

type BackToPreviousButtonProps = {
  fallbackHref?: string;
  label?: string;
  sx?: SxProps<Theme>;
};

export default function BackToPreviousButton({
  fallbackHref = '/home',
  label = 'กลับหน้าก่อนหน้า',
  sx,
}: BackToPreviousButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    const hasInternalHistory = window.history.length > 1 && document.referrer.startsWith(window.location.origin);
    if (hasInternalHistory) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <Button
      type="button"
      onClick={handleBack}
      startIcon={<ArrowBackIosNewRoundedIcon sx={{ fontSize: '16px !important' }} />}
      sx={{
        alignSelf: 'flex-start',
        px: 0,
        minHeight: 36,
        color: 'text.secondary',
        fontSize: 13,
        fontWeight: 700,
        '&:hover': {
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.06),
          color: 'primary.main',
        },
        '& .MuiButton-startIcon': { mr: 0.75 },
        ...sx,
      }}
    >
      {label}
    </Button>
  );
}
