'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Autocomplete, Avatar, Box, Button, Container, Fade, TextField, Typography, useTheme, } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { FC, use, useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';
import { useGetWithdrawListAllQuery } from '@/lib/features/withdraw';
import { LoadingDialog } from '@/components/Loading';
import WithdrawHistoryTable from './Table';
import { decrypt } from '@/utils/encryption';
import { useGetOrganizationListAllQuery } from '@/lib/features/organization';
import { OrganizationDetailModel } from '@/model/organization';
import { AccountBalanceWalletOutlined } from '@mui/icons-material';
import { useGetPxMarketProductHistoryListAllQuery, useGetPxMarketProductListAllQuery } from '@/lib/features/px_market_product';


interface Props {
  params: any | null
}

const MarketHistoryPage: FC<Props> = ({
  params
}) => {

  const { id } = useParams();

  const resolvedParams: any = id ? use(params) : null;
  const ParamsId = resolvedParams && resolvedParams.id ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}` : '0';

  const { data: ProductList, isLoading } = useGetPxMarketProductListAllQuery();


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

  const memberType = memberDetail && memberDetail.member_type === "general_member" || '';




  const memberId = memberDetail && memberDetail.member_id ? `${memberDetail.member_id}` : '0';


  const [organizationId, setOrganizationId] = useState<string>('');
  const { data: pxMarketProductHistory, isLoading: isLoadingPxMarketProductHistory,
    error: errorusermemberList
  } = useGetPxMarketProductHistoryListAllQuery({
    status: '',
    // date: '',
    // created_by_id: memberId,
    // organization_id: organizationId ? `${organizationId}` : '',
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
  return (

    <>
      <LoadingDialog open={isLoadingOverviewDetailById || isLoadingMemberById || isLoadingPxMarketProductHistory || isLoading} />

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
            <Grid mt={1} size={{ md: 12 }}>
              <Fade in={true} timeout={1000}>

                <div>
                  <PageHeader textHeader='รายระเอืยดผู้ใช้ / การแลกของรางวัล' />

                </div>



              </Fade>
            </Grid>

            {!memberType &&
              <Grid size={12} >


                <Container
                  sx={{
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                    maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                    padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                    margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
                  }}

                >
                  <Box sx={{ pl: 2, m: 2 }}>
                    <Autocomplete
                      sx={{ mt: 1, width: 300 }}
                      autoHighlight

                      value={
                        organizationData?.find((item: any) => `${item.organization_id}` === `${organizationId}`) ||
                        null
                      }
                      onChange={(_event, newValue: any) => {
                        setOrganizationId(newValue?.organization_id ? `${newValue?.organization_id}` : '')
                      }}
                      getOptionLabel={(option) => option.company_name || ''}
                      options={memberType ? organizationData?.filter((item: any) => item.is_active === true) : filteredOrgs?.filter((item: any) => item.is_active === true) || []}
                      renderOption={(props, option) => (
                        <Box
                          component="li"
                          {...props}
                          key={option.organization_id}
                          display="flex"
                          alignItems="flex-end"
                          justifyContent="space-between"
                        >
                          <Avatar
                            key={option.organization_id}
                            sx={{ mr: 1 }}
                            src={
                              option.company_logo
                                ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${option.company_logo}`
                                : 'https://placehold.co/500x500/EEE/31343C'
                            }
                          />
                          {/* ({option.login_name}) */}
                          {option.company_name}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          size="small"
                          placeholder={'เลือก บริษัท'}
                          name="organization_id"
                          label="บริษัท"

                        />
                      )}
                    />
                  </Box>
                </Container>



              </Grid>
            }

            <Grid size={{ md: 12 }} mb={5}>
              <Fade in={true} timeout={1000}>
                <div >
                  <Grid
                    sx={{
                      px: 4
                    }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Grid size={{ xs: 12, md: 12 }} textAlign={'left'} >
                      <Container
                        sx={{
                          width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                          maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                          padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                          margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
                        }}

                      >
                        <Box display={'flex'} justifyContent={'left'} alignItems={'left'}>
                          <Box sx={{ pl: 2 }}>
                            <Typography color='primary' variant='h3' gutterBottom>
                              ประวัติการแลกของรางวัล
                            </Typography>
                          </Box>

                        </Box>

                      </Container>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <WithdrawHistoryTable
                        pxMarketProductHistory={pxMarketProductHistory}
                        errorusermemberList={errorusermemberList}
                        organizationData={organizationData}
                        ProductList={ProductList}
                        memberId={memberId}
                        organizationId={organizationId}
                        memberType={memberType}
                      />
                    </Grid>
                  </Grid>
                </div>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Box >
    </>
  );
}

export default MarketHistoryPage;
