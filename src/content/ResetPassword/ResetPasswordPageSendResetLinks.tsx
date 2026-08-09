'use client';

import { Alert, Avatar, Box, Button, Card, CircularProgress, Collapse, Container, Dialog, DialogContent, IconButton, InputAdornment, Slide, styled, TextField, Typography } from "@mui/material"
import { forwardRef, ReactElement, Ref, useState } from "react"

import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from "react-i18next";
import wait from "@/utils/wait";
import { auth } from "@/services/firebase";
import { Person } from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
import { sendPasswordResetEmail } from "firebase/auth";
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import { TransitionProps } from "@mui/material/transitions";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation'
import Grid from '@mui/material/Grid2';
import { resetState } from "@/lib/userActions";
import { useDispatch } from "react-redux";
import { handleForceLogout } from "@/utils/authUtils";

const DialogWrapper = styled(Dialog)(
    () => `
        .MuiDialog-paper {
          overflow: visible;
        }
  `
);



const ButtonError = styled(Button)(
    ({ theme }) => `
       background: ${theme.colors.error.dark};
       color: ${theme.palette.error.contrastText};
  
       &:hover {
          background: ${theme.colors.error.main};
       }
      `
);


const AvatarError = styled(Avatar)(
    ({ theme }) => `
        background-color: ${theme.colors.error.lighter};
        color: ${theme.colors.error.main};
        width: ${theme.spacing(12)};
        height: ${theme.spacing(12)};
  
        .MuiSvgIcon-root {
          font-size: ${theme.typography.pxToRem(45)};
        }
  `
);


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


const Transition = forwardRef(function Transition(
    props: TransitionProps & { children: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Slide direction="down" ref={ref} {...props} />;
});



const ResetPasswordPageSendResetLink = () => {

    const { t }: { t: any } = useTranslation();
    const [openAlert, setOpenAlert] = useState(true);
    const dispatch = useDispatch();
    const [Stdsuccessful, setStdsuccessful] = useState(false);

    const [msgError, SetMsgError] = useState<string>('');

    const { status } = useSession();
    const router = useRouter()

    const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

    const handleOpenConfirmDelete = () => {
        setOpenConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setOpenConfirmDelete(false);
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return setStdsuccessful(true);
        } catch (error: any) {
            setStdsuccessful(false);
            SetMsgError(error.message);
            handleOpenConfirmDelete()
            throw new Error(error.message || 'Failed to send reset link');
        }
    };

    return (
        <>


            <Container component="main" >
                <Box
                    sx={{
                        p: 5,

                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    {/* <Box
                        component={'img'}
                        sx={{
                            width: 'auto',
                            maxwidth: 200,
                            height: 'auto',
                            maxWidth: 100,
                            mb : 3
                          }}

                        // sx={styles.appLogo}
                        src={'/assets/image/lads_logo.png'} /> */}


                    <Typography component="div" >
                        <Box sx={{ fontWeight: 'bold', m: 1, fontSize: '1.5rem' }}>เปลี่ยนรหัสผ่าน</Box>

                    </Typography>
                    <Box sx={{ fontSize: '0.7rem', mb: 3 }}>กรุณากรอกอีเมลของท่านเพื่อส่งลิงก์รีเซ็ตรหัสผ่านให้ท่าน.</Box>

                    {!Stdsuccessful ?
                        <Formik
                            initialValues={{
                                email: '',
                                submit: null,
                            }}
                            validationSchema={Yup.object().shape({
                                email: Yup.string()
                                    .email(t('ข้อมูลไม่ถูกต้อง กรุณากรอกอีเมล')) // Ensure it's a valid email format
                                    .required(t('กรุณากรอกอีเมล')), // Mark it as required
                            })}
                            onSubmit={async (
                                _values,
                                { setErrors, setStatus, setSubmitting }
                            ) => {
                                try {
                                    await wait(1000);
                                    setStatus({ success: true });
                                    setSubmitting(false);

                                    if (_values.email) {
                                        resetPassword(_values.email)
                                    }


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
                                            <Grid size={12}>

                                                <TextField

                                                    fullWidth
                                                    autoFocus
                                                    slotProps={{
                                                        input: {
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Person />
                                                                </InputAdornment>
                                                            ),
                                                        }
                                                    }}

                                                    placeholder={t('อีเมล@gmail.com*')}
                                                    type="text"
                                                    name="email"
                                                    value={values.email}
                                                    variant="outlined"
                                                    onBlur={handleBlur}
                                                    onChange={handleChange}
                                                    error={Boolean(touched.email && errors.email)}
                                                    helperText={(touched.email && errors.email) ? String(errors.email) : ''}
                                                />
                                            </Grid>

                                            <Grid size={12}>
                                                <Button
                                                    type="submit"

                                                    variant="contained"
                                                    fullWidth
                                                    startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                                                    disabled={Boolean(errors.submit) || isSubmitting}

                                                    // color="info"
                                                    sx={{ mb: 3, backgroundColor: 'login.button_summit_color', }}
                                                >
                                                    ส่งลิงก์รีเซ็ตรหัสผ่าน
                                                </Button>

                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                </form>
                            )}
                        </Formik> : ''
                    }

                    {Stdsuccessful ?
                        <Box py={8}>
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
                                        ลิ้งเปลี่ยนรหัสผ่านใหม่ได้ถูกส่งไปให้ท่านทางอีเมลที่กรอกไว้แล้ว
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
                                    กับไปหน้าเข้าสู่ระบบ
                                </Button>
                            </Container>
                        </Box> : ''
                    }





                </Box>



            </Container >



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
                    <AvatarError>
                        <CloseIcon />
                    </AvatarError>



                    <Typography
                        align="center"
                        sx={{
                            pt: 2,
                            pb: 4,
                            px: 6
                        }}
                        fontWeight="normal"
                        color="text.secondary"
                        variant="h4"
                    >
                        {msgError}
                    </Typography>

                    <Box>

                        <ButtonError
                            onClick={handleCloseConfirmDelete}
                            size="large"
                            sx={{
                                mx: 1,
                                px: 3
                            }}
                            variant="contained"
                        >
                            {t('OK')}
                        </ButtonError>
                    </Box>
                </Box>
            </DialogWrapper>




        </>
    )
}

export default ResetPasswordPageSendResetLink

