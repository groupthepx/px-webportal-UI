/**
 * SeleteOrganization Page Component (Refactored)
 * 
 * ปรับปรุง Performance และ Code Quality:
 * - แยก component ออกเป็นส่วนย่อยๆ
 * - ใช้ custom hooks สำหรับ wallet calculations
 * - เพิ่ม memoization เพื่อป้องกัน re-render ที่ไม่จำเป็น
 * - ลด inline styles
 * - ใช้ shared styled components
 */

import { FC, memo } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { MemberDataDetailModel } from '@/model/member';
import { useWalletCalculations } from '../Card/shared/hooks';
import HeaderSection from './components/HeaderSection';
import OrganizationList from './components/OrganizationList';

interface Props {
  memberById: MemberDataDetailModel;
  setOpenActionEdit: (open: boolean) => void;
  coutPxMarketProductHistoryData: number;
}

const SeleteOrganizationPage: FC<Props> = memo(
  ({ memberById, setOpenActionEdit, coutPxMarketProductHistoryData }) => {
    // Extract member data
    const memberDetail = memberById?.data ?? null;
    const walletData = memberDetail?.member_wallet;
    const walletNonOrgData = memberDetail?.member_wallet_non_org;

    // Calculate wallet totals using custom hook
    const { totalPxCoin, totalWalletBalance } = useWalletCalculations(walletData, walletNonOrgData);

    // Check if member is VJ
    const isVJMember = memberDetail?.member_type === 'vj_member';

    // member_wallet_non_org

    return (
      // <Box
      //   sx={{
      //     position: 'relative',
      //     zIndex: 5,
      //     display: 'block',
      //     flex: 1,
      //     backgroundColor: '#F7F8F9',
      //   }}
      // >
        <Box display="block">
          <Grid justifyContent="center" alignItems="center" container display={'block'}>
            {/* Header Section: Information Member + Wallet Details */}
            <HeaderSection
              member={memberDetail}
              setOpenActionEdit={setOpenActionEdit}
              totalWalletBalance={totalWalletBalance}
              totalPxCoin={totalPxCoin}
              coutPxMarketProductHistoryData={coutPxMarketProductHistoryData}
            />

            {/* Organization List: Show for all members */}
            {memberDetail?.member_organization && (
              <OrganizationList
                organizations={memberDetail.member_organization}
                walletData={walletData}
                walletNonOrgData={walletNonOrgData}
                isVJMember={isVJMember}
              />
            )}
          </Grid>
        </Box>
      // </Box>
    );
  }
);

SeleteOrganizationPage.displayName = 'SeleteOrganizationPage';

export default SeleteOrganizationPage;

