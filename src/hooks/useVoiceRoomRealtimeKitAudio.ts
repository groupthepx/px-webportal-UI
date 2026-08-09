'use client';

import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { VoiceRoomAudioRole, VoiceRoomAudioToken } from '@/model/voice-room';

export type VoiceRoomRealtimeAudioStatus = 'disabled' | 'idle' | 'joining' | 'listening' | 'speaking' | 'playback_blocked' | 'error';

type RtkMeeting = ReturnType<typeof useRealtimeKitClient>[0];
type RtkAudioPlayback = {
  play?: () => Promise<void>;
  onError?: (callback: () => void) => void;
};

interface UseVoiceRoomRealtimeKitAudioParams {
  enabled: boolean;
  role: VoiceRoomAudioRole;
  publishAudio: boolean;
  getToken: () => Promise<VoiceRoomAudioToken>;
}

function audioPlaybackFor(meeting: RtkMeeting) {
  return meeting.audio as unknown as RtkAudioPlayback | undefined;
}

function registerPlaybackErrorHandler(meeting: RtkMeeting, onPlaybackBlocked: () => void) {
  audioPlaybackFor(meeting)?.onError?.(onPlaybackBlocked);
}

async function playMeetingAudio(meeting: RtkMeeting) {
  const audioPlayback = audioPlaybackFor(meeting);
  if (!audioPlayback?.play) throw new Error('Cloudflare audio playback manager is not available');
  await audioPlayback.play();
}

async function leaveMeeting(meeting: RtkMeeting | null) {
  if (!meeting) return;
  try {
    await meeting.self.disableAudio();
  } catch {
    // Ignore cleanup errors from browsers that already closed media devices.
  }
  try {
    await meeting.leave();
  } catch {
    // Ignore cleanup errors when the SDK already left the meeting.
  }
}

function activeStatusFor(publishAudio: boolean): VoiceRoomRealtimeAudioStatus {
  return publishAudio ? 'speaking' : 'listening';
}

export function useVoiceRoomRealtimeKitAudio({
  enabled,
  role,
  publishAudio,
  getToken,
}: UseVoiceRoomRealtimeKitAudioParams) {
  const [meeting, initMeeting] = useRealtimeKitClient({ resetOnLeave: true });
  const activeMeetingRef = useRef<RtkMeeting | null>(null);
  const [status, setStatus] = useState<VoiceRoomRealtimeAudioStatus>(enabled ? 'idle' : 'disabled');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!enabled) {
      setStatus('disabled');
      setErrorMessage('');
      void leaveMeeting(activeMeetingRef.current);
      activeMeetingRef.current = null;
      return undefined;
    }

    let cancelled = false;
    let joinedMeeting: RtkMeeting | null = null;

    async function connectAudio() {
      setStatus('joining');
      setErrorMessage('');
      try {
        const audioToken = await getToken();
        if (cancelled) return;
        const nextMeeting = await initMeeting({
          authToken: audioToken.token,
          defaults: { audio: false, video: false },
          modules: {
            chat: false,
            connectedMeetings: false,
            experimentalAudioPlayback: true,
            internals: false,
            livestream: false,
            participant: true,
            pip: false,
            plugin: false,
            poll: false,
            recording: false,
            stage: false,
          },
        });
        if (cancelled) {
          await leaveMeeting(nextMeeting || null);
          return;
        }
        if (!nextMeeting) throw new Error('ไม่สามารถเริ่ม Cloudflare RealtimeKit ได้');

        joinedMeeting = nextMeeting;
        activeMeetingRef.current = nextMeeting;
        registerPlaybackErrorHandler(nextMeeting, () => {
          if (!cancelled) setStatus('playback_blocked');
        });
        await nextMeeting.join();
        if (publishAudio) await nextMeeting.self.enableAudio();
        else await nextMeeting.self.disableAudio();
        try {
          await playMeetingAudio(nextMeeting);
          if (!cancelled) setStatus(activeStatusFor(publishAudio));
        } catch {
          if (!cancelled) setStatus('playback_blocked');
        }
      } catch (error) {
        if (cancelled) return;
        setStatus('error');
        setErrorMessage(error instanceof Error ? error.message : 'เชื่อมต่อเสียงจริงไม่สำเร็จ');
      }
    }

    void connectAudio();

    return () => {
      cancelled = true;
      if (activeMeetingRef.current === joinedMeeting) activeMeetingRef.current = null;
      void leaveMeeting(joinedMeeting);
    };
  }, [enabled, getToken, initMeeting, publishAudio, role]);

  const resumePlayback = useCallback(async () => {
    const activeMeeting = activeMeetingRef.current || meeting || null;
    if (!activeMeeting) return;
    try {
      await playMeetingAudio(activeMeeting);
      setStatus(activeStatusFor(publishAudio));
      setErrorMessage('');
    } catch (error) {
      setStatus('playback_blocked');
      setErrorMessage(error instanceof Error ? error.message : 'Browser บล็อกการเล่นเสียงอัตโนมัติ');
    }
  }, [meeting, publishAudio]);

  return {
    status,
    errorMessage,
    resumePlayback,
  };
}
