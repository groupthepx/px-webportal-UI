import { io, type Socket } from 'socket.io-client';
import type { ClientToServerEvents, ServerToClientEvents } from '@/model/voice-room';

export type VoiceRoomSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

function cleanEnvUrl(value: string | undefined) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '').trim();
}

function resolveSocketOrigin() {
  const explicitOrigin = cleanEnvUrl(process.env.NEXT_PUBLIC_SOCKET_URL);
  const apiUrl = cleanEnvUrl(
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.NEXT_PUBLIC_BASE_API ||
    process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API
  );
  const rawUrl = explicitOrigin || apiUrl;

  if (!rawUrl) return '';

  try {
    return new URL(rawUrl).origin;
  } catch {
    return rawUrl.replace(/\/+$/, '');
  }
}

export function createVoiceRoomSocket(token: string): VoiceRoomSocket {
  const origin = resolveSocketOrigin();
  const path = cleanEnvUrl(process.env.NEXT_PUBLIC_SOCKET_PATH) || '/v2/socket.io';

  return io(`${origin}/voice-room`, {
    auth: { token },
    path,
    transports: ['websocket', 'polling'],
    autoConnect: false,
  });
}
