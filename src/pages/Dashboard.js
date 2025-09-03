import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Alert,
  Box,
} from '@mui/material'
import { fetchProblems } from '../store/slices/problemsSlice'
import { fetchSubmissions } from '../store/slices/submissionsSlice'
import ProblemList from '../components/Problems/ProblemList'
import UserStats from '../components/User/UserStats'
import SubmissionsList from '../components/Submissions/SubmissionsList'
import LoadingSpinner from '../components/Common/LoadingSpinner'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { problems, loading: problemsLoading, error: problemsError } = useSelector((state) => state.problems)
  const { submissions, loading: submissionsLoading, error: submissionsError } = useSelector((state) => state.submissions)
  const { user } = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(fetchProblems())
    dispatch(fetchSubmissions())
  }, [dispatch])
  
  // Get recent submissions (last 5)
  const recentSubmissions = submissions.slice(0, 5)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.username}!
      </Typography>
      
      {problemsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {problemsError.detail || 'Error loading problems'}
        </Alert>
      )}
      
      {submissionsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submissionsError.detail || 'Error loading submissions'}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12} md={4}>
          <UserStats />
        </Grid>
        
        {/* Problem List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Problems
            </Typography>
            <ProblemList problems={problems} loading={problemsLoading} />
          </Paper>

          {/* Recent Submissions */}
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5">
                Recent Submissions
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {submissions.length} total submissions
              </Typography>
            </Box>
            <SubmissionsList submissions={recentSubmissions} loading={submissionsLoading} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard