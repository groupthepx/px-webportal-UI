'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Autocomplete, Avatar, Box, Button, Container, Fade, TextField, Typography, useTheme, } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { usePostProgressvdoMutation } from '@/lib/features/video';
import { FC, use, useEffect, useMemo, useState } from 'react';
import WalletDetails from './Wallet';
import { AccountBalanceWalletOutlined, FileDownloadOutlined } from '@mui/icons-material';
import ButtonPrimary from '@/components/ButtonPrimary';
import { useParams, useRouter } from 'next/navigation';
import { useGetWithdrawListAllQuery } from '@/lib/features/withdraw';
import { LoadingDialog } from '@/components/Loading';
import WithdrawHistoryTable from './Table';
import { decrypt, encrypt } from '@/utils/encryption';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';
import { OrganizationDetailModel } from '@/model/organization';


interface Props {
  params: any | null
}

const WithdrawMoneyPage: FC<Props> = ({
  params
}) => {

  const { id } = useParams();

  const resolvedParams: any = id ? use(params) : null;
  const ParamsId = resolvedParams && resolvedParams.id ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}` : '0';



  const theme = useTheme();
  const router = useRouter();



  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
  );
  const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';

  const { data: memberById, isLoading: isLoadingMemberById } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === '0' }
  );
  const memberDetail = memberById && memberById.data ? memberById.data : null


  const memberId = memberDetail && memberDetail.member_id ? `${memberDetail.member_id}` : '0';


  const [organizationId, setOrganizationId] = useState<string>('');
  const { data: withdrawListAll, isLoading: isLoadingwithdrawListAll,
    error: errorusermemberList
  } = useGetWithdrawListAllQuery({
    status: '',
    date: '',
    created_by_id: memberId,
    organization_id: organizationId ? `${organizationId}` : '',
  },
    { skip: memberId === '0' }
  );

  const { data: overviewDetailById, isLoading: isLoadingOverviewDetailById, refetch: refetchOverviewDetailById } = useGetMemberOverviewDetailByIdQuery(
    { id: `${memberParamsId}`, organizationId: organizationId },
    { skip: organizationId === '0' || memberParamsId === '0' }
  );



  const { data: organizationListAll,
  } = useGetOrganizationListAllQuery();
  const coinData = memberById && memberById.data && memberById.data.member_wallet ? memberById.data.member_wallet : [];
  const organizationData = organizationListAll?.data?.filter((item: any) => item.is_active === true)

  // 1. Extract all organization_ids from coinData
  const coinOrgIds = coinData.map((c: any) => c.organization_id);

  // 2. Filter organizationData to only those whose organization_id appears in coinOrgIds
  const filteredOrgs = organizationData && organizationData.filter((org: OrganizationDetailModel) =>
    coinOrgIds.includes(org.organization_id)
  );

  useEffect(() => {
    if (ParamsId !== '0') {
      setOrganizationId(ParamsId);
    }
  }, [ParamsId]);

  const Wallet = coinData && coinData.find((c: any) => c.organization_id === ParamsId)

  const myWallet = Wallet ? Wallet.wallet.balance : 0;


  const memberType = memberById?.data?.member_type === "general_member" || '';







  return (

    <>
      <LoadingDialog open={isLoadingOverviewDetailById || isLoadingMemberById || isLoadingwithdrawListAll} />

      <Box
        sx={{
          position: 'relative',
          zIndex: 5,
          display: 'block',
          flex: 1,
        }}
      >

        <Box display="block">
          <Grid sx={{ backgroundColor: '#F7F8F9' }} justifyContent="left" alignItems="center" container>
            <Grid mt={1} size={{ xs: 12 }}>
              <Fade in={true} timeout={1000}>

                <div>
                  <PageHeader textHeader='รายระเอืยดผู้ใช้ / การถอนเงิน' />

                </div>



              </Fade>
            </Grid>
            <Grid size={{ xs: 12 }} mb={{ xs: 2, md: 5 }}>
              <Fade in={true} timeout={1000}>
                <div >
                  <Grid
                    sx={{
                      px: { xs: 2, md: 4 }
                    }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={{ xs: 1, md: 2 }}
                  >
                    <Grid size={12} >
                      <Box
                        display={'flex'}
                        flexDirection={{ xs: 'column', md: 'row' }}
                        justifyContent={'space-between'}
                        alignItems={{ xs: 'flex-start', md: 'center' }}
                        gap={{ xs: 2, md: 0 }}
                      >
                        <Box sx={{ pl: { xs: 1, md: 2 } }}>
                          <Typography
                            color='primary'
                            variant="h2"
                            component="h2"
                            gutterBottom
                            sx={{
                              fontSize: { xs: '1.5rem', md: '2rem' }
                            }}
                          >
                            {memberDetail?.nick_name}
                          </Typography>
                          <Typography
                            variant='subtitle2'
                            gutterBottom
                            sx={{
                              fontSize: { xs: '0.75rem', md: '0.875rem' }
                            }}
                          >
                            {/* User ID:  {memberDetail?.user_id} */}
                            User PX: {memberDetail?.user_px}
                            {/* User ID:  {memberDetail?.user_id} */}
                          </Typography>
                          <Typography
                            variant='subtitle2'
                            gutterBottom
                            sx={{
                              fontSize: { xs: '0.75rem', md: '0.875rem' }
                            }}
                          >
                            รหัสผู้แนะนำ:   {memberDetail?.refer_id ? memberDetail?.refer_id : 'ไม่มี'}
                          </Typography>

                   


                        </Box>
                        <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                          <Button
                            onClick={() => { router.push('/profile/withdraw_money/account_bank') }}
                            variant="outlined"
                            startIcon={<AccountBalanceWalletOutlined />}
                            fullWidth={true}
                            size="small"
                            sx={{
                              borderWidth: '2px',
                              color: theme.colors.gradients.primaryHover,
                              borderColor: theme.colors.gradients.primaryHover,
                              fontSize: { xs: '0.75rem', md: '0.875rem' },
                              px: { xs: 2, md: 3 },
                              py: { xs: 1, md: 1.5 },
                              '&:hover': {
                                borderWidth: '2px',
                                borderColor: theme.colors.gradients.primary,
                                backgroundColor: theme.colors.gradients.primary,
                              }
                            }}
                          >
                            {'ข้อมูลบัญชีธนาคาร'}
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={{ xs: 1, md: 2 }}
                      >
                        <Grid size={{ xs: 12, md: 4 }} >
                          <WalletDetails overviewDetailById={overviewDetailById} ParamsId={organizationId} coinData={coinData}     memberData={memberById} />
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} textAlign={'left'} >
                      <Container
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: 'lg',
                          padding: { xs: '0', md: '0px' },
                          margin: { xs: '0', sm: 'auto' }
                        }}

                      >
                        <Box
                          display={'flex'}
                          flexDirection={{ xs: 'column', md: 'row' }}
                          justifyContent={'space-between'}
                          alignItems={{ xs: 'flex-start', md: 'center' }}
                          gap={{ xs: 2, md: 0 }}
                        >
                          <Box sx={{ pl: { xs: 1, md: 2 } }}>
                            <Typography
                              color='primary'
                              variant='h3'
                              gutterBottom
                              sx={{
                                fontSize: { xs: '1.25rem', md: '1.5rem' }
                              }}
                            >
                              ประวัติการถอน
                            </Typography>
                          </Box>
                          <Box sx={{ pl: { xs: 1, md: 2 }, width: { xs: '100%', md: 'auto' } }}>
                            <ButtonPrimary
                              fullWidth
                              size="small"
                              startIcon={<FileDownloadOutlined />}
                              onClick={
                                () => {


                                  const encryptedId = organizationId && encrypt(organizationId.toString());

                                  // console.log('encryptedId', encryptedId);
                                  // router.push(`/profile/withdraw_money/report/${encryptedId}`)
                                  window.open(`/profile/withdraw_money/report/${encryptedId}`, '_blank');

                                }
                              }
                              text='ดาวน์โหลดรายงานการถอนเงิน'
                              sx={{
                                fontSize: { xs: '0.75rem', md: '0.875rem' },
                                px: { xs: 2, md: 3 },
                                py: { xs: 1, md: 1.5 },
                              }}
                            />
                          </Box>
                        </Box>

                      </Container>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <WithdrawHistoryTable
                        withdrawListAll={withdrawListAll}
                        errorusermemberList={errorusermemberList}
                        organizationData={organizationData}
                        memberType={memberType ? true : false}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
}

export default WithdrawMoneyPage;
