import { BlogDetailsModel, BlogListAllModel } from "@/model/blog"
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({
   //  postBlog: builder.mutation<any, {  blog: Partial<any> }>({
   //      query: ({  blog }) => ({
   //          // baseUrl: process.env.NEXT_PUBLIC_BASE_API_PAY ,
   //          url: `/blog`,
   //          method: 'POST',
   //          body: blog,
       
   //      }),
   //   }),
     getBlogListAll: builder.query<any, void>({
        query: () => ({
           url: `/blogs`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: BlogListAllModel) => Promise.resolve(response)
     }),
     getBlogById: builder.query<any, { id: string | null }>({
      query: ({ id }) => ({
         url: `/blog/${id}`,
         method: 'GET',
         headers: {
            "Content-Type": "application/json",
         },
      }),
      transformResponse: (response: BlogDetailsModel) => Promise.resolve(response)
   }),


   //   deleteBlog: builder.mutation<any, { id: string; }>({
   //    query: ({ id }) => ({

   //       url: `/blog/${id}`,
   //       method: 'DELETE',
   //    }),
   // }),

   // updateBlog: builder.mutation<any, { id: string; blog: Partial<any> }>({
   //    query: ({ id, blog }) => ({

   //       url: `/blog/${id}`,
   //       method: 'PUT',
   //       body: blog,

   //    }),
   // }),
 

   }),
})

export const {
   //  usePostBlogMutation,
    useGetBlogListAllQuery,
    useGetBlogByIdQuery,
   //  useDeleteBlogMutation,
   //  useUpdateBlogMutation
} = userApiSlice
