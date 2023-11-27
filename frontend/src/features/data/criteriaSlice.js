import { createSlice } from "@reduxjs/toolkit";

export const criteriaSlice = createSlice({
    name: "criteria",
    initialState: {
        criterias: [],
        criteria: null
    },
    reducers: {
        storeCriterias: (state, { payload }) => {
            state.criterias = payload.criterias;
        },
        storeCriteria: (state, { payload }) => {

        },
        deStoreCriterias: (state) => {
            state.criterias = [];
            state.criteria = null;
        },
        deStoreCriteria: (state) => {
            state.criteria = null;
        }
    }
});

export const {
    storeCriterias,
    storeCriteria,
    deStoreCriterias,
    deStoreCriteria
} = criteriaSlice.actions;
