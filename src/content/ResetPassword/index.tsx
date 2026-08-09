'use client';

import { Alert, Avatar, Box, Button, Card, CircularProgress, Collapse, Container, DialogContent, IconButton, InputAdornment, TextField, Typography, styled } from "@mui/material"
import { useEffect, useState } from "react"
import { Visibility, VisibilityOff, FeedbackOutlined } from "@mui/icons-material"
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import wait from "@/utils/wait";
import CloseIcon from '@mui/icons-material/Close';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { auth } from "@/services/firebase";
import { checkActionCode, confirmPasswordReset } from "firebase/auth"
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Grid2';
import { resetState } from "@/lib/userActions";
import { useDispatch } from "react-redux";
import { handleForceLogout } from "@/utils/authUtils";


const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      margin-left: auto;
      margin-right: auto;

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);




const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.warning.lighter};
      color: ${theme.colors.warning.main};
      width: ${theme.spacing(10)};
      height: ${theme.spacing(10)};
      margin: 0 auto ${theme.spacing(2)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(42)};
      }
`
);


const ResetPasswordPage = () => {

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);
  const { t }: { t: any } = useTranslation();
  const [openAlert, setOpenAlert] = useState(true);
  const dispatch = useDispatch();
  const [Stdsuccessful, setStdsuccessful] = useState(false);
  const [StdoobCode, setStdoobCode] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { status } = useSession();
  const router = useRouter()
  const readoobCode = (oobCode: any) => {

    checkActionCode(auth, oobCode)
      .then(async (actionCodeInfo) => {

        if (actionCodeInfo.operation === 'PASSWORD_RESET') {
          // console.log('Password reset link is valid');
          setStdoobCode(true);
          await wait(1000);
          setLoading(false);
          // Proceed with allowing the user to reset the password
        } else {
          // console.log('Invalid or expired link');
          setStdoobCode(false);
          await wait(1000);
          setLoading(false);
          // Handle the case where the link is invalid or expired
        }
      })
      .catch(async (error) => {
        console.error('Error checking action code:', error);
        setStdoobCode(false);
        await wait(1000);
        setLoading(false);

        // Handle the error
      });

  }


  const handleResetPassword = (item: any) => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const oobCode = url.searchParams.get('oobCode');
    if (oobCode) {
      confirmPasswordReset(auth, oobCode, item.password_confirm)
        .then(() => {
          // console.log('Password reset successful');
          setStdsuccessful(true)
        })
        .catch((error) => {
          console.error('Password reset error:', error);
        });
    }
  }

  useEffect(() => {

    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const oobCode = url.searchParams.get('oobCode');

    readoobCode(oobCode)


  }, [])


  return (
    <>

      {loading ? <> </> :
        <Container component="main" maxWidth="xs"

        >

          {!Stdsuccessful ? <Card
            sx={{
              boxShadow: 3,

              borderRadius: 2,

              // backgroundColor:'backgroup',
              py: 4,
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >



            {StdoobCode ? <Typography component="div" >
              <Box sx={{ fontWeight: 'bold', m: 1, fontSize: '1.5rem' }}>New Password</Box>

            </Typography> : ''}
            {StdoobCode ? <Box sx={{ fontSize: '0.7rem', mb: 3 }}>Fill in the fields below to Reset Password your account.</Box> : ''}

            {!StdoobCode ? <Grid size={12}>
              <Box
                sx={{
                  py: { xs: 3, md: 8, lg: 12 },
                  textAlign: 'center'
                }}
              >
                <AvatarPrimary>
                  <FeedbackOutlined />
                </AvatarPrimary>
                <Typography variant="h4">{t('Expired link')}  !</Typography>
                <Typography
                  variant="h4"
                  sx={{
                    pt: 1,
                    pb: 3
                  }}
                  fontWeight="normal"
                  color="text.secondary"
                >
                  {t(
                    'Please ! Try Again !'
                  )}
                  !
                </Typography>
                <Button
                  sx={{ mt: 5, }}
                  fullWidth
                  variant="contained"
                  href={'/'}
                >
                  Continue to sign in
                </Button>
              </Box>
            </Grid> :
              <Formik
                initialValues={{

                  password: '',
                  password_confirm: '',

                  submit: null,

                }}
                validationSchema={Yup.object().shape({
                  password: Yup.string()
                    .min(8)
                    .max(255)
                    .required(t('The password field is required')),
                  password_confirm: Yup.string()
                    .oneOf(
                      [Yup.ref('password')],
                      t('Both password fields need to be the same')
                    )
                    .required(t('This field is required')),



                })}
                onSubmit={async (
                  _values,
                  { setErrors, setStatus, setSubmitting }
                ) => {
                  try {


                    await wait(1000);

                    setStatus({ success: true });
                    setSubmitting(false);
                    handleResetPassword(_values);
                  } catch (err: any) {
                    console.error(err);
                    setStatus({ success: false });
                    setErrors({ submit: err.message });
                    setSubmitting(false);
                  }
                }}
              >
                {({
                  errors,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  touched,
                  values,

                }) => (
                  <form onSubmit={handleSubmit}>
                    <DialogContent dividers >

                      <Grid container spacing={3}>
                        <Grid size={12} >

                          <TextField
                            error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            name="password"
                            label=" New Password"
                            type={showPassword ? "text" : "password"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            variant="outlined"
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                    >
                                      {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }
                            }}

                          />
                        </Grid>


                        <Grid size={12}  >

                          <TextField
                            error={Boolean(touched.password_confirm && errors.password_confirm)}
                            fullWidth
                            helperText={touched.password_confirm && errors.password_confirm}
                            name="password_confirm"
                            label="Confirm New Password"
                            type={showPassword ? "text" : "password"}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password_confirm}
                            variant="outlined"
                            slotProps={{
                              input: {
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                      aria-label="toggle password visibility"
                                      onClick={handleClickShowPassword}
                                      onMouseDown={handleMouseDownPassword}
                                    >
                                      {showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                                )
                              }
                            }}
                          />
                        </Grid>



                        <Button
                          type="submit"

                          variant="contained"
                          fullWidth
                          startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                          disabled={Boolean(errors.submit) || isSubmitting}

                          // color="info"
                          sx={{ mt: 3, mb: 3, ml: 3, backgroundColor: 'login.button_summit_color', }}
                        >
                          Reset Password
                        </Button>

                      </Grid>
                    </DialogContent>
                  </form>
                )}
              </Formik>}


          </Card>
            : <Box py={8}>
              <Container maxWidth="sm">
                <AvatarSuccess>
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Collapse in={openAlert}>
                  <Alert
                    sx={{
                      mt: 5
                    }}
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenAlert(false);
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    severity="info"
                  >
                    {t(
                      'Password reset successful'
                    )}
                  </Alert>
                </Collapse>



                <Button
                  sx={{ mt: 5, }}
                  fullWidth
                  variant="contained"
                  onClick={() => {

                    if (status === "authenticated") {
                      dispatch(resetState());
                      handleForceLogout(dispatch, router);
                      router.push('/login');
                    } else {
                      router.push('/login');
                    }
                  }}

                >
                  Continue to sign in
                </Button>
              </Container>
            </Box>}



        </Container >
      }
    </>
  )
}

export default ResetPasswordPage

