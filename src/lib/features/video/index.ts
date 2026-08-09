import { MemberDataDetailModel } from "@/model/member"
import { OverviewDetailListModel } from "@/model/overview_detail"
import { ProfileModel } from "@/model/profile"
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({

//       getProfileById: builder.query<any, void >({
//          query: () => ({
//             url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/profile-detail`,
//             method: 'GET',
//             headers: {
//                "Content-Type": "application/json",
//             },
//          }),
//          transformResponse: (response: ProfileModel) => Promise.resolve(response)
//       }),
//       getMemberOverviewDetailById: builder.query<any, { id: string | null }>({
//          query: ({ id }) => ({
//              url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/member/overview-detail/${id}`,
//              method: 'GET',
//              headers: {
//                  "Content-Type": "application/json",
//              },
//          }),
//          transformResponse: (response: OverviewDetailListModel) => Promise.resolve(response)
//      }),
//      getMemberById: builder.query<any, { id: string | null }>({
//       query: ({ id }) => ({
//           url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/member/${id}`,
//           method: 'GET',
//           headers: {
//               "Content-Type": "application/json",
//           },
//       }),
//       transformResponse: (response: MemberDataDetailModel) => Promise.resolve(response)
//   }),

postProgressvdo: builder.mutation<any, { vdo: Partial<any> }>({
    query: ({ vdo }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/vdo/update/progress`,
        method: 'POST',
        body: vdo,

    }),
}),

getVideoByOrganizationsById: builder.query<any, { id: string | null }>({
    query: ({ id }) => ({
        url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/vdos?organization_id=${id}`,
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        },
    }),
    transformResponse: (response: any) => Promise.resolve(response),
}),


   }),
})

export const {
    // postProfileById,
    // postMemberOverviewDetailById,
    // postMemberById,
    usePostProgressvdoMutation,
    useGetVideoByOrganizationsByIdQuery,

    // useGetProfileByIdQuery,
    // useGetMemberOverviewDetailByIdQuery,
    // useGetMemberByIdQuery
    


} = userApiSlice
