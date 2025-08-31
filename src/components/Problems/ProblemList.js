import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Typography,
  Box,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const ProblemList = ({ problems, loading }) => {
  const navigate = useNavigate()
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'success'
      case 'medium':
        return 'warning'
      case 'hard':
        return 'error'
      default:
        return 'default'
    }
  }
  
  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Easy'
      case 'medium':
        return 'Medium'
      case 'hard':
        return 'Hard'
      default:
        return difficulty
    }
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (problems.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
        No problems available.
      </Typography>
    )
  }
  
  return (
    <List sx={{ width: '100%' }}>
      {problems.map((problem) => (
        <ListItem
          key={problem.id}
          onClick={() => navigate(`/problem/${problem.id}`)}
          sx={{ 
            borderBottom: '1px solid',
            borderColor: 'divider',
            '&:hover': {
              bgcolor: 'action.hover',
              cursor: 'pointer',
            },
          }}
          secondaryAction={
            <IconButton edge="end" aria-label="go">
              <ArrowForwardIosIcon />
            </IconButton>
          }
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                  {problem.title}
                </Typography>
                <Chip
                  label={getDifficultyText(problem.difficulty)}
                  color={getDifficultyColor(problem.difficulty)}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  label={`${problem.points} pts`} 
                  variant="outlined" 
                  size="small" 
                />
              </Box>
            }
            secondary={problem.description && problem.description.substring(0, 100) + '...'}
          />
        </ListItem>
      ))}
    </List>
  )
}

export default ProblemList