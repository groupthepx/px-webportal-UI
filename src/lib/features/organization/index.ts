





import { BonusRankListModel } from "@/model/bonus_rank";
import { IncomePolicyListModel } from "@/model/income_policy";
import { MissionListModel } from "@/model/mission";
import { MissionCoinUpListModel } from "@/model/mission_coin_up";
import { OrganizationDetailDataModel, OrganizationListModel } from "@/model/organization"
import { PositionMissionListModel } from "@/model/position_mission";
import { VJMissionListModel } from "@/model/vj_mission";
import { apiSlice } from "@/utils/apiSlice"



export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
      postOrganization: builder.mutation<any, { organization: Partial<any> }>({
         query: ({ organization }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/organization`,
            method: 'POST',
            body: organization,

         }),
      }),
      getOrganizationListAll: builder.query<any, void>({
         query: () => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/organizations`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: OrganizationListModel) => Promise.resolve(response)
      }),

      getOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/organization/${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: OrganizationDetailDataModel) => Promise.resolve(response)
      }),

      updateOrganization: builder.mutation<any, { id: string; organization: Partial<any> }>({
         query: ({ id, organization }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/organization/${id}`,
            method: 'PUT',
            body: organization,

         }),
      }),


      postIncomePolicy: builder.mutation<any, { incomePolicy: Partial<any> }>({
         query: ({ incomePolicy }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/income-policy-app`,
            method: 'POST',
            body: incomePolicy,

         }),
      }),

      getIncomePolicyByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/income-policy-app?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: IncomePolicyListModel) => Promise.resolve(response)
      }),

      deleteIncomePolicy: builder.mutation<any, { id: string; }>({
         query: ({ id }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/income-policy-app/${id}`,
            method: 'DELETE',
         }),
      }),

      updateIncomePolicy: builder.mutation<any, { id: string; incomePolicy: Partial<any> }>({
         query: ({ id, incomePolicy }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/income-policy-app/${id}`,
            method: 'PUT',
            body: incomePolicy,

         }),
      }),


      getMissionByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: MissionListModel) => Promise.resolve(response)
      }),

      postMission: builder.mutation<any, { mission: Partial<any> }>({
         query: ({ mission }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission`,
            method: 'POST',
            body: mission,

         }),
      }),

      updateMission: builder.mutation<any, { id: string; mission: Partial<any> }>({
         query: ({ id, mission }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission/${id}`,
            method: 'PUT',
            body: mission,

         }),
      }),

      deleteMission: builder.mutation<any, { id: string; }>({
         query: ({ id }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission/${id}`,
            method: 'DELETE',
         }),
      }),


      getRankBonusByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/rank-bonus?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: BonusRankListModel) => Promise.resolve(response)
      }),

      postRankBonus: builder.mutation<any, { rankBonus: Partial<any> }>({
         query: ({ rankBonus }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/rank-bonus`,
            method: 'POST',
            body: rankBonus,

         }),
      }),

      deleteRankBonus: builder.mutation<any, { id: string; }>({
         query: ({ id }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/rank-bonus/${id}`,
            method: 'DELETE',
         }),
      }),

      updateRankBonus: builder.mutation<any, { id: string; rankBonus: Partial<any> }>({
         query: ({ id, rankBonus }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/rank-bonus/${id}`,
            method: 'PUT',
            body: rankBonus,

         }),
      }),

      getVJMissionByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/vj-mission?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: VJMissionListModel) => Promise.resolve(response)
      }),

      postVJMission: builder.mutation<any, { vjMission: Partial<any> }>({
         query: ({ vjMission }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/vj-mission`,
            method: 'POST',
            body: vjMission,

         }),
      }),

      updateVJMission: builder.mutation<any, { id: string; vjMission: Partial<any> }>({
         query: ({ id, vjMission }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/vj-mission/${id}`,
            method: 'PUT',
            body: vjMission,

         }),
      }),

      getPositionMissionByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/position-mission?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: PositionMissionListModel) => Promise.resolve(response)
      }),


      updatePositionMission: builder.mutation<any, { id: string; positionMission: Partial<any> }>({
         query: ({ id, positionMission }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/position-mission/${id}`,
            method: 'PUT',
            body: positionMission,
         }),
      }),



      getMissionCoinUpByOrganizationsById: builder.query<any, { id: string | null }>({
         query: ({ id }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission-coin-up?organization_id=${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: MissionCoinUpListModel) => Promise.resolve(response)
      }),

      postMissionCoinUp: builder.mutation<any, { missionCoinUp: Partial<any> }>({
         query: ({ missionCoinUp }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission-coin-up`,
            method: 'POST',
            body: missionCoinUp,

         }),
      }),

      updateMissionCoinUp: builder.mutation<any, { id: string; missionCoinUp: Partial<any> }>({
         query: ({ id, missionCoinUp }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission-coin-up/${id}`,
            method: 'PUT',
            body: missionCoinUp,

         }),
      }),

      deleteMissionCoinUp: builder.mutation<any, { id: string; }>({
         query: ({ id }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/mission-coin-up/${id}`,
            method: 'DELETE',
         }),
      }),





   }),
})

export const {
   usePostOrganizationMutation,
   useGetOrganizationListAllQuery,
   useUpdateOrganizationMutation,
   useGetOrganizationsByIdQuery,
   usePostIncomePolicyMutation,
   useGetIncomePolicyByOrganizationsByIdQuery,
   useDeleteIncomePolicyMutation,
   useUpdateIncomePolicyMutation,
   useGetMissionByOrganizationsByIdQuery,
   usePostMissionMutation,
   useUpdateMissionMutation,
   useDeleteMissionMutation,
   useGetRankBonusByOrganizationsByIdQuery,
   usePostRankBonusMutation,
   useDeleteRankBonusMutation,
   useUpdateRankBonusMutation,
   useGetVJMissionByOrganizationsByIdQuery,
   useUpdateVJMissionMutation,
   useUpdatePositionMissionMutation,
   useGetPositionMissionByOrganizationsByIdQuery,
   usePostVJMissionMutation,
   useGetMissionCoinUpByOrganizationsByIdQuery,
   usePostMissionCoinUpMutation,
   useUpdateMissionCoinUpMutation,
   useDeleteMissionCoinUpMutation,


} = userApiSlice
