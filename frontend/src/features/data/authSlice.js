import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const access = Cookies.get("access") ? Cookies.get("access") : null;
const refresh = Cookies.get("refresh") ? Cookies.get("refresh") : null;
const video = Cookies.get("video") ? Cookies.get("video") : null;

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        access: access,
        refresh: refresh,
        video: video,
    },
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
        deStoreAuthCredentials: (state) => {
            return {
                access: access,
                refresh: refresh,
                video: video,
            }
        }
    }
});

export const { 
    storeAuthCredentials, 
    storeVideoToken,
    storeAccessToken,
    deStoreAuthCredentials 
} = authSlice.actions;
