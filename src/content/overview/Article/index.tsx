
import {

    Box,
    Button,
    Card,

    CardMedia,
    Container,
    Divider,

    Skeleton,

    Typography,
    alpha,
    styled,
    useTheme
} from '@mui/material';
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { useGetBlogListAllQuery } from '@/lib/features/blog';
import { BlogDetailModel } from '@/model/blog';
import { encrypt } from '@/utils/encryption';



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



const truncateHTML = (htmlContent: any, limit: any) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    const truncatedText = textContent.length > limit ? textContent.slice(0, limit) + '...' : textContent;
    return truncatedText;
};


const CardActionAreaWrapper = styled(Box)(
    ({ theme }) => `
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
  
      .MuiTouchRipple-root {
          opacity: .3;
      }
  
      .MuiCardActionArea-focusHighlight {
          background: ${theme.colors.alpha.trueWhite[100]};
      }
  
      &:hover {
          .MuiCardActionArea-focusHighlight {
              opacity: .1;
          }
      }
    `
);




function ArticlePage() {
    const { t } = useTranslation();
    const theme = useTheme();
    const router = useRouter();

    const { data: blogListAll, isLoading: isLoadingBlogList,
    } = useGetBlogListAllQuery();


    // const data = [
    //     {
    //         title: 'Digital Payment will be Top Payment In Next 10 Years',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/435x300.png'
    //     },
    //     {
    //         title: 'Digital Payment will be Top Payment In Next 10 Years',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/435x300.png'
    //     },
    //     {
    //         title: 'Digital Payment will be Top Payment In Next 10 Years',
    //         description: 'Lorem ipsum dolor sit amet, consectetur adisquat adipiscing elit ut aliquam.',
    //         image: 'https://placehold.co/435x300.png'
    //     },

    // ]



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
                spacing={1}
                justifyContent="left"
                alignItems="stretch" // Ensures all grid items have the same height
                container
            >

                <Grid size={{ xs: 12, md: 12 }} style={{ textAlign: 'center' }} >

                    <TypographyH1
                        color='primary' >
                        {t('บทความ')}
                    </TypographyH1>
                </Grid>

                {isLoadingBlogList
                    ? // Skeleton placeholders when loading
                    [...Array(3)].map((_, index) => (
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
                    ))
                    :
                    blogListAll && blogListAll.data
                        .slice(0, 3)
                        .map((item: BlogDetailModel, index: number) => (

                            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }} style={{ textAlign: 'center' }} >

                                <Card
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',

                                        mt: 2,
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
                                    <CardActionAreaWrapper>
                                        <CardMedia
                                            component="img"
                                            height="435"
                                            image={item?.blog_cover ? process.env.NEXT_PUBLIC_BASE_UPLOADS + '/' + item?.blog_cover : ''}
                                            alt="..."
                                        />


                                    </CardActionAreaWrapper>
                                    <Box
                                        sx={{
                                            px: { md: 2, lg: 1.5, xl: 3 },
                                            pt: 2,
                                            textAlign: 'left'
                                        }}
                                    >


                                        <Typography
                                            mb={2}

                                            sx={{
                                                transition: `${theme.transitions.create(['color'])}`,
                                                color: `${theme.colors.alpha.black[100]}`,
                                                fontSize: {
                                                    xs: theme.typography.pxToRem(16), // Mobile size
                                                    sm: theme.typography.pxToRem(18), // Small screens
                                                    md: theme.typography.pxToRem(20), // Medium screens
                                                    lg: theme.typography.pxToRem(22)  // Large screens
                                                },

                                                '&:hover': {
                                                    color: `${theme.colors.primary.main}`
                                                },
                                                whiteSpace: 'nowrap', // Prevents wrapping
                                                overflow: 'hidden', // Hides overflowed text
                                                textOverflow: 'ellipsis', // Adds "..." to truncated text
                                            }}
                                            color="text.primary"
                                            variant="h3"
                                        // underline="none"

                                        >
                                            {item.blog_title}
                                        </Typography>


                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Typography
                                                mb={2}
                                                variant="subtitle1"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'left'
                                                }}
                                            >

                                                {item.created_at ? `${format(new Date(item.created_at), "dd/MM/yyyy HH:mm:ss ")}` : 'N/A'}
                                            </Typography>
                                            <Typography
                                                mb={2}
                                                variant="subtitle1"
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'left'
                                                }}
                                            >

                                                {''}
                                            </Typography>
                                        </Box>

                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                pb: 2,
                                                fontSize: {
                                                    xs: theme.typography.pxToRem(12), // Mobile size
                                                    sm: theme.typography.pxToRem(14), // Small screens
                                                    md: theme.typography.pxToRem(16), // Medium screens
                                                    lg: theme.typography.pxToRem(18)  // Large screens
                                                }
                                            }}
                                        >

                                            <div dangerouslySetInnerHTML={{ __html: truncateHTML(item.blog_content, 100), }} />
                                        </Typography>
                                        <Divider
                                            sx={{
                                                mb: 2
                                            }}
                                        />
                                        <Button
                                            variant="text"
                                            onClick={() => {
                                                const encryptedRoleId = encrypt(item.blog_id.toString());
                                                router.push(`/article/detail/${encryptedRoleId}`)

                                            }}

                                            sx={{
                                                borderRadius: 10,
                                                px: 3
                                            }}
                                        >
                                            {t('อ่านบทความ')}
                                        </Button>
                                    </Box>
                                </Card>

                            </Grid>

                        ))
                }


                <Grid mt={2} size={{ xs: 12, md: 12 }} style={{ textAlign: 'center' }} >

                    <Button
                        onClick={() => { router.push('/article') }}
                        variant="outlined"
                        sx={{
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
    );
}

export default ArticlePage;
