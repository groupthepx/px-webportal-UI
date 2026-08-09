'use client';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import { Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, FormControl, IconButton, InputLabel, MenuItem, Select, Slider, Stack, TextField, Tooltip, Typography, alpha, useTheme, type SxProps, type Theme } from '@mui/material';
import { getSession } from 'next-auth/react';
import { enqueueSnackbar } from 'notistack';
import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useAuthentication from '@/hooks/useAuthentication';
import { useVoiceRoomRealtimeKitAudio } from '@/hooks/useVoiceRoomRealtimeKitAudio';
import { useCreateVoiceRoomAudioTokenMutation, useGetVoiceRoomAudioConfigQuery, useGetVoiceRoomMeQuery } from '@/lib/features/voiceRoom';
import type { VoiceRoomAdminSummary, VoiceRoomAudioRole, VoiceRoomGiftItem, VoiceRoomGiftTransactionItem, VoiceRoomMeResponse, VoiceRoomMemberSummary, VoiceRoomMessageItem, VoiceRoomMicQueueItem, VoiceRoomMicState } from '@/model/voice-room';
import { createVoiceRoomSocket, type VoiceRoomSocket } from '@/services/voiceRoomSocket';

const EMOJIS = ['👍', '❤️', '🎉', '👏'];
const BASE_UPLOADS = process.env.NEXT_PUBLIC_BASE_UPLOADS?.replace(/\/$/, '') || '';
type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'disconnected';
type GiftVisualTone = 'fire' | 'heart' | 'star' | 'diamond' | 'magic' | 'music' | 'royal' | 'rocket' | 'coffee' | 'rose' | 'shield' | 'default';

const ROLE_LABEL_TH: Record<string, string> = {
  Admin: 'ผู้ดูแล',
  Staff: 'สตาฟ',
  Member: 'สมาชิก',
  VJ: 'วีเจ',
};

const CONNECTION_STATUS_TH: Record<ConnectionStatus, string> = {
  idle: 'ยังไม่เชื่อมต่อ',
  connecting: 'กำลังเชื่อมต่อ',
  connected: 'เชื่อมต่อแล้ว',
  reconnecting: 'กำลังเชื่อมต่อใหม่',
  disconnected: 'หลุดการเชื่อมต่อ',
};

const REALTIME_AUDIO_STATUS_TH: Record<string, string> = {
  disabled: 'ยังไม่เปิดใช้',
  idle: 'รอเชื่อมต่อ',
  joining: 'กำลังเข้าเสียง',
  listening: 'กำลังฟัง',
  speaking: 'กำลังออกอากาศ',
  playback_blocked: 'รอกดเปิดเสียง',
  error: 'เชื่อมต่อเสียงไม่ได้',
};

const MIC_STATE_TH: Record<string, string> = {
  idle: 'ว่าง',
  requested: 'รออนุมัติ',
  speaking: 'กำลังพูด',
  muted: 'ถูกปิดเสียง',
};

const MESSAGE_TYPE_TH: Record<string, string> = {
  text: 'ข้อความ',
  emoji: 'อีโมจิ',
  gift: 'กิ๊ฟ',
  system: 'ระบบ',
  moderation: 'จัดการห้อง',
};

const MODERATION_ACTION_TH: Record<string, string> = {
  mic_requested: 'ขอขึ้นไมค์',
  mic_started: 'ขึ้นไมค์',
  mic_idle: 'ลงจากไมค์',
  mic_approved: 'อนุมัติให้ขึ้นไมค์',
  chat_muted: 'ปิดสิทธิ์พิมพ์',
  mic_muted: 'ปิดไมค์',
  mic_blocked: 'บล็อกไมค์',
};

const GIFT_NAME_TH: Record<string, string> = {
  'rose kiss': 'ดอกกุหลาบ',
  'sweet heart': 'หัวใจหวาน',
  'lucky star': 'ดาวนำโชค',
  'coffee boost': 'กาแฟเติมพลัง',
  'music note': 'โน้ตดนตรี',
  'mic spotlight': 'ไมค์สปอตไลต์',
  'hot fire': 'ไฟร้อนแรง',
  'magic spark': 'ประกายเวทมนตร์',
  'blue diamond': 'เพชรสีฟ้า',
  'champion cup': 'ถ้วยแชมป์',
  'royal crown': 'มงกุฎ',
  'rocket boost': 'จรวดพุ่ง',
  'vip shield': 'โล่ VIP',
};

const GIFT_TONE_LOOKUP: Record<string, GiftVisualTone> = {
  'rose kiss': 'rose',
  'ดอกกุหลาบ': 'rose',
  'sweet heart': 'heart',
  'หัวใจหวาน': 'heart',
  'lucky star': 'star',
  'ดาวนำโชค': 'star',
  'coffee boost': 'coffee',
  'กาแฟเติมพลัง': 'coffee',
  'music note': 'music',
  'โน้ตดนตรี': 'music',
  'mic spotlight': 'music',
  'ไมค์สปอตไลต์': 'music',
  'hot fire': 'fire',
  'ไฟร้อนแรง': 'fire',
  'magic spark': 'magic',
  'ประกายเวทมนตร์': 'magic',
  'blue diamond': 'diamond',
  'เพชรสีฟ้า': 'diamond',
  'champion cup': 'royal',
  'ถ้วยแชมป์': 'royal',
  'royal crown': 'royal',
  'มงกุฎ': 'royal',
  'rocket boost': 'rocket',
  'จรวดพุ่ง': 'rocket',
  'vip shield': 'shield',
  'โล่ vip': 'shield',
};

const GIFT_TONE_STYLE: Record<GiftVisualTone, { accent: string; soft: string; border: string; glow: string; icon: string; animation: string }> = {
  fire: { accent: '#ff4d1f', soft: '#fff0e8', border: '#ffb08f', glow: 'rgba(255, 77, 31, 0.32)', icon: '🔥', animation: 'gift-fire-rise 1.8s ease-in-out infinite' },
  heart: { accent: '#f43f5e', soft: '#fff1f5', border: '#fda4af', glow: 'rgba(244, 63, 94, 0.28)', icon: '❤️', animation: 'gift-heart-beat 1.55s ease-in-out infinite' },
  star: { accent: '#f59e0b', soft: '#fff7dc', border: '#facc15', glow: 'rgba(245, 158, 11, 0.3)', icon: '✨', animation: 'gift-star-twinkle 1.7s ease-in-out infinite' },
  diamond: { accent: '#0ea5e9', soft: '#e8f7ff', border: '#7dd3fc', glow: 'rgba(14, 165, 233, 0.28)', icon: '💎', animation: 'gift-diamond-shine 2.1s ease-in-out infinite' },
  magic: { accent: '#8b5cf6', soft: '#f4f0ff', border: '#c4b5fd', glow: 'rgba(139, 92, 246, 0.25)', icon: '🪄', animation: 'gift-star-twinkle 1.6s ease-in-out infinite' },
  music: { accent: '#6366f1', soft: '#eef2ff', border: '#a5b4fc', glow: 'rgba(99, 102, 241, 0.24)', icon: '🎵', animation: 'gift-float 1.9s ease-in-out infinite' },
  royal: { accent: '#d97706', soft: '#fff7ed', border: '#fdba74', glow: 'rgba(217, 119, 6, 0.28)', icon: '👑', animation: 'gift-star-twinkle 1.9s ease-in-out infinite' },
  rocket: { accent: '#ef4444', soft: '#fff1f2', border: '#fca5a5', glow: 'rgba(239, 68, 68, 0.28)', icon: '🚀', animation: 'gift-rocket-boost 1.65s ease-in-out infinite' },
  coffee: { accent: '#a16207', soft: '#fff8e6', border: '#f3c775', glow: 'rgba(161, 98, 7, 0.22)', icon: '☕', animation: 'gift-float 2s ease-in-out infinite' },
  rose: { accent: '#e11d48', soft: '#fff1f2', border: '#fda4af', glow: 'rgba(225, 29, 72, 0.25)', icon: '🌹', animation: 'gift-heart-beat 1.7s ease-in-out infinite' },
  shield: { accent: '#10b981', soft: '#ecfdf5', border: '#86efac', glow: 'rgba(16, 185, 129, 0.25)', icon: '🛡️', animation: 'gift-diamond-shine 2.2s ease-in-out infinite' },
  default: { accent: '#fb923c', soft: '#fff7ed', border: '#fed7aa', glow: 'rgba(251, 146, 60, 0.24)', icon: '🎁', animation: 'gift-float 2s ease-in-out infinite' },
};

