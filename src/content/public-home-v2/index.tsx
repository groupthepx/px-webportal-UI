'use client';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { Avatar, Box, Button, Chip, Container, Rating, Stack, Typography, alpha, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid2';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { IMAGECOVERLADING } from '@/constants/image';
import { useGetActivityListAllQuery } from '@/lib/features/activity';
import { useGetReviewListAllQuery } from '@/lib/features/review';
import { useGetTopVJListAllQuery } from '@/lib/features/topvj';
import type { ActivityDetailModel } from '@/model/activity';
import type { ReviewDetail } from '@/model/review';
import type { TopVJModelDetail } from '@/model/top_vj';

const fallbackTopVjs: Array<Partial<TopVJModelDetail>> = [
  { nick_name: 'Friend', full_name: 'นานา', profile: '', _sum: { amount: 86610 } },
  { nick_name: 'Mild', full_name: 'มิลด์', profile: '', _sum: { amount: 73420 } },
  { nick_name: 'Pim', full_name: 'พิม', profile: '', _sum: { amount: 62890 } },
  { nick_name: 'Aom', full_name: 'ออม', profile: '', _sum: { amount: 51460 } },
];

const fallbackActivities: Array<Partial<ActivityDetailModel>> = [
  { activity_title: 'ภารกิจ STAR LIVE ประจำเดือน', activity_description: 'รวมช่วงเวลาการไลฟ์และกิจกรรมของ VJ ในเดือนนี้' },
  { activity_title: 'Live Challenge', activity_description: 'ติดตามภารกิจและกิจกรรมใหม่จากทีม PX' },
  { activity_title: 'STAR LIVE Community', activity_description: 'เรื่องราวและความเคลื่อนไหวจากชุมชน VJ' },
];

const fallbackReviews: Array<Partial<ReviewDetail>> = [
  { reviewer: 'นานา', review_career: 'VJ TikTok', review_star: 5, review_description: 'มีทีมช่วยดูแลตั้งแต่เริ่มต้น ทำให้กล้าลองและเข้าใจระบบมากขึ้น' },
  { reviewer: 'มิลด์', review_career: 'VJ SUGO', review_star: 5, review_description: 'ชอบที่มีหลักสูตรให้เรียนและเห็นความคืบหน้าของตัวเองชัดเจน' },
  { reviewer: 'พิม', review_career: 'VJ VOYA', review_star: 4.5, review_description: 'เริ่มจากไม่มีประสบการณ์ แต่มีทีมคอยแนะนำทุกขั้นตอน' },
];

const buildUploadUrl = (path?: string) => {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_UPLOADS?.replace(/\/$/, '');
  return base ? `${base}/${path.replace(/^\//, '')}` : path;
};

function useAutoScrollRail(railRef: React.MutableRefObject<HTMLDivElement | null>, delay = 4500) {
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;

    const timer = window.setInterval(() => {
      const step = Math.max(rail.clientWidth * 0.82, 260);
      const isAtEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
      rail.scrollTo({ left: isAtEnd ? 0 : rail.scrollLeft + step, behavior: 'smooth' });
    }, delay);

    return () => window.clearInterval(timer);
  }, [delay, railRef]);
}

const joinSteps = [
  { number: '01', title: 'กรอกข้อมูลสมัคร', description: 'เลือก App ที่สนใจและส่งข้อมูลให้ทีมตรวจสอบ' },
  { number: '02', title: 'เรียนรู้และฝึกฝน', description: 'ทำความเข้าใจระบบและฝึกตามหลักสูตรของ App' },
  { number: '03', title: 'เริ่มต้นเป็น VJ', description: 'เมื่อผ่านขั้นตอนแล้ว คุณก็พร้อมเริ่มสร้างรายได้' },
];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <Box sx={{ maxWidth: 660, mb: { xs: 3, md: 4 } }}>
      <Typography
        sx={{
          color: 'primary.main',
          fontSize: 13,
          fontWeight: 900,
          letterSpacing: 0,
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        {eyebrow}
      </Typography>
      <Typography
        component="h2"
        sx={{
          color: '#172033',
          fontSize: { xs: 27, md: 38 },
          lineHeight: 1.2,
          fontWeight: 900,
          letterSpacing: 0,
        }}
      >
        {title}
      </Typography>
      <Typography sx={{ mt: 1.2, color: '#667085', fontSize: 16, lineHeight: 1.7 }}>
        {description}
      </Typography>
    </Box>
  );
}

