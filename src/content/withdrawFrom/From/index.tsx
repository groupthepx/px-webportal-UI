import {

  Typography,
  Card,
  Box,

  styled,
  useTheme,
  TextField,
  Divider,
  Button,
  CircularProgress,
  alpha,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useEffect, useMemo } from 'react';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import wait from '@/utils/wait';
import NumberFormatCustom from '@/components/NumberFormatCustom';
import { Add, ArrowForwardOutlined } from '@mui/icons-material';
import { MemberDataDetailModel } from '@/model/member';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);


interface Props {
  postWithdrawRequestsComission: any
  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDataDetailModel
  handleOpenConfirmDelete: any
  ParamsId: string
  walletBalance: number | null;
  postWithdrawRequestsNonOranizationComission: any
  isVJMember: boolean;
}
const WithdrawMoneyFromDetails: FC<Props> = ({
  overviewDetailById,
  postWithdrawRequestsComission,
  memberById,
  handleOpenConfirmDelete,
  ParamsId,
  walletBalance,
  postWithdrawRequestsNonOranizationComission,
  isVJMember,
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();



  const myWallet = overviewDetailById ? overviewDetailById.data && overviewDetailById.data.my_wallet || null : null;


  const memberDetail = memberById && memberById.data ? memberById.data : null

  // ตรวจสอบว่า KYC สำเร็จหรือไม่ (หา KYC ที่ approved และยังไม่หมดอายุ)
  const profileVerified = useMemo(() => {
    const kycList = memberDetail?.kyc_verification;
    if (!kycList || kycList.length === 0) {
      return false;
    }

    // หา KYC ที่ status = "approved" และไม่ถูกลบ
    const approvedKycs = kycList.filter(
      (kyc) => kyc.status === 'approved' && !kyc.deleted_at
    );

    if (approvedKycs.length === 0) {
      return false;
    }

    // เช็คว่ายังไม่หมดอายุ
    const validKyc = approvedKycs.find((kyc) => {
      if (!kyc.expire_date) return false;
      const expireDate = dayjs(kyc.expire_date);
      const today = dayjs();
      return expireDate.isAfter(today) || expireDate.isSame(today, 'day');
    });

    return Boolean(validKyc);
  }, [memberDetail]);




  return (
    <>
      <CardBorderBottom
        style={{
          borderBlockColor: `${theme.colors.primary.main}`,

        }}

        sx={{
          // borderBottomColor: `${theme.colors.primary.main}`,

          textAlign: 'center'
        }}
      // onClick={() => {
      //   // router.push(`${GENERAL_DASHBOARD_PATH}/approval/forget`)
      // }} 
      >

        <Box
          p={3}
        // display="flex"
        // alignItems="center"
        // justifyContent="space-between"
        >

          <Box alignItems="left" textAlign={"left"}>

            <Formik
              initialValues={{
                title: "",
                withdraw_count: 0,
                submit: null,
              }}
              validationSchema={Yup.object().shape({

              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  // ไม่สามารถถอนได้ถ้า KYC ยังไม่สำเร็จ
                  if (!profileVerified) {
                    setSubmitting(false);
                    return;
                  }

                  await wait(1000);
                  setStatus({ success: true });
                  setSubmitting(false);

                  if (values.withdraw_count < 300) {
                    handleOpenConfirmDelete()
                  } else {

                    if (isVJMember) {
                      postWithdrawRequestsComission(
                        {
                          withdraw: {
                            ...values,
                            withdraw_count: parseInt(`${values.withdraw_count}`),
                            // organization_id: `${ParamsId}`
                          }
                        }
                      )
                    } else {

                      postWithdrawRequestsNonOranizationComission(
                        {
                          withdraw: {
                            ...values,
                            withdraw_count: parseInt(`${values.withdraw_count}`),
                            organization_id: `${ParamsId}`
                          }
                        }
                      )
                    }




                  }

                  // console.log("values", {
                  //   ...values,
                  //   withdraw_count : parseInt(`${values.withdraw_count}`),
                  // })



                  // RequestAction(values);
                } catch (err: any) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.data });
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, handleSubmit, isSubmitting, touched, handleBlur, setFieldValue, values, handleChange }) => (
                <form onSubmit={handleSubmit}>

                  {memberDetail && memberDetail.bank_account ?
                    <Box >

                      <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >

                        <Grid container spacing={2}>

                          <Grid size={12} textAlign={'center'} >

                            <Typography variant="subtitle1" gutterBottom>
                              {t('กรุณากรอกจำนวนเงินที่ต้องการถอน')}
                            </Typography>
                          </Grid>

                          {!profileVerified && (
                            <Grid size={12} textAlign={'left'}>
                              <Alert severity="error" sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                                  <Typography component="span">{t('กรุณายืนยันตัวตน (KYC) ก่อนทำการถอนเงิน')}</Typography>
                                  <Button size="small" variant="outlined" onClick={() => router.push('/profile?tab=kyc')}>ไปยืนยัน KYC</Button>
                                </Box>
                              </Alert>
                            </Grid>
                          )}

                          <Grid size={12} textAlign={'left'} >

                            <Alert severity="warning">
                              {[
                                'สามารถกดถอนเงินได้ทุกวันเงินจะเข้าในวันอังคารและวันศุกร์',
                                'ถอนขั้นต่ำ 300 บาท',
                                'หักณที่จ่าย 3%',
                              ].map((text, index) => (
                                <Typography
                                  key={index}
                                  variant="subtitle1"
                                  gutterBottom
                                  sx={{ '&::before': { content: '"– "', marginRight: 1 } }}
                                >
                                  {text}
                                </Typography>
                              ))}
                            </Alert>
                          </Grid>
                          <Grid size={12} >
                            <Box display="flex" alignItems="center" justifyContent="center" >
                              <Image
                                src="/assets/svg/pg/wallte.svg"
                                width={24}
                                height={24}
                                alt="Wallte"
                              />
                              <Typography variant="subtitle1" ml={1}>
                                ยอดเงิน ของคุณ :
                              </Typography>
                              <Typography color='primary' variant="h4" ml={1}>
                                {(walletBalance ? walletBalance : 0).toLocaleString() || 0}  ฿
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid size={12} >
                            <TextField
                              error={Boolean(touched.withdraw_count && errors.withdraw_count)}
                              fullWidth
                              size='small'
                              disabled={!profileVerified}
                              placeholder={t('จำนวนเงิน (บาท)*')}
                              helperText={touched.withdraw_count && typeof errors.withdraw_count === 'string' ? errors.withdraw_count : ''}
                              label={t('จำนวนเงิน (บาท)*')}
                              name="withdraw_count"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.withdraw_count}
                              variant="outlined"
                              slotProps={{
                                input: {
                                  inputComponent: NumberFormatCustom as any,
                                },
                              }}
                            />
                          </Grid>
                          <Grid size={12} >

                            <TextField
                              sx={{
                                mt: 1,
                              }}
                              error={Boolean(touched.title && errors.title)}
                              fullWidth
                              disabled={!profileVerified}
                              helperText={touched.title && errors.title}
                              name="title"
                              placeholder={t('รายละเอียด')}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.title}
                              size='small'
                              label={t('รายละเอียด')}
                              multiline
                              minRows={4}
                              maxRows={8}
                            />
                          </Grid>

                          {memberDetail && memberDetail.bank_account && (
                            <Grid size={12} textAlign={'center'} >

                              <Typography variant="subtitle1" gutterBottom>
                                {t('ข้อมูลบัญชีธนาคาร')}
                              </Typography>
                            </Grid>
                          )}


                          {memberDetail && memberDetail.bank_account && (

                            <Grid size={12} textAlign={'center'} >
                              <Card
                                elevation={0}
                                sx={{
                                  mx: 3,
                                  background: `${alpha(theme.colors.alpha.black[100], 0.1)}`
                                }}
                              >
                                <List >
                                  <ListItem>
                                    <ListItemText
                                      primaryTypographyProps={{
                                        variant: 'h5'
                                      }}
                                      primary={t('ธนาคาร') + ':'}
                                    />
                                    <Typography variant="subtitle1">{memberDetail.bank_account && memberDetail.bank_account.bank_name}</Typography>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primaryTypographyProps={{
                                        variant: 'h5'
                                      }}
                                      primary={t('เลขบัญชี') + ':'}
                                    />
                                    <Typography variant="subtitle1">{memberDetail.bank_account && memberDetail.bank_account.account_number}</Typography>
                                  </ListItem>
                                  <ListItem>
                                    <ListItemText
                                      primaryTypographyProps={{
                                        variant: 'h5'
                                      }}
                                      primary={t('ชื่อบัญชีธนาคาร') + ':'}
                                    />
                                    <Typography variant="subtitle1">{memberDetail.bank_account && memberDetail.bank_account.account_name}</Typography>
                                  </ListItem>

                                </List>

                              </Card>
                            </Grid>
                          )}

                          {memberDetail && memberDetail.bank_account && (
                            <Grid size={12} textAlign={'center'} >
                              <IconButton
                                onClick={() => {

                                  router.push('/profile/withdraw_money/account_bank');
                                }}
                                sx={{
                                  ml: 2,
                                  fontSize: '0.9rem',
                                  color: `#F1A12A`,
                                  // borderBottom: `1px solid ${theme.colors.primary.main}`,
                                  // textUnderlineOffset: '2px',
                                  underline: '2px dotted',
                                }}>
                                เปลี่ยนบัญชีธนาคาร
                              </IconButton>
                            </Grid>
                          )}



                        </Grid>



                      </Box>
                      <Divider sx={{
                        width: '100%',
                        mt: 4,
                        border: '1px solid',
                        borderColor: theme.colors.primary.main,
                      }} orientation="horizontal" flexItem />
                      <Box mt={4} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }}>




                      </Box>


                    </Box>
                    :
                    <Box mt={2} p={10} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
                      <Box>
                        <Typography variant="h4" color='primary' gutterBottom>
                          {t('คุณยังไม่ได้กรอกบัญชีธนาคาร')}
                        </Typography>

                        <Button

                          onClick={() => {
                            router.push('/profile/withdraw_money/account_bank');
                          }}

                          variant="outlined"
                          startIcon={<ArrowForwardOutlined />}

                          sx={{
                            borderWidth: '2px',
                            mt: 2,
                            color: theme.colors.gradients.primaryHover,
                            borderColor: theme.colors.gradients.primaryHover,
                            '&:hover': {
                              borderWidth: '2px',
                              // color: theme.colors.white.main,
                              borderColor: theme.colors.gradients.primary,
                              backgroundColor: theme.colors.gradients.primary,
                            }
                          }}

                        >
                          {'ไปหน้าเพิ่มบัญชีธนาคาร'}
                        </Button>
                      </Box>




                    </Box>}





                  {memberDetail && memberDetail.bank_account && (
                    <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
                      <Button
                        className="rounded-[10px]"
                        color="inherit"
                        // variant="contained"
                        sx={{
                          // width: '625px',
                          // height: '320px',
                          background: theme.colors.gradients.primary,
                          fontWeight: 'bold',
                          color: '#ffffff',
                          m: 1,
                          '&:hover': {
                            background: theme.colors.gradients.primaryHover, // Change to your desired hover gradient
                          },
                        }}
                        type="submit"
                        disabled={!profileVerified || Boolean(errors.submit) || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                        variant="contained"
                        size='large'

                      >
                        {t('ส่งคำขอ')}
                      </Button>

                    </Box>)}



                </form>
              )
              }
            </Formik>

          </Box>



        </Box>
      </CardBorderBottom>
    </>
  );
}

export default WithdrawMoneyFromDetails;
