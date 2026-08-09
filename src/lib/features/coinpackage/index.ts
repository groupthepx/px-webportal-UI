import { BlogDetailsModel, BlogListAllModel } from "@/model/blog"
import { CoinBalancePackagesListModel } from "@/model/coin_balance_packages"
import { TransferCoinBalanceListModel } from "@/model/transfer_coin_balance";
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({


      // postCoinBalanceTransfer: builder.mutation<any, { transfer: Partial<any> }>({
      //    query: ({ transfer }) => ({
      //       // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
      //       url: `/coin-balance-package/transfer/`,
      //       method: 'POST',
      //       body: transfer,

      //    }),
      // }),
      getCoinBalancePackagesListAll: builder.query<any, void>({
         query: () => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/coin-balance-packages/enabled`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: CoinBalancePackagesListModel) => Promise.resolve(response),
         providesTags: ['withdraw', 'member'], // Provide a tag for this query
      }),
      //   getBlogById: builder.query<any, { id: string | null }>({
      //    query: ({ id }) => ({
      //       url: `/blog/${id}`,
      //       method: 'GET',
      //       headers: {
      //          "Content-Type": "application/json",
      //       },
      //    }),
      //    transformResponse: (response: BlogDetailsModel) => Promise.resolve(response)
      // }),


      //   deleteBlog: builder.mutation<any, { id: string; }>({
      //    query: ({ id }) => ({

      //       url: `/blog/${id}`,
      //       method: 'DELETE',
      //    }),
      // }),

      updateCoinBalanceTransfer: builder.mutation<any, { id: string; transfer: Partial<any> }>({
         query: ({ id, transfer }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/coin-balance-package/transfer/${id}`,
            method: 'PUT',
            body: transfer,
          
         }),
           invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag

      }),

      updateCoinBalanceTransferNonOrg: builder.mutation<any, { id: string; transfer: Partial<any> }>({
         query: ({ id, transfer }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/coin-balance-package/transfer/non-organization/${id}`,
            method: 'PUT',
            body: transfer,
            
         }),
         invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag

      }),



      getTransferCoinBalanceListAll: builder.query<any, { id: string; }>({
         query: ({ id }) => ({
            // This endpoint expects a member id. The shorter route treats the
            // path parameter as an organization id and loses the app context.
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/transfer-coin-balance-history/member/${id}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: TransferCoinBalanceListModel) => Promise.resolve(response),
         providesTags: ['withdraw', 'member'], // Provide a tag for this query
      }),


   }),
})

export const {

   //  usePostBlogMutation,
   // useGetBlogListAllQuery,
   // useGetBlogByIdQuery,
   //  useDeleteBlogMutation,
   //  useUpdateBlogMutation
   useGetCoinBalancePackagesListAllQuery,
   useUpdateCoinBalanceTransferMutation,
   useGetTransferCoinBalanceListAllQuery,
   useUpdateCoinBalanceTransferNonOrgMutation,

} = userApiSlice
