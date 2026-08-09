import { BlogListAllModel } from "@/model/blog"
import { PxMarketProductModel } from "@/model/px_market_product";
import { PXProductHistoryModel } from "@/model/px_product_history";
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({

      getPxMarketProductListAll: builder.query<any, void>({
         query: () => ({
            url: `/products`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: PxMarketProductModel) => Promise.resolve(response),
         providesTags: ['withdraw', 'member'], // Provide a tag for this query
      }),

      getPxMarketProductHistoryListAll: builder.query<any, { status: string | null }>({
         query: ({ status }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/orders?status=${status}`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: PXProductHistoryModel) => Promise.resolve(response),
         providesTags: ['withdraw', 'member'], // Provide a tag for this query
      }),



      postOrderPxMarketProduct: builder.mutation<any, { product: Partial<any> }>({
         query: ({ product }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/order`,
            method: 'POST',
            body: product,

         }),
         invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag

      }),

         postOrderPxMarketProductNonOrganization: builder.mutation<any, { product: Partial<any> }>({
         query: ({ product }) => ({
            // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/order/non-organization`,
            method: 'POST',
            body: product,

         }),
         invalidatesTags: ['withdraw', 'member'], // This invalidates the 'Transactions' tag

      }),

      // Redeem with LIVE POINTS (คะแนน) — organization member
      postOrderRedeemPoints: builder.mutation<any, { product: Partial<any> }>({
         query: ({ product }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/order/redeem-points`,
            method: 'POST',
            body: product,
         }),
         invalidatesTags: ['withdraw', 'member'],
      }),

      // Redeem with LIVE POINTS — general (non-organization) member
      postOrderRedeemPointsNonOrganization: builder.mutation<any, { product: Partial<any> }>({
         query: ({ product }) => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/order/non-organization/redeem-points`,
            method: 'POST',
            body: product,
         }),
         invalidatesTags: ['withdraw', 'member'],
      }),

      // Spendable live points balance per organization
      getMyLivePoints: builder.query<any, void>({
         query: () => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-points/me`,
            method: 'GET',
            headers: { "Content-Type": "application/json" },
         }),
         providesTags: ['withdraw', 'member'],
      }),

      // Points movement statement (earns + spends)
      getMyLivePointsTransactions: builder.query<any, void>({
         query: () => ({
            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/live-points/me/transactions`,
            method: 'GET',
            headers: { "Content-Type": "application/json" },
         }),
         providesTags: ['withdraw', 'member'],
      }),


   }),
})

export const {
   useGetPxMarketProductListAllQuery,
   usePostOrderPxMarketProductMutation,
   useGetPxMarketProductHistoryListAllQuery,
   usePostOrderPxMarketProductNonOrganizationMutation,
   usePostOrderRedeemPointsMutation,
   usePostOrderRedeemPointsNonOrganizationMutation,
   useGetMyLivePointsQuery,
   useGetMyLivePointsTransactionsQuery,

} = userApiSlice
