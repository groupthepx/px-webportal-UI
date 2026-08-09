'use client';

import ImagePreview from '@/components/ImagePreview';
import PdfPreview from '@/components/PdfPreview';
import { useGetProfileByIdQuery } from '@/lib/features/profile';
import {
    useGetVideoByOrganizationsByIdQuery,
    usePostProgressvdoMutation,
} from '@/lib/features/video';
import { OverviewDetailListModel } from '@/model/overview_detail';
import { decrypt, encrypt } from '@/utils/encryption';
import {
    ArrowBack,
    CheckCircleRounded,
    ChevronRight,
    ExpandMore,
    LockOutlined,
    MenuRounded,
    OndemandVideo,
    PictureAsPdf,
    PlayArrow,
    QuizOutlined,
    SchoolOutlined,
    Timer,
} from '@mui/icons-material';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    alpha,
    Avatar,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Divider,
    Drawer,
    IconButton,
    LinearProgress,
    Skeleton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import MuxPlayer from '@mux/mux-player-react';
import { useParams, useRouter } from 'next/navigation';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getMemberApplications } from '../Home/homeData';
import { useMemberData } from '../memberdetail/hooks';
import { buildVdoCategoryGroups, type VdoCategoryGroup } from './categoryGroups';

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

type LessonTopic = {
    id: string;
    title: string;
    mission: any;
    progress: number;
    locked: boolean;
    completed: boolean;
};

type LessonGroup = VdoCategoryGroup & {
    locked: boolean;
    isCompleted: boolean;
    examReady: boolean;
    topics: LessonTopic[];
};

const getProgress = (progressItems: any[], vdoId: string) => {
    const item = progressItems.find((progress) => `${progress?.vdo_id || progress?.vdo?.vdo_id || ''}` === vdoId);
    const value = Number(item?.progress || 0);
    return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
};

const getFileName = (url?: string) => {
    if (!url) return 'เอกสารประกอบ';
    try {
        return new URL(url).pathname.split('/').pop() || 'เอกสารประกอบ';
    } catch {
        return url.split('/').pop() || 'เอกสารประกอบ';
    }
};

const isPdfFile = (url?: string) => Boolean(url && url.toLowerCase().includes('.pdf'));

function StatusChip({ completed, locked }: { completed: boolean; locked: boolean }) {
    if (locked) {
        return (
            <Chip
                size="small"
                icon={<LockOutlined sx={{ fontSize: '14px !important' }} />}
                label="ล็อกอยู่"
                sx={{ bgcolor: '#f1f2f4', color: '#5f6368', fontSize: 11.5, fontWeight: 700 }}
            />
        );
    }

    return (
        <Chip
            size="small"
            icon={completed ? <CheckCircleRounded sx={{ fontSize: '14px !important' }} /> : undefined}
            label={completed ? 'เรียนจบแล้ว' : 'กำลังเรียน'}
            sx={{
                bgcolor: completed ? '#e9f9e7' : '#fff4e8',
                color: completed ? '#16803c' : '#c65b14',
                fontSize: 11.5,
                fontWeight: 700,
            }}
        />
    );
}

