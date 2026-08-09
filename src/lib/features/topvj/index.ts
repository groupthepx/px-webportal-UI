import { BlogDetailsModel, BlogListAllModel } from "@/model/blog"
import { TopVJModelList } from "@/model/top_vj"
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
  
     getTopVJListAll: builder.query<any, void>({
        query: () => ({
           url: `/top-vj`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: TopVJModelList) => Promise.resolve(response)
     }),
  
   }),
})

export const {
     useGetTopVJListAllQuery,
      
} = userApiSlice
