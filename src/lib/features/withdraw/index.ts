
import { WithdrawRequestListModel } from "@/model/withdraw_request"
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({


      postWithdrawRequests: builder.mutation<any, { withdraw: Partial<any> }>({
         query: ({ withdraw }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/withdraw-request/all-organization`,
            method: 'POST',
            body: withdraw,
         }),
         invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag
      }),

      postWithdrawRequestsNonOranization: builder.mutation<any, { withdraw: Partial<any> }>({
         query: ({ withdraw }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/withdraw-request/non-organization`,
            method: 'POST',
            body: withdraw,
         }),
         invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag
      }),

      getWithdrawListAll: builder.query<any, { status: string, date: string, organization_id?: string, created_by_id: string }>({
         query: ({
            status,
            date,
            organization_id,
            created_by_id
         }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/withdraw-requests/filter?${status && status != 'all' ? `status=${status}` : ''}${date ? `&date=${date}` : ''}${organization_id ? `&organization_id=${organization_id}` : ''}${created_by_id ? `&created_by_id=${created_by_id}` : ''}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: WithdrawRequestListModel) => Promise.resolve(response),
         providesTags: ['withdraw', 'member'], // Provide a tag for this query
      }),


   }),
})

export const {


   usePostWithdrawRequestsMutation,
   useGetWithdrawListAllQuery,
  usePostWithdrawRequestsNonOranizationMutation,

} = userApiSlice