const ROLE_TONE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  Admin: { color: '#b91c1c', bg: '#fff1f2', border: '#fecdd3' },
  Staff: { color: '#c2410c', bg: '#fff7ed', border: '#fed7aa' },
  Member: { color: '#047857', bg: '#ecfdf5', border: '#a7f3d0' },
  VJ: { color: '#0f766e', bg: '#ecfeff', border: '#99f6e4' },
};

const VOICE_ROOM_WEB_MOTION_SX = {
  '@keyframes speakerPulse': {
    '0%': { boxShadow: '0 0 0 0 rgba(255, 77, 31, 0.42)' },
    '70%': { boxShadow: '0 0 0 10px rgba(255, 77, 31, 0)' },
    '100%': { boxShadow: '0 0 0 0 rgba(255, 77, 31, 0)' },
  },
  '@keyframes gift-fire-rise': {
    '0%, 100%': { transform: 'translateY(0) scale(1)', filter: 'drop-shadow(0 0 0 rgba(255, 77, 31, 0))' },
    '50%': { transform: 'translateY(-3px) scale(1.08)', filter: 'drop-shadow(0 5px 9px rgba(255, 77, 31, 0.38))' },
  },
  '@keyframes gift-heart-beat': {
    '0%, 100%': { transform: 'scale(1)' },
    '34%': { transform: 'scale(1.12)' },
    '58%': { transform: 'scale(0.97)' },
  },
  '@keyframes gift-star-twinkle': {
    '0%, 100%': { transform: 'rotate(0deg) scale(1)', opacity: 0.9 },
    '50%': { transform: 'rotate(8deg) scale(1.1)', opacity: 1 },
  },
  '@keyframes gift-diamond-shine': {
    '0%': { transform: 'translateX(-90%) rotate(18deg)', opacity: 0 },
    '42%': { opacity: 0.85 },
    '100%': { transform: 'translateX(120%) rotate(18deg)', opacity: 0 },
  },
  '@keyframes gift-float': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-4px)' },
  },
  '@keyframes gift-rocket-boost': {
    '0%, 100%': { transform: 'translate(0, 0) rotate(-6deg)' },
    '50%': { transform: 'translate(3px, -5px) rotate(4deg)' },
  },
  '@keyframes voiceRoomGiftBanner': {
    from: { opacity: 0, transform: 'translateY(-8px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& *, & *::before, & *::after': {
      animation: 'none !important',
      transition: 'none !important',
    },
  },
} as const;

const CHAT_BUBBLE_MAX_WIDTH = { xs: '86%', sm: '72%', md: '64%', xl: '58%' } as const;
const ROOM_EVENT_MESSAGE_TYPES = new Set(['gift', 'system', 'moderation']);
const CHAT_PANEL_SX = {
  order: { xs: 1, lg: 2 },
  height: { xs: 560, lg: 680 },
  minHeight: { xs: 500, lg: 680 },
  maxHeight: { lg: 680 },
  display: 'flex',
  flexDirection: 'column',
} as const;
const CHAT_TIMELINE_SX = {
  flex: '1 1 auto',
  minHeight: 0,
  p: { xs: 2, md: 3 },
  overflowY: 'auto',
  overflowX: 'hidden',
  overscrollBehavior: 'contain',
  display: 'flex',
  flexDirection: 'column',
  gap: { xs: 1.5, md: 1.75 },
  background:
    'radial-gradient(circle at 12% 8%, rgba(255, 237, 213, 0.72), transparent 26%), linear-gradient(180deg, rgba(248,250,252,0.88), rgba(255,255,255,0.98))',
  '&:last-child': {
    pb: { xs: 2, md: 3 },
  },
} as const;
const CHAT_EMOJI_ROW_SX = {
  px: 2,
  pt: 1,
  pb: 0.5,
  flexShrink: 0,
  bgcolor: 'rgba(255,255,255,0.96)',
} as const;
const CHAT_COMPOSER_SX = {
  p: 2,
  pt: 1,
  flexShrink: 0,
  bgcolor: 'rgba(255,255,255,0.96)',
  alignItems: 'center',
} as const;
const CHAT_SEND_BUTTON_SX = {
  minWidth: 42,
  width: 42,
  height: 42,
  flexShrink: 0,
  alignSelf: 'center',
  borderRadius: '50%',
  p: 0,
} as const;
const CHAT_DAY_SEPARATOR_SX = {
  alignSelf: 'center',
  px: 1.25,
  py: 0.4,
  borderRadius: 999,
  bgcolor: 'rgba(15, 23, 42, 0.08)',
  color: 'text.secondary',
  boxShadow: '0 6px 16px rgba(15, 23, 42, 0.06)',
} as const;
const CHAT_UNREAD_BUTTON_SX = {
  position: 'absolute',
  left: '50%',
  bottom: 96,
  transform: 'translateX(-50%)',
  zIndex: 4,
  px: 1.4,
  py: 0.45,
  minHeight: 28,
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 900,
  bgcolor: '#111827',
  color: '#fff',
  boxShadow: '0 12px 28px rgba(15, 23, 42, 0.22)',
  '&:hover': {
    bgcolor: '#0f172a',
  },
} as const;

type ChatTimelineItem =
  | { kind: 'day'; id: string; label: string }
  | {
      kind: 'message';
      id: string;
      message: VoiceRoomMessageItem;
      isOwn: boolean;
      showHeader: boolean;
      showAvatar: boolean;
      groupedWithPrevious: boolean;
      groupedWithNext: boolean;
    };

