"use client";
import PageHeader from "@/components/PageHeader";
import {
  useGetMemberByIdQuery,
  useGetMemberOverviewDetailByIdQuery,
  useGetProfileByIdQuery,
} from "@/lib/features/profile";
import { Box, Container, Fade, Typography, Zoom } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useInView } from "react-intersection-observer";
import {
  useGetCoinBalancePackagesListAllQuery,
  useGetTransferCoinBalanceListAllQuery,
  useUpdateCoinBalanceTransferMutation,
  useUpdateCoinBalanceTransferNonOrgMutation,
} from "@/lib/features/coinpackage";
import ItemExchange from "./ItemExchange";
import { CoinBalancePackagesDeatilModel } from "@/model/coin_balance_packages";
import DialogCustom from "@/components/DeleteDialogCustom";
import { FC, use, useEffect, useMemo, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { LoadingDialog } from "@/components/Loading";
import WithdrawCoinFromDetails from "./From";
import { useParams } from "next/navigation";
import { decrypt } from "@/utils/encryption";
import { DEFAULT_VALUES } from "../withdrawcoin/constants";

interface Props {
  params: any | null;
}

const ExchangeCoinPage: FC<Props> = ({ params }) => {
  const { id } = useParams();

  const resolvedParams: any = id ? use(params) : null;
  const ParamsId =
    resolvedParams && resolvedParams.id
      ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}`
      : "0";

  // Define refs for each section
  const { ref: landingRef, inView: landingInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { data: ProfileById, isLoading: isLoadingProfilegById } =
    useGetProfileByIdQuery();

  const memberParamsId =
    !isLoadingProfilegById &&
    ProfileById &&
    ProfileById.data &&
    ProfileById.data.member_id
      ? `${ProfileById.data.member_id}`
      : "0";

  const {
    data: overviewDetailById,
    isLoading: isLoadingOverviewDetailById,
    refetch: refetchOverviewDetailById,
  } = useGetMemberOverviewDetailByIdQuery(
    { id: `${memberParamsId}`, organizationId: ParamsId },
    { skip: ParamsId === "0" || memberParamsId === "0" }
  );

  const {
    data: memberById,
    isLoading: isLoadingMemberById,
    refetch,
  } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === "0" }
  );

  const { data: coinBalancePackages, isLoading: isLoadingCoinBalancePackages } =
    useGetCoinBalancePackagesListAllQuery();

  const memberDetail = memberById && memberById.data ? memberById.data : null;

  const [coinBalancePackagesDeatil, setCoinBalancePackagesDeatil] =
    useState<CoinBalancePackagesDeatilModel | null>(null);

  // console.log("coinBalancePackages", coinBalancePackages)

  const [openAction, setOpenAction] = useState(false);

  const handleActionOpen = () => {
    setOpenAction(true);
  };
  const handleActionClose = () => {
    setOpenAction(false);
  };

  // const myWallet = overviewDetailById && overviewDetailById.data && overviewDetailById.data.my_wallet && overviewDetailById.data.my_wallet.wallet;

  const isVJMember = memberDetail?.member_type === "vj_member";

  // const coinBalance = useMemo(() => {
  //   if (isVJMember) {
  //     // ถ้าเป็น general_member ใช้ member_wallet_non_org
  //     const totalCoin =
  //       memberById?.data?.member_wallet?.reduce(
  //         (sum: number, walletItem: any) => {
  //           const coin = walletItem?.wallet?.coin ?? 0;
  //           return sum + coin;
  //         },
  //         0
  //       ) ?? DEFAULT_VALUES.COIN_AMOUNT;
  //     return Number.parseInt(String(totalCoin), 10);
  //   } else {
  //     // ถ้าไม่ใช่ general_member ให้ sum coins จาก member_wallet array ทั้งหมด

  //     const balance =
  //       memberById?.data?.member_wallet_non_org[0]?.wallet?.coin ||
  //       DEFAULT_VALUES.COIN_AMOUNT;
  //     return Number.parseInt(String(balance), 10);
  //   }
  // }, [overviewDetailById, isVJMember, memberById]);

  const balance = !isVJMember
    ? memberDetail?.member_wallet_non_org[0].wallet.coin
    : overviewDetailById?.data?.my_wallet?.wallet?.coin;

  const myCoin = balance || 0;

  const { refetch: refetchTransferCoinBalance } =
    useGetTransferCoinBalanceListAllQuery(
      { id: `${ParamsId}` },
      { skip: ParamsId === "0" }
    );

  const [
    updateCoinBalanceTransferComission,
    {
      isLoading: isPosting,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: errorUpdateCoinBalanceTransfer,
    },
  ] = useUpdateCoinBalanceTransferMutation();

  const [
    updateCoinBalanceTransferNonOrgComission,
    {
      isLoading: isPostingNonOrg,
      isSuccess: isPostNonOrgSuccess,
      isError: isPostNonOrgError,
      error: updatNonOrgeError,
    },
  ] = useUpdateCoinBalanceTransferNonOrgMutation();

  useEffect(() => {
    async function fetch() {
      if (isPostNonOrgSuccess) {
        await refetchOverviewDetailById();
        await refetchTransferCoinBalance();
        await refetch();
        // setPackgeListDetail(null)
        handleActionClose();
        enqueueSnackbar(`${"เพิ่มข้อมูลสำเร็จ"}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      } else if (
        //isUpdateError || isDeleteError ||
        isPostNonOrgError
      ) {
        //   console.log("updateError", updateError)

        enqueueSnackbar('เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่', {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      }
    }

    fetch();
  }, [isPostNonOrgError, isPostNonOrgSuccess]);

  useEffect(() => {
    async function fetch() {
      if (isPostSuccess) {
        await refetchOverviewDetailById();
        await refetchTransferCoinBalance();
        await refetch();
        // setPackgeListDetail(null)
        handleActionClose();
        enqueueSnackbar(`${"เพิ่มข้อมูลสำเร็จ"}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      } else if (
        //isUpdateError || isDeleteError ||
        isPostError
      ) {
        //   console.log("updateError", updateError)

        enqueueSnackbar('เกิดข้อผิดพลาดในการเพิ่มข้อมูล กรุณาลองใหม่', {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      }
    }

    fetch();
  }, [isPostError, isPostSuccess]);

  return (
    <>
      <LoadingDialog
        open={
          isLoadingCoinBalancePackages ||
          isPosting ||
          isLoadingMemberById ||
          isPostingNonOrg
        }
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 5,
          display: "block",
          flex: 1,
        }}
      >
        <Box display="block">
          <Grid
            sx={{ backgroundColor: "#F7F8F9" }}
            justifyContent="left"
            alignItems="center"
            container
          >
            <Grid mt={1} size={{ md: 12 }}>
              <Fade in={landingInView} timeout={2000}>
                <div ref={landingRef}>
                  <PageHeader textHeader="รายระเอืยดผู้ใช้ / PX Coin / Choice" />
                </div>
              </Fade>
            </Grid>
            <Grid size={{ md: 12 }} mb={5}>
              <Fade in={landingInView} timeout={2000}>
                <div>
                  <Grid
                    sx={{
                      px: 4,
                    }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                  >
                    <Grid size={{ xs: 12, md: 12 }} textAlign={"center"}>
                      <Typography color="primary" variant="h3" gutterBottom>
                        แบบฟอร์มการถอนเงิน
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 12 }}>
                      <WithdrawCoinFromDetails
                        myCoin={myCoin}
                        overviewDetailById={overviewDetailById}
                        memberById={memberById}
                        coinBalancePackages={coinBalancePackages}
                        memberParamsId={memberParamsId}
                        updateCoinBalanceTransferComission={
                          updateCoinBalanceTransferComission
                        }
                        ParamsId={ParamsId}
                        updateCoinBalanceTransferNonOrgComission={
                          updateCoinBalanceTransferNonOrgComission
                        }
                        isVJMember={isVJMember}
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
};

export default ExchangeCoinPage;
