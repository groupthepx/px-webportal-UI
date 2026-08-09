'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery, useGetRewardHistoryQuery } from '@/lib/features/profile';
import { Box, Button, Container, Fade, Typography, useTheme, } from '@mui/material';
import Grid from '@mui/material/Grid2';

import { useParams, useRouter } from 'next/navigation';

import { LoadingDialog } from '@/components/Loading';

import CoinManagementTable from './Table';
import { FC, use } from 'react';
import { decrypt } from '@/utils/encryption';


interface Props {
  params: any | null
}

const HistoryPage: FC<Props> = ({
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
  const { data: overviewDetailById, isLoading: isLoadingOverviewDetailById, refetch: refetchOverviewDetailById } = useGetMemberOverviewDetailByIdQuery(
    { id: `${memberParamsId}`, organizationId: ParamsId },
    { skip: ParamsId === '0' || memberParamsId === '0' }
  );
  const { data: memberById, isLoading: isLoadingMemberById } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === '0' }
  );
  const memberDetail = memberById && memberById.data ? memberById.data : null


  const memberId = memberDetail && memberDetail.member_id ? `${memberDetail.member_id}` : '0';




  const { data: rewardHistoryById,
    error: errorCouponListAll,

    isLoading: isLoadingRewardHistoryById } = useGetRewardHistoryQuery(
      { id: `${memberParamsId}`, organization_id: ParamsId },
      { skip: memberParamsId === '0' || ParamsId === '0' }
    );


 const member_Organization = memberDetail && memberDetail.member_organization ? memberDetail.member_organization : null;

  return (

    <>
      <LoadingDialog open={isLoadingOverviewDetailById || isLoadingMemberById || isLoadingRewardHistoryById} />

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
                  <PageHeader textHeader='รายระเอืยดผู้ใช้ / ประวัติยอดการปิดยอด' />
                </div>
              </Fade>
            </Grid>
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
                    <Grid size={12} >
                      <Box
                        display={'flex'}
                        justifyContent={'space-between'}
                        alignItems={'center'}
                      >
                        <Box sx={{ pl: 2 }}>
                          <Typography color='primary' variant="h2" component="h2" gutterBottom>
                            {memberDetail?.nick_name}
                          </Typography>
                          <Typography variant='subtitle2' gutterBottom>
                            User PX:  {memberDetail?.user_px}
                          </Typography>
                          <Typography variant='subtitle2' gutterBottom>
                            รหัสผู้แนะนำ:   {memberDetail?.refer_id ? memberDetail?.refer_id : 'ไม่มี'}
                          </Typography>
                        </Box>

                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }} textAlign={'left'} >
                      <Container
                        sx={{
                          width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                          maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                          padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                          margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
                        }}

                      >
                        <Typography color='primary' variant='h3' gutterBottom>
                          ประวัติยอดการปิดยอด
                        </Typography>
                      </Container>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <CoinManagementTable
                        rewardHistoryById={rewardHistoryById}
                        errorCouponListAll={errorCouponListAll}
                            organizationParamsId={ParamsId}
                        member_Organization={member_Organization}
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

export default HistoryPage;
