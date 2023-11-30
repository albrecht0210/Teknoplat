import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    profile: null
}

export const accountSlice = createSlice({
    name: "account",
    initialState: initialState,
    reducers: {
        storeProfile: (state, { payload }) => {
            state.profile = payload.profile;
        },
        deStoreAccounnt: () => initialState
    }
});

export const {
    storeProfile,
    deStoreProfile
} = accountSlice.actions;
