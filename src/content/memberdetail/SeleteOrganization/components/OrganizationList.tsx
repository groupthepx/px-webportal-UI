/**
 * Organization List Component
 * แสดงรายการ organizations ทั้งหมด
 * ใช้ memoization เพื่อป้องกัน re-render
 */

import { FC, memo, useMemo } from 'react';
import { Container, Typography, Fade, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import OrganizationCard from './OrganizationCard';
import { MemberWalletNonOrg, MemberOrganization } from '@/model/member';

interface WalletItem {
  organization_id: string | number;
  wallet: {
    coin: number;
    balance: number;
  };
}

interface OrganizationListProps {
  organizations: MemberOrganization[];
  walletData?: WalletItem[];
  walletNonOrgData?: MemberWalletNonOrg[];
  isVJMember: boolean;
}

const OrganizationList: FC<OrganizationListProps> = memo(
  ({ organizations, walletData, walletNonOrgData, isVJMember }) => {
    // Filter active organizations with memoization
    const activeOrganizations = useMemo(() => {
      return organizations.filter((org) => org.is_active === true);
    }, [organizations]);

    // Create a lookup map for wallet data
    const walletMap = useMemo(() => {
      const map = new Map<string | number, number>();

      if (isVJMember) {
        walletData?.forEach((wallet) => {
          map.set(wallet.organization_id, wallet.wallet?.coin ?? 0);
        });
      } else {
        // For non-VJ members, sum all wallet coins since we can't match to specific organizations
        const totalCoins = walletNonOrgData?.reduce((total, wallet) => total + (wallet.wallet?.coin ?? 0), 0) ?? 0;
        // Store the total with a special key for non-VJ members
        map.set('non-vj-total', totalCoins);
      }

      return map;
    }, [walletData, walletNonOrgData, isVJMember]);

    // Get coin amount for organization
    const getCoinAmount = (organizationId: string | number): number => {
      if (isVJMember) {
        return walletMap.get(organizationId) ?? 0;
      } else {
        // For non-VJ members, return the total coins for all organizations
        return walletMap.get('non-vj-total') ?? 0;
      }
    };

    if (activeOrganizations.length === 0) {
      return null;
    }

    return (
      <>
        {/* Header */}
        <Grid size={12}>
          <Container
            sx={{
              width: '100%',
              maxWidth: 'lg',
              padding: { xs: '5px', md: '16px' },
              margin: 'auto',
            }}
          >
         <Box>
                        <Typography
                          variant="h2"
                          component="h2"
                          sx={{
                            fontWeight: 700,
                            color: 'text.primary',
                            mb: 1,
                            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' }
                          }}
                        >
                          รายการบริษัท
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ fontSize: { xs: '0.875rem', md: '1rem' } }}
                        >
                          จัดการข้อมูลบริษัทและการเป็นสมาชิก
                        </Typography>
                      </Box>
          </Container>
        </Grid>

        {/* Organization Cards */}
        <Grid size={{ md: 12 }} mb={5}>
          <Container
            sx={{
              width: '100%',
              maxWidth: 'lg',
              padding: { xs: '0', md: '16px' },
              margin: 'auto',
            }}
          >
            <Fade in={true} timeout={1000}>
              <div>
                <Grid
                  sx={{
                    px: { md: 4, sm: 2, xs: 1 },
                  }}
                  container
                  direction="row"
                  justifyContent="left"
                  alignItems="stretch"
                  spacing={1}
                >
                  {activeOrganizations.map((organization) => (
                    <Grid
                      key={organization.organization_id}
                      size={{
                        xs: 12,
                        sm: 12,
                        md: 4,
                      }}
                    >
                      <OrganizationCard
                        organization={organization}
                        coinAmount={getCoinAmount(organization.organization_id)}
                      />
                    </Grid>
                  ))}
                </Grid>
              </div>
            </Fade>
          </Container>
        </Grid>
      </>
    );
  }
);

OrganizationList.displayName = 'OrganizationList';

export default OrganizationList;

