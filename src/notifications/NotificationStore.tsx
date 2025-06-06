import { configureStore } from "@reduxjs/toolkit";
import notificationReducer from "./NotificationSlice";

const notificationStore = configureStore({
  reducer: {
    notification: notificationReducer
  }
})

export default notificationStore;