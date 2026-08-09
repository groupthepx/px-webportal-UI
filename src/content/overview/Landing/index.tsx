import { IMAGECOVERLADING, LOGO_LINE } from '@/constants/image';
import { LOGO_LINE_WHITE } from '@/constants/svg';
import TypedText from '@/components/TypedText';
import { useGetContactListAllQuery } from '@/lib/features/contact';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import {
  Box,
  Button,
  Container,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(42)};
    line-height: 1.04;
    letter-spacing: 0;

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(54)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(64)};
    }
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
    line-height: 1.7;
`
);

const ImgWrapper = styled(Box)(
  ({ theme }) => `
    position: relative;
    z-index: 5;
    width: 100%;
    max-width: 720px;
    margin: 0 auto;
    overflow: hidden;
    border-radius: ${theme.general.borderRadiusLg};

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: ${theme.general.borderRadiusLg};
    }
  `
);

const isValidURL = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

function LandingPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();

  const { data: contactListAll, isLoading: isLoadingContactListAll } = useGetContactListAllQuery();
  const LINE = contactListAll?.data.find((item: any) => item.contact_title === 'LINE' && item.is_active === true);

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#fff4eb',
        pt: { xs: 3, md: 5 },
        pb: { xs: 5, md: 7 },
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 1,
          px: { xs: 2.5, md: 4 },
        }}
      >
        <Grid container spacing={{ xs: 3, md: 6 }} justifyContent="center" alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <ImgWrapper>
              <Image
                layout="responsive"
                width={900}
                height={720}
                alt="PX VJ mobile application"
                src={IMAGECOVERLADING}
                priority
              />
            </ImgWrapper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ maxWidth: 650, mx: { xs: 'auto', md: 0 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{
                  display: 'inline-flex',
                  px: 1.7,
                  py: 0.8,
                  mb: 2.2,
                  borderRadius: '999px',
                  border: `1px solid ${alpha(theme.colors.primary.main, 0.18)}`,
                  bgcolor: alpha(theme.colors.primary.main, 0.08),
                  color: theme.colors.primary.dark,
                }}
              >
                <VerifiedRoundedIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 900 }}>PX VJ Official Platform</Typography>
              </Stack>

              <TypographyH1
                variant="h1"
                sx={{
                  mb: 2,
                  fontWeight: 900,
                  background: theme.colors.gradients.primary,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                <TypedText text={t('The PX Group')} />
              </TypographyH1>

              <TypographyH2 color="text.secondary" fontWeight={500} sx={{ maxWidth: 560, mx: { xs: 'auto', md: 0 } }}>
                {t('รับสมัคร VJ ประจำสังกัด ทำไม่เป็นสอนฟรี พร้อมระบบเรียนรู้และติดตามงานในแอป PX VJ')}
              </TypographyH2>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.4}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent={{ xs: 'center', md: 'flex-start' }}
                sx={{ mt: 3 }}
              >
                <Button
                  color="inherit"
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  sx={{
                    minHeight: 54,
                    px: 3.2,
                    borderRadius: '16px',
                    background: theme.colors.gradients.primary,
                    fontSize: 16,
                    fontWeight: 900,
                    color: '#ffffff',
                    boxShadow: '0 18px 38px rgba(241, 89, 42, 0.28)',
                    '&:hover': {
                      background: theme.colors.gradients.primaryHover,
                      boxShadow: '0 22px 46px rgba(241, 89, 42, 0.34)',
                    },
                  }}
                  onClick={() => router.push('/register')}
                  size="large"
                >
                  {t('สมัครเลย')}
                </Button>

                <Box>
                  {isLoadingContactListAll ? (
                    <Skeleton variant="rounded" width={210} height={54} />
                  ) : LINE ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent={{ xs: 'center', md: 'flex-start' }}
                      spacing={1}
                      sx={{
                        minHeight: 54,
                        px: 1.2,
                        borderRadius: '16px',
                        border: '1px solid rgba(15,23,42,0.10)',
                        bgcolor: 'rgba(255,255,255,0.72)',
                      }}
                    >
                      <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 700 }}>
                        {t('สอบถามรายละเอียดเพิ่มเติม')}
                      </Typography>
                      {LINE.contact_content && isValidURL(LINE.contact_content) ? (
                        <IconButton
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: '#ffffff',
                            '&:hover': {
                              bgcolor: '#f3fff4',
                            },
                          }}
                          onClick={() => window.open(LINE.contact_content, '_blank')}
                          aria-label="Open Line contact"
                        >
                          <Box component="span" sx={{ width: 28, height: 28 }}>
                            <Image src={LOGO_LINE} layout="responsive" width={500} height={500} alt="LINE" />
                          </Box>
                        </IconButton>
                      ) : (
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box component="span" sx={{ width: 24, height: 24 }}>
                            <Image src={LOGO_LINE_WHITE} layout="responsive" width={500} height={500} alt="LINE" />
                          </Box>
                          <Typography sx={{ color: 'text.secondary', fontSize: 14, fontWeight: 700 }}>
                            {LINE.contact_content}
                          </Typography>
                        </Stack>
                      )}
                    </Stack>
                  ) : null}
                </Box>
              </Stack>

            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default LandingPage;
