import {

  Typography,
  Card,
  Box,
  CardActionArea,
  styled,
  useTheme,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  alpha

} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC } from 'react';
import { AccountBalanceWalletOutlined, Add, ArrowForwardOutlined, EditOutlined, MoveToInboxOutlined } from '@mui/icons-material';
import CountUp from 'react-countup';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';

import Image from "next/image";
import { OverviewDetailListModel } from '@/model/overview_detail';
import { MemberDataDetailModel } from '@/model/member';
const CardBorderBottom = styled(Card)(
  () => `
    border-bottom: transparent 5px solid;
  `
);


interface Props {


  memberById: MemberDataDetailModel
  handleActionOpen: any
  SetMethodAction: any
  setMemberDetailData: any
  handleOpen: any
}
const BankDetails: FC<Props> = ({
 
  memberById,
  SetMethodAction,
  handleActionOpen,
  setMemberDetailData,
  handleOpen
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();



  const memberDetail = memberById && memberById.data ? memberById.data : null


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


            <Box display={'flex'} sx={{ justifyContent: 'space-between', alignItems: 'center' }} >
              {/* <Typography mr={1} variant="body1" gutterBottom>
                <Image
                  src="/assets/svg/pg/wallte.svg"
                  width={30}
                  height={30}
                  alt="withdraw_money"
                />{' '}

              </Typography> */}
              <Box>
                <Typography variant="h3" gutterBottom>
                  {t('ข้อมูลบัญชีธนาคาร')}
                </Typography>
              </Box>
              <Box>
                {memberDetail && memberDetail.bank_account &&
                  <Button color='secondary' startIcon={<EditOutlined />}

                    onClick={() => {
                      setMemberDetailData(memberDetail)
                      SetMethodAction('update')
                      handleActionOpen()


                    }}
                  >
                    แก้ไข
                  </Button>}

              </Box>





            </Box>

          </Box>

          {memberDetail && memberDetail.bank_account ?
            <Grid

              container
              direction="row"
              justifyContent="center"
              alignItems="stretch"
              spacing={2}
            >
              <Grid size={{ xs: 12, md: 6 }} >
                {/* PromptPay (or any) QR Code on the left */}
                <Box
                  mr={{ xs: 0, sm: 2 }}
                  mb={{ xs: 2, sm: 0 }}
                  sx={{
                    cursor: 'pointer',
                  }}
                  display="flex"
                  justifyContent="center"
                  onClick={() => {
                    handleOpen(memberDetail.bank_account && memberDetail.bank_account.qr_img ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + memberDetail.bank_account.qr_img : '')
                  }}
                >
                  <Image
                    src={memberDetail.bank_account && memberDetail.bank_account.qr_img ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + memberDetail.bank_account.qr_img : ''}  // Replace with your actual QR code or placeholder
                    alt="PromptPay QR Code"
                    width={250}
                    height={250}
                  />
                </Box>
              </Grid>
              {/* Bank details on the right */}
              <Grid size={{ xs: 12, md: 6 }} justifyContent={'center'}  >

                <Card
                  elevation={0}

                  sx={{
                    mt: 5,
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
            </Grid>
            :
            <Box mt={2} p={10} display={'flex'} sx={{ justifyContent: 'center', alignItems: 'center' }} >
              <Button
                onClick={() => {

                  SetMethodAction('insert')
                  handleActionOpen()

                }}
                variant="outlined"
                startIcon={<Add />}
                sx={{
                  borderWidth: '2px',
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
                {'เพิ่มบัญชีธนาคาร'}
              </Button>

            </Box>}

        </Box>
      </CardBorderBottom>
    </>
  );
}

export default BankDetails;
