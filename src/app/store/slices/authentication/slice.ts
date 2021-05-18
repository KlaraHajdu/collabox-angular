import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import User from '../../../types/User'
import AuthState from './types/AuthState'

const initialState: AuthState = {
    currentUser: null,
    errorMessage: null,
    loading: true,
}

const slice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        SET_CURRENT_USER: (state, action: PayloadAction<User | null>) => {
            state.currentUser = action.payload
            state.loading = false
        },
    },
})

export default slice.reducer

export const authenticationActions = slice.actions

