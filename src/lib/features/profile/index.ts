import { MemberDataDetailModel } from "@/model/member"
import { OverviewDetailListModel } from "@/model/overview_detail"
import { ProfileModel } from "@/model/profile"
import { ReferFriendModel, ReferRewardHistoryModel } from "@/model/refer_friend"
import { RewardHistoryListModel } from "@/model/reward_history"
import { KycVerificationListResponse } from "@/model/kyc_verification"
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true, // Allow overriding existing endpoints
    endpoints: (builder) => ({

        getProfileById: builder.query<any, void>({
            query: () => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/profile-detail`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: ProfileModel) => Promise.resolve(response),
            providesTags: ['withdraw', 'member', 'profile'], // Provide a tag for this query
            // Performance: ข้อมูล profile ไม่เปลี่ยนบ่อย
            keepUnusedDataFor: 600, // เก็บ cache 10 นาที
        }),
        getMemberOverviewDetailById: builder.query<any, { id: string | null, organizationId: string }>({
            query: ({ id, organizationId }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/member/overview-detail/${id}`,
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: {
                    organization_id: organizationId,
                },
            }),
            transformResponse: (response: OverviewDetailListModel) => Promise.resolve(response),
            providesTags: ['withdraw', 'member'], // Provide a tag for this query
            // Performance: Overview data อาจเปลี่ยนบ่อยกว่า profile
            keepUnusedDataFor: 180, // เก็บ cache 3 นาที
        }),
        getMemberById: builder.query<any, { id: string | null }>({
            query: ({ id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/member/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },

            }),
            transformResponse: (response: MemberDataDetailModel) => Promise.resolve(response),
            providesTags: ['withdraw', 'member'], // Provide a tag for this query
            // KYC/balance state changes from other flows; keep this short to avoid stale verification status.
            keepUnusedDataFor: 30,
        }),

        getRewardHistory: builder.query<any, { id: string | null, organization_id: string | null }>({
            query: ({ id, organization_id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/add-reward-history/member/${id}/organization_id/${organization_id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: RewardHistoryListModel) => Promise.resolve(response),
            providesTags: ['withdraw', 'member'], // Provide a tag for this query
        }),
        getGeneralRewardHistoryByMember: builder.query<any, { id: string | null }>({
            query: ({ id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/add-reward-history/member/${id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: any) => Promise.resolve(response),
            providesTags: ['withdraw', 'member'],
            keepUnusedDataFor: 60,
        }),
        getRewardHistoryMemberReferMission: builder.query<any, { id: string | null, organization_id: string | null }>({
            query: ({ id, organization_id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/add-reward-history/refer-mission/member/${id}/organization_id/${organization_id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: ReferFriendModel) => Promise.resolve(response),
            providesTags: ['withdraw', 'member'], // Provide a tag for this query
        }),

        verifyProfileKyc: builder.mutation<any, FormData>({
            query: (formData) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/kyc/verify`,
                method: 'POST',
                body: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }),
            invalidatesTags: ['member', 'kyc'], // This invalidates the 'Transactions' tag
        }),

        getPendingKycVerifications: builder.query<any, { memberId: string }>({
            query: ({ memberId }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/kyc/verifications?status=pending&page=1&limit=10`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: KycVerificationListResponse, meta, arg) => {
                // Filter ตาม member_id จาก response
                const filteredData = response.data?.filter(
                    (kyc) => kyc.member_id === arg.memberId
                ) || [];
                return {
                    ...response,
                    data: filteredData,
                };
            },
            providesTags: ['kyc'], // Provide a tag for this query
            keepUnusedDataFor: 60, // เก็บ cache 1 นาที (ตรวจสอบบ่อยขึ้น)
        }),
     // New endpoint: Get refer reward history by member
      // ประวัติโบนัสแนะนำเพื่อน - แสดงข้อมูลของคนที่เราแนะนำ
      getReferRewardHistoryByMember: builder.query<ReferRewardHistoryModel, { member_id: string | null }>({
        query: ({ member_id }) => ({
           url: `/add-reward-history/refer-reward/member/${member_id}`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: ReferRewardHistoryModel) => Promise.resolve(response),
        providesTags: ['withdraw', 'member'],
     }),

    }),
})

export const {
    useGetProfileByIdQuery,
    useGetMemberOverviewDetailByIdQuery,
    useGetMemberByIdQuery,
    useGetRewardHistoryQuery,
    useLazyGetRewardHistoryQuery,
    useGetGeneralRewardHistoryByMemberQuery,

    useGetRewardHistoryMemberReferMissionQuery,
    useVerifyProfileKycMutation,
    useGetPendingKycVerificationsQuery,
    useGetReferRewardHistoryByMemberQuery,
} = userApiSlice
