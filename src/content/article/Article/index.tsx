import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Skeleton,
    Typography,
    alpha,
    styled,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid2';
import { useGetBlogListAllQuery } from '@/lib/features/blog';
import { BlogDetailModel } from '@/model/blog';
import { encrypt } from '@/utils/encryption';
import { useRouter } from 'next/navigation';

const TypographyH1 = styled(Typography)(
    ({ theme }) => `
        font-size: ${theme.typography.pxToRem(32)};

    ${theme.breakpoints.up('sm')} {
      font-size: ${theme.typography.pxToRem(32)};
    }

    ${theme.breakpoints.up('md')} {
      font-size: ${theme.typography.pxToRem(40)};
    }
  `
);

const truncateHTML = (htmlContent: any, limit: number) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    return textContent.length > limit ? `${textContent.slice(0, limit)}...` : textContent;
};

function ArticlePageData() {
    const { t } = useTranslation();
    const theme = useTheme();
    const router = useRouter();
    const { data: blogListAll, isLoading: isLoadingBlogList } = useGetBlogListAllQuery();

    const openArticle = (blogId: string | number) => {
        const encryptedRoleId = encrypt(blogId.toString());
        router.push(`/article/detail/${encryptedRoleId}`);
    };

    return (
        <Container
            sx={{
                width: { xs: '100%', sm: 'auto' },
                maxWidth: 'lg',
                px: { xs: 1, sm: 2, md: 0 },
                mx: { xs: 0, sm: 'auto' }
            }}
        >
            <Grid
                m={{ xs: 2, sm: 4, md: 5 }}
                spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                justifyContent="left"
                alignItems="stretch"
                container
            >
                <Grid size={{ xs: 12, md: 12 }} sx={{ textAlign: 'center' }}>
                    <TypographyH1 color="primary">{t('บทความ')}</TypographyH1>
                </Grid>

                {isLoadingBlogList
                    ? [...Array(12)].map((_, index) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                sx={{
                                    mt: 1,
                                    height: '100%',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.colors.alpha.black[100], 0.08)}`
                                }}
                            >
                                <Skeleton variant="rectangular" sx={{ height: { xs: 190, sm: 220, md: 240 } }} />
                                <CardContent>
                                    <Skeleton variant="text" width="80%" height={30} />
                                    <Skeleton variant="text" width="60%" height={25} />
                                    <Skeleton variant="text" width="100%" height={50} />
                                </CardContent>
                                <CardActions>
                                    <Skeleton variant="rounded" width={110} height={32} />
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                    : blogListAll?.data?.map((item: BlogDetailModel, index: number) => (
                        <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                                sx={{
                                    mt: 1,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: `1px solid ${alpha(theme.colors.alpha.black[100], 0.08)}`,
                                    transition: theme.transitions.create(['box-shadow', 'transform']),
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                        boxShadow: `0 1.5rem 4rem ${alpha(theme.colors.alpha.black[100], 0.16)}`
                                    }
                                }}
                            >
                                <CardActionArea
                                    onClick={() => openArticle(item.blog_id)}
                                    sx={{
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        textAlign: 'left'
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: { xs: 190, sm: 220, md: 240 },
                                            objectFit: 'cover'
                                        }}
                                        image={item?.blog_cover ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.blog_cover}` : ''}
                                        alt={item.blog_title || 'บทความ'}
                                    />
                                    <CardContent sx={{ flexGrow: 1, px: { xs: 2, md: 2.5 }, py: 2 }}>
                                        <Typography
                                            mb={1.25}
                                            variant="h3"
                                            color="text.primary"
                                            sx={{
                                                color: theme.colors.alpha.black[100],
                                                fontSize: {
                                                    xs: theme.typography.pxToRem(16),
                                                    sm: theme.typography.pxToRem(18),
                                                    md: theme.typography.pxToRem(20)
                                                },
                                                fontWeight: 700,
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 2,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {item.blog_title}
                                        </Typography>
                                        <Typography
                                            mb={1.25}
                                            variant="subtitle1"
                                            sx={{
                                                color: theme.colors.gray.main,
                                                fontSize: theme.typography.pxToRem(12)
                                            }}
                                        >
                                            {item.created_at ? format(new Date(item.created_at), 'dd/MM/yyyy HH:mm:ss ') : 'N/A'}
                                        </Typography>
                                        <Typography
                                            variant="subtitle2"
                                            sx={{
                                                color: theme.colors.gray.dark,
                                                fontSize: {
                                                    xs: theme.typography.pxToRem(12),
                                                    sm: theme.typography.pxToRem(14)
                                                },
                                                display: '-webkit-box',
                                                WebkitBoxOrient: 'vertical',
                                                WebkitLineClamp: 3,
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <Box component="span" dangerouslySetInnerHTML={{ __html: truncateHTML(item.blog_content, 100) }} />
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions sx={{ px: { xs: 2, md: 2.5 }, pb: 2, pt: 0 }}>
                                    <Button
                                        variant="text"
                                        onClick={() => openArticle(item.blog_id)}
                                        sx={{
                                            borderRadius: 10,
                                            px: 2,
                                            color: theme.colors.primary.main,
                                            fontWeight: 700
                                        }}
                                    >
                                        {t('อ่านบทความ')}
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
}

export default ArticlePageData;