function LessonSidebar({
    lessons,
    selectedTopicId,
    onSelectTopic,
    onOpenExam,
}: {
    lessons: LessonGroup[];
    selectedTopicId: string;
    onSelectTopic: (topic: LessonTopic) => void;
    onOpenExam: (lesson: LessonGroup) => void;
}) {
    const theme = useTheme();
    const [expandedLessonId, setExpandedLessonId] = useState<string | null | undefined>(undefined);
    const selectedLessonId = lessons.find((lesson) => lesson.topics.some((topic) => topic.id === selectedTopicId && !topic.locked))?.id;
    const expandedLesson = expandedLessonId ?? selectedLessonId ?? lessons.find((lesson) => !lesson.locked)?.id ?? '';

    return (
        <Card
            elevation={0}
            sx={{
                position: { md: 'sticky' },
                top: { md: 92 },
                maxHeight: { md: 'calc(100vh - 112px)' },
                overflowY: { md: 'auto' },
                border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`,
                borderRadius: 2.5,
            }}
        >
            <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.common.black, 0.08)}` }}>
                <Typography sx={{ color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>
                    เนื้อหาบทเรียน
                </Typography>
                <Typography sx={{ mt: 0.4, color: theme.colors.gray.main, fontSize: 12.5 }}>
                    เรียงลำดับการเรียนและข้อสอบตามบท
                </Typography>
            </Box>

            <Box sx={{ p: 1 }}>
                {lessons.map((lesson, lessonIndex) => {
                    const isExpanded = expandedLesson === lesson.id;
                    const completedTopics = lesson.topics.filter((topic) => topic.completed).length;

                    return (
                        <Accordion
                            key={lesson.id}
                            expanded={isExpanded && !lesson.locked}
                            onChange={() => {
                                if (!lesson.locked) setExpandedLessonId(isExpanded ? null : lesson.id);
                            }}
                            disableGutters
                            elevation={0}
                            sx={{
                                '&:before': { display: 'none' },
                                bgcolor: lesson.locked ? '#f7f7f8' : '#fff',
                                border: `1px solid ${alpha(theme.palette.common.black, 0.07)}`,
                                borderRadius: 1.5,
                                mb: 1,
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={lesson.locked ? <LockOutlined sx={{ color: '#92969b', fontSize: 18 }} /> : <ExpandMore sx={{ color: theme.colors.primary.main }} />}
                                sx={{
                                    minHeight: 68,
                                    px: 1.5,
                                    '& .MuiAccordionSummary-content': { my: 1.2 },
                                }}
                            >
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                    <Avatar
                                        variant="rounded"
                                        src={resolveVdoCoverUrl(lesson.topics[0]?.mission)}
                                        sx={{ width: 38, height: 38, bgcolor: alpha(theme.colors.primary.main, 0.1), color: theme.colors.primary.main }}
                                    >
                                        {lessonIndex + 1}
                                    </Avatar>
                                    <Box minWidth={0}>
                                        <Typography sx={{ color: lesson.locked ? '#70757a' : theme.colors.black.main, fontSize: 13.5, fontWeight: 800 }} noWrap>
                                            บทที่ {lessonIndex + 1} · {lesson.name}
                                        </Typography>
                                        <Typography sx={{ mt: 0.25, color: theme.colors.gray.main, fontSize: 11.5 }}>
                                            {lesson.locked ? 'เรียนบทก่อนหน้าให้จบก่อน' : `${completedTopics}/${lesson.topics.length} หัวข้อ`}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </AccordionSummary>

                            <AccordionDetails sx={{ pt: 0, px: 1 }}>
                                <Stack spacing={0.5}>
                                    {lesson.topics.map((topic, topicIndex) => (
                                        <Button
                                            key={topic.id}
                                            variant="text"
                                            disabled={topic.locked}
                                            onClick={() => onSelectTopic(topic)}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                alignItems: 'flex-start',
                                                gap: 1,
                                                px: 1.1,
                                                py: 1,
                                                minHeight: 56,
                                                borderRadius: 1.25,
                                                color: topic.locked ? '#8a8f94' : topic.id === selectedTopicId ? theme.colors.primary.main : theme.colors.black.main,
                                                bgcolor: topic.id === selectedTopicId ? alpha(theme.colors.primary.main, 0.08) : 'transparent',
                                                textAlign: 'left',
                                                '&:hover': { bgcolor: alpha(theme.colors.primary.main, 0.06) },
                                                '&.Mui-disabled': { color: '#8a8f94' },
                                            }}
                                        >
                                            {topic.locked ? <LockOutlined sx={{ mt: 0.15, fontSize: 17 }} /> : topic.completed ? <CheckCircleRounded sx={{ mt: 0.15, color: '#16803c', fontSize: 17 }} /> : <PlayArrow sx={{ mt: 0.15, color: theme.colors.primary.main, fontSize: 18 }} />}
                                            <Box minWidth={0} flex={1}>
                                                <Typography sx={{ fontSize: 12.5, fontWeight: topic.id === selectedTopicId ? 800 : 600, lineHeight: 1.35 }}>
                                                    หัวข้อที่ {topicIndex + 1} · {topic.title}
                                                </Typography>
                                                <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: 10.5 }}>
                                                    {topic.mission?.explanation_file ? 'วิดีโอและเอกสารประกอบ' : 'วิดีโอ'}
                                                </Typography>
                                            </Box>
                                            {topic.id === selectedTopicId && <ChevronRight sx={{ mt: 0.15, fontSize: 17 }} />}
                                        </Button>
                                    ))}

                                    <Divider sx={{ my: 0.5 }} />
                                    <Button
                                        variant="text"
                                        disabled={!lesson.examReady}
                                        onClick={() => onOpenExam(lesson)}
                                        startIcon={lesson.examReady ? <QuizOutlined /> : <LockOutlined />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            px: 1.1,
                                            py: 1,
                                            borderRadius: 1.25,
                                            color: lesson.examReady ? theme.colors.primary.main : '#8a8f94',
                                            fontSize: 12.5,
                                            fontWeight: 800,
                                            '&.Mui-disabled': { color: '#8a8f94' },
                                        }}
                                    >
                                        {lesson.examReady ? 'เข้าสู่หน้าข้อสอบ' : 'ข้อสอบ · เรียนหัวข้อให้ครบก่อน'}
                                    </Button>
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    );
                })}
            </Box>
        </Card>
    );
}

