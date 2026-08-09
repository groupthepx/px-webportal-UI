'use client';
import PageHeader from '@/components/PageHeader';
import { useGetMemberByIdQuery, useGetMemberOverviewDetailByIdQuery, useGetProfileByIdQuery } from '@/lib/features/profile';
import { Box, Fade, Typography, useTheme, Zoom, } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useEffect, useState } from 'react';
import BankDetails from './BankDetail';
import AccountBankFromDetails from './From';
import { usePostBankAccountMutation, useUpdateBankAccountMutation } from '@/lib/features/bankaccout';
import { LoadingDialog } from '@/components/Loading';
import { enqueueSnackbar } from 'notistack';
import { MemberDetailModel } from '@/model/member';
import ImagePreview from '@/components/ImagePreview';
import { extractApiError } from '@/utils/extractApiError';

function AccountBankPage() {
  const [methodAction, SetMethodAction] = useState<string>('');
  const [openAction, setOpenAction] = useState(false);
  const [memberDetailData, setMemberDetailData] = useState<MemberDetailModel | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const handleOpen = (url: string) => {
    setImagePreview(url);
    setOpenImagePreview(true);
  };
  const handleClose = () => {
    setOpenImagePreview(false);
  };
  const { data: ProfileById, isLoading: isLoadingProfilegById } = useGetProfileByIdQuery(
  );
  const memberParamsId = !isLoadingProfilegById && ProfileById && ProfileById.data && ProfileById.data.member_id ? `${ProfileById.data.member_id}` : '0';

  const { data: memberById, isLoading: isLoadingMemberById, refetch: refetchMemberById } = useGetMemberByIdQuery(
    { id: `${memberParamsId}` },
    { skip: memberParamsId === '0' }
  );
  const memberDetail = memberById && memberById.data ? memberById.data : null
  const [
    postBankAccountComission,
    {
      isLoading: isPosting,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: errorPostBankAccount,
    },
  ] = usePostBankAccountMutation();
  const [
    updateBankAccountComission,
    {
      isLoading: isUpdating,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: errorUpdateBankAccount,
    },
  ] = useUpdateBankAccountMutation();
  const handleActionOpen = () => {
    setOpenAction(true);
  };
  const handleActionClose = () => {
    setOpenAction(false);
  };
  useEffect(() => {
    async function fetch() {
      if (
        isUpdateSuccess
      ) {

        await refetchMemberById();
        handleActionClose()


        enqueueSnackbar(`${'อัพเดทข้อมูลสำเร็จ'}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });
      } else if (
        //isUpdateError || isDeleteError ||
        isUpdateError
      ) {

        enqueueSnackbar('เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่', {
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
    isUpdateError,
    isUpdateSuccess,
    errorUpdateBankAccount,
  ]);
  useEffect(() => {
    async function fetch() {
      if (
        isPostSuccess
      ) {



        await refetchMemberById();
        handleActionClose()
        enqueueSnackbar(`${'เพิ่มบัญชีธนาคารเรียบร้อย'}`, {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
          TransitionComponent: Zoom,
        });

        // await wait(1000);

        // router.back();

      } else if (
        //isUpdateError || isDeleteError ||
        isPostError
      ) {

        enqueueSnackbar(extractApiError(errorPostBankAccount, 'เพิ่มบัญชีธนาคารล้มเหลว กรุณาลองใหม่อีกครั้ง'), {
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
    errorPostBankAccount,
  ]);
  return (
    <>
      <LoadingDialog open={isPosting || isLoadingMemberById || isUpdating} />
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


            <Grid 
              size={{ xs: 12, sm: 12, md: 12 }}
              mt={1} 
              // xs={12} // Add xs prop for smallest screens
              // md={12}
            >
              <Fade in={true} timeout={2000}>
                <div>
                  <PageHeader textHeader='รายระเอืยดผู้ใช้ / การถอนเงิน / ข้อมูลบัญชีธนาคาร' />
                </div>
              </Fade>
            </Grid>

            <Grid 
              size={{ xs: 12, sm: 12, md: 12 }}
              mb={5}
            >
              <Fade in={true} timeout={2000}>
                <div>
                  <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="stretch"
                    spacing={{ xs: 1, sm: 2 }} // Responsive spacing
                    sx={{
                      px: { xs: 2, sm: 4 } // Responsive padding
                    }}
                  >
                    <Grid    size={{ xs: 12, sm: 12, md: 12 }} >
                      <Box
                        display={'flex'}
                        flexDirection={{ xs: 'column', sm: 'row' }} // Stack on mobile
                        justifyContent={'space-between'}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        sx={{ pl: { xs: 1, sm: 2 } }}
                      >
                        <Box>
                          <Typography color='primary' variant="h2" component="h2" gutterBottom>
                            {memberDetail?.nick_name}
                          </Typography>
                          <Typography variant='subtitle2' gutterBottom>
                            User pX: {memberDetail?.user_px}
                          </Typography>
                          <Typography variant='subtitle2' gutterBottom>
                            รหัสผู้แนะนำ: {memberDetail?.refer_id ? memberDetail?.refer_id : 'ไม่มี'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid    size={{ xs: 12, sm: 12, md: 12 }}>
                      <Grid
                        container
                        direction="row"
                        justifyContent="center"
                        alignItems="stretch"
                        spacing={{ xs: 1, sm: 2 }} // Responsive spacing
                      >
                        <Grid    size={{ xs: 12, sm: 12, md: 12 }} >
                          <BankDetails 
                            memberById={memberById}
                            handleActionOpen={handleActionOpen}
                            SetMethodAction={SetMethodAction}
                            setMemberDetailData={setMemberDetailData}
                            handleOpen={handleOpen}
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

      <AccountBankFromDetails
        openAction={openAction}
        handleActionClose={handleActionClose}
        methodAction={methodAction}
        postBankAccountComission={postBankAccountComission}
        memberById={memberById}
        memberDetailData={memberDetailData}
        updateBankAccountComission={updateBankAccountComission}

      />


      <ImagePreview open={openImagePreview} handleClose={handleClose} imagePreviews={imagePreview} />
    </>
  );
}

export default AccountBankPage;
