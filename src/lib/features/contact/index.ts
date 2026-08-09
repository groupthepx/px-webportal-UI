

import { ConstactListAllModel } from "@/model/constact";
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
  
      getContactListAll: builder.query<any, void>({
         query: () => ({
            url: `/contacts`,
            method: 'GET',
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: ConstactListAllModel) => Promise.resolve(response)
      }),

      // updateContact: builder.mutation<any, { id: string; contact: Partial<any> }>({
      //    query: ({ id, contact }) => ({
   
      //       url: `/contact/${id}`,
      //       method: 'PUT',
      //       body: contact,
   
      //    }),
      // }),


   }),
})

export const {
   //  usePostBlogMutation,
   // useUpdateContactMutation,
   useGetContactListAllQuery,
} = userApiSlice
