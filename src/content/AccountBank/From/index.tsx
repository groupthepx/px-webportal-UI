import {
  Card,
  Box,
  styled,
  useTheme,
  Divider,
  Button,
  CircularProgress,
  Dialog,
  Typography,
  Avatar,
  ListItem,
  List,
  FormHelperText,
  DialogContent,
  TextField,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FC, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import wait from '@/utils/wait';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

import Image from "next/image";
import { useDropzone } from 'react-dropzone';
import { AddPhotoAlternateOutlined } from '@mui/icons-material';
import NumberFormatCustom from '@/components/NumberFormatCustom';
import { MemberDataDetailModel, MemberDetailModel } from '@/model/member';

const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);


const AvatarWrapperInput = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);


const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);



const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);




interface Props {
  openAction: boolean;
  handleActionClose: () => void;
  methodAction: string
  postBankAccountComission: any
  memberById: MemberDataDetailModel
  memberDetailData: MemberDetailModel | null
  updateBankAccountComission: any
}
const AccountBankFromDetails: FC<Props> = ({
  openAction,
  handleActionClose,
  methodAction,
  postBankAccountComission,
  memberById,
  memberDetailData,
  updateBankAccountComission
}): any => {
  const { t }: { t: any } = useTranslation();
  const router = useRouter();
  const theme = useTheme();

  const [fileImages, setFileImages] = useState<Blob | null>(null);




  const {

    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpeg'],
      'image/jpg': ['.jpg'],
      // 'video/mp4': ['.mp4'], // Add this line




    },
    onDrop: (files) => {
      if (files) {

        if (files[0].type.startsWith('image/')) {
          // Handle image upload and cropping
          setFileImages(files[0])
        } else if (files[0].type === 'video/mp4') {
          // Handle video upload and cropping
          // handleVideoUpload(file);

          setFileImages(files[0])
        }

      }

      // setAcceptedFiles(files);

    },
    maxFiles: 1,
    multiple: false,

  });
  const memberDetail = memberById && memberById.data ? memberById.data : null


  return (
    <>
      <Dialog
        fullWidth
        maxWidth="md"
        open={openAction}
        onClose={handleActionClose}
        // Add responsive styles
        PaperProps={{
          sx: {
            width: {
              xs: '95%',
              sm: '80%',
              md: '70%'
            },
            maxHeight: {
              xs: '90vh',
              sm: '80vh'
            },
            margin: {
              xs: '10px',
              sm: '20px'
            }
          }
        }}
      >
        <Box
          p={{ xs: 1, sm: 2, md: 3 }}
          sx={{
            overflowY: 'auto'
          }}
        >
          <Box
            display={'flex'}
            sx={{
              justifyContent: 'left',
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Typography mr={1} variant="body1" gutterBottom>
              <Image
                src="/assets/svg/pg/wallte.svg"
                width={30}
                height={30}
                alt="withdraw_money"
              />{' '}

            </Typography>

            <Typography variant="h3" gutterBottom>
              {t('ข้อมูลบัญชีธนาคาร')}
            </Typography>



          </Box>


          <Formik
            initialValues={{
              qr_img: "",
              bank_name: methodAction == 'update' ? `${memberDetailData && memberDetailData.bank_account && memberDetailData.bank_account.bank_name}` : "",
              account_number: methodAction == 'update' ? `${memberDetailData && memberDetailData.bank_account && memberDetailData.bank_account.account_number}` : "",
              account_name: methodAction == 'update' ? `${memberDetailData && memberDetailData.bank_account && memberDetailData.bank_account.account_name}` : "",
              member_id: memberDetail && memberDetail.member_id ? `${memberDetail.member_id}` : "",
              submit: null,
            }}
            validationSchema={Yup.object().shape({

              bank_name: Yup.string().required(t('กรุณากรอกธนาคาร')),
              account_number: Yup.string().required(t('กรุณากรอกหมายเลขบัญชีธนาคาร')),
              account_name: Yup.string().required(t('กรุณากรอกชื่อบัญชีธนาคาร')),

              qr_img: Yup.mixed().test(
                'file-required',
                'กรุณาอัปโหลดรูปภาพโปรไฟล์',
                function () {
                  // Access fileImages directly for validation
                  return methodAction == 'update' ? true : fileImages !== null;
                }
              )

            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                await wait(1000);
                setStatus({ success: true });
                setSubmitting(false);


                const formData = new FormData();



                if (fileImages) {
                  formData.append('qr_img', fileImages);
                }

                formData.append('bank_name', values.bank_name);
                formData.append('account_number', values.account_number);
                formData.append('account_name', values.account_name);
                formData.append('member_id', values.member_id);

                if (methodAction === 'insert') {
                  postBankAccountComission({
                    bank: formData
                  })
                } else if (methodAction === 'update' && memberDetailData && memberDetailData.bank_account) {
                  updateBankAccountComission({
                    id: memberDetailData && memberDetailData.bank_account && memberDetailData.bank_account.bank_account_id,
                    bank: formData
                  })
                }

                // console.log("values", {
                //   ...values,
                //   withdraw_count : parseInt(`${values.withdraw_count}`),
                // })

                // postWithdrawRequestsComission(
                //   {
                //     withdraw: {
                //       ...values,
                //       withdraw_count: parseInt(`${values.withdraw_count}`),
                //     }
                //   }
                // )
                // RequestAction(values);
              } catch (err: any) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.data });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleSubmit, isSubmitting, touched, handleBlur, setFieldValue, values, handleChange }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  sx={{
                    p: { xs: 1, sm: 2, md: 3 }
                  }}
                >
                  <Grid
                    container
                    spacing={{ xs: 1, sm: 2 }}
                  >
                    {/* Modify Grid items */}
                    <Grid size={{ xs: 12, sm: 12 }}>
                      {/* Upload section */}
                      <BoxUploadWrapper
                        sx={{
                          cursor: "pointer",
                          p: { xs: 1, sm: 2, md: 3 },
                          minHeight: { xs: 150, sm: 200 }
                        }}
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {isDragAccept && (
                          <>
                            {/* AddPhotoAlternateOutlined */}
                            <AvatarSuccess variant="rounded">
                              <CheckTwoToneIcon />
                            </AvatarSuccess>
                            <Typography
                              sx={{
                                mt: 2
                              }}
                            >
                              {t('Drop the files to start uploading')}
                            </Typography>
                          </>
                        )}
                        {isDragReject && (
                          <>
                            <AvatarDanger variant="rounded">
                              <CloseTwoToneIcon />
                            </AvatarDanger>
                            <Typography
                              sx={{
                                mt: 2
                              }}
                            >
                              {t('You cannot upload these file types')}
                            </Typography>
                          </>
                        )}
                        {!isDragActive && (
                          <>
                            <AvatarWrapperInput variant="rounded">
                              <AddPhotoAlternateOutlined />
                            </AvatarWrapperInput>
                            <Typography
                              variant='body2'
                              sx={{
                                mt: 2
                              }}
                            >
                              {t('เลือกไฟล์หรือลากแล้ววางที่นี่')}
                            </Typography>
                            <Typography
                              variant='subtitle1'
                              sx={{
                                mt: 2
                              }}
                            >
                              {t('รูปแบบ JPEG, PNG และ JPG สูงสุด 50MB')}
                            </Typography>
                          </>
                        )}
                      </BoxUploadWrapper>

                      {fileImages ? <>

                        <List disablePadding component="div">
                          <ListItem disableGutters component="div" >
                            {fileImages.type.startsWith('image/') ? (
                              <>
                                <Box
                                  component="img"
                                  sx={{
                                    height: 75, // Adjust the height as needed
                                    width: 100,  // Adjust the width as needed
                                    marginRight: 2,
                                  }}
                                  src={URL.createObjectURL(fileImages)}
                                // alt={fileImages.name}
                                />
                                <b>{(fileImages.size / (1024 * 1024)).toFixed(2)} MB</b>
                                <Divider />
                              </>
                            ) : null}
                          </ListItem>
                        </List>

                      </>
                        : methodAction == 'update' && memberDetailData && memberDetailData.bank_account && memberDetailData.bank_account.qr_img ?
                          <Box mt={2}>
                            <List disablePadding component="div">
                              <ListItem disableGutters component="div" >
                                <>
                                  <Box
                                    component="img"
                                    sx={{
                                      height: 75, // Adjust the height as needed
                                      width: 100,  // Adjust the width as needed
                                      marginRight: 2,
                                    }}
                                    src={process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + memberDetailData.bank_account.qr_img}
                                  // alt={fileImages.name}
                                  />
                                  {/* <b>{(fileImages.size / (1024 * 1024)).toFixed(2)} MB</b> */}
                                  <Divider />
                                </>

                              </ListItem>
                            </List>

                          </Box>


                          : ''}


                      <Box
                        pt={2}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexGrow={1}
                      >
                        {touched.qr_img && errors.qr_img && typeof errors.qr_img === 'string' && (
                          <FormHelperText sx={{ color: 'red' }}>
                            {errors.qr_img}
                          </FormHelperText>
                        )}
                      </Box>


                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        error={Boolean(touched.bank_name && errors.bank_name)}
                        fullWidth
                        size='small'
                        helperText={touched.bank_name && typeof errors.bank_name === 'string' ? errors.bank_name : ''}
                        label={t('ธนาคาร*')}
                        name="bank_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.bank_name}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        error={Boolean(touched.account_number && errors.account_number)}
                        fullWidth
                        size='small'
                        helperText={touched.account_number && typeof errors.account_number === 'string' ? errors.account_number : ''}
                        label={t('หมายเลขบัญชีธนาคาร*')}
                        name="account_number"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.account_number}
                        variant="outlined"
                      // slotProps={{
                      //   input: {
                      //     inputComponent: NumberFormatCustom as any,
                      //   },
                      // }}
                      />

                    </Grid>
                    <Grid size={12} >
                      <TextField
                        error={Boolean(touched.account_name && errors.account_name)}
                        fullWidth
                        size='small'
                        helperText={touched.account_name && typeof errors.account_name === 'string' ? errors.account_name : ''}
                        label={t('ชื่อบัญชีธนาคาร*')}
                        name="account_name"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.account_name}
                        variant="outlined"
                      />
                    </Grid>





                    <Grid size={{ xs: 12, sm: 12 }}>
                      <Button
                        fullWidth
                        sx={{
                          mt: { xs: 1, sm: 2 },
                          py: { xs: 1, sm: 1.5 },
                          background: theme.colors.gradients.primary,
                          fontWeight: 'bold',
                          color: '#ffffff',
                          '&:hover': {
                            background: theme.colors.gradients.primaryHover,
                          },
                        }}
                        type="submit"
                        disabled={Boolean(errors.submit) || isSubmitting}
                        startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
                        variant="contained"
                        size='large'

                      >
                        {methodAction === 'insert' ? t('บันทึกข้อมูล') : t('แก้ไขข้อมูล')}
                      </Button>

                    </Grid>
                  </Grid>
                </DialogContent>

              </form>
            )
            }
          </Formik>


        </Box>





      </Dialog>
    </>
  );
}

export default AccountBankFromDetails;
