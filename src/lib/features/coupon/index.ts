






import { apiSlice } from "@/utils/apiSlice"



export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({


      updateClaimCouponMove: builder.mutation<any, {  data: Partial<any> }>({
         query: ({  data }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/coupon/claim`,
            method: 'PUT',
            body: data,
         }),
         invalidatesTags: ['member'], // This invalidates the 'Transactions' tag
      }),

            updateClaimCouponMoveNonOrg: builder.mutation<any, {  data: Partial<any> }>({
         query: ({  data }) => ({

            url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/coupon/claim/non-organization`,
            method: 'PUT',
            body: data,
         }),
         invalidatesTags: ['member'], // This invalidates the 'Transactions' tag
      }),


      



   }),
})

export const {
  
   useUpdateClaimCouponMoveMutation,
   useUpdateClaimCouponMoveNonOrgMutation,
  
} = userApiSlice