export default function PublicHomeV2() {
  const theme = useTheme();
  const router = useRouter();
  const topVjRailRef = useRef<HTMLDivElement | null>(null);
  const starLiveRailRef = useRef<HTMLDivElement | null>(null);
  const reviewRailRef = useRef<HTMLDivElement | null>(null);

  const { data: topVjResponse } = useGetTopVJListAllQuery();
  const { data: activityResponse } = useGetActivityListAllQuery();
  const { data: reviewResponse } = useGetReviewListAllQuery();

  useAutoScrollRail(topVjRailRef);
  useAutoScrollRail(starLiveRailRef, 5200);
  useAutoScrollRail(reviewRailRef, 5000);

  const topVjs = (topVjResponse?.data?.length ? topVjResponse.data : fallbackTopVjs).slice(0, 8);
  const starLiveActivities = (activityResponse?.data?.length ? activityResponse.data : fallbackActivities).slice(0, 8);
  const reviews = (reviewResponse?.data?.length ? reviewResponse.data : fallbackReviews).slice(0, 8);
  return (
    <Box sx={{ bgcolor: '#f7f8fb', overflow: 'hidden' }}>
      <Box
        component="section"
        sx={{
          bgcolor: '#fff4eb',
          borderBottom: '1px solid rgba(241, 89, 42, 0.10)',
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 5 }, py: { xs: 4, md: 7 } }}>
          <Grid container spacing={{ xs: 4, md: 7 }} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Chip
                  icon={<ShieldRoundedIcon />}
                  label="The PX Group · Official VJ Platform"
                  sx={{
                    height: 34,
                    bgcolor: alpha(theme.colors.primary.main, 0.10),
                    color: theme.colors.primary.dark,
                    fontWeight: 800,
                    '& .MuiChip-icon': { color: theme.colors.primary.main },
                  }}
                />
              </Stack>
              <Typography
                component="h1"
                sx={{
                  maxWidth: 660,
                  color: '#172033',
                  fontSize: { xs: 38, md: 58 },
                  lineHeight: 1.08,
                  fontWeight: 900,
                  letterSpacing: 0,
                }}
              >
                เริ่มต้นเส้นทาง VJ
                <Box component="span" sx={{ display: 'block', color: 'primary.main' }}>
                  ในแบบของคุณ
                </Box>
              </Typography>
              <Typography sx={{ maxWidth: 590, mt: 2, color: '#667085', fontSize: { xs: 16, md: 18 }, lineHeight: 1.75 }}>
                สมัครเป็น VJ กับ The PX Group เลือก App ที่สนใจ เรียนรู้ก่อนเริ่มงาน และมีทีมคอยดูแลตั้งแต่วันแรก
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.3} sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => router.push('/register')}
                  sx={{
                    minHeight: 52,
                    px: 2.8,
                    borderRadius: '8px',
                    background: theme.colors.gradients.primary,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 900,
                    boxShadow: '0 14px 28px rgba(241, 89, 42, 0.24)',
                    '&:hover': { background: theme.colors.gradients.primaryHover },
                  }}
                >
                  สมัครเป็น VJ
                </Button>
                <Button
                  component="a"
                  href="#how-to-join"
                  variant="outlined"
                  startIcon={<PlayCircleOutlineRoundedIcon />}
                  sx={{
                    minHeight: 52,
                    px: 2.4,
                    borderRadius: '8px',
                    borderColor: alpha(theme.colors.primary.main, 0.36),
                    color: theme.colors.primary.dark,
                    fontSize: 16,
                    fontWeight: 800,
                  }}
                >
                  ดูขั้นตอนการสมัคร
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: 'relative',
                  minHeight: { xs: 250, sm: 360, md: 480 },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    width: '72%',
                    height: '78%',
                    right: { xs: '8%', md: '12%' },
                    bottom: '4%',
                    bgcolor: '#ffd6bd',
                    borderRadius: '28px',
                    transform: 'rotate(4deg)',
                  }}
                />
                <Box sx={{ position: 'relative', width: '100%', maxWidth: 600, zIndex: 1 }}>
                  <Image
                    src={IMAGECOVERLADING}
                    alt="แอปพลิเคชัน PX VJ"
                    width={900}
                    height={720}
                    priority
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ px: { xs: 2.5, md: 5 } }}>
        <Box component="section" sx={{ py: { xs: 5, md: 8 }, borderTop: '1px solid #eaecf0' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Box sx={{ '& > div': { mx: 'auto' } }}>
              <SectionHeading
                eyebrow="Community proof"
                title="ท็อปวีเจ STAR LIVE"
                description="ดูผลงานของ VJ ที่กำลังเติบโตไปกับระบบ PX VJ และสร้างความเคลื่อนไหวในแต่ละ App"
              />
            </Box>
            <Button variant="outlined" endIcon={<ArrowForwardRoundedIcon />} onClick={() => router.push('/home/vj_star_live')} sx={{ mb: 3, borderRadius: '8px', fontWeight: 800 }}>
              ดูท็อปวีเจทั้งหมด
            </Button>
          </Box>
          <Box
            ref={topVjRailRef}
            sx={{
              display: 'flex',
              justifyContent: { xs: 'flex-start', md: 'center' },
              gap: 1.5,
              overflowX: 'auto',
              pb: 1,
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {topVjs.map((vj: Partial<TopVJModelDetail>, index: number) => {
              const profileUrl = buildUploadUrl(vj.profile);
              const displayName = vj.nick_name || vj.full_name || 'VJ';

              return (
                <Box
                  key={vj.member_id || `${displayName}-${index}`}
                  sx={{
                    minWidth: { xs: 220, sm: 250, md: 290 },
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ position: 'relative', width: '100%', maxWidth: 290, aspectRatio: '1 / 1.22' }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '27%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '53%',
                        height: '47%',
                        overflow: 'hidden',
                        borderRadius: '12px',
                        bgcolor: '#172033',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        zIndex: 0,
                      }}
                    >
                      {profileUrl ? (
                        <Box component="img" src={profileUrl} alt={displayName} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Typography sx={{ fontSize: { xs: 34, md: 44 }, fontWeight: 900 }}>{displayName.charAt(0)}</Typography>
                      )}
                      <Box sx={{ position: 'absolute', left: 6, right: 6, bottom: 8, color: '#fff', textAlign: 'left', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                        <Typography sx={{ fontSize: 10, lineHeight: 1.3 }}>ไอดีห้อง: {vj.room_id || '-'}</Typography>
                        <Typography sx={{ fontSize: 10, lineHeight: 1.3 }}>User ID: {vj.user_id || '-'}</Typography>
                      </Box>
                    </Box>
                    <Box component="img" src="/assets/image/bg_top_vj.png" alt="กรอบท็อปวีเจ" sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
                    <Typography sx={{ position: 'absolute', left: '50%', bottom: '8%', transform: 'translateX(-50%)', zIndex: 2, color: '#fff', fontSize: { xs: 12, md: 15 }, fontWeight: 900, whiteSpace: 'nowrap', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                      {displayName}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
          <Box sx={{ bgcolor: '#172033', borderRadius: '8px', px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2} alignItems={{ xs: 'flex-start', sm: 'center' }}>
              <Box sx={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: '8px', bgcolor: 'rgba(241, 89, 42, 0.16)', color: '#ff9f73' }}>
                <AutoGraphRoundedIcon />
              </Box>
              <Box>
                <Typography sx={{ color: '#fff', fontSize: { xs: 24, md: 31 }, fontWeight: 900 }}>STAR LIVE ความเคลื่อนไหวล่าสุด</Typography>
                <Typography sx={{ mt: 0.4, color: 'rgba(255,255,255,0.68)', fontSize: 14 }}>กิจกรรมและเรื่องราวจากชุมชน VJ ของเรา</Typography>
              </Box>
            </Stack>
            <Box
              ref={starLiveRailRef}
              sx={{
                display: 'flex',
                gap: 1.5,
                overflowX: 'auto',
                mt: 3,
                pb: 1,
                scrollSnapType: 'x mandatory',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {starLiveActivities.map((activity: Partial<ActivityDetailModel>, index: number) => {
                const mediaUrl = activity.playback_id
                  ? `https://image.mux.com/${activity.playback_id}/thumbnail.png`
                  : buildUploadUrl(activity.activity_media);

                return (
                  <Box key={activity.activity_id || `${activity.activity_title}-${index}`} onClick={() => router.push('/activity')} sx={{ minWidth: { xs: 260, sm: 320, md: 360 }, scrollSnapAlign: 'start', bgcolor: '#202b40', border: '1px solid rgba(255,255,255,0.10)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'transform .2s ease', '&:hover': { transform: 'translateY(-3px)' } }}>
                    <Box sx={{ position: 'relative', height: { xs: 145, md: 175 }, bgcolor: '#283650' }}>
                      {mediaUrl ? (
                        <Box component="img" src={mediaUrl} alt={activity.activity_title || 'STAR LIVE activity'} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <Stack alignItems="center" justifyContent="center" sx={{ width: '100%', height: '100%', color: '#ff9f73' }}>
                          <AutoGraphRoundedIcon sx={{ fontSize: 42 }} />
                        </Stack>
                      )}
                      <Box sx={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.45, borderRadius: '999px', bgcolor: 'rgba(0,0,0,0.62)', color: '#fff' }}>
                        <PlayCircleOutlineRoundedIcon sx={{ fontSize: 17 }} />
                        <Typography sx={{ fontSize: 12, fontWeight: 800 }}>STAR LIVE</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Typography sx={{ color: '#fff', fontSize: 17, fontWeight: 900, lineHeight: 1.35 }}>{activity.activity_title || 'กิจกรรม STAR LIVE'}</Typography>
                      <Typography sx={{ mt: 0.7, color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.6 }}>
                        {(activity.activity_description || 'ติดตามกิจกรรมและความเคลื่อนไหวของ VJ').slice(0, 100)}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>

        <Box component="section" sx={{ py: { xs: 5, md: 8 }, borderTop: '1px solid #eaecf0' }}>
          <SectionHeading
            eyebrow="VJ stories"
            title="เสียงจากคนที่เริ่มต้นไปกับเรา"
            description="ประสบการณ์จาก VJ ที่ได้เรียนรู้ ฝึกฝน และเติบโตไปพร้อมกับทีม"
          />
          <Box
            ref={reviewRailRef}
            sx={{
              display: 'flex',
              gap: 1.5,
              overflowX: 'auto',
              pb: 1,
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
          >
            {reviews.map((review: Partial<ReviewDetail>, index: number) => {
              const reviewer = review.reviewer || 'VJ ของเรา';
              const avatarUrl = buildUploadUrl(review.reviewer_media);

              return (
                <Box key={review.review_id || `${reviewer}-${index}`} sx={{ minWidth: { xs: 280, sm: 350, md: 390 }, scrollSnapAlign: 'start', bgcolor: '#fff', border: '1px solid #eaecf0', borderRadius: '8px', p: 2.3 }}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <Avatar src={avatarUrl || undefined} sx={{ width: 48, height: 48, bgcolor: '#fff1e7', color: 'primary.main', fontWeight: 900 }}>
                      {reviewer.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography sx={{ color: '#172033', fontSize: 16, fontWeight: 900 }}>{reviewer}</Typography>
                      <Typography sx={{ color: '#667085', fontSize: 13 }}>{review.review_career || 'VJ ในระบบ PX'}</Typography>
                    </Box>
                  </Stack>
                  <Rating value={review.review_star ?? 5} precision={0.5} readOnly size="small" sx={{ mt: 1.5, color: '#f59e0b' }} />
                  <Typography sx={{ mt: 1, color: '#475467', fontSize: 15, lineHeight: 1.7 }}>
                    “{review.review_description || 'ระบบช่วยให้เริ่มต้นและติดตามการเติบโตได้ง่ายขึ้น'}”
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box id="how-to-join" component="section" sx={{ py: { xs: 5, md: 8 }, borderTop: '1px solid #eaecf0' }}>
          <SectionHeading
            eyebrow="How to start"
            title="สมัครง่าย เริ่มต้นได้ทีละขั้น"
            description="ไม่จำเป็นต้องมีประสบการณ์มาก่อน ทีมจะช่วยแนะนำคุณตามขั้นตอนที่เหมาะสม"
          />
          <Grid container spacing={2}>
            {joinSteps.map((step) => (
              <Grid key={step.number} size={{ xs: 12, md: 4 }}>
                <Box sx={{ position: 'relative', height: '100%', bgcolor: '#172033', color: '#fff', borderRadius: '8px', p: { xs: 2.5, md: 3 } }}>
                  <Typography sx={{ color: '#ffb48d', fontSize: 32, lineHeight: 1, fontWeight: 900 }}>{step.number}</Typography>
                  <Typography sx={{ mt: 2, fontSize: 19, fontWeight: 900 }}>{step.title}</Typography>
                  <Typography sx={{ mt: 0.8, color: 'rgba(255,255,255,0.70)', fontSize: 15, lineHeight: 1.7 }}>{step.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
          <Box sx={{ bgcolor: '#fff1e7', border: '1px solid #ffd8c5', borderRadius: '8px', px: { xs: 2.5, md: 6 }, py: { xs: 3.5, md: 5 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2.5 }}>
            <Box>
              <Typography sx={{ color: '#172033', fontSize: { xs: 24, md: 32 }, lineHeight: 1.2, fontWeight: 900 }}>
                พร้อมเริ่มต้นเส้นทาง VJ แล้วหรือยัง?
              </Typography>
              <Typography sx={{ mt: 0.8, color: '#667085', fontSize: 15, lineHeight: 1.6 }}>
                กรอกข้อมูลเบื้องต้น ใช้เวลาไม่นาน แล้วให้ทีมติดต่อกลับ
              </Typography>
            </Box>
            <Button
              variant="contained"
              endIcon={<ArrowForwardRoundedIcon />}
              onClick={() => router.push('/register')}
              sx={{ minHeight: 50, px: 2.8, flexShrink: 0, borderRadius: '8px', background: theme.colors.gradients.primary, fontSize: 16, fontWeight: 900 }}
            >
              สมัครเป็น VJ
            </Button>
          </Box>
        </Box>
      </Container>
      <Box sx={{ height: { xs: 12, md: 24 } }} />
    </Box>
  );
}
