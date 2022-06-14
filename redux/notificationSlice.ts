import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationInitState {
  alert: {
    show: boolean;
    message: string;
  };
}
const initialState: NotificationInitState = {
  alert: {
    show: false,
    message: '',
  },
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    dismissMessage: (state) => {
      return initialState
    },
    showMessage: (state, action: PayloadAction<string>) => {
      state.alert.show = true;
      state.alert.message = action.payload;
    },
  },
});

export const { dismissMessage, showMessage } = notificationSlice.actions;
export default notificationSlice.reducer;
