import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/adminAuthSlice'
import { server } from '../../../server'

const adminBaseQuery = fetchBaseQuery({ 
    baseUrl: `${server}`, 
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token
        if (token) {
            headers.set('token', `Bearer ${token}`)
        }
        return headers
    } 
})

const adminBaseQueryWithReauth = async (args, api, extraOptions) => {
    // console.log(args) // request url, method, body
    // console.log(api) // signal, dispatch, getState()
    // console.log(extraOptions) //custom like {shout: true}

    let result = await adminBaseQuery(args, api, extraOptions)

    // If you want, handle other status codes, too
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // send refresh token to get new access token 
        const refreshResult = await adminBaseQuery('/refresh', api, extraOptions)

        if (refreshResult?.data) {

            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data }))

            // retry original query with new access token
            result = await adminBaseQuery(args, api, extraOptions)
        } else {

            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = "Your login has expired. "
            }
            return refreshResult
        }
    }

    return result
}

export const adminApiSlice = createApi({
    baseQuery: adminBaseQueryWithReauth,
    tagTypes: ['AdminUsers', 'AdminOrders', 'AdminProducts', 'AdminCart'],
    endpoints: (builder) => ({})
})