import { FC, forwardRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Avatar,
  Typography,
  Button,
  styled,
  useTheme,
  Slide,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Cancel';
import { TransitionProps } from '@mui/material/transitions';
import { useTranslation } from 'react-i18next';

// Filter out custom "severity" prop so it doesn't get passed to DOM
const DialogWrapper = styled(Dialog, { shouldForwardProp: (prop) => prop !== 'severity' })<{
  severity: 'success' | 'error';
}>(({ theme, severity }) => ({
  '& .MuiDialog-paper': {
    position: 'relative',
    overflow: 'visible',
    borderRadius: theme.shape.borderRadius * 2,
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: theme.spacing(1),
      background:
        severity === 'error'
          ? `linear-gradient(90deg, ${theme.palette.error.light} 0%, ${theme.palette.error.main} 100%)`
          : `linear-gradient(90deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
      borderTopLeftRadius: 'inherit',
      borderTopRightRadius: 'inherit'
    }
  }
}));

const AvatarStyled = styled(
  Avatar,
  { shouldForwardProp: (prop) => prop !== 'severity' }
)<{ severity: 'success' | 'error' }>(({ theme, severity }) => {
  const bg = severity === 'error' ? theme.palette.error.light : theme.palette.success.light;
  const color = severity === 'error' ? theme.palette.error.dark : theme.palette.success.dark;
  return {
    backgroundColor: bg,
    color,
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginTop: theme.spacing(2),
    '& .MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(48)
    }
  };
});

const ButtonStyled = styled(
  Button,
  { shouldForwardProp: (prop) => prop !== 'severity' }
)<{ severity: 'success' | 'error' }>(({ theme, severity }) => {
  const bg = severity === 'error' ? theme.palette.error.main : theme.palette.success.main;
  const hoverBg = severity === 'error' ? theme.palette.error.dark : theme.palette.success.dark;
  return {
    backgroundColor: bg,
    color: theme.palette.common.white,
    padding: theme.spacing(1.5, 5),
    borderRadius: 8,
    fontWeight: 'bold',
    '&:hover': {
      backgroundColor: hoverBg
    }
  };
});

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props}>{props.children}</Slide>;
});

export interface CustomProps {
  open: boolean;
  onClickClose: () => void;
  severity?: 'success' | 'error';
  textHeader?: string;
  textTitle?: string;
  btnConfirmText?: string;
}

const DialogCustomStatus: FC<CustomProps> = ({
  open,
  onClickClose,
  severity = 'success',
  textHeader,
  textTitle,
  btnConfirmText
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const defaults = {
    success: {
      header: t('แลกของรางวัลสำเร็จ'),
      title: t('ขอแสดงความยินดี คุณสามารถแลกรับของขวัญได้แล้ว เจ้าหน้าที่ของเราจะติดต่อคุณโดยเร็วที่สุดเพื่อจัดส่ง'),
      btn: t('ขอบคุณมาก'),
      icon: <CheckIcon />
    },
    error: {
      header: t('Coin PX ไม่พอ!'),
      title: t('ไม่สามารถแลกของรางวัลได้ เนื่องจากเหรียญไม่เพียงพอ กรุณาลองใหม่อีกครั้ง'),
      btn: t('ตกลง'),
      icon: <CancelIcon />
    }
  };

  const { header, title, btn, icon } = defaults[severity];

  return (
    <DialogWrapper
      open={open}
      onClose={onClickClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      severity={severity}
      PaperProps={{ sx: { pt: 2 } }}
    >
      <IconButton
        aria-label={t('Close')}
        onClick={onClickClose}
        sx={{
          position: 'absolute',
          top: theme.spacing(1),
          right: theme.spacing(1),
          color: theme.palette.grey[500]
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ textAlign: 'center', pt: 0, px: 6, pb: 4 }}>
        <Typography
          variant="h3"
          sx={{ color: severity === 'error' ? theme.palette.error.dark : theme.palette.success.dark, mt: 1 }}
        >
          {textHeader ?? header}
        </Typography>

        <Box display={"flex"} justifyContent={"center"} sx={{ mt: 2, mb: 4 }} >
          <AvatarStyled severity={severity}>
            {icon}
          </AvatarStyled>
        </Box>



        <Typography
          variant="h4"
          color="text.secondary"
          fontWeight="normal"
          sx={{ mt: 2, mb: 4 }}
        >
          {textTitle ?? title}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', pb: 4 }}>
        <ButtonStyled severity={severity} onClick={onClickClose}>
          {btnConfirmText ?? btn}
        </ButtonStyled>
      </DialogActions>
    </DialogWrapper>
  );
};

export default DialogCustomStatus;
