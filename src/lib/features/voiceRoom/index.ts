import type { SendVoiceRoomGiftRequest, VoiceRoomAudioConfig, VoiceRoomAudioToken, VoiceRoomGiftItem, VoiceRoomMeResponse, VoiceRoomMessageItem } from '@/model/voice-room';
import { apiSlice } from '@/utils/apiSlice';

function cleanEnvUrl(value: string | undefined) {
  return String(value || '').trim().replace(/^['"]|['"]$/g, '').trim().replace(/\/$/, '');
}

function voiceRoomPrivateUrl(path: string) {
  const publicBaseUrl = cleanEnvUrl(process.env.NEXT_PUBLIC_BASE_API);
  const baseUrl = cleanEnvUrl(process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API) || publicBaseUrl.replace(/\/public$/, '/api');
  return baseUrl ? `${baseUrl}${path}` : path;
}

export const voiceRoomApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getVoiceRoomMe: builder.query<VoiceRoomMeResponse, void>({
      query: () => ({ url: voiceRoomPrivateUrl('/voice-room/me'), method: 'GET' }),
      transformResponse: (response: { data: VoiceRoomMeResponse }) => response.data,
      providesTags: ['VoiceRoom'],
    }),
    getVoiceRoomMessages: builder.query<VoiceRoomMessageItem[], { limit?: number; before?: string } | void>({
      query: (params) => {
        const search = new URLSearchParams();
        if (params?.limit) search.set('limit', String(params.limit));
        if (params?.before) search.set('before', params.before);
        return { url: voiceRoomPrivateUrl(`/voice-room/messages${search.toString() ? `?${search.toString()}` : ''}`), method: 'GET' };
      },
      transformResponse: (response: { data: VoiceRoomMessageItem[] }) => response.data,
      providesTags: ['VoiceRoom'],
    }),
    getVoiceRoomGifts: builder.query<VoiceRoomGiftItem[], void>({
      query: () => ({ url: voiceRoomPrivateUrl('/voice-room/gifts'), method: 'GET' }),
      transformResponse: (response: { data: VoiceRoomGiftItem[] }) => response.data,
      providesTags: ['VoiceRoom'],
    }),
    getVoiceRoomAudioConfig: builder.query<VoiceRoomAudioConfig, void>({
      query: () => ({ url: voiceRoomPrivateUrl('/voice-room/audio-config'), method: 'GET' }),
      transformResponse: (response: { data: VoiceRoomAudioConfig }) => response.data,
      providesTags: ['VoiceRoom'],
    }),
    createVoiceRoomAudioToken: builder.mutation<VoiceRoomAudioToken, void>({
      query: () => ({ url: voiceRoomPrivateUrl('/voice-room/audio-token'), method: 'POST' }),
      transformResponse: (response: { data: VoiceRoomAudioToken }) => response.data,
    }),
    sendVoiceRoomGift: builder.mutation<VoiceRoomMessageItem, SendVoiceRoomGiftRequest>({
      query: (body) => ({ url: voiceRoomPrivateUrl('/voice-room/gifts/send'), method: 'POST', body }),
      transformResponse: (response: { data: { message: VoiceRoomMessageItem } }) => response.data.message,
      invalidatesTags: ['VoiceRoom'],
    }),
  }),
});

export const {
  useGetVoiceRoomMeQuery,
  useGetVoiceRoomMessagesQuery,
  useGetVoiceRoomGiftsQuery,
  useGetVoiceRoomAudioConfigQuery,
  useCreateVoiceRoomAudioTokenMutation,
  useSendVoiceRoomGiftMutation,
} = voiceRoomApi;
