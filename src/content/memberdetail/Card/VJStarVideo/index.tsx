import ImagePreview from '@/components/ImagePreview';
import PdfPreview from '@/components/PdfPreview';
import { useGetVideoByOrganizationsByIdQuery } from '@/lib/features/video';
import { MemberDetailModel } from '@/model/member';
import { OverviewDetailListModel } from '@/model/overview_detail';
import {
  ExpandMore,
  Image as ImageIcon,
  PictureAsPdf,
  PlayArrow,
  Stars,
  Timer,
} from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Avatar,
  Box,
  Card,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  styled,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import MuxPlayer from "@mux/mux-player-react";
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { buildVdoCategoryGroups } from '../../../VJStarVideo/categoryGroups';

const toMediaUrl = (url?: string | null) => {
  const value = url?.trim();
  if (!value) return '';
  if (/^(https?:)?\/\//.test(value) || value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }
  const baseUrl = process.env.NEXT_PUBLIC_BASE_UPLOADS?.replace(/\/$/, '') || '';
  const path = value.replace(/^\//, '');
  return baseUrl ? `${baseUrl}/${path}` : value;
};

const resolveVdoCoverUrl = (mission: any) => {
  const coverUrl = toMediaUrl(mission?.cover_image);
  if (coverUrl) return coverUrl;

  const thumbnailUrl = toMediaUrl(mission?.thumbnail);
  if (thumbnailUrl) return thumbnailUrl;

  return mission?.playback_id
    ? `https://image.mux.com/${mission.playback_id}/thumbnail.png`
    : '';
};

const UserBoxButton = styled(Box)(
  ({ theme }) => `

  padding: ${theme.spacing(0, 1)};

  background-color: ${theme.colors.alpha.white[10]};
  border-radius: ${theme.general.borderRadiusLg};


  .MuiSvgIcon-root {
    transition: ${theme.transitions.create(['color'])};
    font-size: ${theme.typography.pxToRem(24)};
    color: ${theme.colors.primary.main};
  }



  &.active,
  &:hover {
   # background-color: ${alpha(theme.colors.alpha.white[30], 0.2)};

   # .MuiSvgIcon-root {
   #   color: ${theme.colors.alpha.trueWhite[100]};
    #}
  }

  .MuiButton-label {
    justify-content: flex-start;
  }

`
);
const UserBoxDescriptionMain = styled(Typography)(
  ({ theme }) => `
        color: ${theme.colors.gray.main};
`
);
const UserBoxText = styled(Box)(
  ({ theme }) => `
    text-align: left;
    padding-left: ${theme.spacing(1)};
`
);
const UserBoxLabelMain = styled(Typography)(
  ({ theme }) => `
    font-weight: ${theme.typography.fontWeightBold};
    display: block;
    color: ${theme.colors.black.main};
`);



interface VJStarVideoMemberProps {

  overviewDetailById: OverviewDetailListModel;
  postProgressvdoComission: any
  member: MemberDetailModel | null
  organization_id: any
  refetchOverview: any
}

const MissionAccordion: React.FC<{ mission: any, index: number, member_id: any, postProgressvdoComission: any, overviewDetailById: OverviewDetailListModel, organization_id: any, refetchOverview: any }> = ({ mission, index, member_id, postProgressvdoComission, overviewDetailById, organization_id, refetchOverview }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const avatarSrc =
    !mission.is_unlock ?
      '/assets/svg/pg/golden-trophy-locked.svg' :
      '/assets/svg/pg/golden-trophy.svg';

  const missionsVdoDataMyProgress = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.my_progress || []
  const missionsAllProgress = missionsVdoDataMyProgress.find(m => m.vdo_id === mission.vdo_id);

  const [videoDuration, setVideoDuration] = useState<number | null>(null);
  const triggeredThresholds = useRef<Record<string, Set<number>>>({});
  const [openImagePreview, setOpenImagePreview] = useState(false);
  const [openPdfPreview, setOpenPdfPreview] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string>('');
  const [previewFileName, setPreviewFileName] = useState<string>('');
  const videoThumbnail = resolveVdoCoverUrl(mission);



  const handleLoadedMetadata = (event: any) => {
    const duration = event.target.duration;
    setVideoDuration(duration);
  };

  const formatDuration = (duration: number | null) => {
    if (!duration) return "N/A";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} นาที`;
  };

  // ฟังก์ชันสำหรับเปิด Image Preview
  const handleOpenImagePreview = (url: string) => {
    setPreviewImageUrl(url);
    setOpenImagePreview(true);
  };

  // ฟังก์ชันสำหรับเปิด PDF Preview
  const handleOpenPdfPreview = (url: string, fileName: string) => {
    setPreviewPdfUrl(url);
    setPreviewFileName(fileName);
    setOpenPdfPreview(true);
  };

  // ตรวจสอบว่าเป็นไฟล์ PDF หรือไม่
  const isPdfFile = (url: string) => {
    return url?.toLowerCase().endsWith('.pdf') || false;
  };

  // ดึงชื่อไฟล์จาก URL
  const getFileName = (url: string) => {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || 'document';
    } catch {
      return url.split('/').pop() || 'document';
    }
  };

const getMissionStatus = (isUnlock: boolean, progress: number) => {
  if (isUnlock && progress === 100) {
    return { text: 'สำเร็จ', color: 'green' };
  }
  if (isUnlock) {
    return { text: 'กำลังดำเนิน', color: 'orange' };
  }
  return { text: 'ยังไม่ได้รับอนุญาต', color: 'gray' };
};

  // { id: 'v1', title: 'Title1', time: '2:10', coins: 100, progress: 100, status: 'completed' },
  // { id: 'v2', title: 'Title2', time: '2:10', coins: 100, progress: 100, status: 'completed' },
  // { id: 'v3', title: 'Title3', time: '2:10', coins: 150, progress: 50, status: 'in-progress' },
  // { id: 'v4', title: 'Title4', time: '2:10', coins: 100, progress: 100, status: 'locked' },
  // { id: 'v5', title: 'Title5', time: '2:10', coins: 100, progress: 100, status: 'locked' },


  const progressColor =
    (missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0) === 100 ? 'green' : (missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0) != 0 ?
      'orange' :
      theme.palette.grey[400];



  const handleTimeUpdate = useCallback((event: any) => {
    // Cast event.target to HTMLMediaElement to access currentTime and duration safely
    const video = event.target as HTMLMediaElement;
    const currentTime = video.currentTime;
    const duration = video.duration;

    // Avoid division by zero or invalid duration
    if (!duration || duration <= 0) return;

    const progress = (currentTime / duration) * 100;
    // Determine the current threshold, rounded down to the nearest 10.
    const threshold = Math.floor(progress / 10) * 10;

    // Initialize the set for this video if it doesn't exist
    if (!triggeredThresholds.current[mission.vdo_id]) {
      triggeredThresholds.current[mission.vdo_id] = new Set();
    }

    const currentThresholds = triggeredThresholds.current[mission.vdo_id];

    // Only trigger for thresholds between 10 and 100 (inclusive) if not already triggered.
    if (threshold >= 10 && threshold <= 100 && !currentThresholds.has(threshold)) {
      currentThresholds.add(threshold);
      // console.log(`${threshold}% reached for video ${mission.vdo_id}`, progress);

      const currentSavedProgress = missionsAllProgress?.progress ?? 0;

      // Only post if the calculated progress is greater than what is already saved on the backend/state
      if (currentSavedProgress < progress) {
        postProgressvdoComission({
          vdo: {
            member_id: `${member_id}`,
            vdo_id: `${mission.vdo_id}`,
            progress: progress,
            organization_id: `${organization_id}`
          }
        }).unwrap().then(() => {
          refetchOverview && refetchOverview();
        });
      }
    }
  }, [member_id, mission.vdo_id, missionsAllProgress?.progress, postProgressvdoComission, refetchOverview]);

  return (

    <Accordion sx={{ borderRadius: 3, overflow: 'hidden', mb: 1 }}>
      <AccordionSummary
        expandIcon={
          <ExpandMore
            sx={{
              color: theme.palette.primary.main,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.1)' }
            }}
          />
        }
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.95)} 0%, ${alpha(theme.palette.grey[50], 0.9)} 100%)`,
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 1)} 0%, ${alpha(theme.palette.grey[100], 0.95)} 100%)`,
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.08)}`,
          },
          py: { xs: 1.5, md: 2 },
          px: { xs: 1, md: 2 },
        }}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={{ xs: 2, md: 3 }}
          sx={{ width: '100%' }}
        >
          {/* Column 1: Avatar */}
           {/* Column 1: Avatar + Status */}
          <Grid size={{ xs: 3, sm: 2, md: 1.5 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -4,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`,
                    borderRadius: '16px',
                    filter: 'blur(8px)',
                  }}
                />
                <Avatar
                  variant="rounded"
                  alt={mission?.vdo_title || `reward${mission && mission.vdo_id}`}
                  src={videoThumbnail || avatarSrc}
                  sx={{
                    width: { xs: 56, sm: 64, md: 72 },
                    height: { xs: 56, sm: 64, md: 72 },
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.warning.main, 0.25)}`,
                    border: `2px solid ${alpha(theme.palette.warning.main, 0.3)}`,
                    position: 'relative',
                    zIndex: 1,
                    '& img': {
                      objectFit: 'cover',
                    },
                  }}
                />
                {videoThumbnail && (
                  <Box
                    sx={{
                      position: 'absolute',
                      zIndex: 2,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: alpha('#000', 0.58),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayArrow sx={{ color: '#fff', fontSize: 20 }} />
                  </Box>
                )}
              </Box>
              {/* Status Text */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
                  color: getMissionStatus(mission.is_unlock, missionsAllProgress?.progress || 0).color,
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {getMissionStatus(mission.is_unlock, missionsAllProgress?.progress || 0).text}
              </Typography>
            </Box>
          </Grid>

          {/* Column 2: Video Info (Title, Duration, Bonus) */}
          <Grid size={{ xs: 9, sm: 5, md: 4.5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                  fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' },
                  lineHeight: 1.3,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {mission && mission.vdo_title}
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', gap: { xs: 1.5, md: 2.5 }, mt: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: alpha(theme.palette.info.main, 0.08),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                  }}
                >
                  <Timer sx={{ fontSize: 16, color: theme.palette.info.main }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.info.dark,
                      fontSize: { xs: '0.7rem', md: '0.75rem' },
                    }}
                  >
                    {formatDuration(videoDuration)}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.25,
                    py: 0.5,
                    borderRadius: 1.5,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.light, 0.05)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                  }}
                >
                  <Stars sx={{ fontSize: 16, color: theme.palette.warning.main }} />
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 600,
                      color: theme.palette.warning.dark,
                      fontSize: { xs: '0.7rem', md: '0.75rem' },
                    }}
                  >
                    +{mission && mission.vdo_bonus.toLocaleString()} Coin
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Column 3: PDF/Image Button */}
          <Grid size={{ xs: 6, sm: 2, md: 2 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.75,
              }}
            >
              {/* Header */}
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600,
                  color: theme.palette.text.secondary,
                  fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  textAlign: 'center',
                }}
              >
                ไฟล์คำอธิบาย
              </Typography>

              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {/* Glowing backdrop - same as Avatar */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: -4,
                    background: mission.explanation_file
                      ? `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.2)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`
                      : `linear-gradient(135deg, ${alpha(theme.palette.grey[400], 0.15)} 0%, ${alpha(theme.palette.grey[300], 0.08)} 100%)`,
                    borderRadius: '16px',
                    filter: 'blur(8px)',
                  }}
                />

                {mission.explanation_file ? (
                  <Tooltip
                    title={isPdfFile(mission.explanation_file) ? 'ดูไฟล์ PDF' : 'ดูรูปภาพ'}
                    arrow
                    placement="top"
                  >
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isPdfFile(mission.explanation_file)) {
                          handleOpenPdfPreview(mission.explanation_file, getFileName(mission.explanation_file));
                        } else {
                          handleOpenImagePreview(mission.explanation_file);
                        }
                      }}
                      sx={{
                        width: { xs: 56, sm: 64, md: 72 },
                        height: { xs: 56, sm: 64, md: 72 },
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(theme.palette.warning.light, 0.1)} 100%)`,
                        border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                        // boxShadow: `0 4px 20px ${alpha(theme.palette.warning.main, 0.25)}`,
                        position: 'relative',
                        zIndex: 1,
                        // transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-2px) scale(1.05)',
                          boxShadow: `0 8px 28px ${alpha(theme.palette.warning.main, 0.35)}`,
                        },
                      }}
                    >
                      <Box
                        component="img"
                        src="/assets/image/research.png"
                        alt="ไฟล์คำอธิบาย"
                        sx={{
                          width: { xs: 32, sm: 36, md: 42 },
                          height: { xs: 32, sm: 36, md: 42 },
                          objectFit: 'contain',
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Box
                    sx={{
                      width: { xs: 56, sm: 64, md: 72 },
                      height: { xs: 56, sm: 64, md: 72 },
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 0.5,
                      background: `linear-gradient(135deg, ${alpha('#ffffff', 0.9)} 0%, ${alpha(theme.palette.grey[100], 0.8)} 100%)`,
                      border: `2px dashed ${alpha(theme.palette.grey[400], 0.4)}`,
                      boxShadow: `0 4px 20px ${alpha(theme.palette.grey[400], 0.15)}`,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    <Box
                      component="img"
                      src="/assets/image/data-analysics.png"
                      alt="ไม่มีไฟล์"
                      sx={{
                        width: { xs: 24, sm: 28, md: 32 },
                        height: { xs: 24, sm: 28, md: 32 },
                        objectFit: 'contain',
                        opacity: 0.4,
                        filter: 'grayscale(100%)',
                      }}
                    />
                    <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.55rem', textAlign: 'center' }}>
                      ไม่มีไฟล์
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Column 4: Progress */}
          <Grid size={{ xs: 6, sm: 3, md: 4 }}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  ความคืบหน้า
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: progressColor,
                    fontSize: { xs: '0.8rem', md: '0.875rem' },
                  }}
                >
                  {missionsAllProgress && missionsAllProgress.progress ? Math.round(missionsAllProgress.progress) : 0}%
                </Typography>
              </Box>

              <Box
                sx={{
                  position: 'relative',
                  height: { xs: 8, md: 10 },
                  borderRadius: 5,
                  background: alpha(theme.palette.grey[300], 0.4),
                  overflow: 'hidden',
                  boxShadow: `inset 0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: `${missionsAllProgress && missionsAllProgress.progress ? missionsAllProgress.progress : 0}%`,
                    borderRadius: 5,
                    background: (missionsAllProgress?.progress ?? 0) === 100
                      ? `linear-gradient(90deg, ${theme.palette.success.main} 0%, ${theme.palette.success.light} 100%)`
                      : (missionsAllProgress?.progress ?? 0) > 0
                        ? `linear-gradient(90deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.light} 100%)`
                        : 'transparent',
                    boxShadow: (missionsAllProgress?.progress ?? 0) > 0
                      ? `0 2px 8px ${alpha((missionsAllProgress?.progress ?? 0) === 100 ? theme.palette.success.main : theme.palette.warning.main, 0.4)}`
                      : 'none',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
                {/* Shimmer effect for in-progress */}
                {(missionsAllProgress?.progress ?? 0) > 0 && (missionsAllProgress?.progress ?? 0) < 100 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
                      animation: 'shimmer 2s infinite',
                      '@keyframes shimmer': {
                        '0%': { transform: 'translateX(-100%)' },
                        '100%': { transform: 'translateX(100%)' },
                      },
                    }}
                  />
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </AccordionSummary>

      {/* Expanded Content */}
      <AccordionDetails>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            width: '100%',
          }}
        >
          {/* Video Player */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              position: 'relative',
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            {mission && mission.playback_id ? (
              <MuxPlayer
                playbackId={`${mission.playback_id}`}
                metadataVideoTitle={`${mission.vdo_title}`}
                metadataViewerUserId={`${mission.vdo_id}`}
                primaryColor="#ffffff"
                secondaryColor="#000000"
                accentColor={`${theme.palette.primary.main}`}
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                style={{
                  width: '100%',
                  height: isMobile ? '300px' : '500px',
                  borderRadius: theme.general.borderRadius,
                }}
              />
            ) : null}
          </Box>

       
        </Box>
      </AccordionDetails>

      {/* Image Preview */}
      <ImagePreview
        open={openImagePreview}
        handleClose={() => setOpenImagePreview(false)}
        imagePreviews={previewImageUrl}
      />

      {/* PDF Preview */}
      <PdfPreview
        open={openPdfPreview}
        handleClose={() => setOpenPdfPreview(false)}
        pdfUrl={previewPdfUrl}
        fileName={previewFileName}
      />
    </Accordion>

  );
};

