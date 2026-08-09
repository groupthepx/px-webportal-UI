
import { DistrictModel, ProvinceModel, VillageModel } from "@/model/region"
import { apiSlice } from "@/utils/apiSlice"



export const userApiSlice = apiSlice.injectEndpoints({
  overrideExisting: true, // Allow overriding existing endpoints
   endpoints: (builder) => ({


      getProvince: builder.query<ProvinceModel, void>({
         query: () => ({
            url: '/thai-province-data/api_province.json',
            method: 'GET',
            absoluteUrl: true, // Flag to use absolute URL (local file)
            headers: {
               "Content-Type": "application/json",
            },
         }),
         transformResponse: (response: any) => Promise.resolve(response) as any
      }),
      getDistrictById: builder.query<any , { id?: string  }>({
         query: () => ({
           url: '/thai-province-data/api_amphure.json',
           method: 'GET',
           absoluteUrl: true, // Flag to use absolute URL (local file)
           headers: {
             'Content-Type': 'application/json',
           },
         }),
        //  transformResponse: (response: any, meta, arg) => {
        //    const id = arg.id;
        //    if (id === null) return undefined; // Handle null id
        //    const data = response as DistrictModel[];
        //    return Promise.resolve(data.filter((district) => district.province_id === Number(id))) as any;
        //  },
         transformResponse: (response: any, meta, arg) => {
          const districtData = (response as DistrictModel[]);
      
          if (arg.id) {
            return districtData.filter(district => district.province_id === parseInt(`${arg.id}`));
          }
      
          return districtData;
        },
         // Optional: You can add providesTags if you’re using caching and invalidation
         // providesTags: (result, error, arg) => [{ type: 'District', id: arg.id }],
       }),
       getVillageById: builder.query<any, { id?: string  }>({
         query: () => ({
            url: '/thai-province-data/api_tambon.json',
           method: 'GET',
           absoluteUrl: true, // Flag to use absolute URL (local file)
           headers: {
             "Content-Type": "application/json",
           },
         }),
         transformResponse: (response: unknown, meta: any, arg: { id?: string | null }) => {
           const villageData = (response as VillageModel[]);
       
           if (arg.id) {
             return villageData.filter(village => village.amphure_id === parseInt(`${arg.id}`));
           }
       
           return villageData;
         },
       }),



   }),
})

export const {
   useGetProvinceQuery,
   useGetDistrictByIdQuery,
   useGetVillageByIdQuery
} = userApiSlice
