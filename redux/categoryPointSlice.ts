import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Category } from '../components/types';
import db from '../db-services';

interface UpdateObj {
  id: string;
  points: number;
}

interface CategoryPointInt {
  categories: Category[];
}

const initialState: CategoryPointInt = {
  categories: [],
};

export const getPoints = createAsyncThunk('categoryPoint/getPoints', () => {
  return new Promise<Category[]>((resolve, reject) => {
    db.find({ type: 'category' }, (err: Error, docs: any[]) => {
      if (err) reject(err.message);
      // console.log(docs)
      resolve(docs);
    });
  });
});

export const addPoints = createAsyncThunk(
  'categoryPoint/addPointsByRef',
  (update: UpdateObj) => {
    return new Promise<UpdateObj>((resolve, reject) => {
      db.update(
        { _id: update.id },
        { $set: { points: update.points } },
        (err: Error, numRemoved: number) => {
          if (err) reject(err.message);
          resolve(update);
        }
      );
    });
  }
);

export const removePoints = createAsyncThunk(
  'categoryPoint/removePointsByID', (id: string) => {
    return new Promise<string>((resolve, reject) => {
      db.remove({_id: id}, {}, (err: Error, numRemoved: number) => {
        if (err) reject(err.message)
        resolve(id)
      })
    })
  }
)
export const categoryPointSlice = createSlice({
  name: 'categoryPoint',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPoints.fulfilled, (state, action) => {
      state.categories = action.payload;
    })
    .addCase(addPoints.fulfilled, (state, action) => {
      const index = state.categories.findIndex(category => category._id === action.payload.id)
      state.categories[index].points = action.payload.points
    })
    .addCase(removePoints.fulfilled, (state, action) => {
      const index = state.categories.findIndex(category => category._id === action.payload)
      state.categories.splice(index, 1)

    })
  },
});

export default categoryPointSlice.reducer;