function TopicViewer({
    topic,
    memberId,
    organizationId,
    overviewDetailById,
    postProgress,
    refetchOverview,
}: {
    topic: LessonTopic;
    memberId: string;
    organizationId: string;
    overviewDetailById: OverviewDetailListModel;
    postProgress: any;
    refetchOverview: () => any;
}) {
    const theme = useTheme();
    const [videoDuration, setVideoDuration] = useState<number | null>(null);
    const [openImagePreview, setOpenImagePreview] = useState(false);
    const [openPdfPreview, setOpenPdfPreview] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState('');
    const [previewPdfUrl, setPreviewPdfUrl] = useState('');
    const [previewFileName, setPreviewFileName] = useState('');
    const triggeredThresholds = useRef<Set<number>>(new Set());
    const savedProgress = getProgress(overviewDetailById?.data?.vdo_data?.my_progress || [], topic.id);
    const coverUrl = resolveVdoCoverUrl(topic.mission);

    const saveProgress = useCallback((progress: number) => {
        if (progress <= savedProgress) return;
        postProgress({
            vdo: {
                member_id: memberId,
                vdo_id: topic.id,
                progress,
                organization_id: organizationId,
            },
        })
            .unwrap()
            .then(() => refetchOverview())
            .catch(() => undefined);
    }, [memberId, organizationId, postProgress, refetchOverview, savedProgress, topic.id]);

    const handleTimeUpdate = useCallback((event: any) => {
        const video = event.target as HTMLMediaElement;
        const duration = video.duration;
        if (!duration || duration <= 0) return;

        const progress = Math.min(100, (video.currentTime / duration) * 100);
        const threshold = Math.floor(progress / 10) * 10;
        if (threshold >= 10 && threshold <= 100 && !triggeredThresholds.current.has(threshold)) {
            triggeredThresholds.current.add(threshold);
            saveProgress(progress);
        }
    }, [saveProgress]);

    const openFilePreview = () => {
        const fileUrl = toMediaUrl(topic.mission?.explanation_file);
        if (!fileUrl) return;
        if (isPdfFile(fileUrl)) {
            setPreviewPdfUrl(fileUrl);
            setPreviewFileName(getFileName(fileUrl));
            setOpenPdfPreview(true);
        } else {
            setPreviewImageUrl(fileUrl);
            setOpenImagePreview(true);
        }
    };

    return (
        <Card elevation={0} sx={{ border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`, borderRadius: 2.5, overflow: 'hidden' }}>
            <Box sx={{ position: 'relative', bgcolor: '#17212b', aspectRatio: { xs: '16 / 10', sm: '16 / 9' }, minHeight: { xs: 210, sm: 360 } }}>
                {topic.mission?.playback_id ? (
                    <MuxPlayer
                        key={topic.id}
                        playbackId={`${topic.mission.playback_id}`}
                        metadataVideoTitle={`${topic.title}`}
                        metadataViewerUserId={`${topic.id}`}
                        primaryColor="#ffffff"
                        secondaryColor="#000000"
                        accentColor={`${theme.palette.primary.main}`}
                        onLoadedMetadata={(event: any) => setVideoDuration(event.target.duration)}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={() => saveProgress(100)}
                        style={{ width: '100%', height: '100%' }}
                    />
                ) : coverUrl ? (
                    <Box component="img" src={coverUrl} alt={topic.title} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <Stack alignItems="center" justifyContent="center" spacing={1} sx={{ height: '100%', color: '#fff' }}>
                        <OndemandVideo sx={{ fontSize: 50, opacity: 0.75 }} />
                        <Typography sx={{ fontSize: 13, opacity: 0.8 }}>ยังไม่มีสื่อสำหรับหัวข้อนี้</Typography>
                    </Stack>
                )}
                {coverUrl && !topic.mission?.playback_id && (
                    <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', bgcolor: alpha('#000', 0.2) }}>
                        <PlayArrow sx={{ color: '#fff', fontSize: 62 }} />
                    </Box>
                )}
            </Box>

            <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.25}>
                    <Box minWidth={0}>
                        <Typography sx={{ color: theme.colors.black.main, fontSize: { xs: 18, sm: 22 }, fontWeight: 800, lineHeight: 1.3 }}>
                            {topic.title}
                        </Typography>
                        <Typography sx={{ mt: 0.6, color: theme.colors.gray.main, fontSize: 12.5 }}>
                            {videoDuration ? `${Math.floor(videoDuration / 60)}:${String(Math.floor(videoDuration % 60)).padStart(2, '0')} นาที` : 'วิดีโอการเรียนรู้'}
                            {topic.mission?.vdo_bonus ? ` · +${Number(topic.mission.vdo_bonus).toLocaleString()} Coin` : ''}
                        </Typography>
                    </Box>
                    <StatusChip completed={topic.completed} locked={topic.locked} />
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1.75 }}>
                    <LinearProgress
                        variant="determinate"
                        value={topic.progress}
                        sx={{ flex: 1, height: 8, borderRadius: 99, bgcolor: '#eceff2', '& .MuiLinearProgress-bar': { borderRadius: 99, bgcolor: topic.completed ? '#16a34a' : theme.colors.primary.main } }}
                    />
                    <Typography sx={{ minWidth: 38, color: topic.completed ? '#16803c' : theme.colors.primary.main, fontSize: 12.5, fontWeight: 800, textAlign: 'right' }}>
                        {Math.round(topic.progress)}%
                    </Typography>
                </Stack>

                {topic.mission?.explanation_file && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={isPdfFile(topic.mission.explanation_file) ? <PictureAsPdf /> : <OndemandVideo />}
                        onClick={openFilePreview}
                        sx={{ mt: 2, borderRadius: 1.5, fontSize: 12.5 }}
                    >
                        เปิดเอกสารประกอบ
                    </Button>
                )}
            </Box>

            <ImagePreview open={openImagePreview} handleClose={() => setOpenImagePreview(false)} imagePreviews={previewImageUrl} />
            <PdfPreview open={openPdfPreview} handleClose={() => setOpenPdfPreview(false)} pdfUrl={previewPdfUrl} fileName={previewFileName} />
        </Card>
    );
}

function buildLessonGroups(videos: any[], progressItems: any[]): LessonGroup[] {
    const rawGroups = buildVdoCategoryGroups(videos, progressItems);
    let previousLessonComplete = true;

    return rawGroups.map((group, lessonIndex) => {
        const serverLocksLesson = group.videos.length > 0 && group.videos.every((video) => video.is_unlock === false);
        const lessonLocked = serverLocksLesson || (lessonIndex > 0 && !previousLessonComplete);
        let previousTopicComplete = true;

        const topics = group.videos.map((mission: any) => {
            const progress = getProgress(progressItems, `${mission.vdo_id}`);
            const serverLocksTopic = mission.is_unlock === false;
            const locked = lessonLocked || serverLocksTopic || !previousTopicComplete;
            const completed = progress >= 100;
            previousTopicComplete = completed;
            return {
                id: `${mission.vdo_id}`,
                title: mission.vdo_title || 'หัวข้อการเรียน',
                mission,
                progress,
                locked,
                completed,
            };
        });

        const completed = topics.length > 0 && topics.every((topic) => topic.completed);
        previousLessonComplete = completed && !lessonLocked;

        return {
            ...group,
            locked: lessonLocked,
            examReady: completed && !lessonLocked,
            topics,
            completed: topics.filter((topic) => topic.completed).length,
            isCompleted: completed,
        } as LessonGroup;
    });
}

const createMockMission = (id: string, title: string, progress: number, locked = false) => ({
    vdo_id: id,
    vdo_title: title,
    vdo_bonus: 30,
    mockProgress: progress,
    is_unlock: !locked,
    is_active: true,
    cover_image: '/assets/image/research.png',
});

const MOCK_LESSON_GROUPS: LessonGroup[] = [
    {
        id: 'mock-lesson-1',
        name: 'พื้นฐานการเริ่มต้นเป็น VJ',
        sortOrder: 1,
        videos: [],
        total: 3,
        completed: 1,
        progressPercent: 50,
        locked: false,
        isCompleted: false,
        examReady: false,
        topics: [
            { id: 'mock-topic-1-1', title: 'รู้จักระบบและการเตรียมตัว', mission: createMockMission('mock-topic-1-1', 'รู้จักระบบและการเตรียมตัว', 100), progress: 100, locked: false, completed: true },
            { id: 'mock-topic-1-2', title: 'การใช้งาน App เบื้องต้น', mission: createMockMission('mock-topic-1-2', 'การใช้งาน App เบื้องต้น', 50), progress: 50, locked: false, completed: false },
            { id: 'mock-topic-1-3', title: 'แนวทางการทำงานที่ควรรู้', mission: createMockMission('mock-topic-1-3', 'แนวทางการทำงานที่ควรรู้', 0, true), progress: 0, locked: true, completed: false },
        ],
    },
    {
        id: 'mock-lesson-2',
        name: 'ทักษะการทำงานกับผู้ชม',
        sortOrder: 2,
        videos: [],
        total: 2,
        completed: 2,
        progressPercent: 100,
        locked: false,
        isCompleted: true,
        examReady: true,
        topics: [
            { id: 'mock-topic-2-1', title: 'การสื่อสารอย่างมืออาชีพ', mission: createMockMission('mock-topic-2-1', 'การสื่อสารอย่างมืออาชีพ', 100), progress: 100, locked: false, completed: true },
            { id: 'mock-topic-2-2', title: 'การดูแลผู้ชมระหว่าง Live', mission: createMockMission('mock-topic-2-2', 'การดูแลผู้ชมระหว่าง Live', 100), progress: 100, locked: false, completed: true },
        ],
    },
    {
        id: 'mock-lesson-3',
        name: 'ทักษะขั้นสูง',
        sortOrder: 3,
        videos: [],
        total: 2,
        completed: 0,
        progressPercent: 0,
        locked: true,
        isCompleted: false,
        examReady: false,
        topics: [
            { id: 'mock-topic-3-1', title: 'การวางแผนเนื้อหา', mission: createMockMission('mock-topic-3-1', 'การวางแผนเนื้อหา', 0, true), progress: 0, locked: true, completed: false },
            { id: 'mock-topic-3-2', title: 'การสร้างประสบการณ์ที่ดี', mission: createMockMission('mock-topic-3-2', 'การสร้างประสบการณ์ที่ดี', 0, true), progress: 0, locked: true, completed: false },
        ],
    },
];

export default function VJStarVideoPage() {
    const theme = useTheme();
    const router = useRouter();
    const routeParams = useParams<{ id?: string }>();
    const ParamsId = useMemo(() => {
        if (!routeParams?.id) return '0';
        try {
            return `${decrypt(decodeURIComponent(routeParams.id))}`;
        } catch {
            return decodeURIComponent(routeParams.id);
        }
    }, [routeParams?.id]);

    const { data: profileById, isLoading: isLoadingProfile } = useGetProfileByIdQuery();
    const memberParamsId = profileById?.data?.member_id ? `${profileById.data.member_id}` : '0';
    const { memberDetail, overviewDetailById, isLoading, refetchOverview } = useMemberData({
        memberParamsId,
        organizationId: ParamsId,
    });
    const [postProgressvdoComission] = usePostProgressvdoMutation();
    const { data: videoListByOrganization } = useGetVideoByOrganizationsByIdQuery(
        { id: ParamsId },
        { skip: ParamsId === '0' },
    );

    const missionVideo = overviewDetailById?.data?.vdo_data?.all_vdo || [];
    const progressItems = overviewDetailById?.data?.vdo_data?.my_progress || [];
    const mergedMissionVideo = useMemo(() => {
        const videoById = new Map<string, any>((videoListByOrganization?.data || []).map((video: any) => [`${video.vdo_id}`, video]));

        return missionVideo.map((mission: any) => {
            const video = videoById.get(`${mission.vdo_id}`);
            if (!video) return mission;
            return {
                ...mission,
                cover_image: video.cover_image || mission.cover_image,
                vdo_category_id: video.vdo_category_id || mission.vdo_category_id,
                vdo_category: video.vdo_category || mission.vdo_category,
                thumbnail: video.cover_image || video.thumbnail || mission.cover_image || mission.thumbnail,
            };
        });
    }, [missionVideo, videoListByOrganization?.data]);

    const lessons = useMemo(() => buildLessonGroups(mergedMissionVideo, progressItems), [mergedMissionVideo, progressItems]);
    const [showMockCases, setShowMockCases] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const displayLessons = showMockCases ? [...lessons, ...MOCK_LESSON_GROUPS] : lessons;
    const [selectedTopicId, setSelectedTopicId] = useState('');

    const firstAvailableTopic = useMemo(
        () => displayLessons.flatMap((lesson) => lesson.topics).find((topic) => !topic.locked),
        [displayLessons],
    );

    const selectedTopicFromState = displayLessons.flatMap((lesson) => lesson.topics).find((topic) => topic.id === selectedTopicId && !topic.locked);
    const selectedTopic = selectedTopicFromState || firstAvailableTopic;
    const completedLessons = displayLessons.filter((lesson) => lesson.isCompleted).length;
    const totalTopics = displayLessons.reduce((total, lesson) => total + lesson.topics.length, 0);
    const completedTopics = displayLessons.reduce((total, lesson) => total + lesson.topics.filter((topic) => topic.completed).length, 0);
    const overallProgress = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const isLoadingAll = isLoadingProfile || isLoading;
    const currentApp = useMemo(
        () => getMemberApplications(memberDetail).find((app) => app.id === ParamsId),
        [memberDetail, ParamsId],
    );

    const openExam = (lesson: LessonGroup) => {
        router.push(`/member/training/${encodeURIComponent(encrypt(ParamsId))}/exam/${encodeURIComponent(encrypt(lesson.id))}`);
    };

    if (isLoadingAll) {
        return (
            <Box sx={{ minHeight: '70vh', bgcolor: theme.palette.background.default, py: 4 }}>
                <Container maxWidth="lg"><Stack spacing={2}><Skeleton variant="rounded" height={120} /><Skeleton variant="rounded" height={420} /></Stack></Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: theme.palette.background.default }}>
            <Box sx={{ background: theme.colors.gradients.primary, color: '#fff', py: { xs: 2.25, md: 3 }, px: { xs: 2, md: 3 } }}>
                <Container maxWidth="lg">
                    <Stack direction="row" alignItems="center" spacing={1.25}>
                        <IconButton onClick={() => router.back()} aria-label="กลับ" sx={{ color: '#fff', bgcolor: alpha('#fff', 0.14), '&:hover': { bgcolor: alpha('#fff', 0.24) } }}>
                            <ArrowBack />
                        </IconButton>
                        <Box minWidth={0} flex={1}>
                            <Typography sx={{ fontSize: { xs: 18, sm: 22, md: 26 }, fontWeight: 800, lineHeight: 1.25 }} noWrap>
                                บทเรียน VJ Star Video
                            </Typography>
                            <Typography sx={{ mt: 0.25, color: alpha('#fff', 0.82), fontSize: 12.5 }} noWrap>
                                เรียนตามลำดับหัวข้อและปลดล็อกข้อสอบของแต่ละบท
                            </Typography>
                        </Box>
                        <Avatar src={currentApp?.logo || undefined} variant="rounded" sx={{ width: 42, height: 42, bgcolor: '#fff', color: theme.colors.primary.main, border: `2px solid ${alpha('#fff', 0.7)}` }}>
                            {currentApp?.name?.slice(0, 1) || 'A'}
                        </Avatar>
                    </Stack>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ py: { xs: 2, md: 3 } }}>
                <Card elevation={0} sx={{ mb: 2, p: { xs: 1.75, md: 2.25 }, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`, borderRadius: 2.5 }}>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }}>
                        <Stack direction="row" spacing={1.2} alignItems="center" flex={1}>
                            <Box sx={{ width: 42, height: 42, display: 'grid', placeItems: 'center', flexShrink: 0, borderRadius: 1.5, color: '#fff', background: theme.colors.gradients.primary }}>
                                <SchoolOutlined />
                            </Box>
                            <Box minWidth={0}>
                                <Typography sx={{ color: theme.colors.black.main, fontSize: 16, fontWeight: 800 }}>
                                    ความคืบหน้าการเรียน
                                </Typography>
                                <Typography sx={{ mt: 0.25, color: theme.colors.gray.main, fontSize: 12.5 }}>
                                    เรียนจบ {completedLessons}/{displayLessons.length} บท · {completedTopics}/{totalTopics} หัวข้อ
                                </Typography>
                            </Box>
                        </Stack>
                        <Box sx={{ minWidth: { sm: 220 } }}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                <Typography sx={{ color: 'text.secondary', fontSize: 11.5 }}>ความคืบหน้ารวม</Typography>
                                <Typography sx={{ color: theme.colors.primary.main, fontSize: 12.5, fontWeight: 800 }}>{overallProgress}%</Typography>
                            </Stack>
                            <LinearProgress variant="determinate" value={overallProgress} sx={{ height: 8, borderRadius: 99, bgcolor: '#edf0f3', '& .MuiLinearProgress-bar': { borderRadius: 99, background: theme.colors.gradients.primary } }} />
                        </Box>
                        <Button
                            size="small"
                            variant={showMockCases ? 'contained' : 'outlined'}
                            onClick={() => setShowMockCases((current) => !current)}
                            sx={{
                                flexShrink: 0,
                                borderRadius: 1.5,
                                fontSize: 11.5,
                                whiteSpace: 'nowrap',
                                ...(showMockCases ? { color: '#fff', background: theme.colors.gradients.primary } : { color: theme.colors.primary.main, borderColor: alpha(theme.colors.primary.main, 0.35) }),
                            }}
                        >
                            {showMockCases ? 'ซ่อนตัวอย่างทุกสถานะ' : 'ดูตัวอย่างทุกสถานะ'}
                        </Button>
                    </Stack>
                </Card>

                {displayLessons.length === 0 ? (
                    <Card elevation={0} sx={{ p: 5, textAlign: 'center', border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`, borderRadius: 2.5 }}>
                        <OndemandVideo sx={{ color: theme.colors.primary.main, fontSize: 52 }} />
                        <Typography sx={{ mt: 1, color: theme.colors.black.main, fontSize: 18, fontWeight: 800 }}>ยังไม่มีบทเรียน</Typography>
                        <Typography sx={{ mt: 0.5, color: theme.colors.gray.main, fontSize: 13 }}>เมื่อมีบทเรียนที่เปิดให้คุณ ระบบจะแสดงรายการที่นี่</Typography>
                    </Card>
                ) : (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1fr) 360px' }, gap: { xs: 2, md: 2.5 }, alignItems: 'start' }}>
                        <Box>
                            {selectedTopic ? (
                                <TopicViewer
                                    topic={selectedTopic}
                                    memberId={`${memberDetail?.member_id || ''}`}
                                    organizationId={ParamsId}
                                    overviewDetailById={overviewDetailById}
                                    postProgress={postProgressvdoComission}
                                    refetchOverview={refetchOverview}
                                />
                            ) : (
                                <Card elevation={0} sx={{ p: 4, borderRadius: 2.5, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}` }}>
                                    <Typography sx={{ fontSize: 15, fontWeight: 800 }}>บทเรียนนี้ยังไม่เปิดให้เข้าเรียน</Typography>
                                </Card>
                            )}

                            {selectedTopic && (
                                <Card elevation={0} sx={{ mt: 2, p: { xs: 1.75, md: 2.25 }, border: `1px solid ${alpha(theme.palette.common.black, 0.08)}`, borderRadius: 2.5 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Timer sx={{ color: theme.colors.primary.main, fontSize: 20 }} />
                                        <Typography sx={{ color: theme.colors.black.main, fontSize: 14, fontWeight: 800 }}>วิธีเรียนให้ครบตามลำดับ</Typography>
                                    </Stack>
                                    <Typography sx={{ mt: 0.75, color: theme.colors.gray.main, fontSize: 12.5, lineHeight: 1.7 }}>
                                        หัวข้อถัดไปจะเปิดเมื่อเรียนหัวข้อก่อนหน้าเสร็จ และข้อสอบจะเปิดเมื่อเรียนครบทุกหัวข้อในบทนั้น
                                    </Typography>
                                </Card>
                            )}
                        </Box>

                        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                            <LessonSidebar lessons={displayLessons} selectedTopicId={selectedTopic?.id || ''} onSelectTopic={(topic) => setSelectedTopicId(topic.id)} onOpenExam={openExam} />
                        </Box>
                    </Box>
                )}
            </Container>

            <Box
                sx={{
                    display: { xs: 'flex', md: 'none' },
                    position: 'fixed',
                    zIndex: 1200,
                    right: 16,
                    bottom: 80,
                }}
            >
                <Tooltip title="เลือกรายการบทเรียน" arrow>
                    <IconButton onClick={() => setMobileSidebarOpen(true)} aria-label="เลือกรายการบทเรียน" sx={{ width: 48, height: 48, color: '#fff', bgcolor: theme.colors.primary.main, boxShadow: `0 8px 20px ${alpha(theme.colors.primary.main, 0.28)}`, '&:hover': { bgcolor: theme.colors.primary.dark } }}>
                        <MenuRounded />
                    </IconButton>
                </Tooltip>
            </Box>

            <Drawer
                anchor="right"
                open={mobileSidebarOpen}
                onClose={() => setMobileSidebarOpen(false)}
                sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 'min(92vw, 380px)', p: 1, bgcolor: theme.palette.background.default } }}
            >
                <LessonSidebar
                    lessons={displayLessons}
                    selectedTopicId={selectedTopic?.id || ''}
                    onSelectTopic={(topic) => { setSelectedTopicId(topic.id); setMobileSidebarOpen(false); }}
                    onOpenExam={(lesson) => { setMobileSidebarOpen(false); openExam(lesson); }}
                />
            </Drawer>
        </Box>
    );
}
