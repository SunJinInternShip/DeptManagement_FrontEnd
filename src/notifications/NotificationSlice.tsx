import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: false,
  reducers: {
    toggle: (state) => !state
  }
})

export const { toggle } = notificationSlice.actions

export default notificationSlice.reducer