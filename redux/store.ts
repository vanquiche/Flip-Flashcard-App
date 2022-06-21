import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import notificationReducer from './notificationSlice';
import checkInReducer from './checkInSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    notification: notificationReducer,
    checkIn: checkInReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
