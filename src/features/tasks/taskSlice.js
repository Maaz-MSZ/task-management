import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios'; 
import { getIndianTimestamp } from '@/utils/constants';

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async ({ page = 1, limit = 5 }, thunkAPI) => {
    try {
        const res = await axios.get(`/tasks?_page=${page}&_limit=${limit}&_sort=id&_order=desc`);
        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
}
);

export const createTask = createAsyncThunk('tasks/createTask', async (task, thunkAPI) => {
    try {
        const res = await axios.post(`/tasks`, task, getAuthHeaders());

        // Add activity log
        const user = JSON.parse(localStorage.getItem("user"));
        await axios.post(`/activity`, {
            message: `📝 ${user.email} created task "${task.title}"`,
            timestamp: getIndianTimestamp()
        });

        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, data }, thunkAPI) => {
    try {
        const res = await axios.put(`/tasks/${id}`, data, getAuthHeaders());

        const user = JSON.parse(localStorage.getItem("user"));
        await axios.post(`/activity`, {
            message: `🔄 ${user.email} updated task "${data.title}"`,
            timestamp: getIndianTimestamp()
        });

        return res.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, thunkAPI) => {
    try {

        // Get the task title before deleting (optional but useful for log)
        const tasks = thunkAPI.getState().tasks.tasks;
        const deletedTask = tasks.find((t) => t.id === id);

        await axios.delete(`/tasks/${id}`, getAuthHeaders());

        const user = JSON.parse(localStorage.getItem("user"));
        await axios.post(`/activity`, {
            message: `❌ ${user.email} deleted task "${deletedTask?.title || 'Unknown'}"`,
            timestamp: getIndianTimestamp()
        });

        return id;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.message);
    }
});

const taskSlice = createSlice({
    name: 'tasks',
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload);
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex((task) => task.id === action.payload.id); //If you had tasks with IDs [1, 2, 3] and you updated task id=2, this line would return index 1
                if (index !== -1) state.tasks[index] = action.payload; //findIndex() returns -1 if no match is found.
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter((task) => task.id !== action.payload); //.filter((task) => task.id !== action.payload): keeps only the tasks whose ID is NOT equal to the deleted task’s ID, action.payload: contains the ID of the task that was deleted.
            }); // The result is a new array excluding the deleted task.
    },
});

export default taskSlice.reducer;
