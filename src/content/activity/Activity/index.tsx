import {
    Box,
    Card,
    CardActionArea,
    CardContent,
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
import { useGetActivityListAllQuery } from '@/lib/features/activity';
import { ActivityDetailModel } from '@/model/activity';
import PreviewActivityModel from '@/components/ActivityPreview';
import { useState } from 'react';
import { PlayArrowOutlined } from '@mui/icons-material';

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

function ActivityPageData() {
    const { t } = useTranslation();
    const theme = useTheme();
    const { data: activityListAll, isLoading: isLoadingActivityList } = useGetActivityListAllQuery();
    const [activityDetail, setActivityDetail] = useState<ActivityDetailModel | null>(null);
    const [openActionPreview, setOpenActionPreview] = useState(false);

    const handleActionOpenPreview = () => setOpenActionPreview(true);
    const handleActionClosePreview = () => setOpenActionPreview(false);

    return (
        <>
            <Container
                sx={{
                    width: { xs: '100%', sm: 'auto' },
                    maxWidth: 'lg',
                    px: { xs: 1, sm: 2, md: 0 },
                    mx: { xs: 0, sm: 'auto' },
                    mb: { xs: 2, sm: 2, md: 4 }
                }}
            >
                <Grid
                    m={{ xs: 1, sm: 3, md: 5 }}
                    spacing={{ xs: 1.5, sm: 2, md: 2.5 }}
                    justifyContent="left"
                    alignItems="stretch"
                    container
                >
                    <Grid size={{ xs: 12, md: 12 }} sx={{ textAlign: 'center' }}>
                        <TypographyH1 color="primary">
                            {t('กิจกรรมสังกัด')} <b>PX</b>
                        </TypographyH1>
                    </Grid>

                    {isLoadingActivityList
                        ? [...Array(12)].map((_, index) => (
                            <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
                                <Card
                                    sx={{
                                        mt: 1,
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                        border: `1px solid ${alpha(theme.colors.alpha.black[100], 0.08)}`
                                    }}
                                >
                                    <Skeleton variant="rectangular" sx={{ height: { xs: 150, sm: 180, md: 230 } }} />
                                    <CardContent sx={{ textAlign: 'left' }}>
                                        <Skeleton variant="text" width="80%" />
                                        <Skeleton variant="text" width="60%" />
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                        : activityListAll?.data?.map((item: ActivityDetailModel, index: number) => (
                            <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
                                <Card
                                    sx={{
                                        mt: { xs: 1, sm: 2, md: 2 },
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
                                        onClick={() => {
                                            setActivityDetail(item);
                                            handleActionOpenPreview();
                                        }}
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'stretch',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {item.mux_asset_id && item.playback_id ? (
                                            <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
                                                <Box
                                                    component="img"
                                                    src={`https://image.mux.com/${item.playback_id}/thumbnail.png`}
                                                    alt={item.mux_asset_id}
                                                    sx={{
                                                        display: 'block',
                                                        width: '100%',
                                                        height: { xs: 150, sm: 180, md: 230 },
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                                <PlayArrowOutlined
                                                    sx={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        color: 'white',
                                                        fontSize: { xs: 24, sm: 30, md: 36 },
                                                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                                        borderRadius: '50%',
                                                        p: 0.5
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    height: { xs: 150, sm: 180, md: 230 },
                                                    objectFit: 'cover'
                                                }}
                                                image={item?.activity_media ? `${process.env.NEXT_PUBLIC_BASE_UPLOADS}/${item.activity_media}` : ''}
                                                alt={item.activity_title || 'กิจกรรม'}
                                            />
                                        )}

                                        <CardContent
                                            sx={{
                                                flexGrow: 1,
                                                px: { xs: 1.5, sm: 2, md: 2.5 },
                                                py: 2,
                                                textAlign: 'left'
                                            }}
                                        >
                                            <Typography
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
                                                {item.activity_title}
                                            </Typography>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    mt: 1,
                                                    color: theme.colors.gray.dark,
                                                    fontSize: {
                                                        xs: theme.typography.pxToRem(12),
                                                        sm: theme.typography.pxToRem(14)
                                                    },
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 4,
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {item?.activity_description?.length > 100
                                                    ? `${item.activity_description.slice(0, 100)}...`
                                                    : item.activity_description}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
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

export default ActivityPageData;
