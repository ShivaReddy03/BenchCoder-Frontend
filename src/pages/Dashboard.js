import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Box,
  Alert
} from '@mui/material'
import { fetchProblems } from '../store/slices/problemsSlice'
import ProblemList from '../components/Problems/ProblemList'
import UserStats from '../components/User/UserStats'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { problems, loading, error } = useSelector((state) => state.problems)
  const { user } = useSelector((state) => state.auth)
  
  useEffect(() => {
    dispatch(fetchProblems())
  }, [dispatch])
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome back, {user?.username}!
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.detail || 'Error loading problems'}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* User Stats */}
        <Grid item xs={12} md={4}>
          <UserStats />
        </Grid>
        
        {/* Problem List */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Problems
            </Typography>
            <ProblemList problems={problems} loading={loading} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Dashboard