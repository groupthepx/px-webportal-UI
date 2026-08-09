'use client';
import { Avatar, Box, Button, Card, Checkbox, CircularProgress, Container, Dialog, Divider, FormControlLabel, IconButton, InputAdornment, ListItem, Skeleton, Slide, Stack, TextField, Typography, styled, useTheme, Fade, Backdrop } from "@mui/material"
import { signIn, useSession } from 'next-auth/react';
import { forwardRef, ReactElement, Ref, useContext, useEffect, useRef, useState } from "react"
import { Person, Visibility, VisibilityOff, Lock, CheckCircle, Error as ErrorIcon, Refresh } from "@mui/icons-material"
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from 'next/navigation'
import { TransitionProps } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";
import wait from "@/utils/wait";
import Grid from '@mui/material/Grid2';
import Logo from "@/components/Logo";
import { HEADER_LOGO, LOGO_LINE_WHITE } from "@/constants/svg";
import Texts from "@/components/Texts";
import { ROUTES_NOT_USER_SIDE_HEADER } from "@/constants/route";
import secureLocalStorage from "react-secure-storage";
import { useSearchParams } from 'next/navigation';
import { useGetContactListAllQuery } from "@/lib/features/contact";
import { LOGO_LINE } from "@/constants/image";
import { SidebarContext } from "@/contexts/SidebarContext";
import { LOGIN_SUCCESS_ROUTE } from './loginRedirect';


