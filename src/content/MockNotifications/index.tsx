'use client';

import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import LiveTvOutlinedIcon from '@mui/icons-material/LiveTvOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import RedeemOutlinedIcon from '@mui/icons-material/RedeemOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { alpha, Avatar, Box, Button, ButtonBase, Chip, Container, Paper, Stack, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useMemo, useState, type ReactNode } from 'react';
import { MOCK_PORTAL_NOTIFICATIONS, type NotificationIconKey, type PortalNotification } from '@/mocks/notifications';

type NotificationFilter = 'all' | 'unread';

const notificationIcon = (iconKey: NotificationIconKey): ReactNode => {
  const props = { fontSize: 'small' as const };

  switch (iconKey) {
    case 'kyc':
      return <VerifiedUserOutlinedIcon {...props} />;
    case 'withdraw':
      return <AccountBalanceWalletOutlinedIcon {...props} />;
    case 'order':
      return <ShoppingBagOutlinedIcon {...props} />;
    case 'coupon':
      return <RedeemOutlinedIcon {...props} />;
    case 'gift':
      return <CardGiftcardOutlinedIcon {...props} />;
    case 'live':
      return <LiveTvOutlinedIcon {...props} />;
    case 'points':
      return <EmojiEventsOutlinedIcon {...props} />;
    case 'account':
      return <TaskAltOutlinedIcon {...props} />;
    case 'training':
      return <SchoolOutlinedIcon {...props} />;
    case 'level':
      return <TrendingUpOutlinedIcon {...props} />;
    case 'recruitment':
      return <GroupAddOutlinedIcon {...props} />;
    case 'content':
      return <ArticleOutlinedIcon {...props} />;
    default:
      return <NotificationsNoneOutlinedIcon {...props} />;
  }
};

