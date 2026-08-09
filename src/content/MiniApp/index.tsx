'use client';

import CardGiftcardRoundedIcon from '@mui/icons-material/CardGiftcardRounded';
import LiveTvRoundedIcon from '@mui/icons-material/LiveTvRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StorefrontRoundedIcon from '@mui/icons-material/StorefrontRounded';
import RedeemRoundedIcon from '@mui/icons-material/RedeemRounded';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import { alpha, Box, Card, CardActionArea, CardContent, Container, Grid, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { ElementType, useState } from 'react';

import StartLive from '@/components/StartLive';
import useCurrentMemberType from '@/hooks/useCurrentMemberType';

type MiniAppItem = {
  label: string;
  description: string;
  href?: string;
  icon: ElementType;
  action?: 'live';
  vjOnly?: boolean;
};

const miniApps: MiniAppItem[] = [
  { label: 'ตลาด PX', description: 'เลือกซื้อสินค้าและแลกสิทธิ์', href: '/px_market', icon: StorefrontRoundedIcon },
  { label: 'ห้องเสียง', description: 'เข้าร่วมห้องเสียงของสมาชิก', href: '/voice-room', icon: RecordVoiceOverRoundedIcon },
  { label: 'ยืนยันขึ้น Live', description: 'ยืนยันเวลาการขึ้น Live', icon: LiveTvRoundedIcon, action: 'live', vjOnly: true },
  { label: 'อังเปา', description: 'ดูรายการอังเปาที่ได้รับ', href: '/member/angpao', icon: CardGiftcardRoundedIcon },
  { label: 'ของขวัญ', description: 'ตรวจสอบของขวัญของคุณ', href: '/gift_box', icon: RedeemRoundedIcon },
  { label: 'รับคะแนน', description: 'ดูประวัติการได้รับคะแนน', href: '/profile/points_history', icon: StarRoundedIcon },
  { label: 'ห้องเรียนออนไลน์', description: 'เรียนบทเรียนและติดตามความคืบหน้า', href: '/member/training', icon: SchoolRoundedIcon, vjOnly: true }
];

export default function MiniAppPage() {
  const router = useRouter();
  const theme = useTheme();
  const { memberType } = useCurrentMemberType(true);
  const visibleMiniApps = miniApps.filter((item) => !item.vjOnly || memberType !== 'general_member');
  const [liveDialogOpen, setLiveDialogOpen] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, md: 5 } }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: theme.colors.black.main }}>
          มินิแอป
        </Typography>
        <Typography sx={{ mt: 0.5, color: theme.colors.gray.main }}>
          เลือกฟังก์ชันที่ต้องการใช้งาน
        </Typography>
      </Box>

      <Grid container spacing={1.5}>
        {visibleMiniApps.map((item) => {
          const Icon = item.icon;

          return (
            <Grid item xs={6} key={item.label}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  border: `1px solid ${alpha(theme.colors.primary.main, 0.12)}`,
                  borderRadius: 3,
                  background: '#fff'
                }}
              >
                <CardActionArea sx={{ height: '100%' }} onClick={() => item.action === 'live' ? setLiveDialogOpen(true) : router.push(item.href || '/')}>
                  <CardContent sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: 'grid',
                        placeItems: 'center',
                        width: 42,
                        height: 42,
                        mb: 1.5,
                        borderRadius: 2,
                        color: theme.colors.primary.main,
                        backgroundColor: alpha(theme.colors.primary.main, 0.1)
                      }}
                    >
                      <Icon />
                    </Box>
                    <Typography sx={{ fontWeight: 800, fontSize: 15, color: theme.colors.black.main }}>
                      {item.label}
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 12, lineHeight: 1.45, color: theme.colors.gray.main }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <StartLive open={liveDialogOpen} onOpenChange={setLiveDialogOpen} hideTrigger />
    </Container>
  );
}
