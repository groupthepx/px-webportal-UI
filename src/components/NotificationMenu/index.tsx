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
import { Avatar, Box, Button, Divider, ListItemIcon, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import type { NotificationIconKey, PortalNotification } from '@/mocks/notifications';

export type { PortalNotification } from '@/mocks/notifications';

type NotificationMenuProps = {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: PortalNotification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
};

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

export default function NotificationMenu({
  anchorEl,
  open,
  onClose,
  items,
  onRead,
  onReadAll,
}: NotificationMenuProps) {
  const router = useRouter();
  const unreadCount = items.filter((item) => !item.isRead).length;

  const handleOpen = (item: PortalNotification) => {
    onRead(item.id);
    onClose();
    router.push(item.href);
  };

  const handleOpenAll = () => {
    onClose();
    router.push('/member/notifications');
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            width: { xs: 340, sm: 410 },
            maxWidth: 'calc(100vw - 24px)',
            borderRadius: 2.5,
            overflow: 'hidden',
          },
        },
      }}
    >
      <Box sx={{ px: 2, pt: 1.5, pb: 1.25 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Box>
            <Typography sx={{ fontWeight: 800, fontSize: 16, color: 'text.primary' }}>
              การแจ้งเตือน
            </Typography>
            <Typography sx={{ mt: 0.25, color: 'text.secondary', fontSize: 12 }}>
              {items.length} รายการ · ยังไม่อ่าน {unreadCount} รายการ
            </Typography>
          </Box>
          {unreadCount > 0 && (
            <Button
              onClick={onReadAll}
              size="small"
              sx={{ minWidth: 'auto', px: 0.75, fontSize: 11.5, fontWeight: 700 }}
            >
              อ่านทั้งหมด
            </Button>
          )}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ maxHeight: { xs: '58vh', sm: 540 }, overflowY: 'auto' }}>
        {items.length > 0 ? items.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => handleOpen(item)}
            sx={{
              px: 2,
              py: 1.25,
              alignItems: 'flex-start',
              whiteSpace: 'normal',
              gap: 0.25,
              bgcolor: item.isRead ? 'background.paper' : '#fff8f3',
              '&:hover': { bgcolor: item.isRead ? '#f8fafc' : '#fff1e8' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 42, mt: 0.2, position: 'relative' }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: `${item.color}18`, color: item.color }}>
                {notificationIcon(item.iconKey)}
              </Avatar>
              {!item.isRead && (
                <Box
                  aria-label="ยังไม่ได้อ่าน"
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: 4,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: '#ef4444',
                    border: '2px solid #fff8f3',
                  }}
                />
              )}
            </ListItemIcon>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <Typography sx={{ fontSize: 13.5, fontWeight: item.isRead ? 600 : 800, lineHeight: 1.35 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ flexShrink: 0, color: 'text.disabled', fontSize: 10.5, lineHeight: 1.4 }}>
                  {item.category}
                </Typography>
              </Stack>
              <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: 12, lineHeight: 1.4 }}>
                {item.description}
              </Typography>
              <Typography sx={{ mt: 0.55, color: 'text.disabled', fontSize: 11, lineHeight: 1.3 }}>
                {item.timeLabel}
              </Typography>
            </Box>
          </MenuItem>
        )) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNoneOutlinedIcon sx={{ color: 'text.disabled', fontSize: 32 }} />
            <Typography sx={{ mt: 0.5, color: 'text.secondary', fontSize: 13 }}>
              ยังไม่มีการแจ้งเตือน
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <MenuItem onClick={handleOpenAll} sx={{ justifyContent: 'center', py: 1.25, color: 'primary.main', fontWeight: 700, fontSize: 13 }}>
        ดูการแจ้งเตือนทั้งหมด
      </MenuItem>
    </Menu>
  );
}
