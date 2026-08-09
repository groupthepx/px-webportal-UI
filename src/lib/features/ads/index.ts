import { BannerModel } from "@/model/banner";
import { apiSlice } from "@/utils/apiSlice"

export const userApiSlice = apiSlice.injectEndpoints({
   overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({

     getBannerListAll: builder.query<any, { id: string;}>({
        query: ({id}) => ({
           url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/banners/enabled?organization_id=${id}`,
           method: 'GET',
           headers: {
              "Content-Type": "application/json",
           },
        }),
        transformResponse: (response: BannerModel) => Promise.resolve(response)
     }),



   }),
})

export const {
   
    useGetBannerListAllQuery,
 

} = userApiSlice
