import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/problems/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchProblem = createAsyncThunk(
  'problems/fetchProblem',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/problems/${id}/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const problemsSlice = createSlice({
  name: 'problems',
  initialState: {
    problems: [],
    currentProblem: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentProblem: (state) => {
      state.currentProblem = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Problems
      .addCase(fetchProblems.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.loading = false
        state.problems = action.payload
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Problem
      .addCase(fetchProblem.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProblem.fulfilled, (state, action) => {
        state.loading = false
        state.currentProblem = action.payload
      })
      .addCase(fetchProblem.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentProblem, clearError } = problemsSlice.actions
export default problemsSlice.reducer