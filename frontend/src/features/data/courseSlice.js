import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    courses: [],
    course: null,

}

export const courseSlice = createSlice({
    name: "course",
    initialState: initialState,
    reducers: {
        storeCourses: (state, { payload }) => {
            state.courses = payload.courses;
        },
        storeCourse: (state, { payload }) => {
            state.course = payload.course;
        },
        deStoreCourses: () => initialState,
        deStoreCourse: (state) => {
            state.course = initialState.course
        }
    }
});

export const {
    storeCourses,
    storeCourse,
    deStoreCourses,
    deStoreCourse
} = courseSlice.actions;
