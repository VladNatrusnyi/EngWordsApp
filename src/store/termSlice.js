import {createSlice} from "@reduxjs/toolkit";

export const emptyInitialStateForAppSlice = {
    currentTopics: [],
    pretestData: null,
    pretestStatus: false,
    isPretestLoading: false,
    isPretestError: '',
    modules: []
}

const initialState = emptyInitialStateForAppSlice

export const termSlice = createSlice({
    name: 'term',
    initialState,
    reducers: {
        setCurrentTopics(state, action) {
            state.currentTopics = action.payload
        },

        setPretestData(state, action) {
            state.pretestData = action.payload
        },

        setIsPretestLoading(state, action) {
            state.isPretestLoading = action.payload
        },
        setIsPretestError(state, action) {
            state.isPretestError = action.payload
        },

        setPretestStatus(state, action) {
            state.pretestStatus = action.payload
        },

        setModules(state, action) {
            state.modules = action.payload
        },

    },
})

// Action creators are generated for each case reducer function
export const {
    setCurrentTopics,
    setPretestData,
    setIsPretestLoading,
    setIsPretestError,
    setPretestStatus,
    setModules
} = termSlice.actions

export default termSlice.reducer
