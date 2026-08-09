import { FC, ReactElement, forwardRef, Ref } from 'react';
import { Avatar, Box, Button, Dialog, Slide, Typography, styled, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import CloseIcon from '@mui/icons-material/Close';
import { TransitionProps } from '@mui/material/transitions';


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
     background: ${theme.colors.primary.dark};
     color: ${theme.palette.primary.contrastText};

     &:hover {
        background: ${theme.colors.primary.main};
     }
    `
);

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Slide direction="down" ref={ref} {...props} />;
});


interface CustomProps {

  onClickCompleted?: () => void; // Optional click handler
  onClickClose?: () => void; // Optional click handler
  openConfirmDelete: boolean; // Open confirm delete dialog
  textHeader?: string; // Header text
  textTitle?: string; // Header text
  btnConfirmText?: string; // Confirm button text
  btnCloseText?: string; // Close button text
}




const DialogCustom: FC<CustomProps> = ({

  onClickCompleted,
  onClickClose,
  openConfirmDelete,
  textHeader,
  textTitle,
  btnConfirmText,
  btnCloseText

}) => {

  const { t }: { t: any } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        // keepMounted
        onClose={onClickClose}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}

        >
          {/* <AvatarError>
            <CloseIcon />
          </AvatarError> */}

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {textHeader ? textHeader : t("ถ้าลบทิ้งจะกู้คืนไม่ไดเลยนะ")}
          </Typography>

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

            {textTitle ? textTitle : t("ถ้าลบทิ้งจะกู้คืนไม่ไดเลยนะ")}
          </Typography>

          <Box>
            <Button
              variant="outlined"

              sx={{
                mt: 3,
                px: 5,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: "bold",
                // background: theme.colors.gradients.primary,
                // color: "#fff",
                // "&:hover": {
                //   background: theme.colors.gradients.primaryHover,
                // },
                mx: 1
              }}
              onClick={onClickClose}
            >
              {btnCloseText ? btnCloseText : t('ยกเลิก')}
            </Button>
            {/* <ButtonError
              onClick={onClickCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {btnConfirmText ? btnConfirmText : t('ลบข้อมูล')}
            </ButtonError> */}
            <Button
              variant="contained"
              sx={{
                mt: 3,
                px: 5,
                py: 1.5,
                borderRadius: "8px",
                fontWeight: "bold",
                background: theme.colors.gradients.primary,
                color: "#fff",
                "&:hover": {
                  background: theme.colors.gradients.primaryHover,
                },
              }}
              onClick={onClickCompleted}
            >
              {btnConfirmText ? btnConfirmText : t('ลบข้อมูล')}
            </Button>
          </Box>
        </Box>
      </DialogWrapper>


    </>
  );
}

export default DialogCustom;
