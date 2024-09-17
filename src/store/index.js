import {combineReducers, configureStore} from '@reduxjs/toolkit'
import termReducer from './termSlice'

import {setupListeners} from "@reduxjs/toolkit/query";



export const USER_LOGOUT_FROM_APP = '@@logout/USER_LOGOUT_FROM_APP'

const combinedReducer = combineReducers({
    term: termReducer,
});

const rootReducer = (state, action) => {
    if (action.type === USER_LOGOUT_FROM_APP) {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            immutableCheck: false,
            serializableCheck: false,
        })
})

setupListeners(store.dispatch)