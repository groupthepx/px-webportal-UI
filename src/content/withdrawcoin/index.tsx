'use client';

import React, { use } from 'react';
import { Box, Container, Fade, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useInView } from 'react-intersection-observer';
import { useParams } from 'next/navigation';

import PageHeader from '@/components/PageHeader';
import WalletDetails from './Wallet';
import WithdrawCoinHistoryTable from './Table';
import OrganizationSelector from './components/OrganizationSelector';
import UserProfile from './components/UserProfile';
import { PageContainer, ContentWrapper } from './styles';
import { useWithdrawCoinData } from './hooks/useWithdrawCoinData';
import { useOrganizationSelection } from './hooks/useOrganizationSelection';
import { WithdrawCoinPageProps } from './types';
import { FADE_TIMEOUT, INTERSECTION_THRESHOLD, PAGE_HEADERS } from './constants';

/**
 * WithdrawCoinPage Component
 * หน้าหลักสำหรับการจัดการถอน Coin
 * ใช้ custom hooks และ memoization เพื่อ optimize performance
 */
const WithdrawCoinPage: React.FC<WithdrawCoinPageProps> = ({ params }) => {
  // Get params from URL
  const urlParams = useParams();
  const resolvedParams: any = urlParams?.id && params ? use(params) : null;
  const encryptedParamsId = resolvedParams?.id as string | undefined;

  // Custom hook สำหรับจัดการ organization selection
  const { selectedOrganizationId, setSelectedOrganizationId, hasSelectedOrganization } =
    useOrganizationSelection(encryptedParamsId);

  // Custom hook สำหรับดึงข้อมูล
  const {
    memberDetail,
    overviewData,
    transferData,
    availableOrganizations,
    memberId,
    memberData,
    isLoadingProfile,
    isLoadingOverview,
    transferError,

  } = useWithdrawCoinData(selectedOrganizationId);

  const memberType = memberData?.data?.member_type === "general_member" || '';



  // Intersection observer สำหรับ animation
  const { ref: landingRef } = useInView({
    triggerOnce: true,
    threshold: INTERSECTION_THRESHOLD,
  });

  return (
    <PageContainer>
      <Box display="block">
        <Grid container sx={{ backgroundColor: '#F7F8F9' }} justifyContent="left" alignItems="center">
          {/* Page Header */}
          <Grid mt={1} size={{ md: 12 }}>
            <Fade in={true} timeout={FADE_TIMEOUT}>
              <div ref={landingRef}>
                <PageHeader textHeader={PAGE_HEADERS.MAIN} />
              </div>
            </Fade>
          </Grid>

          {/* Main Content */}
          <Grid size={{ md: 12 }} mb={5}>
            <Fade in={true} timeout={FADE_TIMEOUT}>
              <div>
                <Grid
                  sx={{ px: 4 }}
                  container
                  direction="row"
                  justifyContent="center"
                  alignItems="stretch"
                  spacing={2}
                >
                  {/* Organization Selector และ User Profile */}
                  <Grid size={12}>
                    <Box
                      sx={{
                        pl: 2,
                        justifyContent: { md: 'space-between', xs: '' },
                        display: { md: 'flex', xs: '' },
                        mt: { xs: 5 },
                      }}
                    >
                      {/* Organization Selector */}

                      <Box sx={{ mt: { xs: 2 } }}>
                        {!memberType && <OrganizationSelector
                          value={selectedOrganizationId}
                          options={availableOrganizations}
                          onChange={setSelectedOrganizationId}
                          disabled={isLoadingProfile}
                        />}
                      </Box>

                      {/* User Profile Card */}
                      <Box sx={{ mt: { xs: 2 } }}>
                        <UserProfile memberDetail={memberDetail} />
                      </Box>
                    </Box>
                  </Grid>

                  {/* Wallet และ History Section */}
                  <Grid size={{ xs: 12, md: 12 }}>
                    <Grid
                      container
                      direction="row"
                      justifyContent="center"
                      alignItems="stretch"
                      spacing={2}
                    >
                      {/* Wallet Details */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <WalletDetails
                          overviewDetailById={overviewData}
                          organizationId={selectedOrganizationId}
                          isLoading={isLoadingOverview}
                          memberData={memberData}
                        />
                      </Grid>
                    </Grid>

                    {/* History Table Header */}
                    <Grid size={{ xs: 12, md: 12 }} textAlign="left">
                      <Container
                        sx={{
                          width: { xs: '100%', sm: 'auto' },
                          maxWidth: 'lg',
                          padding: { xs: '0', md: '0px' },
                          margin: { xs: '0', sm: 'auto' },
                        }}
                      >
                        <Typography color="primary" variant="h3" gutterBottom>
                          {PAGE_HEADERS.HISTORY}
                        </Typography>
                      </Container>
                    </Grid>

                    {/* History Table */}
                    <Grid size={{ xs: 12, md: 12 }}>
                      <WithdrawCoinHistoryTable
                        transferCoinBalance={transferData}
                        error={transferError}
                        memberId={memberId}
                        isLoading={isLoadingOverview && hasSelectedOrganization}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </div>
            </Fade>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default WithdrawCoinPage;
