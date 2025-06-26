import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import taskReducer from "../features/tasks/taskSlice";
import commentReducer from "../features/comments/commentSlice";
import activityReducer from '../features/activity/activitySlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    comments: commentReducer,
    activity: activityReducer,
  },
});