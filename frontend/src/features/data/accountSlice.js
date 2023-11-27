import { createSlice } from "@reduxjs/toolkit";

export const accountSlice = createSlice({
    name: "account",
    initialState: {
        profile: null
    },
    reducers: {
        storeProfile: (state, { payload }) => {
            state.profile = payload.profile;
        },
        deStoreProfile: (state) => {
            state.profile = null;
        }
    }
});

export const {
    storeProfile,
    deStoreProfile
} = accountSlice.actions;
