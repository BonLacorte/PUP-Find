import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
    name: 'auth',
    initialState: { token: null },
    reducers: {
        setCredentials: (state, action) => {
            const { accessToken } = action.payload;
            state.token = accessToken;
        },
        logOut: (state, action) => {
            state.token = null;
        }
    }
});

export const { setCredentials, logOut } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;

export const selectCurrentToken = (state) => state.auth.token;