const VJStarVideoMember: React.FC<VJStarVideoMemberProps> = ({ overviewDetailById, postProgressvdoComission, member, organization_id, refetchOverview }) => {

  // console.log("overviewDetailById", overviewDetailById && overviewDetailById.data)

  const missionVideo = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.all_vdo || null
  const progressItems = overviewDetailById && overviewDetailById.data && overviewDetailById.data.vdo_data && overviewDetailById.data.vdo_data.my_progress || []
  const { data: videoListByOrganization } = useGetVideoByOrganizationsByIdQuery(
    { id: organization_id },
    { skip: !organization_id }
  );
  const mergedMissionVideo = useMemo(() => {
    const videoById = new Map<string, any>(
      (videoListByOrganization?.data || []).map((video: any) => [
        video.vdo_id,
        video,
      ])
    );

    return (missionVideo || []).map((mission: any) => {
      const video = videoById.get(mission.vdo_id);
      if (!video) return mission;

      return {
        ...mission,
        cover_image: video.cover_image || mission.cover_image,
        vdo_category_id: video.vdo_category_id || mission.vdo_category_id,
        vdo_category: video.vdo_category || mission.vdo_category,
        thumbnail:
          video.cover_image ||
          video.thumbnail ||
          mission.cover_image ||
          mission.thumbnail,
      };
    });
  }, [missionVideo, videoListByOrganization?.data]);
  const unlockedMissionVideo = useMemo(
    () => mergedMissionVideo.filter((mission: any) => mission.is_unlock === true),
    [mergedMissionVideo]
  );
  const categoryGroups = useMemo(
    () => buildVdoCategoryGroups(unlockedMissionVideo, progressItems),
    [unlockedMissionVideo, progressItems]
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const selectedCategory =
    categoryGroups.find((group) => group.id === selectedCategoryId) ||
    categoryGroups[0];



  return (
    <Box >
      {/* Header */}
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ mb: { xs: 1, md: 2 }, fontSize: { xs: '0.9rem', md: '1.2rem' } }}
      >
        VDO โบนัส VJ Star Live ภารกิจ แจคผู้ฆ่ายักษ์
      </Typography>

      {/* Mission List */}
      {categoryGroups.length > 0 && selectedCategory && (
        <Box sx={{ mb: 2 }}>
          <Tabs
            value={selectedCategory.id}
            onChange={(_, value) => setSelectedCategoryId(value)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              minHeight: 38,
              mb: 1.5,
              '& .MuiTab-root': {
                minHeight: 38,
                borderRadius: 2,
                mr: 1,
                px: 1.5,
                fontWeight: 700,
                fontSize: { xs: '0.72rem', md: '0.82rem' },
                color: 'text.primary',
                background: (theme) => alpha(theme.palette.common.white, 0.86),
                border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'primary.main',
                  background: (theme) => alpha(theme.palette.primary.main, 0.06),
                  borderColor: (theme) => alpha(theme.palette.primary.main, 0.32),
                },
              },
              '& .MuiTab-root.Mui-selected': {
                color: '#fff',
                background: (theme) => theme.colors.gradients.primary,
                borderColor: 'transparent',
                boxShadow: (theme) => `0 8px 18px ${alpha(theme.palette.primary.main, 0.22)}`,
                '&:hover': {
                  color: '#fff',
                  background: (theme) => theme.colors.gradients.primaryHover,
                },
              },
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            {categoryGroups.map((group) => (
              <Tab
                key={group.id}
                value={group.id}
                label={`${group.name} ${group.progressPercent}%`}
              />
            ))}
          </Tabs>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background: (theme) => alpha(theme.palette.primary.main, 0.04),
              border: (theme) => `1px solid ${alpha(theme.palette.primary.main, 0.12)}`,
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" gap={2} mb={1}>
              <Typography variant="caption" fontWeight={800} color="text.primary" noWrap>
                {selectedCategory.name}
              </Typography>
              <Chip
                label={`${selectedCategory.progressPercent}%`}
                size="small"
                color={selectedCategory.progressPercent >= 100 ? 'success' : 'warning'}
                sx={{ fontWeight: 900 }}
              />
            </Box>
            <LinearProgress
              variant="determinate"
              value={selectedCategory.progressPercent}
              sx={{
                height: 7,
                borderRadius: 999,
                background: (theme) => alpha(theme.palette.grey[400], 0.2),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 999,
                },
              }}
            />
          </Box>
        </Box>
      )}

      {(selectedCategory?.videos || [])
        .map((mission, index) => (
          <MissionAccordion key={mission.vdo_id} mission={mission} index={index} member_id={member && member.member_id} postProgressvdoComission={postProgressvdoComission} overviewDetailById={overviewDetailById} organization_id={organization_id} refetchOverview={refetchOverview} />
        ))}
    </Box >
  );
};

export default VJStarVideoMember;
