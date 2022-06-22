import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'
import notificationReducer from './notificationSlice';
import referenceReducer from './referenceSlice'
import categoryPointReducer from './categoryPointSlice'
import preferenceReducer from './preferenceSlice'


export const store = configureStore({
  reducer: {
    user: userReducer,
    reference: referenceReducer,
    notification: notificationReducer,
    categoryPoint: categoryPointReducer,
    preference: preferenceReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
