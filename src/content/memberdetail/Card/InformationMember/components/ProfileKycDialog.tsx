import { FC, useMemo } from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  Button,
  InputLabel,
  TextField,
  FormHelperText,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Divider,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Fade,
  Chip,
  Alert,
  LinearProgress,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Description as DescriptionIcon,
  Send as SendIcon,
  VerifiedUser as VerifiedUserIcon,
  Image as ImageIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Person as PersonIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { KycVerification } from '@/model/member';

interface ProfileKycDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  cardImageSrc: string;
  cardFile: File | null;
  cardNumber: string;
  firstName: string;
  lastName: string;
  issuedDate: string;
  expiresDate: string;
  onCardNumberChange: (value: string) => void;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onIssuedDateChange: (value: string) => void;
  onExpiresDateChange: (value: string) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  profileVerified: boolean;
  isSubmitting: boolean;
  handleImagePreview: (url: string) => void;
  hasPendingKyc?: boolean;
  pendingKycData?: KycVerification | null;
  rejectedKycData?: KycVerification | null;
  isKycExpired?: boolean;
  expiredKycData?: KycVerification | null;
  t: (key: string) => string;
}

const ProfileKycDialog: FC<ProfileKycDialogProps> = ({
  open,
  onClose,
  onSubmit,
  cardImageSrc,
  cardFile,
  cardNumber,
  firstName,
  lastName,
  issuedDate,
  expiresDate,
  onCardNumberChange,
  onFirstNameChange,
  onLastNameChange,
  onIssuedDateChange,
  onExpiresDateChange,
  onFileChange,
  profileVerified,
  isSubmitting,
  handleImagePreview,
  hasPendingKyc = false,
  pendingKycData = null,
  rejectedKycData = null,
  isKycExpired = false,
  expiredKycData = null,
  t,
}) => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

  // กำหนดขั้นตอนและสถานะ
  const steps = useMemo(
    () => [
      {
        label: t('อัปโหลดเอกสาร'),
        desc: t('เลือกรูปบัตรด้านหน้าชัดเจน'),
        icon: <CloudUploadIcon />,
        completed: Boolean(cardFile || cardImageSrc),
      },
      {
        label: t('กรอกรายละเอียด'),
        desc: t('เลขบัตร, ชื่อ-นามสกุล'),
        icon: <DescriptionIcon />,
        completed: Boolean(cardNumber && firstName && lastName),
      },
      {
        label: t('ส่งคำขอ'),
        desc: t('รอทีมตรวจสอบตอบกลับ'),
        icon: <SendIcon />,
        completed: profileVerified,
      },
    ],
    [cardFile, cardImageSrc, cardNumber, firstName, lastName, expiresDate, profileVerified, t]
  );

  // คำนวณขั้นตอนปัจจุบัน
  const activeStep = useMemo(() => {
    if (profileVerified) return 3;
    if (cardFile && cardNumber && firstName && lastName && expiresDate) return 2;
    if (cardFile || cardImageSrc) return 1;
    return 0;
  }, [profileVerified, cardFile, cardImageSrc, cardNumber, firstName, lastName, expiresDate]);

  // Validation states
  const cardNumberError = cardNumber.length > 0 && cardNumber.length !== 8 && cardNumber.length !== 13;
  
  // แปลง string date เป็น dayjs objects สำหรับ validation
  const issuedDateDayjs = issuedDate ? dayjs(issuedDate) : null;
  const expiresDateDayjs = expiresDate ? dayjs(expiresDate) : null;
  
  const dateError = Boolean(
    issuedDateDayjs &&
      expiresDateDayjs &&
      // issuedDateDayjs.isValid() &&
      // expiresDateDayjs.isValid() &&
      issuedDateDayjs.isAfter(expiresDateDayjs)
  );
  
  const isFormValid = Boolean(
    (cardFile || cardImageSrc) &&
      cardNumber &&
      (cardNumber.length === 8 || cardNumber.length === 13) &&
      firstName &&
      lastName &&
      expiresDate &&
      !dateError
  );

  const handleImageClick = () => {
    if (cardImageSrc) {
      handleImagePreview(cardImageSrc);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2.5, md: 4 },
          py: { xs: 2, md: 2.5 },
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          {profileVerified ? (
            <VerifiedUserIcon sx={{ fontSize: 28 }} />
          ) : (
            <DescriptionIcon sx={{ fontSize: 28 }} />
          )}
          <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
            {t(profileVerified ? 'ดูหลักฐานยืนยันตัวตน' : 'ยืนยันตัวตน (KYC)')}
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Verified Status Banner */}
      {profileVerified && (
        <Alert
          severity="success"
          icon={<CheckCircleIcon />}
          sx={{
            borderRadius: 0,
            border: 'none',
            backgroundColor: alpha(theme.palette.success.main, 0.1),
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            {t('โปรไฟล์ของคุณได้รับการยืนยันเรียบร้อยแล้ว')}
          </Typography>
        </Alert>
      )}

      {/* Expired KYC Status Banner */}
      {isKycExpired && expiredKycData && !profileVerified && (
        <Alert
          severity="error"
          icon={<WarningIcon />}
          sx={{
            borderRadius: 0,
            border: 'none',
            backgroundColor: alpha(theme.palette.error.main, 0.1),
          }}
        >
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="body2" fontWeight={700} color="error.main">
                {t('การยืนยันตัวตนหมดอายุแล้ว')}
              </Typography>
            </Stack>
            <Stack spacing={0.5}>
              <Typography variant="caption" sx={{ color: 'error.dark' }}>
                {t('ชื่อ-นามสกุล')}: <strong>{expiredKycData.f_name} {expiredKycData.l_name}</strong>
              </Typography>
              <Typography variant="caption" sx={{ color: 'error.dark' }}>
                {t('หมดอายุเมื่อ')}: <strong>{dayjs(expiredKycData.expire_date).format('DD/MM/YYYY')}</strong>
              </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.5 }}>
              <RefreshIcon sx={{ fontSize: 14, color: 'error.main' }} />
              <Typography variant="caption" sx={{ color: 'error.main', fontWeight: 600 }}>
                {t('กรุณาส่งคำขอยืนยันตัวตนใหม่')}
              </Typography>
            </Stack>
          </Stack>
        </Alert>
      )}

      {/* Pending KYC Status Banner */}
      {hasPendingKyc && pendingKycData && !profileVerified && (
        <Alert
          severity="warning"
          icon={<DescriptionIcon />}
          sx={{
            borderRadius: 0,
            border: 'none',
            backgroundColor: alpha(theme.palette.warning.main, 0.1),
          }}
        >
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={600}>
              {t('คำขอยืนยันตัวตนของคุณกำลังรอการตรวจสอบ')}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {t('ส่งคำขอเมื่อ')}: {pendingKycData.created_at
                ? dayjs(pendingKycData.created_at).format('DD/MM/YYYY HH:mm')
                : t('ไม่ทราบวันที่')}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {t('กรุณารอทีมงานตรวจสอบและตอบกลับคุณ')}
            </Typography>
          </Stack>
      </Alert>
      )}

      {/* Rejected KYC Status Banner */}
      {rejectedKycData && !profileVerified && !hasPendingKyc && (
        <Alert
          severity="error"
          icon={<WarningIcon />}
          sx={{
            borderRadius: 0,
            border: 'none',
            backgroundColor: alpha(theme.palette.error.main, 0.1),
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="body2" fontWeight={700}>
              {t('คำขอ KYC ไม่ผ่านการตรวจสอบ')}
            </Typography>
            <Typography variant="caption">
              {rejectedKycData.rejection_reason || t('กรุณาตรวจสอบข้อมูลและส่งข้อมูลใหม่อีกครั้ง')}
            </Typography>
          </Stack>
        </Alert>
      )}

      {/* Progress Bar */}
      {isSubmitting && <LinearProgress />}

      <DialogContent
        sx={{
          px: { xs: 2.5, md: 4 },
          py: { xs: 3, md: 4 },
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.colors.alpha.white[50],
        }}
      >
        {/* Stepper */}
        <Box mb={4}>
          <Stepper
            activeStep={activeStep}
            orientation={isMdUp ? 'horizontal' : 'vertical'}
                sx={{
              '& .MuiStepLabel-root': {
                '& .MuiStepLabel-label': {
                  fontWeight: 600,
                  fontSize: '0.95rem',
                },
                '& .MuiStepLabel-label.Mui-active': {
                  color: theme.palette.primary.main,
                },
                '& .MuiStepLabel-label.Mui-completed': {
                  color: theme.palette.success.main,
                },
              },
              '& .MuiStepIcon-root': {
                fontSize: '2rem',
                '&.Mui-active': {
                  color: theme.palette.primary.main,
                },
                '&.Mui-completed': {
                  color: theme.palette.success.main,
                },
              },
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label} completed={step.completed}>
                <StepLabel
                  optional={
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      {step.desc}
                    </Typography>
                  }
                >
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {/* Main Content */}
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Image Preview Section */}
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                flex: { xs: 'none', md: 1 },
                borderRadius: 3,
                overflow: 'hidden',
                border: `2px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                position: 'relative',
                minHeight: { xs: 280, md: 420 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: cardImageSrc ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                '&:hover': cardImageSrc
                  ? {
                      transform: 'scale(1.02)',
                      boxShadow: theme.shadows[8],
                      borderColor: theme.palette.primary.main,
                    }
                  : {},
              }}
              onClick={handleImageClick}
            >
              {cardImageSrc ? (
                <>
                  <Box
            component="img"
                    src={cardImageSrc}
                    alt="บัตรประชาชน"
            sx={{
              width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      p: 2,
                    }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      backgroundColor: alpha(theme.palette.common.black, 0.6),
                      borderRadius: '50%',
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.common.black, 0.8),
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    <VisibilityIcon sx={{ color: 'white', fontSize: 20 }} />
                  </Box>
                </>
              ) : (
                <Stack spacing={2} alignItems="center" sx={{ p: 4, textAlign: 'center' }}>
                  <ImageIcon sx={{ fontSize: 64, color: 'text.secondary', opacity: 0.5 }} />
                  <Typography variant="body2" color="text.secondary">
                    {t('ยังไม่มีรูปภาพ')}
                  </Typography>
                </Stack>
              )}
            </Paper>
          </Fade>

          {/* Form Section */}
          <Fade in timeout={800}>
            <Paper
              elevation={0}
              sx={{
                flex: { xs: 'none', md: 1 },
                borderRadius: 3,
                p: { xs: 2.5, md: 3.5 },
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <Stack spacing={3}>
                {/* File Upload Section */}
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                    <CloudUploadIcon color="primary" />
                    <InputLabel
                      sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'text.primary',
                        mb: 0,
                      }}
                    >
                      {t('อัปโหลดรูปบัตรประชาชน')}
                    </InputLabel>
                  </Stack>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                    disabled={hasPendingKyc || profileVerified}
                    startIcon={<CloudUploadIcon />}
                sx={{
                  textTransform: 'none',
                      py: 2,
                  borderRadius: 2,
                      borderStyle: profileVerified ? 'solid' : 'dashed',
                      borderWidth: 2,
                      borderColor: profileVerified
                        ? theme.palette.success.main
                        : cardFile
                        ? theme.palette.success.main
                        : theme.palette.divider,
                      backgroundColor: profileVerified
                        ? alpha(theme.palette.success.main, 0.1)
                        : cardFile
                        ? alpha(theme.palette.success.main, 0.05)
                        : 'transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': profileVerified
                        ? {}
                        : {
                            borderColor: theme.palette.primary.main,
                            backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            borderStyle: 'solid',
                          },
                      '&.Mui-disabled': {
                        borderStyle: profileVerified ? 'solid' : 'dashed',
                        borderColor: profileVerified
                          ? theme.palette.success.main
                          : theme.palette.divider,
                        backgroundColor: profileVerified
                          ? alpha(theme.palette.success.main, 0.1)
                          : 'transparent',
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" justifyContent="space-between" width="100%" spacing={2}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          flex: 1,
                          textAlign: 'left',
                        }}
                      >
                        {profileVerified ? (
                          <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                            {t('โปรไฟล์ได้รับการยืนยันแล้ว')}
                          </Typography>
                        ) : cardFile ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main', mr: 1, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {cardFile.name}
                            </Typography>
                          </>
                        ) : (
                          <Typography variant="body2">{t('คลิกเพื่อเลือกรูปภาพ')}</Typography>
                        )}
                      </Box>
                    </Stack>
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={onFileChange}
                      disabled={hasPendingKyc || profileVerified}
                    />
              </Button>
                  <FormHelperText sx={{ mt: 1, fontSize: '0.75rem' }}>
                    {profileVerified
                      ? t('โปรไฟล์ได้รับการยืนยันแล้ว ไม่สามารถอัปโหลดไฟล์ใหม่ได้')
                      : t('รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5MB')}
                  </FormHelperText>
                  {cardFile && !profileVerified && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={t('อัปโหลดสำเร็จ')}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                  {profileVerified && cardImageSrc && (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label={t('หลักฐานได้รับการยืนยันแล้ว')}
                      color="success"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                <Divider />

                {/* Form Fields */}
                <Stack spacing={2.5}>
                  {/* เลขบัตรประชาชน */}
                  <TextField
                    label={t('เลขบัตรประชาชน')}
                    placeholder={t('กรอกเลขบัตร 8 หรือ 13 หลัก')}
                    value={cardNumber}
                    onChange={(event) => onCardNumberChange(event.target.value)}
                    fullWidth
                    required
                    disabled={hasPendingKyc || profileVerified}
                    error={cardNumberError}
                    helperText={
                      cardNumberError
                        ? t('เลขบัตรประชาชนต้องมี 8 หรือ 13 หลัก')
                        : cardNumber.length > 0
                          ? `${cardNumber.length} ${t('หลัก')}`
                          : t('กรอกเลขบัตรประชาชน 8 หลัก หรือ 13 หลัก')
                    }
                    inputProps={{
                      maxLength: 13,
                      pattern: '[0-9]*',
                      inputMode: 'numeric',
                    }}
                    InputProps={{
                      startAdornment: <DescriptionIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      },
                    }}
                  />

                  {/* ชื่อ - นามสกุล */}
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: 'block', fontWeight: 500 }}
                    >
                      {t('ชื่อ-นามสกุล ตามบัตรประชาชน')}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <TextField
                        label={t('ชื่อ')}
                        placeholder={t('กรอกชื่อตามบัตรประชาชน')}
                        value={firstName}
                        onChange={(event) => onFirstNameChange(event.target.value)}
                        fullWidth
                        required
                        disabled={hasPendingKyc || profileVerified}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <TextField
                        label={t('นามสกุล')}
                        placeholder={t('กรอกนามสกุลตามบัตรประชาชน')}
                        value={lastName}
                        onChange={(event) => onLastNameChange(event.target.value)}
                        fullWidth
                        required
                        disabled={hasPendingKyc || profileVerified}
                        InputProps={{
                          startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                    </Stack>
                  </Box>

                  {/* วันที่หมดอายุ */}
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 1, display: 'block', fontWeight: 500 }}
                    >
                      {t('วันหมดอายุตามบัตรประชาชน')}
                    </Typography>
                    <DatePicker
                      label={t('วันที่หมดอายุบัตร')}
                      format="DD/MM/YYYY"
                      disabled={hasPendingKyc || profileVerified}
                      value={expiresDate ? dayjs(expiresDate, 'DD/MM/YYYY') : null}
                      onChange={(date: Dayjs | null) => {
                        const formattedDate = date ? date.format('DD/MM/YYYY') : '';
                        onExpiresDateChange(formattedDate);
                      }}
                      minDate={dayjs()}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          required: true,
                          error: dateError,
                          helperText: dateError
                            ? t('วันที่หมดอายุไม่ถูกต้อง')
                            : t('เลือกวันที่หมดอายุตามบัตรประชาชน'),
                          sx: {
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Stack>

                {/* Info Box */}
                <Alert
                  severity={profileVerified ? 'success' : 'info'}
                  icon={profileVerified ? <CheckCircleIcon /> : <EditIcon />}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: profileVerified
                      ? alpha(theme.palette.success.main, 0.08)
                      : alpha(theme.palette.info.main, 0.08),
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography variant="caption" component="div" sx={{ fontWeight: 600 }}>
                      {profileVerified ? (
                        <>
                          <strong>{t('โปรไฟล์ได้รับการยืนยันแล้ว:')}</strong>{' '}
                          {t('ไม่สามารถแก้ไขข้อมูลได้')}
                        </>
                      ) : (
                        <>
                          <strong>{t('คำแนะนำ:')}</strong>
                        </>
                      )}
                    </Typography>
                    {!profileVerified && (
                      <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.7rem' }}>
                        <li>{t('ถ่ายภาพบัตรประชาชนด้านหน้าให้ชัดเจน')}</li>
                        <li>{t('กรอกข้อมูลให้ตรงกับบัตรประชาชน')}</li>
                        <li>{t('คลิกที่ภาพเพื่อดูแบบเต็มขนาด')}</li>
                      </Box>
                    )}
                  </Stack>
                </Alert>
              </Stack>
            </Paper>
          </Fade>
        </Stack>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: { xs: 2.5, md: 4 },
          py: 2.5,
          backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.paper : theme.colors.alpha.white[100],
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            textTransform: 'none',
            px: 3,
            borderRadius: 2,
          }}
          disabled={isSubmitting}
        >
          {t('ปิด')}
        </Button>
        {!profileVerified && (
          <Button
            variant="contained"
            color="primary"
            startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
            onClick={onSubmit}
            disabled={isSubmitting || hasPendingKyc || !isFormValid}
            sx={{
              textTransform: 'none',
              px: 4,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: theme.shadows[4],
              '&:hover': {
                boxShadow: theme.shadows[8],
              },
            }}
          >
            {isSubmitting
              ? t('กำลังส่ง...')
              : hasPendingKyc
              ? t('รอการตรวจสอบ')
              : rejectedKycData
              ? t('ส่งข้อมูลใหม่')
              : t('ส่งคำขอยืนยัน')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ProfileKycDialog;
