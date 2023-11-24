import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        prepareHeaders: (headers, { getState }) => {
            const token = Cookies.get('access')
            headers.set('Authorization', `Bearer ${token}`)
        },
        onError: (error) => {
            console.log("Global Error: " + error);
        }
    }),
    endpoints: (builder) => ({
        // Wildcat Server
        authenticate: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8000/api/token/`,
                method: 'POST',
                body: payload.credentials
            }),
        }),
        reauthenticate: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8000/api/token/refresh/`,
                method: 'POST',
                body: payload.credentials
            }),
        }),
        getProfile: builder.query({
            query: () => `http://localhost:8000/api/account/profile/`
        }),
        
        // Team Management Server
        getAccountCourses: builder.query({
            query: () => `http://localhost:8080/api/account/profile/courses/`
        }),
        getCourseDetail: builder.query({
            query: (payload) => `http://localhost:8080/api/courses/${payload.id}/`
        }),

        // Teknoplat Server
        getMeetingsByCourse: builder.query({
            query: (payload) => `http://localhost:8008/api/meetings/?course=${payload.course}/`
        }),
        getMeetingsByCourseAndStatus: builder.query({
            query: (payload) => `http://localhost:8008/api/meetings/?course=${payload.course}&state=${payload.status}/`
        }),
        getMeeting: builder.query({
            query: (payload) => `http://localhost:8008/api/meetings/${payload.id}/`
        })
    })
});

export const {
    // Wildcat Server
    useAuthenticateMutation,
    useReauthenticateMutation,
    useGetProfileQuery,

    // Team Management Server
    useGetAccountCoursesQuery,
    useGetCourseDetailQuery,

    // Teknoplat Server
    useGetMeetingsByCourseQuery,
    useGetMeetingsByCourseAndStatusQuery,
    useGetMeetingQuery
} = apiSlice;