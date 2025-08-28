import { createSlice } from '@reduxjs/toolkit'

const submissionsSlice = createSlice({
  name: 'submissions',
  initialState: {
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null,
  },
  reducers: {},
})

export default submissionsSlice.reducer