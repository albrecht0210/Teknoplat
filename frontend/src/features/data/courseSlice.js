import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: [],
        course: null
    },
    reducers: {
        storeCourses: (state, { payload }) => {
            state.courses = payload.courses;
        },
        storeCourse: (state, { payload }) => {
            state.course = state.courses.find((course) => course.id === payload.course.id);
        },
        storeCourseByName: (state, { payload }) => {
            state.course = state.courses.find((course) => course.name === payload.name);
        },
        deStoreCourses: (state) => {
            state.courses = [];
            state.course = null;
        },
        deStoreCourse: (state) => {
            state.course = null;
        }
    }
});

export const {
    storeCourses,
    storeCourse,
    deStoreCourses,
    deStoreCourse
} = courseSlice.actions;