function voiceRoomUploadUrl(path?: string | null) {
  const value = path?.trim();
  if (!value) return undefined;
  if (/^(https?:)?\/\//.test(value) || value.startsWith('data:') || value.startsWith('blob:')) return value;
  if (!BASE_UPLOADS) return value;
  return `${BASE_UPLOADS}/${value.replace(/^\/+/, '')}`;
}

function avatarLetter(name?: string | null) {
  return name?.trim().charAt(0) || '?';
}

function roleLabel(label?: string | null) {
  return label ? ROLE_LABEL_TH[label] || label : '-';
}

function micStateLabel(state?: string | null) {
  return state ? MIC_STATE_TH[state] || state : '-';
}

function messageTypeLabel(type?: string | null) {
  return type ? MESSAGE_TYPE_TH[type] || type : '-';
}

function connectionStatusLabel(status: ConnectionStatus) {
  return CONNECTION_STATUS_TH[status];
}

function realtimeAudioStatusLabel(status: string) {
  return REALTIME_AUDIO_STATUS_TH[status] || status;
}

function giftDisplayName(name?: string | null) {
  const value = name?.trim();
  if (!value) return 'กิ๊ฟ';
  return GIFT_NAME_TH[value.toLowerCase()] || value;
}

function giftVisualTone(name?: string | null): GiftVisualTone {
  const displayName = giftDisplayName(name);
  const normalized = displayName.toLowerCase();
  const raw = name?.trim().toLowerCase() || '';
  return GIFT_TONE_LOOKUP[normalized] || GIFT_TONE_LOOKUP[raw] || 'default';
}

function giftToneStyle(name?: string | null) {
  return GIFT_TONE_STYLE[giftVisualTone(name)];
}

function metadataText(metadata: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = metadata[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return '';
}

function shortIdentifier(value?: string | null) {
  const rawValue = value?.trim();
  if (!rawValue) return 'ไม่ทราบสมาชิก';
  if (rawValue.length <= 12) return rawValue;
  return `${rawValue.slice(0, 8)}…${rawValue.slice(-4)}`;
}

function messageGiftName(message: VoiceRoomMessageItem) {
  return metadataText(message.metadata, ['gift_name', 'giftName', 'name']) || String(message.metadata.gift_id || '');
}

function appendMessage(messages: VoiceRoomMessageItem[], message: VoiceRoomMessageItem) {
  return messages.some((item) => item.id === message.id) ? messages : [...messages, message];
}

function formatTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function formatDayKey(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'unknown';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatDayLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'ไม่ทราบวันที่';

  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((todayStart - targetStart) / 86400000);

  if (diffDays === 0) return 'วันนี้';
  if (diffDays === 1) return 'เมื่อวาน';
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
}

function senderName(sender: VoiceRoomMessageItem['sender']) {
  if (!sender) return 'ระบบ';
  return 'nick_name' in sender ? sender.nick_name : sender.user_id || roleLabel(sender.role_label);
}

function moderationActionLabel(action?: unknown) {
  if (typeof action !== 'string') return '';
  return MODERATION_ACTION_TH[action] || action;
}

function moderationTargetName(message: VoiceRoomMessageItem, memberNameById?: Map<string, string>) {
  const memberId = metadataText(message.metadata, ['member_id', 'memberId', 'target_member_id', 'targetMemberId']);
  const metadataDisplayName = metadataText(message.metadata, ['target_member_display_name', 'targetMemberDisplayName']);
  if (metadataDisplayName) return metadataDisplayName;

  const metadataName = metadataText(message.metadata, ['target_member_name', 'targetMemberName']);
  const metadataCode = metadataText(message.metadata, ['target_member_code', 'targetMemberCode', 'user_px', 'userPx']);
  if (metadataName && metadataCode && metadataName !== metadataCode) return `${metadataName} (${metadataCode})`;
  if (metadataName) return metadataName;
  if (metadataCode) return metadataCode;

  const onlineName = memberId ? memberNameById?.get(memberId)?.trim() : '';
  if (onlineName) return onlineName;
  return memberId ? `สมาชิก ${shortIdentifier(memberId)}` : '';
}

function moderationMessageBody(message: VoiceRoomMessageItem, memberNameById?: Map<string, string>) {
  if (message.message_type !== 'moderation') return '';
  if (!message.sender || !('admin_id' in message.sender)) return message.body;

  const action = moderationActionLabel(message.metadata.action);
  if (!action) return message.body;

  const actor = senderName(message.sender);
  const targetName = moderationTargetName(message, memberNameById);
  if (!targetName) return `${actor} ${action}`;
  return `${actor} ${action} ${targetName}`;
}

function messageSenderKey(message: VoiceRoomMessageItem) {
  if (!message.sender) return 'system';
  return 'member_id' in message.sender ? `member:${message.sender.member_id}` : `admin:${message.sender.admin_id}`;
}

function messageSenderAvatar(message: VoiceRoomMessageItem) {
  if (!message.sender || !('profile' in message.sender)) return undefined;
  return voiceRoomUploadUrl(message.sender.profile);
}

function messageBody(message: VoiceRoomMessageItem, memberNameById?: Map<string, string>) {
  if (message.message_type === 'gift') {
    const giftName = giftDisplayName(messageGiftName(message));
    const coin = message.metadata.coin_price ? ` (${String(message.metadata.coin_price)} CoinPX)` : '';
    return `ส่งของขวัญ ${giftName}${coin}`;
  }
  if (message.message_type === 'moderation') return moderationMessageBody(message, memberNameById);
  return message.body;
}

function isRoomEventMessage(message: VoiceRoomMessageItem) {
  return ROOM_EVENT_MESSAGE_TYPES.has(message.message_type);
}

function eventMessageIcon(message: VoiceRoomMessageItem) {
  if (message.message_type === 'gift') return giftToneStyle(messageGiftName(message)).icon;
  if (message.message_type === 'moderation') return '🎙️';
  return '•';
}

function canGroupMessages(previous: VoiceRoomMessageItem | undefined, current: VoiceRoomMessageItem | undefined) {
  if (!previous || !current) return false;
  if (isRoomEventMessage(previous) || isRoomEventMessage(current)) return false;
  if (messageSenderKey(previous) !== messageSenderKey(current)) return false;
  if (formatDayKey(previous.created_at) !== formatDayKey(current.created_at)) return false;

  const previousTime = new Date(previous.created_at).getTime();
  const currentTime = new Date(current.created_at).getTime();
  if (Number.isNaN(previousTime) || Number.isNaN(currentTime)) return false;
  return Math.abs(currentTime - previousTime) <= 5 * 60 * 1000;
}

function buildChatTimelineItems(messages: VoiceRoomMessageItem[], ownSenderKey?: string): ChatTimelineItem[] {
  const items: ChatTimelineItem[] = [];
  let lastDayKey = '';

  messages.forEach((message, index) => {
    const dayKey = formatDayKey(message.created_at);
    if (dayKey !== lastDayKey) {
      items.push({
        kind: 'day',
        id: `day:${dayKey}:${message.id}`,
        label: formatDayLabel(message.created_at),
      });
      lastDayKey = dayKey;
    }

    const groupedWithPrevious = canGroupMessages(messages[index - 1], message);
    const groupedWithNext = canGroupMessages(message, messages[index + 1]);
    const isOwn = Boolean(ownSenderKey && messageSenderKey(message) === ownSenderKey);

    items.push({
      kind: 'message',
      id: message.id,
      message,
      isOwn,
      showHeader: !groupedWithPrevious,
      showAvatar: !isOwn && !groupedWithNext,
      groupedWithPrevious,
      groupedWithNext,
    });
  });

  return items;
}

function ChatDaySeparator({ label }: { label: string }) {
  return (
    <Box sx={CHAT_DAY_SEPARATOR_SX}>
      <Typography variant="caption" fontWeight={800}>{label}</Typography>
    </Box>
  );
}

function RolePresenceBadge({ role, compact = false }: { role?: string | null; compact?: boolean }) {
  const style = ROLE_TONE_STYLE[role || ''] || ROLE_TONE_STYLE.Member;
  return (
    <Chip
      size="small"
      label={roleLabel(role)}
      sx={{
        height: compact ? 22 : 24,
        color: style.color,
        bgcolor: style.bg,
        border: `1px solid ${style.border}`,
        fontWeight: 900,
        '& .MuiChip-label': { px: compact ? 0.8 : 1 },
      }}
    />
  );
}

function AnimatedGiftAvatar({ name, imageUrl, size = 42 }: { name?: string | null; imageUrl?: string | null; size?: number }) {
  const displayName = giftDisplayName(name);
  const tone = giftToneStyle(displayName);
  const avatarSize = Math.max(26, size - 8);
  const showShine = giftVisualTone(displayName) === 'diamond' || giftVisualTone(displayName) === 'shield';

  return (
    <Box
      className={`gift-motion gift-motion-${giftVisualTone(displayName)}`}
      sx={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 1.5,
        bgcolor: tone.soft,
        border: `1px solid ${tone.border}`,
        boxShadow: `0 10px 24px ${tone.glow}`,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 2,
          borderRadius: 1.2,
          border: `1px solid ${tone.border}`,
          opacity: 0.6,
        },
        '&::after': showShine
          ? {
              content: '""',
              position: 'absolute',
              top: -8,
              bottom: -8,
              width: size / 2,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.72), transparent)',
              animation: 'gift-diamond-shine 2.2s ease-in-out infinite',
            }
          : undefined,
      }}
    >
      <Avatar
        variant="rounded"
        src={voiceRoomUploadUrl(imageUrl)}
        sx={{
          width: avatarSize,
          height: avatarSize,
          bgcolor: '#fff',
          color: tone.accent,
          fontSize: avatarSize * 0.48,
          fontWeight: 900,
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
          animation: tone.animation,
          zIndex: 1,
        }}
      >
        {tone.icon}
      </Avatar>
    </Box>
  );
}

