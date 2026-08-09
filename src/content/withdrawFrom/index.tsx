'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Avatar, Box, Button, Dialog, Fade, Slide, styled, Typography, Zoom, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useInView } from 'react-intersection-observer';
import { FC, forwardRef, ReactElement, Ref, use, useEffect, useMemo, useState } from 'react';
import WithdrawMoneyFromDetails from './From';
import { usePostWithdrawRequestsMutation, usePostWithdrawRequestsNonOranizationMutation } from '@/lib/features/withdraw';
import { enqueueSnackbar, TransitionProps } from 'notistack';
import { LoadingDialog } from '@/components/Loading';
import wait from '@/utils/wait';
import { useParams, useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { decrypt } from '@/utils/encryption';
import { DEFAULT_VALUES } from '../withdrawcoin/constants';
const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);
const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.dark};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.main};
     }
    `
);


const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});


interface Props {
  params: any | null
}

const WithdrawMoneyFromPage: FC<Props> = ({
  params
}) => {


  const { id } = useParams();

  const resolvedParams: any = id ? use(params) : null;
  const ParamsId = resolvedParams && resolvedParams.id ? `${decrypt(decodeURIComponent(resolvedParams.id as string))}` : '0';



  // Define refs for each section
  const { ref: landingRef, inView: landingInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
  );

  const router = useRouter();

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

  const [
    postWithdrawRequestsComission,
    {
      isLoading: isPosting,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: errorPostWithdraw,
    },
  ] = usePostWithdrawRequestsMutation();


  const [
    postWithdrawRequestsNonOranizationComission,
    {
      isLoading: isPostingNonOranization,
      isSuccess: isPostSuccessNonOranization,
      isError: isPostErrorNonOranization,
      error: updateErrorNonOranization,
    },
  ] = usePostWithdrawRequestsNonOranizationMutation();

  useEffect(() => {
    async function fetch() {
      if (
        isPostSuccessNonOranization
      ) {
        await refetchOverviewDetailById()


        await wait(1000);
        router.back();
        // setPackgeListDetail(null)

        enqueueSnackbar(`${'เพิ่มข้อมูลสำเร็จ'}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      } else if (
        //isUpdateError || isDeleteError ||
        isPostErrorNonOranization
      ) {


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

    fetch()

  }, [
    isPostErrorNonOranization,
    isPostSuccessNonOranization,
  ]);


  useEffect(() => {
    async function fetch() {
      if (
        isPostSuccess
      ) {
        await refetchOverviewDetailById()


        await wait(1000);
        router.back();
        // setPackgeListDetail(null)

        enqueueSnackbar(`${'เพิ่มข้อมูลสำเร็จ'}`, {
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

    fetch()

  }, [
    isPostError,
    isPostSuccess,
    errorPostWithdraw,
  ]);



  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleOpenConfirmDelete = () => {
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };


  const isVJMember = memberDetail?.member_type === 'vj_member';


  const coinBalance = useMemo(() => {
    if (!isVJMember) {
      // ถ้าเป็น general_member ใช้ member_wallet_non_org
      const balance = memberById && memberById?.data?.member_wallet_non_org?.[0]?.wallet?.balance || DEFAULT_VALUES.COIN_AMOUNT;
      return Number.parseInt(String(balance), 10);
    } else {
      // ถ้าไม่ใช่ general_member ให้ sum coins จาก member_wallet array ทั้งหมด
      const totalCoin = memberById?.data?.member_wallet?.reduce((sum: number, walletItem: any) => {
        const balance = walletItem?.wallet?.balance ?? 0;
        return sum + balance;
      }, 0) ?? DEFAULT_VALUES.COIN_AMOUNT;
      return Number.parseInt(String(totalCoin), 10);
    }
  }, [overviewDetailById, isVJMember, memberById]);


  
  const walletBalance = coinBalance;




  return (
    <>
      <LoadingDialog open={isPosting || isLoadingMemberById || isLoadingOverviewDetailById || isPostingNonOranization} />
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
              <Fade in={landingInView} timeout={2000}>
                <div ref={landingRef}>
                  <PageHeader textHeader='รายระเอืยดผู้ใช้' />
                </div>
              </Fade>
            </Grid>
            <Grid size={{ md: 12 }} mb={5}>

              <Fade in={landingInView} timeout={2000}>
                <div >

                  <Grid
                    sx={{
                      px: { xs: 0, md: 4, lg: 6, xl: 8, }
                    }}
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={2}
                  >

                    <Grid size={12} >
                      <Box sx={{ pl: 2 }}>
                        <Typography color='primary' variant="h2" component="h2" gutterBottom>
                          {memberDetail?.nick_name}
                        </Typography>
                        <Typography variant='subtitle2' gutterBottom>
                          User PX:   {memberDetail && memberDetail.user_px ? memberDetail.user_px : 'N/A'}
                        </Typography>
                        <Typography variant='subtitle2' gutterBottom>
                          รหัสผู้แนะนำ:   {memberDetail?.refer_id ? memberDetail?.refer_id : 'ไม่มี'}
                        </Typography>

                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} textAlign={'center'} >
                      <Typography color='primary' variant='h3' gutterBottom>
                        แบบฟอร์มการถอนเงิน
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }} >
                      <Grid

                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={2}
                      >
                        <Grid size={{ xs: 12, md: 6 }} >

                          <WithdrawMoneyFromDetails 
                            isVJMember={isVJMember} 
                            walletBalance={walletBalance} 
                            handleOpenConfirmDelete={handleOpenConfirmDelete} 
                            overviewDetailById={overviewDetailById} 
                            postWithdrawRequestsComission={postWithdrawRequestsComission} 
                            memberById={memberById} 
                            ParamsId={ParamsId} 
                            postWithdrawRequestsNonOranizationComission={postWithdrawRequestsNonOranizationComission}
                          />

                        </Grid>

                      </Grid>


                    </Grid>



                  </Grid>

                </div>
              </Fade>

            </Grid>


          </Grid>


        </Box>
      </Box>



      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        // keepMounted
        onClose={handleCloseConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}

        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>



          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {'ไม่สามารถถอนเงินได้ ถอนขั้นต่ำ 300 บาท'}
          </Typography>




          <Box>

            <ButtonError
              onClick={handleCloseConfirmDelete}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {'OK'}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default WithdrawMoneyFromPage;
