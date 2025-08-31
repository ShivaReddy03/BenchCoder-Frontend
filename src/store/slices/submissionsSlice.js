import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const submitCode = createAsyncThunk(
  'submissions/submitCode',
  async (submissionData, { rejectWithValue }) => {
    try {
      const response = await api.post('/submissions/create/', submissionData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/submissions/')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const fetchSubmission = createAsyncThunk(
  'submissions/fetchSubmission',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/submissions/${id}/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const requestAnalysis = createAsyncThunk(
  'submissions/requestAnalysis',
  async (submissionId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/submissions/${submissionId}/analyze/`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState: {
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentSubmission: (state) => {
      state.currentSubmission = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Code
      .addCase(submitCode.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(submitCode.fulfilled, (state, action) => {
        state.loading = false
        state.submissions.unshift(action.payload)
      })
      .addCase(submitCode.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Submissions
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload
      })
      // Fetch Submission
      .addCase(fetchSubmission.fulfilled, (state, action) => {
        state.currentSubmission = action.payload
      })
      // In the extraReducers section of submissionsSlice, add:
      .addCase(requestAnalysis.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(requestAnalysis.fulfilled, (state, action) => {
        state.loading = false
        // Update the submission with AI analysis results
        const index = state.submissions.findIndex(
          sub => sub.id === action.payload.id
        )
        if (index !== -1) {
          state.submissions[index] = action.payload
        }
        if (state.currentSubmission && state.currentSubmission.id === action.payload.id) {
          state.currentSubmission = action.payload
        }
      })
      .addCase(requestAnalysis.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearCurrentSubmission, clearError } = submissionsSlice.actions
export default submissionsSlice.reducer