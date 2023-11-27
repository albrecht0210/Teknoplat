import { createSlice } from "@reduxjs/toolkit";

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
            console.log(payload);
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
            if (state.current !== null) {
                state.history.push(state.current);
            }
            const currentPath = state.paths.find((path) => path.to === payload.url);
            if (currentPath !== undefined || state.current !== currentPath) {
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
