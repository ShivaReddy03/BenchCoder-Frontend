import React from 'react'
import { useSelector } from 'react-redux'
import { Paper, Typography, Box, Grid, LinearProgress } from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import AssignmentIcon from '@mui/icons-material/Assignment'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

const UserStats = () => {
  const { user } = useSelector((state) => state.auth)
  
  // Calculate solved problems by difficulty (mock data for now)
  const solvedProblems = {
    easy: 5,
    medium: 3,
    hard: 1,
    total: 9
  }
  
  const progressValue = (solvedProblems.total / 20) * 100 // Assuming 20 total problems
  
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Your Statistics
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">
            Score: <strong>{user?.score || 0}</strong>
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AssignmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="body1">
            Problems Solved: <strong>{solvedProblems.total}</strong>
          </Typography>
        </Box>
      </Box>
      
      <Typography variant="body2" gutterBottom>
        Progress
      </Typography>
      <LinearProgress 
        variant="determinate" 
        value={progressValue} 
        sx={{ mb: 2, height: 8, borderRadius: 4 }}
      />
      
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#4caf50', color: 'white' }}>
            <Typography variant="body2">Easy</Typography>
            <Typography variant="h6">{solvedProblems.easy}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#ff9800', color: 'white' }}>
            <Typography variant="body2">Medium</Typography>
            <Typography variant="h6">{solvedProblems.medium}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper sx={{ p: 1, textAlign: 'center', bgcolor: '#f44336', color: 'white' }}>
            <Typography variant="body2">Hard</Typography>
            <Typography variant="h6">{solvedProblems.hard}</Typography>
          </Paper>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <TrendingUpIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="body2">
          Keep going! You're making progress.
        </Typography>
      </Box>
    </Paper>
  )
}

export default UserStats