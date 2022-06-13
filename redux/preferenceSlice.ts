import { createSlice } from "@reduxjs/toolkit";
import {Set} from '../components/types'

interface PreferenceInitState {
  favorites: string[]
}

const initialState: PreferenceInitState = {
  favorites: []
}

export const preferenceSlice = createSlice({
  name: 'preference',
  initialState,
  reducers: {},
})

export default preferenceSlice.reducer;