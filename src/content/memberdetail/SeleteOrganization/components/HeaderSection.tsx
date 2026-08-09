/**
 * Header Section Component
 * แสดง Information Member และ Wallet Details
 */

import { FC, memo } from 'react';
import { Container, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import InformationMember from '../../Card/InformationMember';
import WalletDetails from '../WalletAll';
import { CardBorderBottom } from '../../Card/shared/StyledComponents';
import { MemberDetailModel } from '@/model/member';

interface HeaderSectionProps {
  member: MemberDetailModel | null;
  setOpenActionEdit: (open: boolean) => void;
  totalWalletBalance: number;
  totalPxCoin: number;
  coutPxMarketProductHistoryData: number;
}

const HeaderSection: FC<HeaderSectionProps> = memo(
  ({
    member,
    setOpenActionEdit,
    totalWalletBalance,
    totalPxCoin,
    coutPxMarketProductHistoryData,
  }) => {
    const theme = useTheme();

    return (
      <Grid justifyContent="left" alignItems="center" container>
        <Grid size={{ md: 12 }}>
          <Container
            sx={{
              width: '100%',
              maxWidth: 'lg',
              padding: { xs: '0', md: '16px' },
              margin: 'auto',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Information Member Card */}
              <CardBorderBottom
                className="col-span-1 md:col-span-2 m-2 md:m-0"
                sx={{
                  borderBlockColor: theme.palette.primary.main,
                }}
              >
                <InformationMember
                  member={member}
                  setOpenActionEdit={setOpenActionEdit}
                />
              </CardBorderBottom>

              {/* Wallet Details Card */}
              <CardBorderBottom
                className="col-span-1 md:col-span-1 m-2 md:m-0"
                sx={{
                  borderBlockColor: theme.palette.primary.main,
                }}
              >
                <WalletDetails
                  walletBalance={totalWalletBalance}
                  pxCoin={totalPxCoin}
                  friendBonus={0}
                  marketPoints={coutPxMarketProductHistoryData}
                  kycVerifications={member?.kyc_verification}
                />
              </CardBorderBottom>
            </div>
          </Container>
        </Grid>
      </Grid>
    );
  }
);

HeaderSection.displayName = 'HeaderSection';

export default HeaderSection;

