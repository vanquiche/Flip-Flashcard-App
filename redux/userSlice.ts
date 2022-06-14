import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../components/types';
import { initUser } from '../components/types';
import db from '../db-services';

interface UserInitState {
  user: User;
  loading: 'idle' | 'pending' | 'suceeded' | 'failed';
}

const initialState: UserInitState = {
  user: initUser,
  loading: 'idle',
};

export const createNewUser = createAsyncThunk(
  'user/createUser',
  (newUser: User) => {
    return new Promise<User>((resolve, reject) => {
      db.insert(newUser, (err: Error, newDoc: User) => {
        if (err) reject(err.message);
        resolve(newDoc);
      });
    });
  }
);

export const getUserData = createAsyncThunk('user/getUser', () => {
  return new Promise<User>((resolve, reject) => {
    db.find({ type: 'user' }, (err: Error, docs: User[]) => {
      if (err) reject(err.message);
      if (docs.length > 0) resolve(docs[0]);
    });
  });
});

export const deleteUser = createAsyncThunk('user/deleteCurrentUser', () => {
  return new Promise<User>((resolve, reject) => {
    db.remove({ type: 'user' }, {}, (err: Error, numRemoved: number) => {
      if (err) reject(err.message);
      resolve(initUser);
    });
  });
});

export const updateUser = createAsyncThunk(
  'user/updateUserByField',
  (update: Object) => {
    return new Promise<Object>((resolve, reject) => {
      db.update(
        { type: 'user' },
        { $set: update },
        (err: Error, numRemoved: number) => {
          if (err) reject(err.message);
          resolve(update);
        }
      );
    });
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewUser.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        state.user = action.payload;
      })
      .addCase(createNewUser.rejected, (state, action) => {
        state.loading = 'suceeded';
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        state.user = action.payload;
      })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = 'suceeded';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        state.user = action.payload;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = 'suceeded';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        Object.assign(state, action.payload);
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'suceeded';
      });
  },
});

export default userSlice.reducer;
