import { FC, use } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Fade,
  Skeleton,
  Typography,
  alpha,
  styled,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useGetBlogByIdQuery, useGetBlogListAllQuery } from '@/lib/features/blog';
import { BlogDetailModel } from '@/model/blog';
import { decrypt, encrypt } from '@/utils/encryption';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

const TypographyH1 = styled(Typography)(
  ({ theme }) => `
      font-size: ${theme.typography.pxToRem(30)};

  ${theme.breakpoints.up('sm')} {
    font-size: ${theme.typography.pxToRem(38)};
  }

  ${theme.breakpoints.up('md')} {
    font-size: ${theme.typography.pxToRem(48)};
  }
`
);

interface ArticleDetailPageProps {
  params: Promise<{ id: string }> | any;
}

const ArticleDetail: FC<ArticleDetailPageProps> = ({ params }) => {
  const theme = useTheme();
  const router = useRouter();
  const resolvedParams: { id?: string } = use(params);
  const articleId = resolvedParams?.id
    ? `${decrypt(decodeURIComponent(resolvedParams.id))}`
    : '0';

  const { data: BlogById, isLoading: isLoadingBlogById } = useGetBlogByIdQuery(
    { id: articleId },
    { skip: articleId === '0' }
  );
  const { data: blogListAll, isLoading: isLoadingRelated } = useGetBlogListAllQuery();

  const article = BlogById?.data as BlogDetailModel | undefined;
  const relatedArticles = (blogListAll?.data as BlogDetailModel[] | undefined)
    ?.filter((item) => `${item.blog_id}` !== articleId)
    .slice(0, 3) ?? [];

  const coverUrl = article?.blog_cover
    ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${article.blog_cover}`
    : '';

  const openRelatedArticle = (blogId: string) => {
    router.push(`/article/detail/${encrypt(blogId)}`);
  };

  const articleTextStyles = {
    color: theme.colors.gray.dark,
    fontSize: { xs: theme.typography.pxToRem(15), md: theme.typography.pxToRem(17) },
    lineHeight: 1.95,
    overflowWrap: 'anywhere',
    '& p': { margin: '0 0 1.5rem' },
    '& h1, & h2, & h3, & h4': {
      color: theme.colors.alpha.black[100],
      lineHeight: 1.35,
      margin: '2.5rem 0 1rem'
    },
    '& h1': { fontSize: { xs: '1.5rem', md: '1.9rem' } },
    '& h2': { fontSize: { xs: '1.35rem', md: '1.7rem' } },
    '& h3, & h4': { fontSize: { xs: '1.15rem', md: '1.4rem' } },
    '& img': {
      display: 'block',
      maxWidth: '100%',
      height: 'auto',
      margin: '1.75rem auto',
      borderRadius: 1.5
    },
    '& a': {
      color: theme.colors.primary.main,
      fontWeight: 700
    },
    '& ul, & ol': { paddingLeft: { xs: '1.25rem', md: '2rem' } },
    '& blockquote': {
      margin: '1.75rem 0',
      padding: '1rem 1.25rem',
      borderLeft: `4px solid ${theme.colors.primary.main}`,
      backgroundColor: alpha(theme.colors.primary.main, 0.1)
    },
    '& table': {
      display: 'block',
      maxWidth: '100%',
      overflowX: 'auto'
    }
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 5, display: 'block', flex: 1 }}>
      <Grid
        sx={{
          minHeight: '100vh',
          backgroundColor: '#F7F8F9',
          color: theme.colors.alpha.black[100]
        }}
        container
      >
        <Grid size={{ xs: 12 }}>
          <Fade in timeout={1000}>
            <Container
              maxWidth="lg"
              sx={{
                px: { xs: 2, sm: 3, md: 4 },
                pb: { xs: 5, md: 8 },
                pt: { xs: 3, md: 6 }
              }}
            >
              <Grid spacing={{ xs: 4, md: 6 }} alignItems="flex-start" container>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box component="article">
                    {isLoadingBlogById ? (
                      <>
                        <Skeleton variant="rounded" width={130} height={28} sx={{ mb: 2 }} />
                        <Skeleton variant="text" width="95%" height={68} />
                        <Skeleton variant="text" width="75%" height={68} />
                      </>
                    ) : (
                      <>
                        <Typography
                          component="span"
                          sx={{
                            display: 'inline-flex',
                            px: 1.5,
                            py: 0.6,
                            mb: 2,
                            borderRadius: 10,
                            color: theme.colors.primary.main,
                            backgroundColor: alpha(theme.colors.primary.main, 0.13),
                            fontSize: theme.typography.pxToRem(13),
                            fontWeight: 700
                          }}
                        >
                          บทความ
                        </Typography>
                        <TypographyH1
                          variant="h1"
                          sx={{
                            mb: { xs: 3, md: 4 },
                            color: theme.colors.alpha.black[100],
                            lineHeight: 1.18,
                            letterSpacing: '-0.01em'
                          }}
                        >
                          {article?.blog_title || 'ไม่พบข้อมูลบทความ'}
                        </TypographyH1>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 2,
                            py: 1.75,
                            borderTop: `1px solid ${alpha(theme.colors.alpha.black[100], 0.16)}`,
                            borderBottom: `1px solid ${alpha(theme.colors.alpha.black[100], 0.16)}`
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
                            <Avatar
                              sx={{
                                width: 42,
                                height: 42,
                                flex: '0 0 auto',
                                fontSize: theme.typography.pxToRem(13),
                                fontWeight: 700,
                                color: theme.colors.primary.main,
                                backgroundColor: alpha(theme.colors.primary.main, 0.18)
                              }}
                            >
                              PX
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography variant="body2" sx={{ color: theme.colors.alpha.black[100], fontWeight: 700 }}>
                                PX VJ
                              </Typography>
                              <Typography variant="caption" sx={{ color: theme.colors.gray.main }}>
                                เผยแพร่เมื่อ {article?.created_at ? format(new Date(article.created_at), 'dd/MM/yyyy HH:mm') : 'N/A'}
                              </Typography>
                            </Box>
                          </Box>
                          {typeof article?.view_count === 'number' && (
                            <Typography
                              variant="body2"
                              sx={{
                                flex: '0 0 auto',
                                color: theme.colors.gray.main,
                                whiteSpace: 'nowrap'
                              }}
                            >
                              อ่านแล้ว {article.view_count.toLocaleString()} ครั้ง
                            </Typography>
                          )}
                        </Box>
                      </>
                    )}

                    {isLoadingBlogById ? (
                      <Skeleton
                        variant="rectangular"
                        sx={{
                          width: '100%',
                          height: { xs: 220, sm: 320, md: 430 },
                          mt: { xs: 4, md: 6 },
                          borderRadius: 1.5
                        }}
                      />
                    ) : coverUrl ? (
                      <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 4, md: 6 }, width: '100%' }}>
                        <CardMedia
                          component="img"
                          image={coverUrl}
                          alt={article?.blog_title || 'ภาพหน้าปกบทความ'}
                          sx={{
                            display: 'block',
                            width: '100%',
                            height: 'auto',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: 1.5
                          }}
                        />
                      </Box>
                    ) : null}

                    <Box sx={{ mt: coverUrl || isLoadingBlogById ? 0 : { xs: 4, md: 6 } }}>
                      {isLoadingBlogById ? (
                        <>
                          <Skeleton variant="text" width="100%" height={30} />
                          <Skeleton variant="text" width="95%" height={30} />
                          <Skeleton variant="text" width="88%" height={30} />
                          <Skeleton variant="text" width="100%" height={30} />
                          <Skeleton variant="text" width="70%" height={30} />
                        </>
                      ) : (
                        <Box
                          sx={articleTextStyles}
                          dangerouslySetInnerHTML={{ __html: article?.blog_content || '' }}
                        />
                      )}
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ position: { md: 'sticky' }, top: { md: 24 } }}>
                    <Typography
                      variant="h2"
                      sx={{
                        mb: 2,
                          color: theme.colors.alpha.black[100],
                        fontSize: { xs: theme.typography.pxToRem(22), md: theme.typography.pxToRem(24) },
                        fontWeight: 700
                      }}
                    >
                      แนะนำสำหรับคุณ
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                      {isLoadingRelated
                        ? [...Array(3)].map((_, index) => (
                            <Card key={index} sx={{ overflow: 'hidden', borderRadius: 2, backgroundColor: theme.colors.white.light }}>
                              <Skeleton variant="rectangular" sx={{ height: 175 }} />
                              <CardContent>
                                <Skeleton variant="text" width="85%" height={28} />
                                <Skeleton variant="text" width="65%" />
                                <Skeleton variant="text" width="90%" />
                              </CardContent>
                            </Card>
                          ))
                        : relatedArticles.map((relatedArticle) => (
                            <Card
                              key={relatedArticle.blog_id}
                              sx={{
                                overflow: 'hidden',
                                borderRadius: 2,
                                backgroundColor: theme.colors.white.light,
                                border: `1px solid ${alpha(theme.colors.alpha.black[100], 0.1)}`,
                                transition: theme.transitions.create(['box-shadow', 'transform']),
                                '&:hover': {
                                  transform: 'translateY(-5px)',
                                  boxShadow: `0 1rem 3rem ${alpha(theme.colors.alpha.black[100], 0.3)}`
                                }
                              }}
                            >
                              <CardActionArea onClick={() => openRelatedArticle(relatedArticle.blog_id)}>
                                {relatedArticle.blog_cover ? (
                                  <CardMedia
                                    component="img"
                                    image={`${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${relatedArticle.blog_cover}`}
                                    alt={relatedArticle.blog_title || 'บทความแนะนำ'}
                                    sx={{ height: 175, objectFit: 'cover' }}
                                  />
                                ) : (
                                  <Box sx={{ height: 175, backgroundColor: alpha(theme.colors.primary.main, 0.1) }} />
                                )}
                                <CardContent>
                                  <Typography
                                    variant="h3"
                                    sx={{
                                      color: theme.colors.alpha.black[100],
                                      fontSize: theme.typography.pxToRem(18),
                                      fontWeight: 700,
                                      display: '-webkit-box',
                                      WebkitBoxOrient: 'vertical',
                                      WebkitLineClamp: 2,
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {relatedArticle.blog_title}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ mt: 1, color: theme.colors.gray.main }}
                                  >
                                    {relatedArticle.created_at
                                      ? format(new Date(relatedArticle.created_at), 'dd/MM/yyyy')
                                      : 'N/A'}
                                  </Typography>
                                </CardContent>
                              </CardActionArea>
                            </Card>
                          ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ArticleDetail;
