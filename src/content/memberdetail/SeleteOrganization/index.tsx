import { MemberDataDetailModel } from "@/model/member";
import { FC } from "react";
import Grid from '@mui/material/Grid2';
import {
  alpha,
  Box,
  Card,
  Container,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import InformationMember from "../Card/InformationMember";
import WalletDetails from "./WalletAll";
import OrganizationList from "./components/OrganizationList";


const CardBorderBottom = styled(Card)(
    ({ theme }) => `
    border-bottom: 4px solid ${theme.palette.primary.main};
    border-radius: ${theme.shape.borderRadius * 2}px;
    box-shadow: 0 2px 8px ${alpha(theme.colors.alpha.black[100], 0.08)};
    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 4px 16px ${alpha(theme.colors.alpha.black[100], 0.12)};
    }
  `
);


interface Props {

    memberById: MemberDataDetailModel;
    setOpenActionEdit: any
    coutPxMarketProductHistoryData: number
}
const SeleteOrganizationPage: FC<Props> = ({
    memberById,
    setOpenActionEdit,
    coutPxMarketProductHistoryData
}): any => {


    const theme = useTheme();

    const memberDetail = memberById && memberById.data ? memberById.data : null;

    const walletData = memberDetail?.member_wallet


    const totalPxCoin = walletData?.reduce((sum, w) => {
        // each w has shape { organization_id, wallet: { coin: number, … } }
        const coin = w.wallet?.coin ?? 0;
        return sum + coin;
    }, 0) ?? 0;

    const totalWalletBalance = walletData?.reduce((sum, w) => {
        // each w has shape { organization_id, wallet: { coin: number, … } }
        const coin = w.wallet?.balance ?? 0;
        return sum + coin;
    }, 0) ?? 0;

    return (
        <>

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 5,
                    display: 'block',
                    flex: 1,
                    backgroundColor: '#F7F8F9', // Set background color to light gray
                }}
            >

                <Box display="block">
                    <Grid justifyContent="left" alignItems="center" container>
                        <Grid size={{ md: 12 }}>
                            <div>
                                <Container
                                    sx={{
                                        width: '100%',
                                        maxWidth: 'lg',
                                        padding: { xs: '0', md: '16px' },
                                        margin: 'auto'
                                    }}
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        <CardBorderBottom
                                            className="col-span-1 md:col-span-2 m-2 md:m-0"
                                            style={{
                                                borderBlockColor: `${theme.colors.primary.main}`,

                                            }}
                                        >
                                            <InformationMember member={memberDetail} setOpenActionEdit={setOpenActionEdit} />


                                        </CardBorderBottom>

                                        <CardBorderBottom
                                            className="col-span-1 md:col-span-1 m-2 md:m-0"
                                            style={{
                                                borderBlockColor: `${theme.colors.primary.main}`,

                                            }}
                                        >
                                            <WalletDetails 
                                              walletBalance={totalWalletBalance} 
                                              pxCoin={totalPxCoin} 
                                              friendBonus={0} 
                                              marketPoints={coutPxMarketProductHistoryData}
                                              kycVerifications={memberDetail?.kyc_verification}
                                            />
                                        </CardBorderBottom>
                                    </div>
                                </Container>
                            </div>
                        </Grid>

                        {/* Organization List Section */}
                        {memberDetail && memberDetail.member_type === "vj_member" && (
                            <OrganizationList
                                organizations={memberDetail.member_organization || []}
                                walletData={walletData}
                                isVJMember={true}
                            />
                        )}
                    </Grid>
                </Box >
            </Box >

        </>
    );
}

export default SeleteOrganizationPage;
