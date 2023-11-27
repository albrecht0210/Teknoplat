import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './features/api/apiSlice';
import { authSlice } from './features/data/authSlice';
import { accountSlice } from './features/data/accountSlice';
import { courseSlice } from './features/data/courseSlice';
import { meetingSlice } from './features/data/meetingSlice';
import { pathSlice } from './features/data/pathSlice';

export default configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer, 
        [authSlice.name]: authSlice.reducer,
        [pathSlice.name]: pathSlice.reducer,
        [accountSlice.name]: accountSlice.reducer,
        [courseSlice.name]: courseSlice.reducer,
        [meetingSlice.name]: meetingSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)
});