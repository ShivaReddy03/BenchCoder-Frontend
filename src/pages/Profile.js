import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material'
import { fetchSubmissions } from '../store/slices/submissionsSlice'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TimelineIcon from '@mui/icons-material/Timeline'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const { submissions, loading, error } = useSelector((state) => state.submissions)

  useEffect(() => {
    dispatch(fetchSubmissions())
  }, [dispatch])

  // Calculate user statistics
  const userStats = {
    totalSubmissions: submissions.length,
    acceptedSubmissions: submissions.filter(s => s.verdict === 'AC').length,
    problemsSolved: new Set(submissions.filter(s => s.verdict === 'AC').map(s => s.problem)).size,
  }

  // Calculate submission distribution by verdict
  const verdictDistribution = submissions.reduce((acc, submission) => {
    acc[submission.verdict] = (acc[submission.verdict] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.detail || 'Error loading submissions'}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* User Info */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Email: {user?.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Joined: {new Date(user?.date_joined).toLocaleDateString()}
            </Typography>
          </Paper>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <EmojiEventsIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4">{user?.score || 0}</Typography>
                  <Typography variant="body2">Score</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4">{userStats.problemsSolved}</Typography>
                  <Typography variant="body2">Problems Solved</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <TimelineIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h4">{userStats.totalSubmissions}</Typography>
                  <Typography variant="body2">Total Submissions</Typography>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Submission Distribution
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {Object.entries(verdictDistribution).map(([verdict, count]) => (
                <Chip
                  key={verdict}
                  label={`${verdict}: ${count}`}
                  color={
                    verdict === 'AC' ? 'success' : 
                    verdict === 'WA' ? 'error' : 
                    verdict === 'TLE' ? 'warning' : 'default'
                  }
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile