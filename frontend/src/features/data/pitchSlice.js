import { createSlice } from "@reduxjs/toolkit";

export const pitchSlice = createSlice({
    name: "pitch",
    initialState: {
        pitches: [],
        pitch: null
    },
    reducers: {
        storePitches: (state, { payload }) => {
            state.pitches = payload.pitches;
        },
        storePitch: (state, { payload }) => {

        },
        deStorePitches: (state) => {
            state.pitches = [];
            state.pitch = null;
        },
        deStorePitch: (state) => {
            state.pitch = null;
        }
    }
});

export const {
    storePitches,
    storePitch,
    deStorePitches,
    deStorePitch
} = pitchSlice.actions;
