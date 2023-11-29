import { createSlice } from "@reduxjs/toolkit";
import { Map } from 'immutable';

export const pathSlice = createSlice({
    name: "path",
    initialState: {
        paths: [
            { type: "dashboard", name: "Dashboard", to: "/" },
            { type: "settings", name: "Settings", to: "/settings" },
            { type: "profile", name: "Profile", to: "/profile" }
        ],
        history: [],
        current: null
    },
    reducers: {
        storeCoursePaths: (state, { payload }) => {
            return {
                ...state,
                paths: state.paths.concat(payload.course)
            }
        },
        storeMeetingPaths: (state, { payload }) => {
            return {
                ...state,
                paths: state.paths.concat(payload.meeting)
            }
        },
        storeCurrent: (state, { payload }) => {
            const currentPath = state.paths.find((path) => path.to === payload.url);
            const onHistory = state.history.find((path) => path.to === payload.url);
            if (state.current !== null && !(Map(state.current).equals(Map(currentPath))) && onHistory === undefined) {
                state.history.push(state.current);
            }
            if (currentPath !== undefined && !(Map(state.current).equals(Map(currentPath)))) {
                state.current = currentPath;
            }
        },
        deStoreHistory: (state) => {
            state.history = [];
            state.current = null;
        },
        deStoreCoursePaths: (state) => {
            const newPaths = state.paths.filter((path) => path.type !== "course");
            state.paths = newPaths;
        },
        deStoreMeetingPaths: (state) => {
            const newPaths = state.paths.filter((path) => path.type !== "meeting");
            state.paths = newPaths;
        }
    }
});

export const {
    storeCoursePaths,
    storeMeetingPaths,
    storeCurrent,
    deStoreHistory,
    deStoreCoursePaths,
    deStoreMeetingPaths
} = pathSlice.actions;
