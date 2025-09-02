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

export const createProblem = createAsyncThunk(
  'problems/createProblem',
  async (problemData, { rejectWithValue }) => {
    try {
      const response = await api.post('/problems/', problemData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateProblem = createAsyncThunk(
  'problems/updateProblem',
  async ({ id, ...problemData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/problems/${id}/`, problemData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteProblem = createAsyncThunk(
  'problems/deleteProblem',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/problems/${id}/`)
      return id
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
      .addCase(createProblem.fulfilled, (state, action) => {
        state.problems.push(action.payload)
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        const index = state.problems.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.problems[index] = action.payload
        }
      })
      .addCase(deleteProblem.fulfilled, (state, action) => {
        state.problems = state.problems.filter(p => p.id !== action.payload)
      })
  },
})

export const { clearCurrentProblem, clearError } = problemsSlice.actions
export default problemsSlice.reducer