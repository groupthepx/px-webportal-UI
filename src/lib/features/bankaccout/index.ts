import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
    postBankAccount: builder.mutation<any, { bank: Partial<any> }>({
        query: ({ bank }) => ({
           // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
           url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/bank-account`,
           method: 'POST',
           body: bank,
           headers: {
            'Content-Type': 'multipart/form-data',
        },
        }),
     }),
   updateBankAccount: builder.mutation<any, { id: string; bank: Partial<any> }>({
      query: ({ id, bank }) => ({
         url:`${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/bank-account/${id}`,
         method: 'PUT',
         body: bank,
         headers: {
            'Content-Type': 'multipart/form-data',
        },
      }),
   }),

   }),
})

export const {
    usePostBankAccountMutation,
    useUpdateBankAccountMutation

} = userApiSlice