export default function MockNotifications() {
  const theme = useTheme();
  const router = useRouter();
  const [items, setItems] = useState<PortalNotification[]>(() => MOCK_PORTAL_NOTIFICATIONS.map((item) => ({ ...item })));
  const [filter, setFilter] = useState<NotificationFilter>('all');
  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);
  const visibleItems = filter === 'unread' ? items.filter((item) => !item.isRead) : items;

  const markAllRead = () => {
    setItems((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  const openNotification = (item: PortalNotification) => {
    setItems((current) => current.map((currentItem) => currentItem.id === item.id ? { ...currentItem, isRead: true } : currentItem));
    router.push(item.href);
  };

  return (
    <Box sx={{ minHeight: '100%', bgcolor: '#f7f8f9', py: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="md">
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'flex-start' }} gap={2}>
          <Box>
            <Typography sx={{ color: theme.palette.primary.main, fontSize: { xs: 24, sm: 28 }, fontWeight: 800, lineHeight: 1.2 }}>
              การแจ้งเตือน
            </Typography>
            <Typography sx={{ mt: 0.75, color: 'text.secondary', fontSize: 13 }}>
              รายการแจ้งเตือนจำลองสำหรับเชื่อมต่อกับระบบจริงในขั้นตอนถัดไป
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Button variant="outlined" onClick={markAllRead} sx={{ alignSelf: { xs: 'flex-start', sm: 'auto' }, borderRadius: 2, fontSize: 12.5, fontWeight: 700 }}>
              อ่านทั้งหมด
            </Button>
          )}
        </Stack>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' }, gap: 1.25, mt: 2.5 }}>
          <Paper elevation={0} sx={{ p: 1.75, border: '1px solid #edf0f2', borderRadius: 2.5 }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>ทั้งหมด</Typography>
            <Typography sx={{ mt: 0.4, color: theme.palette.primary.main, fontSize: 22, fontWeight: 800 }}>{items.length}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 1.75, border: '1px solid #edf0f2', borderRadius: 2.5, bgcolor: unreadCount ? '#fff8f3' : '#fff' }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>ยังไม่อ่าน</Typography>
            <Typography sx={{ mt: 0.4, color: unreadCount ? '#ef4444' : '#16a34a', fontSize: 22, fontWeight: 800 }}>{unreadCount}</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 1.75, border: '1px solid #edf0f2', borderRadius: 2.5, gridColumn: { xs: '1 / -1', sm: 'auto' } }}>
            <Typography sx={{ color: 'text.secondary', fontSize: 12 }}>สถานะข้อมูล</Typography>
            <Typography sx={{ mt: 0.4, color: '#64748b', fontSize: 14, fontWeight: 700 }}>Mock UI เท่านั้น</Typography>
          </Paper>
        </Box>

        <Stack direction="row" gap={1} sx={{ mt: 3, mb: 1.5 }}>
          <Button
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'contained' : 'text'}
            sx={{ borderRadius: 2, px: 1.75, fontSize: 12.5, fontWeight: 700, boxShadow: 'none' }}
          >
            ทั้งหมด ({items.length})
          </Button>
          <Button
            onClick={() => setFilter('unread')}
            variant={filter === 'unread' ? 'contained' : 'text'}
            sx={{ borderRadius: 2, px: 1.75, fontSize: 12.5, fontWeight: 700, boxShadow: 'none' }}
          >
            ยังไม่อ่าน ({unreadCount})
          </Button>
        </Stack>

        <Paper elevation={0} sx={{ border: '1px solid #edf0f2', borderRadius: 2.5, overflow: 'hidden' }}>
          {visibleItems.length > 0 ? visibleItems.map((item, index) => (
            <Box key={item.id}>
              <ButtonBase
                onClick={() => openNotification(item)}
                sx={{
                  display: 'flex',
                  width: '100%',
                  px: { xs: 1.5, sm: 2.25 },
                  py: 1.75,
                  justifyContent: 'flex-start',
                  textAlign: 'left',
                  bgcolor: item.isRead ? '#fff' : '#fff8f3',
                  '&:hover': { bgcolor: item.isRead ? '#fafafa' : '#fff1e8' },
                }}
              >
                <Avatar sx={{ flexShrink: 0, width: 40, height: 40, bgcolor: `${item.color}18`, color: item.color }}>
                  {notificationIcon(item.iconKey)}
                </Avatar>
                <Box sx={{ minWidth: 0, flex: 1, ml: 1.5 }}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} gap={0.75}>
                    <Typography sx={{ color: 'text.primary', fontSize: 14, fontWeight: item.isRead ? 600 : 800, lineHeight: 1.35 }}>
                      {item.title}
                    </Typography>
                    <Chip label={item.category} size="small" sx={{ height: 22, bgcolor: alpha(item.color, 0.1), color: item.color, fontSize: 10.5, fontWeight: 700 }} />
                  </Stack>
                  <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 12.5, lineHeight: 1.45 }}>
                    {item.description}
                  </Typography>
                  <Stack direction="row" gap={1} alignItems="center" sx={{ mt: 0.6 }}>
                    <Typography sx={{ color: 'text.disabled', fontSize: 11 }}>{item.timeLabel}</Typography>
                    <Typography sx={{ color: item.isRead ? 'text.disabled' : '#ef4444', fontSize: 11, fontWeight: 700 }}>
                      {item.isRead ? 'อ่านแล้ว' : 'ยังไม่อ่าน'}
                    </Typography>
                  </Stack>
                </Box>
                {!item.isRead && <Box sx={{ flexShrink: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: '#ef4444', ml: 1 }} />}
              </ButtonBase>
              {index < visibleItems.length - 1 && <Box sx={{ borderBottom: '1px solid #edf0f2' }} />}
            </Box>
          )) : (
            <Box sx={{ p: 5, textAlign: 'center' }}>
              <NotificationsNoneOutlinedIcon sx={{ color: 'text.disabled', fontSize: 40 }} />
              <Typography sx={{ mt: 0.75, color: 'text.secondary', fontSize: 13 }}>
                {filter === 'unread' ? 'อ่านการแจ้งเตือนครบแล้ว' : 'ยังไม่มีการแจ้งเตือน'}
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
