import { configureStore } from '@reduxjs/toolkit'
import { UserSlice } from './user'
import { ExpenseSlice } from './expense'

export const store = configureStore({
  reducer: {
    user: UserSlice.reducer,
    expense: ExpenseSlice.reducer,
  },
})


export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch