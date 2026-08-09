import {
    Avatar,
    Box,
    Button,
    Card,

    Rating,
    Skeleton,
    Typography,
    alpha,
    styled,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import Scrollbars from 'react-custom-scrollbars-2';
import { useGetReviewListAllQuery } from '@/lib/features/review';
import { ReviewDetail } from '@/model/review';

const TypographyH1 = styled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(28)}; // Default for mobile

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }
  `
);

function ReviewPage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    // Calculate the appropriate height based on screen size
    const getScrollbarHeight = () => {
        if (isSmallScreen) return 300;
        if (isMediumScreen) return 350;
        return 400;
    };

    const { data: reviewListAll, isLoading: isLoadingReviewListAll,
    } = useGetReviewListAllQuery();

    const data = [
        {
            displayName: 'John Doe',
            jobTitle: 'Designer',
            description: 'ทำวีเจ 9เดือน รายได้รวม 86,610 บาท ไม่ต้องลงทุน ไม่ต้องมีปะรสบการณ',
            avatar: 'https://via.placeholder.com/50',
            rating: 5
        },
        {
            displayName: 'John Doe',
            jobTitle: 'Designer',
            description: 'ทำวีเจ 9เดือน รายได้รวม 86,610 บาท ไม่ต้องลงทุน ไม่ต้องมีปะรสบการณ',
            avatar: 'https://via.placeholder.com/50',
            rating: 3.5
        },
        {
            displayName: 'John Doe',
            jobTitle: 'Designer',
            description: 'ทำวีเจ 9เดือน รายได้รวม 86,610 บาท ไม่ต้องลงทุน ไม่ต้องมีปะรสบการณ',
            avatar: 'https://via.placeholder.com/50',
            rating: 2.5
        },
        {
            displayName: 'John Doe',
            jobTitle: 'Designer',
            description: 'ทำวีเจ 9เดือน รายได้รวม 86,610 บาท ไม่ต้องลงทุน ไม่ต้องมีปะรสบการณ',
            avatar: 'https://via.placeholder.com/50',
            rating: 4
        }
    ];

    return (

        <Grid 
          container 
          spacing={{ xs: 2, sm: 3, md: 4 }} 
          justifyContent="center" 
          alignItems="center"
        >
            {/* Title with responsive typography */}
            <Grid size={{ xs: 12, md: 12 }} textAlign="center">
                <TypographyH1 color="white">
                    รีวิว
                </TypographyH1>
            </Grid>

            {/* Reviews section with responsive height and padding */}
            <Grid size={{ xs: 12, md: 12 }} textAlign="center">
                {isLoadingReviewListAll ? (
                    <Box
                        display="flex"
                        sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                            overflowX: 'auto',
                            gap: { xs: 1, sm: 2 },
                            p: { xs: 1, sm: 2 },
                        }}
                    >
                        {[...Array(3)].map((_, index) => (
                            <Card
                                key={index}
                                sx={{
                                    p: 2,
                                    minWidth: {
                                        xs: '90%',
                                        sm: '70%',
                                        md: '45%',
                                        lg: '30%',
                                    },
                                }}
                            >
                                <Box p={2} display="flex" alignItems="flex-start">
                                    <Skeleton variant="circular" width={40} height={40} />
                                    <Box pl={2}>
                                        <Skeleton variant="text" width={120} />
                                        <Skeleton variant="text" width={80} />
                                    </Box>
                                </Box>
                                <Skeleton variant="text" width="100%" />
                                <Skeleton variant="text" width="80%" />
                                <Skeleton variant="rectangular" height={100} />
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Scrollbars
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={getScrollbarHeight()}
                        universal
                    >
                        <Box
                            display="flex"
                            sx={{
                                flexDirection: { xs: 'column', sm: 'row' },
                                overflowX: 'auto',
                                gap: { xs: 1, sm: 2 },
                                p: { xs: 1, sm: 2 }
                            }}
                        >
                            {reviewListAll && reviewListAll.data.map((item : ReviewDetail, index : any) => (
                                <Card
                                    key={index}
                                    sx={{
                                        p: { xs: 1, sm: 2 },
                                        minWidth: {
                                            xs: '100%',
                                            sm: '80%',
                                            md: '45%',
                                            lg: '30%'
                                        },
                                        mb: { xs: 2, sm: 0 }, // Add margin bottom on mobile
                                        transition: `${theme.transitions.create(['box-shadow', 'transform'])}`,
                                        transform: 'translateY(0px)',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: `0 2rem 8rem 0 ${alpha(
                                                theme.colors.alpha.black[100],
                                                0.1
                                            )}, 
                                            0 0.6rem 1.6rem ${alpha(theme.colors.alpha.black[100], 0.2)}, 
                                            0 0.2rem 0.2rem ${alpha(theme.colors.alpha.black[100], 0.15)}`,
                                        },
                                    }}
                                >
                                    <Box p={{ xs: 1, sm: 2 }} display="flex" alignItems="flex-start">
                                        <Avatar 
                                            src={item?.reviewer_media ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + item?.reviewer_media : ''} 
                                            sx={{ width: { xs: 40, sm: 50 }, height: { xs: 40, sm: 50 } }}
                                        />
                                        <Box pl={{ xs: 1, sm: 2 }}>
                                            <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1rem', sm: '1.2rem' } }}>
                                                {item.reviewer}
                                            </Typography>
                                            <Typography gutterBottom variant="subtitle2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                                                {item.review_career}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Rating 
                                        readOnly 
                                        defaultValue={item?.review_star} 
                                        precision={0.5} 
                                        size={isSmallScreen ? "small" : "medium"}
                                    />
                                    <Typography
                                        variant="subtitle2"
                                        sx={{
                                            pb: { xs: 1, sm: 2 },
                                            fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                            lineHeight: { xs: 1.4, sm: 1.6 }
                                        }}
                                    >
                                        {item.review_description}
                                    </Typography>
                                </Card>
                            ))}
                        </Box>
                    </Scrollbars>
                )}
            </Grid>

            {/* View More Button with responsive spacing */}
            {/* <Grid size={{ xs: 12, md: 12 }} textAlign="center" mt={{ xs: 1, sm: 2, md: 3 }}>
                <Button
                    variant="outlined"
                    size="medium"
                    sx={{
                        borderWidth: { xs: '1px', sm: '2px' },
                        padding: { xs: '6px 16px', sm: '8px 22px', md: '10px 24px' },
                        fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.9375rem' },
                        color: theme.colors.white.main,
                        borderColor: theme.colors.white.main,
                        '&:hover': {
                            borderWidth: '2px',
                            color: theme.colors.white.main,
                            borderColor: theme.colors.black.main,
                            backgroundColor: theme.colors.black.main,
                        },
                    }}
                >
                    ดูเพี่มเตีม
                </Button>
            </Grid> */}
        </Grid>
        // </Container>
    );
}

export default ReviewPage;
