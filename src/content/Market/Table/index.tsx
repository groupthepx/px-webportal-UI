import { FC } from 'react';
import { Box, Card, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Boxdata from '@/components/Boxdata';
import { format } from "date-fns";
import Image from "next/image";
import Label from '@/components/Label';

import { PXProductHistoryModel } from '@/model/px_product_history';
import CountUp from 'react-countup';
import { PxMarketProductModel } from '@/model/px_market_product';


interface Props {
  pxMarketProductHistory: PXProductHistoryModel | null
  errorusermemberList: any
  organizationData: any
  ProductList: PxMarketProductModel
  memberId: string
  organizationId: string
  memberType: boolean
  // SetMethodStatusAction: any
  // setMemberDetail: any
  // handleOpenDialog: any
  // handleOpenDialogPayment  : any
}


const WithdrawHistoryTable: FC<Props> = ({
  pxMarketProductHistory,
  errorusermemberList,
  organizationData,
  ProductList,
  memberId,
  organizationId,
  memberType
  // SetMethodStatusAction,
  // setMemberDetail,
  // handleOpenDialog,
  // handleOpenDialogPayment
  // setBlogDetail,
  // handleActionOpenPreview,
  // handleOpenConfirmDelete,
  // handleActionOpen,
  // SetMethodAction,
}) => {
  // const isMountedRef = useRefMounted();
  const theme = useTheme();

  const { t }: { t: any } = useTranslation();

  const ProductDetailList = ProductList && ProductList.data;

  return (
    <>
      <Container
        sx={{
          width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
          maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
          padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
          margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
        }}

      >
        <Card>
          {(
            <>
              <TableContainer
                sx={{
                  overflowX: 'auto', // Enable horizontal scrolling
                  '@media (max-width: 600px)': {
                    maxWidth: '100vw'
                  }
                }}
              >
                <Table
                  sx={{
                    minWidth: { xs: '100%', sm: 650 }, // Minimum width for different breakpoints
                    '& .MuiTableCell-root': {
                      px: { xs: 1, sm: 2, md: 3 }, // Responsive padding
                      py: { xs: 1, sm: 1.5, md: 2 }, // Responsive padding
                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' } // Responsive font size
                    }
                  }}
                >
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: 'transparent',
                        '& .MuiTableCell-head': {
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },
                          fontWeight: 'bold'
                        }
                      }}>
                      <TableCell align="left">#</TableCell>
                      <TableCell align="left">{t('วันเวลา')}</TableCell>
                      {!memberType && <TableCell align="left">{t('บริษัท')}</TableCell>}
                      <TableCell align="left">{t('ชื่อสินค้า')}</TableCell>
                      <TableCell align="left">{t('รูปภาพปก')}</TableCell>
                      <TableCell align="left">{t('แลกด้วย')}</TableCell>
                      <TableCell align="left">{t('สถานะ')}</TableCell>

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      (errorusermemberList) || pxMarketProductHistory && pxMarketProductHistory
                        .data
                        .filter((item: any) => memberType ? item.buy_by_id === memberId : item.buy_by_id === memberId && organizationId ? item.organization_id === organizationId : !organizationId ? true : false)
                        .length === 0 ? (
                        <TableRow hover >
                          <TableCell colSpan={8} className='whitespace-nowrap' align="left" >
                            <Typography
                              sx={{
                                py: 10,
                              }}
                              variant="h6"
                              fontWeight="normal"
                              color="text.secondary"
                              align="center"
                            >
                              <Boxdata />
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) :
                        pxMarketProductHistory && pxMarketProductHistory.data
                          .filter((item: any) => item.buy_by_id === memberId)
                          .map((item, index) => {
                            return (
                              <TableRow hover key={index}>
                                <TableCell className='whitespace-nowrap' align="left" >
                                  <Typography variant='subtitle1' >
                                    {index + 1}
                                  </Typography>
                                </TableCell>
                                <TableCell className='whitespace-nowrap' align="left" >
                                  <Typography variant='subtitle1' >
                                    {item.created_at ? `${format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss")}` : 'N/A'}
                                  </Typography>
                                </TableCell>


                                {!memberType && <TableCell align="left" className='whitespace-nowrap' >
                                  <Typography    >  {organizationData && organizationData?.find((items: any) =>
                                    `${items.organization_id}` === `${item?.organization_id}`).company_name || ''}   </Typography></TableCell>}

                                <TableCell
                                  align="left"


                                  sx={{
                                    whiteSpace: { xs: 'normal', sm: 'auto' },
                                    '& .MuiTypography-root': {
                                      fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                                    }

                                  }}
                                >
                                  <Typography color='primary' variant='h4'>
                                    {ProductDetailList && ProductDetailList.find((product: any) => product.product_id === item.product_id)?.product_name || ''}
                                  </Typography>
                                </TableCell>
                                <TableCell align="left"  >

                                  <Box
                                    component="img"
                                    sx={{
                                      height: 75, // Adjust the height as needed
                                      width: 100,  // Adjust the width as needed
                                      marginRight: 2,
                                    }}
                                    src={ProductDetailList && ProductDetailList.find((product: any) => product.product_id === item.product_id)?.product_img ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + ProductDetailList.find((product: any) => product.product_id === item.product_id)?.product_img : ''}
                                  // alt={fileImages.name}
                                  />

                                </TableCell>





                                {/* <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='h4'  >   {item?.created_by?.organization_id && organization ? organization.find((org: any) => org.organization_id === item?.created_by?.organization_id)?.company_name : 'N/A'} </Typography></TableCell> */}

                                <TableCell align="left" className='whitespace-nowrap' >
                                  {item.pay_currency === 'points' ? (
                                    <Box display="flex" alignItems="center" sx={{ gap: 0.5 }}>
                                      <Typography variant="h4" sx={{ fontWeight: 800, color: '#16a34a' }}>
                                        <CountUp end={item.points_used || 0} duration={1.5} separator="," />
                                      </Typography>
                                      <Typography variant="subtitle2" sx={{ color: '#16a34a', fontWeight: 700 }}>คะแนน</Typography>
                                    </Box>
                                  ) : (
                                    <Box
                                      display="flex"
                                      alignItems="center" >
                                      <Box mr={1}>
                                        <Image src={'/assets/svg/pg/PX_Coin.svg'} width={24} height={24} alt={'PX Coin'} />
                                      </Box>
                                      <Typography
                                        variant="h4"
                                        sx={{
                                          ml: 1,
                                          background: `${theme.colors.gradients.primary}`,
                                          WebkitBackgroundClip: 'text',
                                          WebkitTextFillColor: 'transparent'
                                        }}
                                      >
                                        <CountUp end={ProductDetailList && ProductDetailList.find((product: any) => product.product_id === item.product_id)?.product_price || 0} duration={1.5} separator="," suffix={''} />
                                      </Typography>
                                    </Box>
                                  )}
                                </TableCell>


                                <TableCell align="left" className='whitespace-nowrap' >
                                  <Typography variant='subtitle1'>
                                    {item.order_status === 'CONFIRMED' ? <Label color='secondary'>บรรจุเรียบร้อย</Label>
                                      : item.order_status === 'PENDING' ? <Label color='warning'>รอดำเนินการ</Label>
                                        : item.order_status === 'SHIPPED' ? <Label color='info'>จัดส่งแล้ว</Label>
                                          : item.order_status === 'DELIVERED' ? <Label color='success'>ได้รับแล้ว</Label>
                                            : item.order_status === 'CANCELLED' ? <Label color='error'>ถูกยกเลิก</Label> : ''}
                                  </Typography>
                                </TableCell>
                                {/* <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='subtitle1'  >   {item.status === 'reject' ? item?.description : ''} </Typography></TableCell> */}
                                {/* <TableCell align="left" className='whitespace-nowrap' >
                              {item.status != 'success' && item.status != 'wait_payment' ? <>


                                <CustomButton text="อนุมัต" variant="approve" startIcon={<Check />} onClick={() => {
                                  SetMethodStatusAction("wait_payment")
                                  setMemberDetail(item)
                                  handleOpenDialog()
                                }} />
                                {item.status != 'reject' ?
                                  <CustomButton text="ปฏิเสธ" variant="reject" startIcon={<Close />} onClick={() => {
                                    SetMethodStatusAction("reject")
                                    setMemberDetail(item)
                                    handleOpenDialog()
                                  }} />
                                  : ''}

                              </> : ''}

                              {item.status === 'wait_payment' ? <>
                                <CustomButton text="ชำระเงิน" variant="password" startIcon={<CurrencyExchangeOutlined />} onClick={() => {
                                  // SetMethodStatusAction("success")
                                  // setMemberDetail(item)
                                  // handleOpenDialog()
                                  SetMethodStatusAction("success")
                                  handleOpenDialogPayment()
                                  setMemberDetail(item)
                                }} />

                              </> : ''}
                            </TableCell> */}





                              </TableRow>
                            );
                          })}
                  </TableBody>
                </Table>
              </TableContainer>
              {/* <Box p={2}>
                  <TablePagination
                    component={"div"}
                    count={roleAll && roleAll.pagination && roleAll.pagination.totalItems ? roleAll.pagination.totalItems : 0}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleLimitChange}
                    page={page}
                    rowsPerPage={limit}
                    rowsPerPageOptions={[5, 25, 50, 100, 250]}
                  />
                </Box> */}
            </>
          )}
        </Card>

      </Container>
    </>
  );
}

export default WithdrawHistoryTable;
