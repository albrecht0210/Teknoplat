import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const access = Cookies.get("access") ? Cookies.get("access") : null;
const refresh = Cookies.get("refresh") ? Cookies.get("refresh") : null;

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        access: access,
        refresh: refresh
    },
    reducers: {
        storeAuthCredentials: (state, { payload }) => {
            state.access = payload.access;
            state.refresh = payload.refresh;
        },
        storeAccessToken: (state, { payload }) => {
            state.access = payload.access;
        },
        deStoreAuthCredentials: (state) => {
            state.access = null;
            state.refresh = null;
        }
    }
});

export const { 
    storeAuthCredentials, 
    storeAccessToken,
    deStoreAuthCredentials 
} = authSlice.actions;
