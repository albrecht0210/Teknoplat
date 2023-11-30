import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
    access: Cookies.get("access") ?? null,
    refresh: Cookies.get("refresh") ?? null,
    video: Cookies.get("video") ?? null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        storeAuthCredentials: (state, { payload }) => {
            state.access = payload.access;
            state.refresh = payload.refresh;
        },
        storeVideoToken: (state, { payload }) => {
            state.video = payload.video;
        },
        storeAccessToken: (state, { payload }) => {
            state.access = payload.access;
        },
        deStoreAuthCredentials: () => initialState
    }
});

export const { 
    storeAuthCredentials, 
    storeVideoToken,
    storeAccessToken,
    deStoreAuthCredentials 
} = authSlice.actions;
