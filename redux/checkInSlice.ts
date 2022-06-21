import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import db from '../db-services';

interface CheckInObject {
  type: 'checkIn';
  _id: string;
  ref: string;
}

interface CheckInState {
  quizes: CheckInObject[];
}

const initialState: CheckInState = {
  quizes: [],
};

export const getCheckInRef = createAsyncThunk('checkIn/getRefs', () => {
  return new Promise<CheckInObject[]>((resolve, reject) => {
    db.find({ type: 'checkIn' }, (err: Error, docs: any[]) => {
      if (err) reject(err.message);
      console.log(docs);
      resolve(docs);
    });
  });
});

export const addNewRefToCheckIn = createAsyncThunk(
  'checkIn/addNewRef',
  (ref: string) => {
    return new Promise<CheckInObject>((resolve, reject) => {
      const doc = {
        type: 'checkIn',
        ref,
      };
      db.insert(doc, (err: Error, newDoc: any) => {
        if (err) reject(err.message);
        console.log('set added to ref');
        resolve(newDoc);
      });
    });
  }
);

export const removeRefFromCheckIn = createAsyncThunk(
  'checkIn/removeRefs',
  () => {
    return new Promise<void>((resolve, reject) => {
      db.remove(
        { type: 'checkIn' },
        { multi: true },
        (err: Error, numRemoved: number) => {
          if (err) reject(err.message);
          resolve();
        }
      );
    });
  }
);

export const checkInSlice = createSlice({
  name: 'checkIn',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewRefToCheckIn.fulfilled, (state, action) => {
        state.quizes.push(action.payload);
      })
      .addCase(removeRefFromCheckIn.fulfilled, () => {
        return initialState;
      })
      .addCase(getCheckInRef.fulfilled, (state, action) => {
        state.quizes = action.payload;
      });
  },
});

export default checkInSlice.reducer;
