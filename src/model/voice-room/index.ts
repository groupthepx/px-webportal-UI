export type VoiceRoomRoleColor = 'red' | 'orange' | 'green';
export type VoiceRoomMessageType = 'text' | 'emoji' | 'gift' | 'system' | 'moderation';
export type VoiceRoomMicState = 'idle' | 'requested' | 'speaking' | 'muted';

export interface VoiceRoomMemberSummary {
  member_id: string;
  nick_name: string;
  profile: string;
  role_label: 'Admin' | 'Staff' | 'Member' | 'VJ';
  role_color: VoiceRoomRoleColor;
  is_vj: boolean;
  is_online: boolean;
  can_speak: boolean;
  is_muted: boolean;
  mic_blocked: boolean;
  is_banned: boolean;
}

export interface VoiceRoomAdminSummary {
  admin_id: string;
  user_id: string;
  role_label: 'Admin' | 'Staff';
  role_color: Extract<VoiceRoomRoleColor, 'red' | 'orange'>;
  is_online: boolean;
}

export interface VoiceRoomMessageItem {
  id: string;
  message_type: VoiceRoomMessageType;
  body: string;
  metadata: Record<string, unknown>;
  is_deleted: boolean;
  sender: VoiceRoomMemberSummary | VoiceRoomAdminSummary | null;
  created_at: string;
}

export interface VoiceRoomGiftItem {
  id: string;
  name: string;
  image_url: string;
  coin_price: number;
  sort_order: number;
  is_active: boolean;
}

export interface VoiceRoomGiftTransactionItem {
  id: string;
  coin_price: number;
  created_at: string;
  gift: VoiceRoomGiftItem | null;
  sender: VoiceRoomMemberSummary | null;
  receiver: VoiceRoomMemberSummary | null;
  message_id: string | null;
}

export interface VoiceRoomTopGifterItem {
  member_id: string;
  nick_name: string;
  profile: string;
  gift_count: number;
  coin_total: number;
}

export interface VoiceRoomMicQueueItem extends VoiceRoomMemberSummary {
  requested_at: string;
  position: number;
}

export interface VoiceRoomMicSnapshot {
  member_id: string | null;
  state: VoiceRoomMicState;
  queue: VoiceRoomMicQueueItem[];
}

export interface VoiceRoomAudioConfig {
  room_id: 'global';
  mode: 'single_speaker';
  real_audio_enabled: boolean;
  provider: string;
  signaling: {
    socket_namespace: string;
    socket_path: string;
    events: Record<string, string>;
  };
  constraints: {
    max_active_speakers: number;
    queue_enabled: boolean;
    real_audio_phase: string;
  };
  provider_config?: {
    sdk_package: string;
    ui_package?: string;
    meeting_id: string | null;
    presets: {
      listener: string;
      speaker: string;
      admin: string;
    };
    missing?: string[];
  } | null;
}

export type VoiceRoomAudioRole = 'listener' | 'speaker' | 'admin';

export interface VoiceRoomAudioToken {
  provider: 'cloudflare_realtimekit';
  meeting_id: string;
  participant_id: string;
  token: string;
  preset_name: string;
  role: VoiceRoomAudioRole;
}

export interface VoiceRoomMeResponse {
  access: {
    can_enter: boolean;
    can_speak: boolean;
    is_muted: boolean;
    mic_blocked: boolean;
    is_banned: boolean;
    note: string;
  };
  wallet: { coin: number | null };
  member?: { member_id: string };
  messages: VoiceRoomMessageItem[];
  gifts: VoiceRoomGiftItem[];
  recent_gift_transactions?: VoiceRoomGiftTransactionItem[];
  gift_stats?: {
    gift_coin_total: number;
    top_gifters: VoiceRoomTopGifterItem[];
  };
}

export interface SendVoiceRoomGiftRequest {
  gift_id: string;
  receiver_member_id: string;
}

export type ClientToServerEvents = {
  'room:join': () => void;
  'message:send': (payload: { type: 'text' | 'emoji'; body: string }) => void;
  'gift:send': (payload: { giftId: string; receiverMemberId: string }) => void;
  'mic:update': (payload: { state: VoiceRoomMicState }) => void;
};

export type ServerToClientEvents = {
  'room:snapshot': (payload: {
    onlineMembers: VoiceRoomMemberSummary[];
    onlineAdmins?: VoiceRoomAdminSummary[];
    messages: VoiceRoomMessageItem[];
    mic: VoiceRoomMicSnapshot;
  }) => void;
  'presence:updated': (payload: { onlineMembers: VoiceRoomMemberSummary[]; onlineAdmins?: VoiceRoomAdminSummary[] }) => void;
  'message:created': (payload: VoiceRoomMessageItem) => void;
  'message:deleted': (payload: { id: string; deleted_by_admin_id: string; deleted_at: string }) => void;
  'gift:created': (payload: { transactionId: string; message: VoiceRoomMessageItem; gift: VoiceRoomGiftItem }) => void;
  'mic:updated': (payload: VoiceRoomMicSnapshot) => void;
  'access:changed': (payload: { member_id: string; can_enter: boolean; can_speak: boolean; is_muted: boolean; mic_blocked: boolean; is_banned: boolean }) => void;
  'room:error': (payload: { code: string; message: string }) => void;
};
