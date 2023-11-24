import { createSlice } from "@reduxjs/toolkit";

export const meetingSlice = createSlice({
    name: "meeting",
    initialState: {
        meetings: [],
        meeting: null,
        status: "in_progress",
    },
    reducers: {
        storeMeetings: (state, { payload }) => {
            state.meetings = payload.meetings;
        },
        storeMeeting: (state, { payload }) => {
            state.meeting = state.meeting.find((meeting) => meeting.id === payload.meeting.id);
        },
        storeMeetingByName: (state, { payload }) => {
            state.meeting = state.meeting.find((meeting) => meeting.name === payload.name);
        },
        storeStatus: (state, { payload }) => {
            state.status = payload.status;
        },
        deStoreMeetings: (state) => {
            state.meetings = [];
            state.meeting = null;
        },
        deStoreMeeting: (state) => {
            state.meeting = null;
        }
    }
});

export const {
    storeMeetings,
    storeMeeting,
    storeMeetingByName,
    storeStatus,
    deStoreMeetings,
    deStoreMeeting
} = meetingSlice.actions;
