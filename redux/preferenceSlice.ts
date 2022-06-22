import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Category, Set, Theme } from '../components/types';
import db from '../db-services';

const defaultTheme: Theme = {
  name: 'default',
  fontColor: 'black',
  cardColor: 'tomato',
  tabColor: 'pink',
  headerColor: 'pink',
};

interface PreferenceInitState {
  favorites: Set[];
  theme: Theme;
}

const initialState: PreferenceInitState = {
  favorites: [],
  theme: defaultTheme,
};

export const getFavorites = createAsyncThunk('preference/getFavorites', () => {
  return new Promise<Set[]>((resolve, reject) => {
    db.find({ type: 'set', favorite: true }, (err: Error, docs: Set[]) => {
      if (err) reject(err.message);
      resolve(docs);
    });
  });
});

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Set>) => {
      const exist = state.favorites.find(
        (fav) => fav._id === action.payload._id
      );
      const index = state.favorites.findIndex(fav => fav._id === action.payload._id)
      // if set doesn't exist then add new set
      // if does exist then merge set
      // else return current state
      if (!exist) {
        state.favorites.push(action.payload);
      } else if (exist) {
        state.favorites.splice(index, 1, action.payload)
      } else state.favorites
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      const index = state.favorites.findIndex(
        (fav) => fav._id === action.payload
      );
      state.favorites.splice(index, 1);
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getFavorites.fulfilled, (state, action) => {
      state.favorites = action.payload;
    });
  },
});

export const { addFavorite, removeFavorite } = preferenceSlice.actions;

export default preferenceSlice.reducer;
