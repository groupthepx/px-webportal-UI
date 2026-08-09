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

const PxFriendPage: FC<Props> = ({
  params
}) => {

 
  return (

    <>
      <LoadingDialog open={false} />

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
                  <PageHeader textHeader='รายระเอืยดผู้ใช้ / เพื่อนที่แนะนำ' />

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
                              เพื่อนที่แนะนำ
                            </Typography>
                          </Box>

                        </Box>

                      </Container>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <WithdrawHistoryTable
                     
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

export default PxFriendPage;
