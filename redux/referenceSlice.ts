import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import db from '../db-services';

interface CheckInObject {
  type: 'checkIn';
  _id: string;
  ref: string;
}

interface CheckInState {
  references: CheckInObject[];
}

const initialState: CheckInState = {
  references: [],
};

export const getReferences = createAsyncThunk('reference/getRefs', () => {
  return new Promise<CheckInObject[]>((resolve, reject) => {
    db.find({ type: 'checkIn' }, (err: Error, docs: any[]) => {
      if (err) reject(err.message);
      console.log(docs);
      resolve(docs);
    });
  });
});

export const addNewReference = createAsyncThunk(
  'reference/addNewRef',
  (ref: string) => {
    return new Promise<CheckInObject>((resolve, reject) => {
      const doc = {
        type: 'checkIn',
        ref,
      };
      db.insert(doc, (err: Error, newDoc: any) => {
        if (err) reject(err.message);
        console.log(ref + ' added to ref');
        resolve(newDoc);
      });
    });
  }
);

export const removeReferences = createAsyncThunk(
  'reference/removeRefs',
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

export const referenceSlices = createSlice({
  name: 'reference',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addNewReference.fulfilled, (state, action) => {
        state.references.push(action.payload);
      })
      .addCase(removeReferences.fulfilled, () => {
        return initialState;
      })
      .addCase(getReferences.fulfilled, (state, action) => {
        state.references = action.payload;
      });
  },
});

export default referenceSlices.reducer;
