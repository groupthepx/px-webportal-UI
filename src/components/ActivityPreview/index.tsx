import { FC } from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    IconButton,
    styled,
    Typography,
    useTheme,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { ActivityDetailModel } from '@/model/activity';
import Image from "next/image";
import Grid from '@mui/material/Grid2';
import Label from '@/components/Label';
import MuxPlayer from '@mux/mux-player-react';



const TypographyH1 = styled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(25)}; // Default for mobile
  
    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(25)};
    }
  
    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(35)};
    }
  `
);
const TypographyH2 = styled(Typography)(
    ({ theme }) => `
      font-size: ${theme.typography.pxToRem(16)};
  `
);


const ImgWrapper = styled(Box)(
    ({ theme }) => `
      position: relative;
      z-index: 5;
      width: 100%;
      aspect-ratio: 16/9;
      overflow: hidden;
      border-radius: ${theme.general.borderRadiusLg};
      
      ${theme.breakpoints.down('md')} {
        aspect-ratio: 4/3;
      }
      
      ${theme.breakpoints.down('sm')} {
        aspect-ratio: 1/1;
      }
  
      img {
        border-radius: ${theme.general.borderRadiusLg}; 
      }
    `
);




interface PreviewActivityModelProps {
    openAction: boolean;
    handleActionClose: () => void;
    activityDetail: ActivityDetailModel | null

}

const PreviewActivityModel: FC<PreviewActivityModelProps> = ({
    openAction,
    handleActionClose,
    activityDetail


}) => {


    const theme = useTheme();




    return (


        <>
            <Dialog 
    fullWidth 
    maxWidth="md" 
    open={openAction} 
    onClose={handleActionClose}
    sx={{
        '& .MuiDialog-paper': {
            margin: { xs: '16px', sm: '32px' },
            width: '100%',
            maxHeight: { xs: '90vh', sm: '80vh' },
            borderRadius: { xs: '12px', sm: '16px' },
        },
        '& .MuiDialogContent-root': {
            padding: { xs: 2, sm: 3 },
            overflowY: 'auto'
        }
    }}
>
    <DialogTitle
        sx={{
            padding: { xs: 2, sm: 3 },
            position: 'relative'
        }}
    >
        <Typography
            sx={{
                background: `${theme.colors.gradients.primary}`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '1.25rem', sm: '1.5rem' }
            }}
            variant="h4"
        >
            {'รายละเอียดกิจกรรม'}
        </Typography>
        <IconButton
            aria-label="close"
            onClick={handleActionClose}
            sx={{
                position: 'absolute',
                right: { xs: 8, sm: 16 },
                top: { xs: 8, sm: 16 },
                color: theme => theme.palette.grey[500]
            }}
        >
            <Close />
        </IconButton>
    </DialogTitle>

    <Grid

        justifyContent="center"
        alignItems="left"
        container
        spacing={{ xs: 2, sm: 3 }}
        sx={{
            p: { xs: 2, sm: 3 }
        }}
    >
        <Grid p={5} size={{ xs: 12, md: 7 }} >
            {activityDetail && activityDetail.mux_asset_id && activityDetail.playback_id ? (
                <>
                    <MuxPlayer
                        streamType="on-demand"
                        playbackId={`${activityDetail.playback_id}`}
                        metadataVideoTitle={`${activityDetail.playback_id}`}
                        metadataViewerUserId={`${activityDetail.playback_id}`}
                        primaryColor="#ffffff"
                        secondaryColor="#000000"
                        accentColor={`${theme.palette.primary.main}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            aspectRatio: "9 / 16", // Ensures 16:9 aspect ratio
                            // maxHeight: "90vh", // Prevents it from exceeding viewport height
                            borderRadius: "8px" // Optional rounded corners
                        }}
                    />
                </>) : (
                <Box
                >

                    <ImgWrapper>
                        <Image
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={activityDetail && activityDetail?.activity_media || 'logo'}
                            src={activityDetail?.activity_media ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + activityDetail.activity_media : ''}
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </ImgWrapper>

                </Box>
            )}





        </Grid>



        <Grid pt={5} p={3} size={{ xs: 12, md: 5 }} sx={{ textAlign: { xs: 'left', md: 'left' } }} >



            {/* <LabelWrapper color="success">{t('Version') + ' 3.1'}</LabelWrapper> */}
            <TypographyH1
                sx={{
                    mb: 2,

                }}
                // style={{
                //     background: `${theme.colors.gradients.primary}`,
                //     WebkitBackgroundClip: 'text',
                //     WebkitTextFillColor: 'transparent',

                // }}

                variant="h3"
            >

                {activityDetail?.activity_title}

            </TypographyH1>
            <TypographyH2
                sx={{
                    lineHeight: 1.5,
                    pb: 1
                }}
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
            >
                {activityDetail?.activity_description}
            </TypographyH2>

            {/* <Typography variant='subtitle1'>  {activityDetail && activityDetail.is_active ? <Label color='success'> ใช้งาน</Label> : <Label color='error'> ปิดใช้งาน</Label>}
            </Typography> */}

        </Grid>



    </Grid>



</Dialog >



        </>
    );
};

export default PreviewActivityModel;
