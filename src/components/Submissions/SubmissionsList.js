import React from 'react'
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  Typography,
  Box,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility'

const SubmissionsList = ({ submissions, loading }) => {
  const navigate = useNavigate()

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case 'AC':
        return 'success'
      case 'WA':
        return 'error'
      case 'TLE':
        return 'warning'
      case 'MLE':
        return 'warning'
      case 'RE':
        return 'error'
      case 'CE':
        return 'error'
      case 'P':
        return 'info'
      default:
        return 'default'
    }
  }

  const getVerdictText = (verdict) => {
    switch (verdict) {
      case 'AC':
        return 'Accepted'
      case 'WA':
        return 'Wrong Answer'
      case 'TLE':
        return 'Time Limit Exceeded'
      case 'MLE':
        return 'Memory Limit Exceeded'
      case 'RE':
        return 'Runtime Error'
      case 'CE':
        return 'Compilation Error'
      case 'P':
        return 'Pending'
      default:
        return verdict
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (submissions.length === 0) {
    return (
      <Typography variant="body1" sx={{ p: 2, textAlign: 'center' }}>
        No submissions yet.
      </Typography>
    )
  }

  return (
    <Paper>
      <List sx={{ width: '100%' }}>
        {submissions.map((submission) => (
          <ListItem
            key={submission.id}
            sx={{ 
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
            secondaryAction={
              <IconButton 
                edge="end" 
                aria-label="view"
                onClick={() => navigate(`/submission/${submission.id}`)}
              >
                <VisibilityIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="h6" component="span" sx={{ flexGrow: 1 }}>
                    {submission.problem_title}
                  </Typography>
                  <Chip
                    label={getVerdictText(submission.verdict)}
                    color={getVerdictColor(submission.verdict)}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(submission.submitted_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Language: {submission.language}
                  </Typography>
                  {submission.execution_time && (
                    <Typography variant="body2" color="text.secondary">
                      Time: {submission.execution_time}ms
                    </Typography>
                  )}
                  {submission.memory_used && (
                    <Typography variant="body2" color="text.secondary">
                      Memory: {submission.memory_used}MB
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

export default SubmissionsList