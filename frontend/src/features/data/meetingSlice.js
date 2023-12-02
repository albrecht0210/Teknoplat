import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    meetings: [],
    meeting: null
}

export const meetingSlice = createSlice({
    name: "meeting",
    initialState: initialState,
    reducers: {
        storeMeetings: (state, { payload }) => {
            return {
                ...state,
                meetings: state.meetings.concat(payload.meetings)
            }
        },
        storeMeetingsOnCourse: (state, { payload }) => {
            state.meetings = payload.meetings;
        },
        storeMeeting: (state, { payload }) => {
            state.meeting = state.meetings.find((meeting) => meeting.id === payload.meeting.id);
        },
        storeMeetingByName: (state, { payload }) => {
            state.meeting = state.meeting.find((meeting) => meeting.name === payload.name);
        },
        deStoreMeetings: () => initialState,
        deStoreMeeting: (state) => {
            state.meeting = null;
        }
    }
});

export const {
    storeMeetings,
    storeMeetingsOnCourse,
    storeMeeting,
    storeReplaceMeeting,
    storeMeetingByName,
    storeMeetingPitchTeam,
    storeMeetingPitchTeamMembers,
    storeStatus,
    deStoreMeetings,
    deStoreMeeting
} = meetingSlice.actions;
