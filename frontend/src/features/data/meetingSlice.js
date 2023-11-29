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
        storeReplaceMeeting: (state, { payload }) => {
            state.meeting = payload.meeting;
        },
        storeMeetingByName: (state, { payload }) => {
            state.meeting = state.meeting.find((meeting) => meeting.name === payload.name);
        },
        storeMeetingPitchTeam: (state, { payload }) => {
            console.log("InTeamPitch:")
            const index = state.meeting.pitches.findIndex((pitch) => pitch.id === payload.pitch);
            state.meeting.pitches[index] = {
                ...state.meeting.pitches[index],
                team: payload.team
            }
        },
        storeMeetingPitchTeamMembers: (state, { payload }) => {
            console.log("InTeamPitchMember:")
            const index = state.meeting.pitches.findIndex((pitch) => pitch.id === payload.pitch);
            console.log(index);
            state.meeting.pitches[index] = {
                ...state.meeting.pitches[index],
                members: payload.members
            }
        },
        storeStatus: (state, { payload }) => {
            state.status = payload.status;
        },
        deStoreMeetings: (state) => {
            return {
                meetings: [],
                meeting: null,
                status: "in_progress",
            }
        },
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