function VoicePanel({ children, sx }: { children: ReactNode; sx?: SxProps<Theme> }) {
  const panelSx: SxProps<Theme> = {
    position: 'relative',
    borderColor: 'rgba(255, 97, 56, 0.16)',
    borderRadius: 2,
    background: 'rgba(255,255,255,0.84)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 20px 52px rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: '0 0 auto 0',
      height: 3,
      background: 'linear-gradient(90deg, #ff4d1f, #ff9f1c, #06b6d4)',
      opacity: 0.82,
      zIndex: 1,
    },
  };

  return (
    <Card
      variant="outlined"
      sx={sx ? [panelSx, ...(Array.isArray(sx) ? sx : [sx])] : panelSx}
    >
      {children}
    </Card>
  );
}

function participantKey(participant: VoiceRoomMemberSummary | VoiceRoomAdminSummary) {
  return 'member_id' in participant ? `member:${participant.member_id}` : `admin:${participant.admin_id}`;
}

function participantName(participant: VoiceRoomMemberSummary | VoiceRoomAdminSummary) {
  return 'nick_name' in participant ? participant.nick_name : participant.user_id || roleLabel(participant.role_label);
}

function WebParticipantRow({
  participant,
  mic,
  micQueue,
}: {
  participant: VoiceRoomMemberSummary | VoiceRoomAdminSummary;
  mic: { member_id: string | null; state: VoiceRoomMicState; queue: VoiceRoomMicQueueItem[] };
  micQueue: VoiceRoomMicQueueItem[];
}) {
  const isMember = 'member_id' in participant;
  const name = participantName(participant);
  const isCurrentMic = isMember && participant.member_id === mic.member_id;
  const queued = isMember ? micQueue.find((item) => item.member_id === participant.member_id) : null;

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        px: 0.5,
        py: 0.45,
        borderRadius: 1,
        transition: 'background-color 160ms ease, transform 160ms ease',
        '&:hover': { bgcolor: 'rgba(255, 97, 56, 0.055)', transform: 'translateX(2px)' },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          animation: isCurrentMic && mic.state === 'speaking' ? 'speakerPulse 1.55s ease-out infinite' : undefined,
          '&::after': isCurrentMic
            ? {
                content: '""',
                position: 'absolute',
                inset: -3,
                borderRadius: '50%',
                border: '2px solid rgba(255, 77, 31, 0.42)',
              }
            : undefined,
        }}
      >
        <Avatar
          src={isMember ? voiceRoomUploadUrl(participant.profile) : undefined}
          sx={{
            width: 34,
            height: 34,
            bgcolor: isCurrentMic ? '#ff4d1f' : '#a3a3a3',
            color: '#fff',
            fontWeight: 900,
            border: '2px solid #fff',
            boxShadow: '0 8px 18px rgba(15, 23, 42, 0.13)',
          }}
        >
          {avatarLetter(name)}
        </Avatar>
      </Box>
      <Box minWidth={0} flex={1}>
        <Typography noWrap variant="body2" fontWeight={800}>{name}</Typography>
        <Stack direction="row" spacing={0.5} alignItems="center" useFlexGap flexWrap="wrap">
          <RolePresenceBadge role={participant.role_label} compact />
          {queued && <Chip size="small" color="warning" label={`คิว ${queued.position}`} />}
          {isCurrentMic && <Chip size="small" color={mic.state === 'speaking' ? 'error' : 'warning'} label={mic.state === 'speaking' ? 'กำลังพูด' : 'รออนุมัติ'} />}
          {'is_muted' in participant && participant.is_muted && <Chip size="small" label="ปิดแชท" />}
          {'mic_blocked' in participant && participant.mic_blocked && <Chip size="small" label="บล็อกไมค์" />}
        </Stack>
      </Box>
      {'can_speak' in participant && participant.can_speak && <MicIcon fontSize="small" color="primary" />}
    </Stack>
  );
}

