import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const chatAdapter = createEntityAdapter({})

const initialState = chatAdapter.getInitialState()


export const chatApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getChat: builder.query({
            query: () => '/chat',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            transformResponse: responseData => {
                const loadedChats = responseData.map((chat) => {
                    chat.id = chat._id
                    return chat
                });
                return chatAdapter.setAll(initialState, loadedChats)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Chat', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Chat', id }))
                    ]
                } else return [{ type: 'Chat', id: 'LIST' }]
            }
        }),
        accessChat: builder.mutation({
            query: initialChat => ({
                url: '/chat',
                method: 'POST',
                body: {
                    ...initialChat,
                }
            }),
            invalidatesTags: [
                { type: 'Chat', id: "LIST" }
            ]
        }),
    }),
})

export const {
    useGetChatQuery,
    useAccessChatMutation,
} = chatApiSlice

// returns the query result object
export const selectChatsResult = chatApiSlice.endpoints.getChat.select()

// creates memoized selector
const selectChatsData = createSelector(
    selectChatsResult,
    chatsResult => chatsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllChats,
    selectById: selectChatById,
    selectIds: selectChatIds
    // Pass in a selector that returns the chats slice of state
} = chatAdapter.getSelectors(state => selectChatsData(state) ?? initialState)
