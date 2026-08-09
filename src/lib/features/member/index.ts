import { apiSlice } from "@/utils/apiSlice"

interface ReferCheckMemberPayload {
    member_id: string
    full_name: string
    nick_name: string
    profile: string
}

interface ReferCheckOrganizationPayload {
    organization_id: string
    company_name: string
    company_logo: string
}

interface ReferCheckPayload {
    id: string
    user_id: string
    organization_id: string
    member: ReferCheckMemberPayload
    organization: ReferCheckOrganizationPayload
}

interface ReferCheckResponse {
    data: ReferCheckPayload | []
    status: number
    error: boolean
    message: string
    exists: boolean
}

export const userApiSlice = apiSlice.injectEndpoints({
    overrideExisting: true, // Allow overriding existing endpoints
    endpoints: (builder) => ({


        postMember: builder.mutation<any, { member: Partial<any> }>({
            query: ({ member }) => ({
                url: `/register`,
                method: 'POST',
                body: member,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },

            }),
        }),

        checkReferId: builder.query<ReferCheckResponse, string>({
            query: (referId) => ({
                url: `/check-refer-id?refer_id=${encodeURIComponent(referId)}`,
                method: 'GET',
            }),
        }),

        updateMember: builder.mutation<any, { id: string; member: Partial<any> }>({
            query: ({ id, member }) => ({
                url: `${process.env.NEXT_PUBLIC_BASE_BACKOFFICE_API}/member/${id}`,
                method: 'PUT',
                body: member,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
        }),
    }),
})

export const {
    usePostMemberMutation,
    useUpdateMemberMutation,
    useLazyCheckReferIdQuery,
} = userApiSlice
