import { FC } from 'react';
import { Box, Card, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Boxdata from '@/components/Boxdata';
import { format } from "date-fns";

import Label from '@/components/Label';
import CustomButton from '@/components/CustomButton';
import { Check, Close, CurrencyExchangeOutlined } from '@mui/icons-material';
import { WithdrawRequestListModel } from '@/model/withdraw_request';
// import { useGetOrganizationListAllQuery } from '@/lib/features/organization';


interface Props {
  withdrawListAll: WithdrawRequestListModel | null
  errorusermemberList: any
  organizationData: any
  // SetMethodStatusAction: any
  // setMemberDetail: any
  // handleOpenDialog: any
  // handleOpenDialogPayment  : any
  memberType : boolean
}


const WithdrawHistoryTable: FC<Props> = ({
  withdrawListAll,
  errorusermemberList,
  organizationData,
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
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: 'transparent',
                      }}>
                      <TableCell className='whitespace-nowrap' align="left">{t('วันที่ร่องขอ')}</TableCell>
                    {!memberType &&  <TableCell className='whitespace-nowrap' align="left">{t('บริษัท')}</TableCell> }  
                      <TableCell className='whitespace-nowrap' align="left">{t('ยอดถอน (THB)')}</TableCell>

                      <TableCell className='whitespace-nowrap' align="left">{t('สถานะการถอน')}</TableCell>

                      <TableCell className='whitespace-nowrap' align="left">{t('เหตุผลการปฏิเสธ')}</TableCell>

                      {/* <TableCell align="left">{t('จัดการ')}</TableCell> */}

                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      (errorusermemberList) || withdrawListAll && withdrawListAll.data.length === 0 ? (
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
                        withdrawListAll && withdrawListAll.data.map((item, index) => {
                          return (
                            <TableRow hover key={index}>
                              <TableCell className='whitespace-nowrap' align="left" >
                                <Typography variant='subtitle1' >
                                  {item.created_at ? `${format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss")}` : 'N/A'}
                                </Typography>
                              </TableCell>
                              {!memberType &&     <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='h4'  >   {organizationData?.find((items: any) => `${items.organization_id}` === `${item?.organization_id}`).company_name ||
                                ''}  </Typography></TableCell> }  




                              {/* <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='h4'  >   {item?.created_by?.organization_id && organization ? organization.find((org: any) => org.organization_id === item?.created_by?.organization_id)?.company_name : 'N/A'} </Typography></TableCell> */}

                              <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='h4'  >   {item?.withdraw_count.toLocaleString()} </Typography></TableCell>



                              <TableCell align="left" className='whitespace-nowrap' >
                                <Typography variant='subtitle1'>
                                  {item.status === 'success' ? <Label color='success'>อนุมัติแล้ว</Label>
                                    : item.status === 'pending' ? <Label color='warning'>รอดำเนินการ</Label>
                                      : item.status === 'wait_payment' ? <Label color='info'>รอชำระเงิน</Label>
                                        : item.status === 'reject' ? <Label color='error'>ถูกปฏิเสธ</Label> : ''}
                                </Typography>
                              </TableCell>
                              <TableCell align="left" className='whitespace-nowrap' >   <Typography variant='subtitle1'  >   {item.status === 'reject' ? item?.description : ''} </Typography></TableCell>
                              





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
