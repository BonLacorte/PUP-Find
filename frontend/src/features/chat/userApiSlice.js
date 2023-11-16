import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAdapter = createEntityAdapter({})

const initialState = userAdapter.getInitialState()


export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUser: builder.query({
            query: () => `/user`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return userAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
        getUserSearch: builder.query({
            query: search => `/user?search=${search}`,
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                });
                return userAdapter.setAll(initialState, loadedUsers)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        }),
    })
})

export const {
    useGetUserQuery,
    useGetUserSearchQuery
} = userApiSlice

// returns the query result object
export const selectUsersResult = userApiSlice.endpoints.getUser.select()

// creates memoized selector
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data // normalized state object with ids & entities
)


//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
    // Pass in a selector that returns the users slice of state
} = userAdapter.getSelectors(state => selectUsersData(state) ?? initialState)
