
import { ActivityListAllModel } from "@/model/activity"
import { ReviewListAllModel } from "@/model/review"
import { apiSlice } from "@/utils/apiSlice"



export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
   //  postActivity: builder.mutation<any, {  activity: Partial<any> }>({
   //      query: ({  activity }) => ({
   //          // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
   //          url: `/activity`,
   //          method: 'POST',
   //          body: activity,
       
   //      }),
   //   }),
     getActivityListAll: builder.query<any, void>({
        query: () => ({
           url: `/activities`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: ActivityListAllModel) => Promise.resolve(response)
     }),


   //   deleteActivity: builder.mutation<any, { id: string; }>({
   //    query: ({ id }) => ({

   //       url: `/activity/${id}`,
   //       method: 'DELETE',
   //    }),
   // }),

   // updateActivity: builder.mutation<any, { id: string; activity: Partial<any> }>({
   //    query: ({ id, activity }) => ({

   //       url: `/activity/${id}`,
   //       method: 'PUT',
   //       body: activity,

   //    }),
   // }),

   }),
})

export const {
   //  usePostActivityMutation,
    useGetActivityListAllQuery,
   //  useDeleteActivityMutation,
   //  useUpdateActivityMutation,
} = userApiSlice
