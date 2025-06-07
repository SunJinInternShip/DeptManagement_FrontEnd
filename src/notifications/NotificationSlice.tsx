import { createSlice } from "@reduxjs/toolkit";

interface Notification {
  message: string;
  createdAt: string;
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: [] as Array<Notification>,
  reducers: {
    addNotification: (state: Array<Notification>, data) => {
      const parsed = JSON.parse(data.payload)
      state.push({
        message: parsed.message,
        createdAt: parsed.createdAt
      })
    },
    resetNotifications: (state: Array<any>) => {
      state.length = 0
    }
  }
})

export const { addNotification } = notificationSlice.actions

export default notificationSlice.reducer