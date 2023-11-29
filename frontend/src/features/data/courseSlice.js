import { createSlice } from "@reduxjs/toolkit";

export const courseSlice = createSlice({
    name: "course",
    initialState: {
        courses: [],
        course: null,
        members: []
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
        storeCourseMembers: (state, { payload }) => {
            state.members = payload.members;
        },
        deStoreCourses: (state) => {
            return {
                courses: [],
                course: null,
                members: []
            }
        },
        deStoreCourse: (state) => {
            state.course = null;
        }
    }
});

export const {
    storeCourses,
    storeCourse,
    storeCourseByName,
    storeCourseMembers,
    deStoreCourses,
    deStoreCourse
} = courseSlice.actions;
