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

        // Authentication API
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
        

        // Profile API
        getProfile: builder.query({
            query: () => `http://localhost:8000/api/account/profile/`
        }),
        
        // Team Management Server
        
        // Courses API
        getAccountCourses: builder.query({
            query: () => `http://localhost:8080/api/account/profile/courses/`
        }),
        
        // Team API
        getTeamDetail: builder.query({
            query: (payload) => `http://localhost:8080/api/teams/${payload.id}/`,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),

        // Teknoplat Server

        // Meetings API
        getMeetingsByCourse: builder.query({
            query: (payload) => `http://localhost:8008/api/meetings/?course=${payload.course}`
        }),
        getPendingMeetings: builder.query({
            query: (payload) => `http://localhost:8008/api/meeting/list/pending/?limit=${payload.limit}&offset=${payload.offset}`,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems)
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        getInProgressMeetings: builder.query({
            query: (payload) => `http://localhost:8008/api/meeting/list/in_progress/?limit=${payload.limit}&offset=${payload.offset}`,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems)
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg
            },
        }),
        getCompletedMeetings: builder.query({
            query: (payload) => `http://localhost:8008/api/meeting/list/completed/?limit=${payload.limit}&offset=${payload.offset}`,
            serializeQueryArgs: ({ endpointName }) => {
                return endpointName
            },
            merge: (currentCache, newItems) => {
                currentCache.push(...newItems)
            },
            forceRefetch({ currentArg, previousArg }) {
                console.log("Start Completed Meeting API");
                console.log(currentArg);
                console.log(previousArg);
                console.log("End Completed Meeting API");
                return currentArg !== previousArg
            },
        }),

        // Meeting API
        getMeetingDetail: builder.query({
            query: (payload) => `http://localhost:8008/api/meetings/${payload.id}/`
        }),
        updateMeetingDetail: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/meetings/${payload.id}/`,
                method: 'PUT',
                body: payload.meeting
            }),
        }),
        
        // Comment API
        addComment: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/comments/`,
                method: 'POST',
                body: payload.comment
            }),
        }),

        // Ratings API
        addRating: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/account/ratings/`,
                method: 'POST',
                body: payload.rating
            }),
        }),
        updateRating: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/ratings/`,
                method: 'PUT',
                body: payload.rating
            }),
        }),
        getRatings: builder.query({
            query: () => `http://localhost:8008/ratings/`
        }),
        getAccountRatings: builder.query({
            query: () => `http://localhost:8008/account/ratings/`
        }),
        getPitchRatings: builder.query({
            query: () => `http://localhost:8008/pitch/ratings/`
        }),

        // Remarks API
        addRemark: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/account/remarks/`,
                method: 'POST',
                body: payload.remark
            }),
        }),
        updateRemark: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/remarks/`,
                method: 'PUT',
                body: payload.remark
            }),
        }),
        getRemarks: builder.query({
            query: () => `http://localhost:8008/remarks/`
        }),
        getAccountRemarks: builder.query({
            query: () => `http://localhost:8008/account/remarks/`
        }),
        getPitchRemarks: builder.query({
            query: () => `http://localhost:8008/pitch/remarks/`
        }),

        // Video SDK API
        createVideoMeeting: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/meeting/create-meeting/`,
                method: 'POST',
                body: payload.credentials
            }),
        }),
        validateVideoMeeting: builder.mutation({
            query: (payload) => ({
                url: `http://localhost:8008/api/meeting/validate-meeting/${payload.video}/`,
                method: 'POST',
                body: payload.credentials
            }),
        }),
        authenticateVideoMeeting: builder.mutation({
            query: () => ({
                url: `http://localhost:8008/api/video/authenticate/`,
                method: 'POST'
            }),
        }),
    })
});

export const {
    // Wildcat Server

    // Authentication API
    useAuthenticateMutation,
    useReauthenticateMutation,

    // Profile API
    useGetProfileQuery,

    // Team Management Server

    // Courses API
    useGetAccountCoursesQuery,

    // Team API
    useGetTeamDetailQuery,

    // Teknoplat Server

    // Meetings API
    useGetMeetingsByCourseQuery,
    useGetPendingMeetingsQuery,
    useGetInProgressMeetingsQuery,
    useGetCompletedMeetingsQuery,

    // Meeting API
    useGetMeetingDetailQuery,
    useUpdateMeetingDetailMutation,

    // Comment API
    useAddCommentMutation,

    // Ratings API
    useAddRatingMutation,
    useUpdateRatingMutation,
    useGetRatingsQuery,
    useGetAccountRatingsQuery,
    useGetPitchRatingsQuery,

    // Remarks API
    useAddRemarkMutation,
    useUpdateRemarkMutation,
    useGetRemarksQuery,
    useGetAccountRemarksQuery,
    useGetPitchRemarksQuery,

    // Video SDK API
    useCreateVideoMeetingMutation,
    useValidateVideoMeetingMutation,
    useAuthenticateVideoMeetingMutation,
} = apiSlice;