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
  InputAdornment,
  Container,

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import Grid from '@mui/material/Grid2';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import wait from '@/utils/wait';
import NumberFormatCustom from '@/components/NumberFormatCustom';
import { Add, ArrowForwardOutlined } from '@mui/icons-material';
import { MemberDataDetailModel } from '@/model/member';
import { CoinBalancePackagesDeatilModel } from '@/model/coin_balance_packages';
import ItemExchange from '../ItemExchange';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);


interface Props {
  // postWithdrawRequestsComission: any
  overviewDetailById: OverviewDetailListModel;
  memberById: MemberDataDetailModel
  myCoin: number
  coinBalancePackages: any
  updateCoinBalanceTransferComission: any
  memberParamsId: string
  ParamsId: string
  updateCoinBalanceTransferNonOrgComission: any
  isVJMember: boolean
}
const WithdrawCoinFromDetails: FC<Props> = ({
  overviewDetailById,
  // postWithdrawRequestsComission,
  memberById,
  myCoin,
  coinBalancePackages,
  memberParamsId,
  updateCoinBalanceTransferComission,
  updateCoinBalanceTransferNonOrgComission,
  ParamsId,
  isVJMember
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();


 





  return (
    <>
      <Formik
        initialValues={{
          // title: "",
          coin: 0,
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          coin: Yup.number()
            .min(1, t('จำนวนเงินต้องไม่ต่ำกว่า 1 บาท'))
            .max(myCoin, t('จำนวนเงินต้องไม่เกินค่าบาทของคุณ'))
            .required(t('กรุณากรอกจำนวนเงิน'))

        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await wait(1000);
            setStatus({ success: true });
            setSubmitting(false);

            // console.log("values", {
            //   id: `${memberParamsId}`,
            //   transfer: {
            //     coin: values.coin ? values.coin : 0,
            //   }
            // })

            if (isVJMember) {

              updateCoinBalanceTransferComission({
                id: `${memberParamsId}`,
                transfer: {
                  coin: values.coin ? parseInt(`${values.coin}`) : 0,
                  organization_id: `${ParamsId}`,
                }
              })


            } else {

              updateCoinBalanceTransferNonOrgComission({
                id: `${memberParamsId}`,
                transfer: {
                  coin: values.coin ? parseInt(`${values.coin}`) : 0,
                }
              })

            }

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
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
            >
              <Grid size={{ xs: 12, md: 4 }} >
                <Container
                  sx={{
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                    maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                    padding: { xs: '0', sm: '16px' }, // Adjust padding for mobile
                    margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
                  }} >
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



                        <Box >

                          <Box display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >

                            <Grid container spacing={2}>

                              <Grid size={12} textAlign={'center'} >

                                <Typography variant="subtitle1" gutterBottom>
                                  {t('กรุณากรอกจำนวน Coin ที่ต้องการถอน')}
                                </Typography>
                              </Grid>
                              <Grid size={12} >
                                <Box display="flex" alignItems="center" justifyContent="center" >
                                  <Image
                                    src="/assets/svg/pg/PX_Coin.svg"
                                    width={24}
                                    height={24}
                                    alt="PX Coin"
                                  />
                                  <Typography variant="subtitle1" ml={1}>
                                    ยอด PX Coin ของคุณ :
                                  </Typography>
                                  <Typography color='primary' variant="h4" ml={1}>
                                    {(myCoin).toLocaleString()}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid size={12} mt={2} >
                                <TextField
                                  error={Boolean(touched.coin && errors.coin)}
                                  fullWidth
                                  size='small'
                                  placeholder={t('จำนวน PX Coin')}
                                  helperText={touched.coin && typeof errors.coin === 'string' ? errors.coin : ''}
                                  label={t('จำนวน PX Coin')}
                                  name="coin"
                                  onBlur={handleBlur}
                                  onFocus={(e) => e.target.select()} // This selects all text on focus
                                  onChange={handleChange}
                                  value={values.coin}
                                  variant="outlined"
                                  slotProps={{
                                    input: {
                                      inputComponent: NumberFormatCustom as any,
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <Button
                                            size="small"
                                            onClick={() => setFieldValue('coin', myCoin)}
                                          >
                                            {t('ทั้งหมด')}
                                          </Button>
                                        </InputAdornment>
                                      ),
                                    }
                                  }
                                  }


                                />
                              </Grid>
                              <Grid size={12} >
                                <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
                                  <Image
                                    src="/assets/svg/pg/wallte.svg"
                                    width={24}
                                    height={24}
                                    alt="PX Coin"
                                  />
                                  <Typography variant="subtitle1" ml={1}>
                                    เทีบยเท่า:
                                  </Typography>
                                  <Typography color='primary' variant="h4" ml={1}>
                                    {(values.coin / 10).toLocaleString()}  ฿
                                  </Typography>
                                </Box>
                              </Grid>

                            </Grid>



                          </Box>
                          <Divider sx={{
                            width: '100%',
                            mt: 4,
                            border: '1px solid',
                            borderColor: theme.colors.primary.main,
                          }} orientation="horizontal" flexItem />



                        </Box>





                        <Box mt={4} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
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
                            disabled={Boolean(errors.submit) || isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                            variant="contained"
                            size='large'

                          >
                            {t('แลกเป็นเงิน')}
                          </Button>

                        </Box>





                      </Box>



                    </Box>
                  </CardBorderBottom>
                </Container>
              </Grid>


              {/* 
              <Grid size={{ xs: 12, md: 12 }} textAlign={'left'} >
                <Container
                  sx={{
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                    maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                    padding: { xs: '0', sm: '16px' }, // Adjust padding for mobile
                    margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
                  }} >
                  <Typography color='primary' variant='h3' gutterBottom>
                    เลือกตัวเลือก
                  </Typography>
                </Container>
              </Grid> */}


              {/* <Grid size={{ xs: 12, md: 12 }} >
                <Container
                  sx={{
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                    maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                    padding: { xs: '0', sm: '16px' }, // Adjust padding for mobile
                    margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens
                  }} >
                  <Grid
                    container
                    direction="row"
                    justifyContent="left"
                    alignItems="left"
                    spacing={2}
                  >
                    {coinBalancePackages && coinBalancePackages.data && coinBalancePackages.data.length > 0 &&
                      coinBalancePackages.data.map((coinBalancePackage: CoinBalancePackagesDeatilModel, index: number) => (
                        <Grid key={index} size={{ xs: 12, md: 4 }} >
                          <ItemExchange
                            myCoin={myCoin}
                            coinBalancePackage={coinBalancePackage}
                            onClick={
                              () => {
                                // console.log("onClick", coinBalancePackage)

                                setFieldValue('coin', coinBalancePackage && coinBalancePackage.coin ? coinBalancePackage.coin : 0)
                                // setCoinBalancePackagesDeatil(coinBalancePackage)
                                // handleActionOpen()
                              }
                            }
                          />
                        </Grid>
                      ))}
                  </Grid>
                </Container>
              </Grid> */}
            </Grid>

          </form>
        )
        }
      </Formik>

    </>
  );
}

export default WithdrawCoinFromDetails;
