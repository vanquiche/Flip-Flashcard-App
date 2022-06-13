import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../components/types';
import { initUser } from '../context/userContext';
import db from '../db-services';

interface UserInitState {
  user: User;
  loading: 'idle' | 'pending' | 'suceeded' | 'failed';
  notification: string;
}

const initialState: UserInitState = {
  user: initUser,
  loading: 'idle',
  notification: '',
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
        state.notification = 'successfully create new user';
        state.user = action.payload;
      })
      // .addCase(createNewUser.pending, (state) => {
      //   state.loading = 'pending';
      // })
      .addCase(createNewUser.rejected, (state, action) => {
        state.loading = 'suceeded';
        if (typeof action.payload === 'string') {
          state.notification = action.payload;
        }
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        state.user = action.payload;
      })
      // .addCase(getUserData.pending, (state) => {
      //   state.loading = 'pending';
      // })
      .addCase(getUserData.rejected, (state, action) => {
        state.loading = 'suceeded';
        if (typeof action.payload === 'string') {
          state.notification = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        state.user = action.payload;
      })
      // .addCase(deleteUser.pending, (state) => {
      //   state.loading = 'pending';
      // })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = 'suceeded';
        if (typeof action.payload === 'string') {
          state.notification = action.payload;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = 'suceeded';
        Object.assign(state, action.payload);
      })
      // .addCase(updateUser.pending, (state) => {
      //   state.loading = 'pending';
      // })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'suceeded';
        if (typeof action.payload === 'string') {
          state.notification = action.payload;
        }
      });
  },
});

export default userSlice.reducer;
