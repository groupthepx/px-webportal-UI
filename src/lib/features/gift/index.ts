import { GiftListResponse } from "@/model/gift"
import { apiSlice } from "@/utils/apiSlice"

export const giftApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({

        getMyGifts: builder.query<any, { member_id: string }>({
            query: ({ member_id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/product/gifts/me?member_id=${member_id}`,
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            }),
            transformResponse: (response: GiftListResponse) => Promise.resolve(response),
            providesTags: ['gift'],
            keepUnusedDataFor: 120,
        }),

        acceptGift: builder.mutation<any, { gift_id: string }>({
            query: ({ gift_id }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/product/gift/accept/${gift_id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['gift', 'member'],
        }),

    }),
})

export const {
    useGetMyGiftsQuery,
    useAcceptGiftMutation,
} = giftApiSlice
