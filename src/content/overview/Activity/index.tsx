import {
    Box,
    Button,
    Card,
    CardMedia,
    Container,
    Skeleton,
    Typography,
    alpha,
    styled,
    useTheme
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { useGetActivityListAllQuery } from '@/lib/features/activity';
import { ActivityDetailModel } from '@/model/activity';
import { useState } from 'react';
import PreviewActivityModel from '@/components/ActivityPreview';
import { PlayArrowOutlined } from '@mui/icons-material';

const CardActionAreaWrapper = styled(Box)(
    () => `
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  
    .MuiTouchRipple-root {
        opacity: .3;
    }
  
    &:hover {
        .MuiCardActionArea-focusHighlight {
            opacity: .05;
        }
    }
  `
);


const TypographyH1 = styled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(32)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }

  `
);

const CardMediaWrapper = styled(CardMedia)(
  ({ theme }) => `
    height: ${theme.spacing(25)}; // Base height
    
    ${theme.breakpoints.up('sm')} {
      height: ${theme.spacing(30)};
    }
    
    ${theme.breakpoints.up('md')} {
      height: ${theme.spacing(35)};
    }

    object-fit: cover;
  `
);


function ActivityPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const router = useRouter();

    const { data: activityListAll, isLoading: isLoadingActivityList,
    } = useGetActivityListAllQuery();

    const [activityDetail, setActivityDetail] = useState<ActivityDetailModel | null>(null);

    const [openActionPreview, setOpenActionPreview] = useState(false);


    const handleActionOpenPreview = () => {
        setOpenActionPreview(true);
    };
    const handleActionClosePreview = () => {
        setOpenActionPreview(false);
    };


    // const data = [
    //     {
    //         title: 'Activities Title',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/300x460.png'
    //     },
    //     {
    //         title: 'Activities Title',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/300x460.png'
    //     },
    //     {
    //         title: 'Activities Title',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/300x460.png'
    //     },
    //     {
    //         title: 'Activities Title',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/300x460.png'
    //     }
    // ]



    return (
        <>
            <Container
                sx={{
                    width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                    maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                    padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                    margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
                }}

            >


                <Grid
                    spacing={{ xs: 1, sm: 2, md: 3 }}
                    justifyContent="center"
                    alignItems="stretch" // Ensures all grid items have the same height
                    container
                    sx={{ px: { xs: 1, sm: 2, md: 0 } }}
                >

                    {/* Update title Grid */}
                    <Grid size={{ xs: 12 }} style={{ textAlign: 'center' }} >

                        <TypographyH1
                            color='primary'
                            sx={{
                                py: { xs: 2, sm: 3, md: 4 },
                                fontSize: {
                                    xs: theme.typography.pxToRem(24),
                                    sm: theme.typography.pxToRem(28),
                                    md: theme.typography.pxToRem(32),
                                    lg: theme.typography.pxToRem(40)
                                }
                            }}
                        >
                            {t('กิจกรรมสังกัด')}{' '}<b>PX</b>
                        </TypographyH1>
                    </Grid>

                    {
                        isLoadingActivityList
                            ? // Skeleton placeholders
                            [...Array(4)].map((_, index) => (
                                <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }} textAlign="center">
                                    <Card
                                        sx={{
                                            p: 2,
                                            mt: 2,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Skeleton variant="rectangular" height={230} />
                                        <Box
                                            sx={{
                                                px: { md: 2, lg: 1.5, xl: 3 },
                                                pt: 2,
                                                textAlign: 'left',
                                            }}
                                        >
                                            <Skeleton variant="text" width="80%" />
                                            <Skeleton variant="text" width="60%" />
                                        </Box>
                                    </Card>
                                </Grid>
                            ))
                            : // Render actual data when loading is false
                            activityListAll && activityListAll.data
                                .slice(0, 4)
                                .map((item: ActivityDetailModel, index: number) => (

                                    <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }} style={{ textAlign: 'center' }} >

                                        <Card
                                            onClick={() => {

                                                setActivityDetail(item);
                                                handleActionOpenPreview();
                                            }}
                                            sx={{
                                                p: { xs: 1, sm: 2, md: 3 },
                                                m: { xs: 1, sm: 2 },
                                                cursor: 'pointer',

                                                mt: { xs: 0, sm: 2, md: 3 },
                                                textAlign: 'center',
                                                height: '100%', // Makes all cards fill the grid height
                                                display: 'flex',
                                                flexDirection: 'column', // Ensure content stacks vertically
                                                justifyContent: 'space-between', // Push content to top and bottom
                                                transition: `${theme.transitions.create(['box-shadow', 'transform'])}`,
                                                transform: 'translateY(0px)',
                                                '&:hover': {
                                                    transform: 'translateY(-10px)',
                                                    boxShadow: `0 2rem 8rem 0 ${alpha(
                                                        theme.colors.alpha.black[100],
                                                        0.1
                                                    )}, 
                                              0 0.6rem 1.6rem ${alpha(
                                                        theme.colors.alpha.black[100],
                                                        0.2
                                                    )}, 
                                              0 0.2rem 0.2rem ${alpha(theme.colors.alpha.black[100], 0.15)}`,
                                                },
                                            }}
                                        >
                                            {/* Update video thumbnail container */}
                                            <Box
                                              sx={{
                                                position: 'relative',
                                                width: '100%',
                                                paddingTop: { xs: '75%', sm: '80%', md: '85%' },
                                                overflow: 'hidden'
                                              }}
                                            >
                                              <img
                                                style={{
                                                  position: 'absolute',
                                                  top: 0,
                                                  left: 0,
                                                  width: '100%',
                                                  height: '100%',
                                                  objectFit: 'cover'
                                                }}
                                                src={`https://image.mux.com/${item.playback_id}/thumbnail.png`}
                                                alt={item.mux_asset_id}
                                              />
                                              <PlayArrowOutlined
                                                sx={{
                                                  position: 'absolute',
                                                  top: '50%',
                                                  left: '50%',
                                                  transform: 'translate(-50%, -50%)',
                                                  color: 'white',
                                                  fontSize: { xs: '24px', sm: '32px', md: '36px' },
                                                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                  borderRadius: '50%',
                                                  padding: '4px'
                                                }}
                                              />
                                            </Box>

                                            {/* Update content spacing */}
                                            <Box
                                              sx={{
                                                p: { xs: 1, sm: 2, md: 3 },
                                                flexGrow: 1,
                                                display: 'flex', 
                                                flexDirection: 'column'
                                              }}
                                            >
                                              <Typography
                                                variant="h3"
                                                sx={{
                                                  fontSize: {
                                                    xs: theme.typography.pxToRem(14),
                                                    sm: theme.typography.pxToRem(16),
                                                    md: theme.typography.pxToRem(18),
                                                    lg: theme.typography.pxToRem(20)
                                                  },
                                                  mb: { xs: 1, sm: 2 }
                                                }}
                                              >
                                                {item.activity_title}
                                              </Typography>

                                              {/* Update description text */}
                                              <Typography
                                                variant="subtitle2"
                                                sx={{
                                                  fontSize: {
                                                    xs: theme.typography.pxToRem(12),
                                                    sm: theme.typography.pxToRem(13),
                                                    md: theme.typography.pxToRem(14),
                                                    lg: theme.typography.pxToRem(16)
                                                  },
                                                  lineHeight: 1.5,
                                                  mb: { xs: 1, sm: 2 }
                                                }}
                                              >
                                                {item?.activity_description?.length > 80
                                                  ? `${item.activity_description.slice(0, 80)}...`
                                                  : item.activity_description}
                                              </Typography>
                                            </Box>

                                        </Card>

                                    </Grid>

                                ))
                    }

                    {/* Update "See More" button */}
                    <Grid mt={{ xs: 2, sm: 3, md: 4 }} size={12} style={{ textAlign: 'center' }} >

                        <Button
                            onClick={() => { router.push('/activity') }}
                            variant="outlined"
                            sx={{
                                py: { xs: 1, sm: 1.5 },
                                px: { xs: 2, sm: 3 },
                                fontSize: {
                                    xs: theme.typography.pxToRem(14),
                                    sm: theme.typography.pxToRem(16)
                                },
                                borderWidth: '2px',
                                color: theme.colors.gray.main,
                                borderColor: theme.colors.gray.main,
                                '&:hover': {
                                    borderWidth: '2px',
                                    color: theme.colors.white.main,
                                    borderColor: theme.colors.gray.main,
                                    backgroundColor: theme.colors.gray.main,
                                }
                            }}
                        >
                            {t('ดูเพี่มเตีม')}
                        </Button>
                    </Grid>



                </Grid>




            </Container>

            <PreviewActivityModel
                openAction={openActionPreview}
                handleActionClose={handleActionClosePreview}
                activityDetail={activityDetail}

            />
        </>

    );
}

export default ActivityPage;
