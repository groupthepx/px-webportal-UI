/**
 * MemberManagementForm Component
 * Form สำหรับแก้ไขข้อมูล member (Refactored Version)
 * 
 * Performance Optimizations:
 * - แยก components ย่อยๆ ออกมา
 * - ใช้ custom hooks แทน logic ที่ซับซ้อน
 * - ใช้ React.memo เพื่อป้องกัน re-render
 * - ใช้ useCallback สำหรับ functions
 */

import { FC, memo } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Formik } from 'formik';
import { Close } from '@mui/icons-material';
import wait from '@/utils/wait';
import CropPhotoDialog from '@/components/CropPhotoDialog';

// Import types, constants และ hooks
import { MemberManagementFormProps } from './types';
import {
  memberFormValidationSchema,
  getDefaultMemberFormValues,
  DIALOG_TITLES,
  BUTTON_LABELS,
} from './constants';
import { useMemberForm, useAddressData, useImageCrop } from './hooks';

// Import components ย่อย
import ProfileAvatar from './components/ProfileAvatar';
import { BasicInfoFields, AddressFields } from './components/FormFields';

/**
 * Form component สำหรับจัดการข้อมูล member
 * 
 * Features:
 * - แก้ไขข้อมูลส่วนตัว
 * - อัปโหลดและ crop รูปภาพ
 * - จัดการที่อยู่ (จังหวัด, เขต, ตำบล)
 * - Responsive design
 */
const MemberManagementForm: FC<MemberManagementFormProps> = memo(({
  openAction,
  handleActionClose,
  member,
  updateMemberComission,
}) => {
  const theme = useTheme();

  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  // Image crop hook - ต้องเรียกก่อนเพื่อเอา fileImages ไปใช้
  const {
    imgSrc,
    selectedImage,
    fileImages,  // <-- รูปที่ crop แล้ว (Blob)
    openActionCrop,
    crop,
    completedCrop,
    imgRef,
    previewCanvasRef,
    setCrop,
    setCompletedCrop,
    handleCloseCrop,
    handleImageUpload,
    onImageLoad,
    handleSaveCrop,
  } = useImageCrop();

  // Member form hook - ส่ง fileImages จาก useImageCrop มาใช้
  const { handleSubmit, isUpdating } = useMemberForm({
    member,
    fileImages,  // <-- ส่ง fileImages มาใช้ตรงนี้!
    onSuccess: handleActionClose,
  });

  const {
    provinces,
    districts,
    villages,
    handleProvinceChange,
    handleDistrictChange,
  } = useAddressData({ member });

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={openAction} onClose={handleActionClose}>
        {/* Dialog Header */}
        <DialogTitle>
          <Typography variant="h4" gutterBottom>
            {DIALOG_TITLES.editMember}
          </Typography>
        </DialogTitle>
        
        {/* Close Button */}
        <IconButton
          aria-label="close"
          onClick={handleActionClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <Close />
        </IconButton>

        {/* Formik Form */}
        <Formik
          initialValues={getDefaultMemberFormValues(member)}
          validationSchema={memberFormValidationSchema}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await wait(1000);
              setStatus({ success: true });
              setSubmitting(false);
              handleSubmit(values);
            } catch (err: any) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.data });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleSubmit: formikHandleSubmit,
            isSubmitting,
            touched,
            handleBlur,
            setFieldValue,
            values,
            handleChange,
          }) => (
            <form onSubmit={formikHandleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: { xs: 1, sm: 2, md: 3 },
                }}
              >
                <Grid direction="row" container spacing={{ xs: 1, sm: 2 }}>
                  {/* Profile Avatar */}
                  <Grid size={12}>
                    <ProfileAvatar
                      selectedImage={selectedImage}
                      currentProfile={member?.profile}
                      error={typeof errors.profile === 'string' ? errors.profile : undefined}
                      touched={touched.profile}
                      onImageUpload={handleImageUpload}
                    />
                  </Grid>

                  {/* Basic Information Fields */}
                  <BasicInfoFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                  />

                  {/* Address Fields */}
                  <AddressFields
                    values={values}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    provinces={provinces}
                    districts={districts}
                    villages={villages}
                    onProvinceChange={handleProvinceChange}
                    onDistrictChange={handleDistrictChange}
                  />
                </Grid>
              </DialogContent>

              {/* Submit Button */}
              <Box
                px={{ xs: 2, sm: 3 }}
                pb={{ xs: 2, sm: 3 }}
                pt={2}
                display="flex"
                justifyContent="center"
              >
                <div>
                  <Button
                    size={mobile ? 'medium' : 'large'}
                    className="rounded-[10px]"
                    fullWidth={mobile}
                    sx={{
                      background: theme.colors.gradients.primary,
                      fontWeight: 'bold',
                      color: '#ffffff',
                      m: 1,
                      minWidth: mobile ? '100%' : '200px',
                      '&:hover': {
                        background: theme.colors.gradients.primaryHover,
                      },
                    }}
                    type="submit"
                    disabled={Boolean(errors.submit) || isSubmitting || isUpdating}
                    startIcon={isSubmitting || isUpdating ? <CircularProgress size="1rem" /> : null}
                    variant="contained"
                  >
                    {BUTTON_LABELS.edit} VJ
                  </Button>
                </div>
              </Box>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Crop Photo Dialog */}
      <CropPhotoDialog
        open={openActionCrop}
        imgSrc={imgSrc}
        crop={crop}
        completedCrop={completedCrop}
        imgRef={imgRef}
        previewCanvasRef={previewCanvasRef}
        aspect={1 / 1}
        handleClose={handleCloseCrop}
        handleCropChange={(_, percentCrop) => setCrop(percentCrop)}
        handleCropComplete={(c) => setCompletedCrop(c)}
        handleSave={handleSaveCrop}
        onImageLoad={onImageLoad}
      />
    </>
  );
});

MemberManagementForm.displayName = 'MemberManagementForm';

export default MemberManagementForm;
