import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchTestCases = createAsyncThunk(
  'testCases/fetchTestCases',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/testcases/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const createTestCase = createAsyncThunk(
  'testCases/createTestCase',
  async (testCaseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/testcases/', testCaseData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const updateTestCase = createAsyncThunk(
  'testCases/updateTestCase',
  async ({ id, ...testCaseData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/testcases/${id}/`, testCaseData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const deleteTestCase = createAsyncThunk(
  'testCases/deleteTestCase',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/testcases/${id}/`)
      return id
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const testCasesSlice = createSlice({
  name: 'testCases',
  initialState: {
    testCases: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Test Cases
      .addCase(fetchTestCases.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTestCases.fulfilled, (state, action) => {
        state.loading = false
        state.testCases = action.payload
      })
      .addCase(fetchTestCases.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Test Case
      .addCase(createTestCase.fulfilled, (state, action) => {
        state.testCases.push(action.payload)
      })
      // Update Test Case
      .addCase(updateTestCase.fulfilled, (state, action) => {
        const index = state.testCases.findIndex(tc => tc.id === action.payload.id)
        if (index !== -1) {
          state.testCases[index] = action.payload
        }
      })
      // Delete Test Case
      .addCase(deleteTestCase.fulfilled, (state, action) => {
        state.testCases = state.testCases.filter(tc => tc.id !== action.payload)
      })
  },
})

export const { clearError } = testCasesSlice.actions
export default testCasesSlice.reducer