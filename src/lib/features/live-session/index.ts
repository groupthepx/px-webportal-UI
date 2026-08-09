import { apiSlice } from "@/utils/apiSlice";

export const liveSessionApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    createLiveSession: builder.mutation<any, { organization_id: string; live_link: string; note?: string }>({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-session`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["live", "profile"],
    }),
    getMyLiveSessions: builder.query<any, void>({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-sessions/me`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
      providesTags: ["live"],
    }),
    endLiveSession: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-session/${id}/end`,
        method: "PUT",
        body: {},
      }),
      invalidatesTags: ["live"],
    }),
    getLiveRewardInfo: builder.query<any, { organization_id: string }>({
      query: ({ organization_id }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-reward-info?organization_id=${organization_id}`,
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }),
    }),
  }),
});

export const {
  useCreateLiveSessionMutation,
  useGetMyLiveSessionsQuery,
  useEndLiveSessionMutation,
  useGetLiveRewardInfoQuery,
} = liveSessionApiSlice;