const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
        border-radius: 16px;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color: ${theme.colors.success.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.dark};
     color: ${theme.palette.error.contrastText};
     border-radius: 8px;
     padding: ${theme.spacing(1.5, 3)};
     font-weight: 600;
     text-transform: none;

     &:hover {
        background: ${theme.colors.error.main};
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
     }
     transition: all 0.2s ease-in-out;
    `
);

const CardBorderLeft = styled(Card)(
  ({ theme }) => `
    border-left: transparent 5px solid;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(0,0,0,0.15);
    }
  `
);

const LoadingButton = styled(Button)(
  ({ theme }) => `
    position: relative;
    border-radius: 8px;
    padding: ${theme.spacing(1.5, 3)};
    font-weight: 600;
    font-size: ${theme.typography.pxToRem(16)};
    text-transform: none;
    min-height: 48px;
    transition: all 0.3s ease-in-out;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.2);
    }

    &:disabled {
      background: ${theme.colors.gradients.primary};
      opacity: 0.8;
      color: white;
    }
  `
);

const SuccessMessage = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.success.lighter};
    color: ${theme.colors.success.main};
    padding: ${theme.spacing(2)};
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: ${theme.spacing(1)};
    margin: ${theme.spacing(2, 0)};
    animation: slideDown 0.3s ease-in-out;

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});


const isValidURL = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
       font-size: ${theme.typography.pxToRem(28)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }
`
);

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(17)};
`
);






const HeaderWrapper = styled(Box)(
  ({ theme }) => `
    height: ${theme.header.height};
    color: ${theme.header.textColor};
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 6;
    background: ${theme.header.background};
    opacity: 0.95;
    backdrop-filter: blur(3px);
    position: fixed;
    justify-content: space-between;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    
    width: 100%;

    @media (min-width: ${theme.breakpoints.values.lg}px) {

      width: 100%;
    }
  `
);



const LoginPage = () => {

  const { t }: { t: any } = useTranslation();
  // const { register, handleSubmit, formState: { errors } } = useForm()
  const [showPassword, setShowPassword] = useState(false);
  const [showLoding, setLoding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loginStep, setLoginStep] = useState<'idle' | 'validating' | 'authenticating' | 'success'>('idle');

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [dialogType, setDialogType] = useState<'error' | 'success'>('error');

  const [msgError, SetMsgError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const formikRef = useRef<FormikProps<any> | null>(null);
  const router = useRouter()

  const theme = useTheme();


  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const { data: session, status } = useSession();

  const currentRoute = usePathname();



  useEffect(() => {
    // console.log(window.location.pathname)

    if (status === "authenticated" && ROUTES_NOT_USER_SIDE_HEADER.includes(currentRoute)) {
      router.push(LOGIN_SUCCESS_ROUTE);
    }
  }, [session, status, currentRoute, router]);

  const { toggleSidebar } = useContext(SidebarContext);
  const closeSidebar = () => toggleSidebar();



  const onSubmits = async (data: any) => {
    try {
      setLoding(true);
      setLoginStep('validating');

      // Simulate validation delay for better UX
      await wait(1000);
      setLoginStep('authenticating');

      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result && result.error) {
        SetMsgError(result.error);
        setDialogType('error');
        handleOpenConfirmDelete();
        setLoginStep('idle');
        setLoding(false);
      } else {
        // Success path
        setLoginStep('success');
        setSuccessMessage('การเข้าสู่ระบบสำเร็จ!');
        setShowSuccess(true);

        if (data.savepaswword) {
          // When checkbox is true, save email and password to localStorage
          secureLocalStorage.setItem('userEmail', data.email);
          secureLocalStorage.setItem('userPassword', data.password);
        } else {
          // When checkbox is false, remove email and password from localStorage
          secureLocalStorage.removeItem('userEmail');
          secureLocalStorage.removeItem('userPassword');
        }

        // Show success message before redirect
        await wait(1500);
        closeSidebar();
        router.push(LOGIN_SUCCESS_ROUTE);
        setLoding(false);
      }
    } catch (error: any) {
      SetMsgError(error.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      setDialogType('error');
      handleOpenConfirmDelete();
      setLoginStep('idle');
      setLoding(false);
    }
  }

  useEffect(() => {

    const userEmail = secureLocalStorage.getItem('userEmail');
    const userPassword = secureLocalStorage.getItem('userPassword');


    if (formikRef.current) {
      if (userEmail && userPassword) {


        formikRef.current.setFieldValue(
          "email",
          `${userEmail}`
        );
        formikRef.current.setFieldValue(
          "password",
          `${userPassword}`
        );
        formikRef.current.setFieldValue(
          "savepaswword",
          true
        );

      }



    }


  }, [formikRef]);

  const handleClick = () => {
    router.push('/'); // Navigate to the homepage
  };

  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam) {
      const decodedMsg = decodeURIComponent(errorParam); // decode "Account+is+Ban"

  //    console.log("decodedMsg", decodedMsg)
      SetMsgError(decodedMsg === "Ban" ? 'บัญชีถูกระงับ กรุณาติดต่อแอดมิน' : decodedMsg);
      handleOpenConfirmDelete();
    }
  }, [searchParams]);


  const { data: contactListAll, isLoading: isLoadingContactListAll,
  } = useGetContactListAllQuery();

  const LINE = contactListAll && contactListAll.data.find((item: any) => item.contact_title === 'LINE Admin' && item.is_active === true);



  return (
    <>
      <Box

      >
        <HeaderWrapper display="flex" alignItems="center">
          <Container>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              alignItems="center"
              spacing={2}
            >
              <Box onClick={handleClick} display="flex" alignItems="center" sx={{ width: '100%', cursor: 'pointer' }}>
                <Logo imageSrc={HEADER_LOGO} />
              </Box>
            </Stack>

          </Container>

        </HeaderWrapper>
        <Container component="main" sx={{ mt: theme.spacing(13), }}>
          <CardBorderLeft
            sx={{
              p: { md: 5, xs: 0 },
              // m : {md : 30 , xs : 0} ,
              mt: { md: 15, xs: 0 },
              ml: { md: 15, xs: 0 },
              mr: { md: 15, xs: 0 },
              borderLeftColor: `${theme.colors.primary.main}`,
              px: { xs: 2, md: 10 },

              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>

            <TypographyH1 sx={{ mt: 2, color: theme.colors.primary.main }} variant="h1" gutterBottom >
              {t('เข้าสู่ระบบ')}
            </TypographyH1>
            <TypographyH2 variant="subtitle1" gutterBottom >
              {t('ลงชื่อเข้าใช้งานสำหรับสมาชิก')}
            </TypographyH2>

            <Formik
              innerRef={formikRef}
              initialValues={{

                email: '',
                password: '',
                savepaswword: false,
                submit: null,
              }}
              validationSchema={Yup.object().shape({

                email: Yup.string()
                  .email(t('ข้อมูลไม่ถูกต้อง')) // Ensure it's a valid email format
                  .required(t('กรุณากรอกอีเมล')), // Mark it as required

                password: Yup.string()
                  .min(8, t('ต้องมีอย่างน้อย 8 ตัวอักษร')) // Ensure password is at least 8 characters long
                  .required(t('กรุณากรอกรหัสผ่าน')), // Mark it as required


              })}
              onSubmit={async (
                _values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                try {


                  setStatus({ success: true });
                  setSubmitting(false);
                  onSubmits(_values);
                } catch (err: any) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.data });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                touched,
                values,
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>

                  <Grid container spacing={2}>

                    <Grid mt={3} size={{ xs: 12, md: 12 }}>

                      <TextField
                        fullWidth
                        autoFocus
                        disabled={showLoding}
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Person color={touched.email && errors.email ? "error" : "action"} />
                              </InputAdornment>
                            ),
                          }
                        }}
                        placeholder={t('อีเมล*')}
                        type="email"
                        name="email"
                        value={values.email}
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          if (errors.email && touched.email) {
                            setFieldValue('email', e.target.value);
                          }
                        }}
                        error={Boolean(touched.email && errors.email)}
                        helperText={touched.email && errors.email ? String(errors.email) : ''}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 2px ${theme.colors.primary.main}20`,
                            },
                          },
                        }}
                      />

                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >

                      <TextField
                        fullWidth
                        disabled={showLoding}
                        value={values.password}
                        placeholder={t('รหัสผ่าน*')}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        variant="outlined"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          handleChange(e);
                          if (errors.password && touched.password) {
                            setFieldValue('password', e.target.value);
                          }
                        }}
                        error={Boolean(touched.password && errors.password)}
                        helperText={touched.password && errors.password ? String(errors.password) : ''}

                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <Lock color={touched.password && errors.password ? "error" : "action"} />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  disabled={showLoding}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    },
                                  }}
                                >
                                  {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                              </InputAdornment>
                            )
                          },
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '8px',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            },
                            '&.Mui-focused': {
                              boxShadow: `0 0 0 2px ${theme.colors.primary.main}20`,
                            },
                          },
                        }}
                      />

                    </Grid>
                    <Grid size={{ xs: 6, md: 6 }}>
                      <FormControlLabel


                        control={<Checkbox
                          onChange={(event: any) => {


                            setFieldValue('savepaswword', event.target.checked);
                          }}
                          checked={values.savepaswword ? true : false} size="small" color="info" />}
                        label="จํารหัสผ่าน" />
                    </Grid>
                    <Grid size={{ xs: 6, md: 6 }} textAlign={'right'}>
                      <Button
                        onClick={(_e) => {
                          // router.push(RESET_PASSWORD_ROUTE);
                          router.push('/reset_password');
                        }}
                        color="warning">
                        ลืมรหัสผ่าน?
                      </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      {showSuccess && (
                        <SuccessMessage>
                          <CheckCircle />
                          <Typography variant="body2" fontWeight="600">
                            {successMessage}
                          </Typography>
                        </SuccessMessage>
                      )}

                      <LoadingButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={showLoding}
                        startIcon={
                          showLoding ? (
                            loginStep === 'validating' ? (
                              <CircularProgress size="1rem" color="inherit" />
                            ) : loginStep === 'authenticating' ? (
                              <CircularProgress size="1rem" color="inherit" />
                            ) : loginStep === 'success' ? (
                              <CheckCircle />
                            ) : (
                              <CircularProgress size="1rem" color="inherit" />
                            )
                          ) : null
                        }
                        sx={{
                          background: showLoding ? theme.colors.gradients.primary : undefined,
                        }}
                      >
                        {showLoding ? (
                          loginStep === 'validating' ? (
                            'กำลังตรวจสอบข้อมูล...'
                          ) : loginStep === 'authenticating' ? (
                            'กำลังเข้าสู่ระบบ...'
                          ) : loginStep === 'success' ? (
                            'เข้าสู่ระบบสำเร็จ!'
                          ) : (
                            'กำลังดำเนินการ...'
                          )
                        ) : (
                          t('เข้าสู่ระบบ')
                        )}
                      </LoadingButton>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }} >
                      <Divider sx={{ my: 4, backgroundColor: theme.colors.primary.main }} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} textAlign={'center'}>
                      <Texts color="secondary"  >
                        {t('ยังไม่มีบัญชี?')}
                      </Texts>
                      {', '}
                      <Button sx={{
                        color: theme.colors.gradients.primary,
                      }}
                        onClick={(_e) => {
                          router.push('/register');
                        }}
                      >
                        {t('สมัครสมาชิก?')}
                      </Button>
                    </Grid>


                  </Grid>
                </form>
              )}
            </Formik>

          </CardBorderLeft>

        </Container >
      </Box>



      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        // keepMounted
        onClose={handleCloseConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}

        >
          {dialogType === 'error' ? (
            <AvatarError>
              <ErrorIcon />
            </AvatarError>
          ) : (
            <AvatarSuccess>
              <CheckCircle />
            </AvatarSuccess>
          )}

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6,
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.5,
            }}
            fontWeight="normal"
            color={dialogType === 'error' ? 'error.main' : 'success.main'}
            variant="h5"
          >
            {msgError}
          </Typography>

          {msgError === "บัญชีถูกระงับ กรุณาติดต่อแอดมิน" &&
            <Box display={'flex'} justifyContent={'center'} >

              <TypographyH2
                sx={{
                  lineHeight: 1.5,
                  pb: 4
                }}
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
              >
                {t(
                  'ติดต่อแอดมิน :'
                )}
                {isLoadingContactListAll ? (
                  // Skeleton for Line Contact
                  <Skeleton variant="rectangular" width="100%" height={10} sx={{ mb: 2 }} />
                ) : LINE ? (
                  <>
                    {LINE.contact_content && isValidURL(LINE.contact_content) ? (
                      <IconButton
                        sx={{
                          fontSize: `${theme.typography.pxToRem(14)}`,
                          color: `${theme.colors.black.main}`,
                          '&:hover': {
                            background: theme.colors.white.light, // Change to your desired hover gradient
                          }

                        }}
                        onClick={() => {


                          window.open(LINE.contact_content, '_blank');

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: '100%',
                            maxWidth: '50px',

                          }}
                        >
                          <Image
                            src={LOGO_LINE} // Use the imageSrc parameter
                            layout="responsive" // Make the image responsive
                            width={500} // Original width (required by Next.js)
                            height={500} // Original height (required by Next.js)
                            alt="Logo"
                          />
                        </Box>

                      </IconButton>
                    ) : (
                      // Fallback content when LINE.contact_content is invalid or not a URL
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          color: `${theme.colors.white.main}`,
                          fontSize: `${theme.typography.pxToRem(14)}`,

                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            width: '100%',
                            maxWidth: '25px',
                            mr: 2,
                          }}
                        >
                          <Image
                            src={LOGO_LINE_WHITE} // Use the imageSrc parameter
                            layout="responsive" // Make the image responsive
                            width={500} // Original width (required by Next.js)
                            height={500} // Original height (required by Next.js)
                            alt="Logo"
                          />
                        </Box>
                        <TypographyH2 variant="h4"
                          color="text.secondary"
                          fontWeight="normal">
                          {LINE.contact_content}
                        </TypographyH2>
                      </Box>
                    )}
                  </>
                ) : ''}
              </TypographyH2>
            </Box>
          }


          <Box display="flex" gap={2} justifyContent="center" mt={2}>
            <ButtonError
              onClick={handleCloseConfirmDelete}
              size="large"
              sx={{
                mx: 1,
                px: 4,
                py: 1.5,
              }}
              variant="contained"
              startIcon={dialogType === 'error' ? <CloseIcon /> : <CheckCircle />}
            >
              {t('OK')}
            </ButtonError>
            {msgError === "บัญชีถูกระงับ กรุณาติดต่อแอดมิน" && (
              <Button
                onClick={() => {
                  handleCloseConfirmDelete();
                  // Add retry login logic here if needed
                }}
                size="large"
                variant="outlined"
                color="primary"
                sx={{
                  mx: 1,
                  px: 4,
                  py: 1.5,
                  borderColor: theme.colors.primary.main,
                  color: theme.colors.primary.main,
                  '&:hover': {
                    backgroundColor: theme.colors.primary.lighter,
                    borderColor: theme.colors.primary.main,
                  },
                }}
                startIcon={<Refresh />}
              >
                {t('ลองใหม่')}
              </Button>
            )}
          </Box>
        </Box>
      </DialogWrapper>


    </>
  )
}

export default LoginPage