function VoiceMessageBubble({
  message,
  memberNameById,
  isOwn = false,
  showHeader = true,
  showAvatar = true,
  groupedWithPrevious = false,
  groupedWithNext = false,
}: {
  message: VoiceRoomMessageItem;
  memberNameById?: Map<string, string>;
  isOwn?: boolean;
  showHeader?: boolean;
  showAvatar?: boolean;
  groupedWithPrevious?: boolean;
  groupedWithNext?: boolean;
}) {
  const isGift = message.message_type === 'gift';
  const isEvent = isRoomEventMessage(message);
  const giftName = isGift ? messageGiftName(message) : '';
  const giftTone = giftToneStyle(giftName);
  const avatarUrl = messageSenderAvatar(message);
  const senderDisplayName = senderName(message.sender);
  const displayBody = messageBody(message, memberNameById);

  if (isEvent) {
    return (
      <Box
        aria-label={`${messageTypeLabel(message.message_type)}: ${displayBody}`}
        sx={{
          alignSelf: 'center',
          maxWidth: { xs: '92%', sm: '78%', md: '68%' },
          px: 1.25,
          py: 0.55,
          borderRadius: 999,
          bgcolor: isGift ? giftTone.soft : message.message_type === 'moderation' ? 'rgba(255, 247, 237, 0.96)' : 'rgba(15, 23, 42, 0.06)',
          border: '1px solid',
          borderColor: isGift ? giftTone.border : message.message_type === 'moderation' ? 'rgba(251, 146, 60, 0.28)' : 'rgba(15, 23, 42, 0.08)',
          boxShadow: isGift ? `0 8px 18px ${giftTone.glow}` : '0 6px 16px rgba(15, 23, 42, 0.06)',
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="center">
          <Typography component="span" sx={{ fontSize: 16, lineHeight: 1 }}>{eventMessageIcon(message)}</Typography>
          <Typography
            variant="caption"
            sx={{
              color: isGift ? '#7c2d12' : 'text.secondary',
              fontWeight: 700,
              lineHeight: 1.35,
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {displayBody}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box
      aria-label={`${messageTypeLabel(message.message_type)}: ${displayBody}`}
      sx={{
        alignSelf: 'stretch',
        width: '100%',
        display: 'flex',
        justifyContent: isOwn ? 'flex-end' : 'flex-start',
        mt: groupedWithPrevious ? -0.85 : 0,
      }}
    >
      <Stack
        direction={isOwn ? 'row-reverse' : 'row'}
        spacing={0.75}
        alignItems="flex-end"
        sx={{
          maxWidth: CHAT_BUBBLE_MAX_WIDTH,
          minWidth: 0,
          ml: isOwn ? 'auto' : 0,
          mr: isOwn ? 0 : 'auto',
        }}
      >
        {!isOwn && (
          <Box sx={{ width: 30, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            {showAvatar && (
              <Avatar
                src={avatarUrl}
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: '#a3a3a3',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 900,
                  border: '2px solid #fff',
                  boxShadow: '0 8px 18px rgba(15, 23, 42, 0.12)',
                }}
              >
                {avatarLetter(senderDisplayName)}
              </Avatar>
            )}
          </Box>
        )}
        <Box
          sx={{
            minWidth: 0,
            px: { xs: 1.15, md: 1.25 },
            pt: showHeader && !isOwn ? 0.75 : 0.85,
            pb: 0.55,
            borderRadius: isOwn
              ? groupedWithPrevious
                ? '13px 4px 4px 13px'
                : groupedWithNext
                  ? '13px 13px 4px 13px'
                  : '13px 13px 4px 13px'
              : groupedWithPrevious
                ? '4px 13px 13px 4px'
                : groupedWithNext
                  ? '13px 13px 13px 4px'
                  : '13px 13px 13px 4px',
            background: isOwn ? '#ecfdf5' : '#fff',
            border: '1px solid',
            borderColor: isOwn ? 'rgba(16, 185, 129, 0.2)' : 'rgba(15, 23, 42, 0.08)',
            boxShadow: isOwn ? '0 6px 16px rgba(16, 185, 129, 0.08)' : '0 6px 16px rgba(15, 23, 42, 0.06)',
          }}
        >
          {showHeader && !isOwn && (
            <Typography variant="caption" fontWeight={900} noWrap sx={{ display: 'block', color: '#92400e', lineHeight: 1.2, mb: 0.2 }}>
              {senderDisplayName}
            </Typography>
          )}
          <Typography variant="body2" sx={{ wordBreak: 'break-word', color: '#111827', fontSize: { xs: 13.5, md: 14 }, lineHeight: 1.42 }}>{displayBody}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.15, textAlign: 'right', fontSize: 10.5, lineHeight: 1.1 }}>
            {formatTime(message.created_at)}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}

function GiftCatalogButton({ gift, onClick }: { gift: VoiceRoomGiftItem; onClick: () => void }) {
  const tone = giftToneStyle(gift.name);

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      sx={{
        minHeight: { xs: 112, md: 108, lg: 118 },
        p: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 0.6,
        textTransform: 'none',
        borderColor: tone.border,
        background: `linear-gradient(180deg, ${tone.soft}, #fff)`,
        boxShadow: `0 10px 22px ${tone.glow}`,
        transition: 'transform 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: tone.border,
          transform: 'translateY(-2px)',
          boxShadow: `0 16px 32px ${tone.glow}`,
        },
      }}
    >
      <AnimatedGiftAvatar name={gift.name} imageUrl={gift.image_url} size={46} />
      <Typography variant="caption" noWrap maxWidth="100%" fontWeight={900}>{giftDisplayName(gift.name)}</Typography>
      <Chip label={`${gift.coin_price} CoinPX`} size="small" color="warning" />
    </Button>
  );
}

function RecentGiftRow({ transaction }: { transaction: VoiceRoomGiftTransactionItem }) {
  const giftName = giftDisplayName(transaction.gift?.name);
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <AnimatedGiftAvatar name={giftName} imageUrl={transaction.gift?.image_url} size={38} />
      <Box minWidth={0}>
        <Typography variant="body2" fontWeight={700} noWrap>{transaction.sender?.nick_name || '-'} → {transaction.receiver?.nick_name || '-'}</Typography>
        <Typography variant="caption" color="text.secondary">{giftName} · {transaction.coin_price} CoinPX</Typography>
      </Box>
    </Stack>
  );
}

export default function VoiceRoomContent() {
  useAuthentication();

  const theme = useTheme();
  const socketRef = useRef<VoiceRoomSocket | null>(null);
  const chatTimelineRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);
  const lastMessageCountRef = useRef(0);
  const giftBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messageSendTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data: room, error, isLoading, refetch: refetchVoiceRoomMe } = useGetVoiceRoomMeQuery();
  const { data: audioConfig } = useGetVoiceRoomAudioConfigQuery();
  const [createAudioToken] = useCreateVoiceRoomAudioTokenMutation();
  const [messages, setMessages] = useState<VoiceRoomMessageItem[]>([]);
  const [onlineMembers, setOnlineMembers] = useState<VoiceRoomMemberSummary[]>([]);
  const [onlineAdmins, setOnlineAdmins] = useState<VoiceRoomAdminSummary[]>([]);
  const [mic, setMic] = useState<{ member_id: string | null; state: VoiceRoomMicState; queue: VoiceRoomMicQueueItem[] }>({ member_id: null, state: 'idle', queue: [] });
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [draft, setDraft] = useState('');
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'failed'>('idle');
  const [failedDraft, setFailedDraft] = useState('');
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [receiverMemberId, setReceiverMemberId] = useState('');
  const [volume, setVolume] = useState(70);
  const [giftBanner, setGiftBanner] = useState<{ gift: VoiceRoomGiftItem; sender: string } | null>(null);
  const [accessOverride, setAccessOverride] = useState<VoiceRoomMeResponse['access'] | null>(null);

  useEffect(() => {
    let cancelled = false;
    let socket: VoiceRoomSocket | null = null;

    async function connect() {
      const session = await getSession();
      const token = (session as { accessToken?: string } | null)?.accessToken;
      if (cancelled || !token) return;

      setConnectionStatus('connecting');
      socket = createVoiceRoomSocket(token);
      socketRef.current = socket;
      socket.on('connect', () => {
        setConnectionStatus('connected');
        socket?.emit('room:join');
        enqueueSnackbar('เชื่อมต่อห้องเสียงแล้ว', { variant: 'success' });
      });
      socket.on('disconnect', () => setConnectionStatus('disconnected'));
      socket.on('connect_error', () => {
        setConnectionStatus('reconnecting');
        enqueueSnackbar('กำลังเชื่อมต่อห้องเสียงใหม่', { variant: 'warning' });
      });
      socket.on('room:snapshot', (payload) => {
        setOnlineMembers(payload.onlineMembers);
        setOnlineAdmins(payload.onlineAdmins || []);
        setMessages(payload.messages);
        setMic(payload.mic);
      });
      socket.on('presence:updated', ({ onlineMembers: members, onlineAdmins: admins }) => {
        setOnlineMembers(members);
        setOnlineAdmins(admins || []);
      });
      socket.on('message:created', (message) => {
        setMessages((current) => appendMessage(current, message));
        setSendStatus('idle');
        setFailedDraft('');
        if (message.message_type === 'moderation') enqueueSnackbar(messageBody(message), { variant: 'info' });
      });
      socket.on('message:deleted', ({ id }) => setMessages((current) => current.filter((message) => message.id !== id)));
      socket.on('mic:updated', setMic);
      socket.on('access:changed', (payload) => {
        if (payload.member_id !== room?.member?.member_id) return;

        setAccessOverride({
          ...(room?.access || {}),
          can_enter: payload.can_enter,
          can_speak: payload.can_speak,
          is_muted: payload.is_muted,
          mic_blocked: payload.mic_blocked,
          is_banned: payload.is_banned,
        });

        if (payload.can_enter !== true || payload.is_banned === true) {
          socket?.disconnect();
        }
      });
      socket.on('gift:created', ({ gift, message }) => {
        setMessages((current) => appendMessage(current, message));
        void refetchVoiceRoomMe();
        enqueueSnackbar(messageBody(message), { variant: 'success' });
        setGiftBanner({ gift, sender: senderName(message.sender) });
        if (giftBannerTimerRef.current) clearTimeout(giftBannerTimerRef.current);
        giftBannerTimerRef.current = setTimeout(() => setGiftBanner(null), 3500);
      });
      socket.on('room:error', ({ message }) => enqueueSnackbar(message, { variant: 'error' }));
      socket.connect();
    }

    void connect();
    return () => {
      cancelled = true;
      if (giftBannerTimerRef.current) clearTimeout(giftBannerTimerRef.current);
      if (messageSendTimerRef.current) clearTimeout(messageSendTimerRef.current);
      socket?.removeAllListeners();
      socket?.disconnect();
      if (socketRef.current === socket) socketRef.current = null;
    };
  }, [refetchVoiceRoomMe, room?.member?.member_id]);

  const roomMessages = messages.length ? messages : room?.messages || [];
  const access = accessOverride || room?.access || null;
  const chronologicalMessages = useMemo(
    () => [...roomMessages].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
    [roomMessages],
  );
  const ownMemberId = room?.member?.member_id || '';
  const ownSenderKey = ownMemberId ? `member:${ownMemberId}` : undefined;
  const chatTimelineItems = useMemo(() => buildChatTimelineItems(chronologicalMessages, ownSenderKey), [chronologicalMessages, ownSenderKey]);
  const activeGifts = useMemo(() => (room?.gifts || []).filter((gift) => gift.is_active), [room?.gifts]);
  const onlineParticipants = useMemo(() => [...onlineAdmins, ...onlineMembers], [onlineAdmins, onlineMembers]);
  const memberNameById = useMemo(() => new Map(onlineMembers.map((member) => [member.member_id, member.nick_name])), [onlineMembers]);
  const micQueue = mic.queue || [];
  const canSpeak = access?.can_speak === true && access.mic_blocked !== true;
  const canSendMessages = access?.is_muted !== true;
  const isDenied = (error as { status?: number } | undefined)?.status === 403 || access?.can_enter === false || access?.is_banned === true;
  const canUseMicControls = !isDenied && access?.mic_blocked !== true;
  const ownMicState = mic.member_id === ownMemberId ? mic.state : 'idle';
  const ownQueueEntry = micQueue.find((item) => item.member_id === ownMemberId) || null;
  const desiredAudioRole: VoiceRoomAudioRole = ownMicState === 'speaking' ? 'speaker' : 'listener';
  const getRealtimeAudioToken = useCallback(() => createAudioToken().unwrap(), [createAudioToken]);
  const realtimeAudio = useVoiceRoomRealtimeKitAudio({
    enabled: audioConfig?.real_audio_enabled === true && !isDenied && Boolean(room),
    role: desiredAudioRole,
    publishAudio: desiredAudioRole === 'speaker',
    getToken: getRealtimeAudioToken,
  });
  const speakingMember = onlineMembers.find((member) => member.member_id === mic.member_id && mic.state === 'speaking');
  const requestingMember = onlineMembers.find((member) => member.member_id === mic.member_id && mic.state === 'requested');
  const micButtonLabel = access?.mic_blocked === true ? 'ถูกบล็อกไมค์' : ownMicState === 'speaking' ? 'ลงไมค์' : ownQueueEntry ? 'ยกเลิกขอไมค์' : canSpeak ? 'ขึ้นไมค์' : 'ขอไมค์';
  const micButtonColor = ownMicState === 'speaking' ? 'error' : ownMicState === 'requested' ? 'warning' : 'primary';

  useEffect(() => {
    if (realtimeAudio.status === 'error' && realtimeAudio.errorMessage) {
      enqueueSnackbar(realtimeAudio.errorMessage, { variant: 'error' });
    }
  }, [realtimeAudio.errorMessage, realtimeAudio.status]);

  const scrollChatToBottom = useCallback(() => {
    const element = chatTimelineRef.current;
    if (!element) return;
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    shouldAutoScrollRef.current = true;
    setHasUnreadMessages(false);
  }, []);

  const prepareOutgoingMessageScroll = useCallback(() => {
    shouldAutoScrollRef.current = true;
    setHasUnreadMessages(false);

    requestAnimationFrame(() => {
      const element = chatTimelineRef.current;
      if (!element) return;
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    });
  }, []);

  const handleChatScroll = useCallback(() => {
    const element = chatTimelineRef.current;
    if (!element) return;
    const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
    const isAtBottom = distanceFromBottom < 96;
    shouldAutoScrollRef.current = isAtBottom;
    if (isAtBottom) setHasUnreadMessages(false);
  }, []);

  useEffect(() => {
    const messageCount = chronologicalMessages.length;
    const hasNewMessages = messageCount > lastMessageCountRef.current;
    lastMessageCountRef.current = messageCount;

    const element = chatTimelineRef.current;
    if (!element) return;

    if (shouldAutoScrollRef.current || !hasNewMessages) {
      requestAnimationFrame(() => {
        element.scrollTo({ top: element.scrollHeight, behavior: 'auto' });
        setHasUnreadMessages(false);
      });
      return;
    }

    requestAnimationFrame(() => setHasUnreadMessages(true));
  }, [chronologicalMessages.length]);

  const sendMessage = (body = draft, type: 'text' | 'emoji' = 'text') => {
    const value = body.trim();
    if (!value || !canSendMessages) return;
    if (!socketRef.current?.connected) {
      setFailedDraft(value);
      setSendStatus('failed');
      enqueueSnackbar('ยังไม่ได้เชื่อมต่อห้องเสียง', { variant: 'warning' });
      return;
    }
    try {
      setSendStatus('sending');
      setFailedDraft('');
      prepareOutgoingMessageScroll();
      socketRef.current.emit('message:send', { type, body: value });
      if (type === 'text') setDraft('');
      if (messageSendTimerRef.current) clearTimeout(messageSendTimerRef.current);
      messageSendTimerRef.current = setTimeout(() => setSendStatus('idle'), 1200);
    } catch {
      setFailedDraft(value);
      setSendStatus('failed');
      if (type === 'text') setDraft(value);
      enqueueSnackbar('ส่งข้อความไม่สำเร็จ กรุณาลองใหม่', { variant: 'error' });
    }
  };

  const sendGift = (gift: VoiceRoomGiftItem) => {
    if (!receiverMemberId || isDenied) {
      enqueueSnackbar('กรุณาเลือกผู้รับของขวัญ', { variant: 'warning' });
      return;
    }
    if (!socketRef.current?.connected) {
      enqueueSnackbar('ยังไม่ได้เชื่อมต่อห้องเสียง', { variant: 'warning' });
      return;
    }
    socketRef.current.emit('gift:send', { giftId: gift.id, receiverMemberId });
  };

  const toggleMic = () => {
    if (!socketRef.current?.connected) {
      enqueueSnackbar('ยังไม่ได้เชื่อมต่อห้องเสียง', { variant: 'warning' });
      return;
    }
    if (access?.mic_blocked === true) {
      enqueueSnackbar('บัญชีนี้ถูกบล็อกสิทธิ์ขอไมค์', { variant: 'warning' });
      return;
    }
    if (ownMicState === 'speaking' || ownQueueEntry) {
      socketRef.current.emit('mic:update', { state: 'idle' });
      return;
    }
    socketRef.current.emit('mic:update', { state: canSpeak ? 'speaking' : 'requested' });
  };

  if (isLoading) {
    return <Box sx={{ minHeight: 440, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>;
  }

  if (isDenied) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', py: 8, px: 2 }}>
        <Card variant="outlined"><CardContent><Typography variant="h5" fontWeight={700}>ไม่สามารถเข้าห้องเสียงได้</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>บัญชีของคุณยังไม่มีสิทธิ์ใช้งานห้องเสียง กรุณาติดต่อผู้ดูแลระบบ</Typography></CardContent></Card>
      </Box>
    );
  }

  if (error || !room) {
    return (
      <Box sx={{ maxWidth: 560, mx: 'auto', py: 8, px: 2 }}>
        <Card variant="outlined"><CardContent><Typography variant="h6" fontWeight={700}>ไม่สามารถโหลดห้องเสียง</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>กรุณาลองใหม่อีกครั้ง</Typography></CardContent></Card>
      </Box>
    );
  }

  return (
    <Box
      className="voice-room-web-surface"
      sx={{
        minHeight: 'calc(100vh - 64px)',
        py: { xs: 2, md: 3 },
        backgroundColor: '#f7f8fa',
        ...VOICE_ROOM_WEB_MOTION_SX,
      }}
    >
      <Box sx={{ maxWidth: 1440, mx: 'auto', px: { xs: 1.5, md: 3 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 2 }}>
          <Box><Typography variant="h5" fontWeight={700}>ห้องเสียง</Typography><Typography variant="body2" color="text.secondary">ห้องรวมออนไลน์ {onlineParticipants.length} คน</Typography></Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'idle' ? 'default' : 'warning'} label={connectionStatusLabel(connectionStatus)} sx={{ fontWeight: 900, boxShadow: connectionStatus === 'connected' ? '0 10px 24px rgba(22, 163, 74, 0.25)' : undefined }} />
            <Chip size="small" color={audioConfig?.real_audio_enabled ? realtimeAudio.status === 'error' ? 'error' : realtimeAudio.status === 'joining' ? 'warning' : 'success' : 'default'} label={audioConfig?.real_audio_enabled ? `เสียงจริง: ${realtimeAudioStatusLabel(realtimeAudio.status)}` : 'เตรียมเสียงแล้ว'} sx={{ fontWeight: 900, bgcolor: audioConfig?.real_audio_enabled ? undefined : '#e5e7eb' }} />
            {audioConfig?.real_audio_enabled && realtimeAudio.status === 'playback_blocked' && <Button size="small" variant="outlined" onClick={() => void realtimeAudio.resumePlayback()}>เปิดเสียง</Button>}
            <Tooltip title="ระดับเสียงในอุปกรณ์นี้"><VolumeUpIcon color="action" /></Tooltip>
            <Slider aria-label="ระดับเสียง" value={volume} onChange={(_, value) => setVolume(value as number)} sx={{ width: 120 }} />
            <Tooltip title={micButtonLabel}>
              <span>
                <Button color={micButtonColor} variant={ownMicState === 'idle' && !ownQueueEntry ? 'contained' : 'outlined'} startIcon={ownMicState === 'speaking' ? <MicIcon /> : <MicOffIcon />} onClick={toggleMic} disabled={!canUseMicControls}>
                  {micButtonLabel}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Stack>

        <Card
          className="voice-room-content-card"
          variant="outlined"
          sx={{
            borderColor: 'rgba(255, 97, 56, 0.16)',
            borderRadius: 2,
            background: 'rgba(255,255,255,0.78)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 20px 60px rgba(15, 23, 42, 0.08)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: { xs: 1.5, md: 2.5 } }}>
            {giftBanner && (
              <Box
                sx={{
                  mb: 2,
                  px: 2,
                  py: 1.25,
                  borderRadius: 1.5,
                  background: `linear-gradient(135deg, ${giftToneStyle(giftBanner.gift.name).soft}, #fff)`,
                  border: `1px solid ${giftToneStyle(giftBanner.gift.name).border}`,
                  boxShadow: `0 16px 36px ${giftToneStyle(giftBanner.gift.name).glow}`,
                  animation: 'voiceRoomGiftBanner 220ms ease-out',
                }}
              >
                <Stack direction="row" spacing={1.25} alignItems="center">
                  <AnimatedGiftAvatar name={giftBanner.gift.name} imageUrl={giftBanner.gift.image_url} size={46} />
                  <Typography fontWeight={900}>{giftBanner.sender} ส่ง {giftDisplayName(giftBanner.gift.name)} ให้สมาชิกในห้อง</Typography>
                </Stack>
              </Box>
            )}
            {ownQueueEntry && ownMicState !== 'speaking' && <Box sx={{ mb: 2, px: 2, py: 1.25, borderRadius: 1.5, bgcolor: alpha(theme.palette.warning.main, 0.08), border: `1px solid ${alpha(theme.palette.warning.main, 0.28)}`, boxShadow: '0 12px 28px rgba(245, 158, 11, 0.12)' }}><Typography fontWeight={800}>คุณอยู่คิวไมค์ลำดับ #{ownQueueEntry.position}</Typography></Box>}
            {(speakingMember || requestingMember) && <Box sx={{ mb: 2, px: 2, py: 1.25, borderRadius: 1.5, bgcolor: '#fff', border: '1px solid rgba(255, 97, 56, 0.16)', boxShadow: '0 14px 34px rgba(15, 23, 42, 0.07)' }}><Typography fontWeight={800}>{mic.state === 'speaking' ? 'กำลังพูด' : 'รออนุมัติไมค์'}: {speakingMember?.nick_name || requestingMember?.nick_name}</Typography></Box>}

            <Box
              className="voice-room-live-grid"
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '220px minmax(0, 1fr) 240px',
                  lg: '260px minmax(0, 1fr) 280px',
                  xl: '300px minmax(0, 1fr) 320px',
                },
                gap: { xs: 1.5, md: 2 },
                alignItems: 'start',
              }}
            >
              <VoicePanel sx={{ order: { xs: 3, lg: 1 }, maxHeight: { xs: 260, md: 420, lg: 520 }, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ minHeight: 0, overflowY: 'auto', pr: 2 }}>
                  <Typography fontWeight={900}>คนออนไลน์</Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack spacing={1}>
                    {onlineParticipants.length ? onlineParticipants.map((participant) => (
                      <WebParticipantRow key={participantKey(participant)} participant={participant} mic={mic} micQueue={micQueue} />
                    )) : <Typography variant="body2" color="text.secondary">กำลังรอคนเชื่อมต่อ</Typography>}
                  </Stack>
                </CardContent>
              </VoicePanel>

              <VoicePanel sx={CHAT_PANEL_SX}>
                <CardContent ref={chatTimelineRef} onScroll={handleChatScroll} sx={CHAT_TIMELINE_SX}>
                  {chatTimelineItems.length ? chatTimelineItems.map((item) => {
                    if (item.kind === 'day') return <ChatDaySeparator key={item.id} label={item.label} />;
                    return (
                      <VoiceMessageBubble
                        key={item.id}
                        message={item.message}
                        memberNameById={memberNameById}
                        isOwn={item.isOwn}
                        showHeader={item.showHeader}
                        showAvatar={item.showAvatar}
                        groupedWithPrevious={item.groupedWithPrevious}
                        groupedWithNext={item.groupedWithNext}
                      />
                    );
                  }) : <Box sx={{ flex: 1, display: 'grid', placeItems: 'center' }}><Typography color="text.secondary">เริ่มบทสนทนาในห้องเสียง</Typography></Box>}
                </CardContent>
                {hasUnreadMessages && (
                  <Button size="small" variant="contained" onClick={scrollChatToBottom} aria-label="เลื่อนไปข้อความใหม่" sx={CHAT_UNREAD_BUTTON_SX}>
                    ข้อความใหม่
                  </Button>
                )}
                <Divider />
                <Stack direction="row" spacing={.5} sx={CHAT_EMOJI_ROW_SX}>{EMOJIS.map((emoji) => <IconButton size="small" key={emoji} onClick={() => sendMessage(emoji, 'emoji')} disabled={!canSendMessages} aria-label={`ส่ง ${emoji}`} sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 247, 237, 0.9)', border: '1px solid rgba(251, 146, 60, 0.18)', animation: emoji === '❤️' ? 'gift-heart-beat 1.9s ease-in-out infinite' : 'gift-float 2.2s ease-in-out infinite', '&:hover': { bgcolor: '#fff7ed', transform: 'translateY(-1px)' } }}>{emoji}</IconButton>)}</Stack>
                <Stack direction="row" spacing={1} sx={CHAT_COMPOSER_SX}>
                  <TextField
                    fullWidth
                    size="small"
                    value={draft}
                    disabled={!canSendMessages}
                    onChange={(event) => {
                      setDraft(event.target.value);
                      if (sendStatus === 'failed') setSendStatus('idle');
                    }}
                    onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendMessage(); } }}
                    placeholder="พิมพ์ข้อความ"
                    inputProps={{ maxLength: 500 }}
                    helperText={sendStatus === 'failed' && failedDraft ? 'ส่งไม่สำเร็จ กดส่งอีกครั้งได้' : ' '}
                    FormHelperTextProps={{ sx: { minHeight: 16, mx: 1.5, color: 'error.main', fontSize: 11 } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 999,
                        bgcolor: '#fff',
                        pr: 0.5,
                      },
                    }}
                  />
                  {sendStatus === 'failed' && failedDraft && (
                    <Button size="small" variant="outlined" color="error" onClick={() => sendMessage(failedDraft)} sx={{ borderRadius: 999, flexShrink: 0 }}>
                      ส่งอีกครั้ง
                    </Button>
                  )}
                  <Button variant="contained" onClick={() => sendMessage()} disabled={!draft.trim() || !canSendMessages || sendStatus === 'sending'} aria-label="ส่งข้อความ" sx={CHAT_SEND_BUTTON_SX}>
                    {sendStatus === 'sending' ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                  </Button>
                </Stack>
              </VoicePanel>

              <VoicePanel sx={{ order: { xs: 2, lg: 3 }, maxHeight: { xs: 360, md: 520, lg: 560 }, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ minHeight: 0, overflowY: 'auto', pr: 2 }}>
                  <Typography fontWeight={900}>ส่งของขวัญ</Typography>
                  <Typography variant="caption" color="text.secondary">Coin PX: {room.wallet?.coin ?? '-'}</Typography>
                  <FormControl fullWidth size="small" sx={{ mt: 1.5 }}><InputLabel id="voice-room-receiver">ผู้รับ</InputLabel><Select labelId="voice-room-receiver" label="ผู้รับ" value={receiverMemberId} onChange={(event) => setReceiverMemberId(event.target.value)}>{onlineMembers.map((member) => <MenuItem value={member.member_id} key={member.member_id}>{member.nick_name}</MenuItem>)}</Select></FormControl>
                  <Divider sx={{ my: 1.5 }} />
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))', md: '1fr', lg: 'repeat(2, minmax(0, 1fr))' }, gap: 1 }}>{activeGifts.map((gift) => <GiftCatalogButton key={gift.id} gift={gift} onClick={() => sendGift(gift)} />)}</Box>
                  {!activeGifts.length && <Typography variant="body2" color="text.secondary">ยังไม่มีของขวัญให้ส่ง</Typography>}
                  <Divider sx={{ my: 1.5 }} />
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <VolunteerActivismIcon color="warning" fontSize="small" />
                    <Typography fontWeight={900}>อันดับผู้ส่งกิ๊ฟ</Typography>
                  </Stack>
                  <Stack spacing={1}>
                    {(room.gift_stats?.top_gifters || []).map((gifter) => (
                      <Stack key={gifter.member_id} direction="row" spacing={1} alignItems="center">
                        <Avatar src={voiceRoomUploadUrl(gifter.profile)} sx={{ width: 30, height: 30, border: '2px solid #fff', boxShadow: '0 8px 18px rgba(251, 146, 60, 0.18)' }}>{avatarLetter(gifter.nick_name)}</Avatar>
                        <Box minWidth={0} flex={1}><Typography variant="body2" fontWeight={700} noWrap>{gifter.nick_name}</Typography><Typography variant="caption" color="text.secondary">{gifter.gift_count} กิ๊ฟ</Typography></Box>
                        <Chip size="small" color="warning" label={`${gifter.coin_total} CoinPX`} />
                      </Stack>
                    ))}
                    {!room.gift_stats?.top_gifters?.length && <Typography variant="body2" color="text.secondary">ยังไม่มีอันดับกิ๊ฟ</Typography>}
                  </Stack>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography fontWeight={700} sx={{ mb: 1 }}>กิ๊ฟล่าสุด</Typography>
                  <Stack spacing={1}>
                    {(room.recent_gift_transactions || []).slice(0, 5).map((transaction) => <RecentGiftRow key={transaction.id} transaction={transaction} />)}
                    {!room.recent_gift_transactions?.length && <Typography variant="body2" color="text.secondary">ยังไม่มีรายการกิ๊ฟ</Typography>}
                  </Stack>
                </CardContent>
              </VoicePanel>
            </Box>
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
