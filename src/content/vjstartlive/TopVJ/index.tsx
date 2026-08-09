
import {
    Box,

    Card,
    CardActionArea,
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

import { useGetTopVJListAllQuery } from '@/lib/features/topvj';
import { TopVJModelDetail } from '@/model/top_vj';

const CardActionAreaWrapper = styled(CardActionArea)(
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
    font-size: ${theme.typography.pxToRem(32)};
    font-weight: 900;
    text-align: center;
    color: #ffcc4d; /* golden tone */
    -webkit-text-stroke: 1px #000;
    text-shadow: 0 2px 4px rgba(0,0,0,0.4);

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(36)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(48)};
    }

    ${theme.breakpoints.up('lg')} {
      font-size: ${theme.typography.pxToRem(56)};
    }
  `
);


function TopVJPageData() {
    const { t } = useTranslation();
    const theme = useTheme();


    const { data: topVJListAll, isLoading: isLoadingTopVJListAll,
    } = useGetTopVJListAllQuery();





    return (
        <Container
            sx={{
                width: { xs: '100%', sm: 'auto' }, // Full width on mobile, auto width on larger screens
                maxWidth: 'lg', // Set maxWidth to 'lg' to maintain a limit on larger screens
                padding: { xs: '0', md: '0px' }, // Adjust padding for mobile
                margin: { xs: '0', sm: 'auto' } // Center align with auto margin on larger screens,
            }}

        >


            <Grid
                m={5}
                spacing={2}
                justifyContent="left"
                alignItems="left"
                container
            >

                <Grid size={12} style={{ textAlign: 'center' }} >

                    <TypographyH1>
                        {t('ท็อปวีเจ')} <b>STAR LIVE</b>
                    </TypographyH1>
                </Grid>

                {isLoadingTopVJListAll ? [...Array(12)].map((_, index) => (
                    <Grid
                        key={index}

                        size={{ xs: 12, sm: 6, md: 4 }}
                        style={{ textAlign: 'center' }}
                    >
                        <Card

                            sx={{
                                p: 2,
                                mt: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Skeleton variant="rectangular" height={435} />
                            <Box
                                sx={{
                                    px: { md: 2, lg: 1.5, xl: 3 },
                                    pt: 2,
                                    textAlign: 'left',
                                }}
                            >
                                <Skeleton variant="text" width="80%" height={30} />
                                <Skeleton variant="text" width="60%" height={25} />
                                <Box display="flex" justifyContent="space-between" mt={1}>
                                    <Skeleton variant="text" width="30%" height={20} />
                                    <Skeleton variant="text" width="30%" height={20} />
                                </Box>
                                <Skeleton variant="text" width="100%" height={50} />
                                <Skeleton
                                    variant="rectangular"
                                    height={40}
                                    width="50%"
                                    sx={{ mt: 2 }}
                                />
                            </Box>
                        </Card>
                    </Grid>
                )) : topVJListAll &&
                topVJListAll.data
                    // .slice(0, 4)
                    .map((item: TopVJModelDetail, index: number) => (
                      <Grid key={index} size={{ xs: 6, sm: 4, md: 3 }} style={{ textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        width: {
                                            xs: 200,
                                            sm: 250,
                                            md: 300,
                                        },
                                        mx: 'auto',
                                        zIndex: 1
                                    }}
                                >
                                    {/* Frame */}
                                    <img
                                        src="/assets/image/bg_top_vj.png"
                                        alt="Top VJ Frame"
                                        style={{ width: '100%', display: 'block' }}
                                    />

                                    {/* VJ Image */}
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: {
                                                xs: '55px',
                                                sm: '72px',
                                                md: '85px'
                                            },
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: {
                                                xs: 100,
                                                sm: 130,
                                                md: 160
                                            },
                                            height: {
                                                xs: 120,
                                                sm: 150,
                                                md: 180
                                            },
                                            overflow: 'hidden',
                                            borderRadius: '12px',
                                            boxShadow: 3,
                                            zIndex: -1

                                        }}
                                    >
                                        <img
                                            src={
                                                item?.profile
                                                    ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.profile}`
                                                    : ''
                                            }
                                            alt={item.nick_name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 20,
                                                left: 5,
                                                width: '100%',
                                                // bgcolor: 'rgba(0,0,0,0.5)',
                                                color: 'white',
                                                p: 0.5,
                                                textAlign: 'left'
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    fontSize: {
                                                        xs: 7,
                                                        sm: 9,
                                                        md: 10
                                                    },
                                                    fontWeight: 'bold',
                                                    lineHeight: 1.2
                                                }}
                                            >
                                                ไอดีห้อง : {item.room_id}
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    fontSize: {
                                                        xs: 7,
                                                        sm: 9,
                                                        md: 10
                                                    }
                                                }}
                                            >
                                                UserID: {item.user_id}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* Name on Ribbon */}
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            position: 'absolute',
                                            bottom: {
                                                xs: '20px',
                                                sm: '24px',
                                                md: '30px'
                                            },
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: {
                                                xs: 10,
                                                sm: 14,
                                                md: 15
                                            },
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {item.nick_name}
                                    </Typography>
                                </Box>
                            </Grid>
                        // <Grid key={index} size={{ xs: 6, md: 3 }} style={{ textAlign: 'center' }} >

                        //     <Card
                        //         sx={{
                        //             p: 2,
                        //             mt: 2,
                        //             textAlign: 'center',
                        //             transition: `${theme.transitions.create([
                        //                 'box-shadow',
                        //                 'transform'
                        //             ])}`,
                        //             transform: 'translateY(0px)',

                        //             '&:hover': {
                        //                 transform: 'translateY(-10px)',
                        //                 boxShadow: `0 2rem 8rem 0 ${alpha(
                        //                     theme.colors.alpha.black[100],
                        //                     0.1
                        //                 )}, 
                        //         0 0.6rem 1.6rem ${alpha(
                        //                     theme.colors.alpha.black[100],
                        //                     0.2
                        //                 )}, 
                        //         0 0.2rem 0.2rem ${alpha(
                        //                     theme.colors.alpha.black[100],
                        //                     0.15
                        //                 )}`
                        //             }
                        //         }}
                        //     >
                        //         <CardActionAreaWrapper>
                        //             <CardMedia
                        //                 component="img"
                        //                 height="230"
                        //                 image={item?.profile ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + item?.profile : ''}
                        //                 alt="..."
                        //             />

                        //         </CardActionAreaWrapper>



                        //         <Box
                        //             sx={{
                        //                 px: { md: 2, lg: 1.5, xl: 3 },
                        //                 pt: 2,
                        //                 textAlign: 'center'
                        //             }}
                        //         >
                        //             <Typography

                        //                 sx={{
                        //                     transition: `${theme.transitions.create(['color'])}`,
                        //                     color: `${theme.colors.alpha.black[100]}`,
                        //                     fontSize: {
                        //                         xs: theme.typography.pxToRem(16), // Mobile size
                        //                         sm: theme.typography.pxToRem(18), // Small screens
                        //                         md: theme.typography.pxToRem(20), // Medium screens
                        //                         lg: theme.typography.pxToRem(22)  // Large screens
                        //                     },

                        //                     '&:hover': {
                        //                         color: `${theme.colors.primary.main}`
                        //                     }
                        //                 }}
                        //                 color="text.primary"
                        //                 variant="h3"

                        //             >
                        //                 {item.full_name}
                        //             </Typography>
                        //             <Typography
                        //                 variant="subtitle2"
                        //                 sx={{
                        //                     pb: 2,
                        //                     fontSize: {
                        //                         xs: theme.typography.pxToRem(12), // Mobile size
                        //                         sm: theme.typography.pxToRem(14), // Small screens
                        //                         md: theme.typography.pxToRem(16), // Medium screens
                        //                         lg: theme.typography.pxToRem(18)  // Large screens
                        //                     }

                        //                 }}
                        //             >
                        //                 {t('ID User:')}       {item.user_id}
                        //             </Typography>

                        //         </Box>

                        //     </Card>

                        // </Grid>

                    ))
                }





            </Grid>
        </Container>
    );
}

export default TopVJPageData;
