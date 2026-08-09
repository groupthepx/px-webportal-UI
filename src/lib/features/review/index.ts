
import { ReviewListAllModel } from "@/model/review"
import { apiSlice } from "@/utils/apiSlice"



export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
  
     getReviewListAll: builder.query<any, void>({
        query: () => ({
           url: `/reviews`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: ReviewListAllModel) => Promise.resolve(response)
     }),


   }),
})

export const {
  
    useGetReviewListAllQuery,
  
} = userApiSlice
