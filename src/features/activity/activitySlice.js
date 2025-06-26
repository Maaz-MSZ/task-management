import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; 

export const fetchActivity = createAsyncThunk(
  'activity/fetch',
  async ({ page = 1, limit = 5 }, thunkAPI) => {
    try {
      const res = await axios.get(`/activity?_page=${page}&_limit=${limit}&_sort=timestamp&_order=desc`);
      return { page, data: res.data };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const activitySlice = createSlice({
  name: 'activity',
  initialState: {
    activity: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivity.fulfilled, (state, action) => {
          state.loading = false;
       if (action.payload.page === 1) {
          //  Replace list on page 1 (after update/delete)
          state.activity = action.payload.data;
        } else {
          //  Append if loading more
          state.activity = [...state.activity, ...action.payload.data];
        }
      })
      .addCase(fetchActivity.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export default activitySlice.reducer;
