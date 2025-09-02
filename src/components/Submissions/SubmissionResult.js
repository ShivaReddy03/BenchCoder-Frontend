import React from 'react'
import {
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MemoryIcon from '@mui/icons-material/Memory'

const SubmissionResult = ({ submission }) => {
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

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case 'AC':
        return <CheckCircleIcon />
      case 'WA':
      case 'RE':
      case 'CE':
        return <CancelIcon />
      case 'TLE':
        return <AccessTimeIcon />
      case 'MLE':
        return <MemoryIcon />
      default:
        return null
    }
  }

  if (!submission) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">No submission data</Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Submission Result
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Chip
          icon={getVerdictIcon(submission.verdict)}
          label={getVerdictText(submission.verdict)}
          color={getVerdictColor(submission.verdict)}
          sx={{ mr: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Submitted at: {new Date(submission.submitted_at).toLocaleString()}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {submission.verdict === 'P' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Your submission is being evaluated. Please wait...
        </Alert>
      )}

      {submission.verdict !== 'P' && (
        <>
          <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Execution Time
              </Typography>
              <Typography variant="h6">
                {submission.execution_time ? `${submission.execution_time} ms` : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Memory Used
              </Typography>
              <Typography variant="h6">
                {submission.memory_used ? `${submission.memory_used} MB` : 'N/A'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Language
              </Typography>
              <Typography variant="h6" textTransform="capitalize">
                {submission.language}
              </Typography>
            </Box>
          </Box>

          {submission.ai_feedback && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" gutterBottom>
                AI Feedback
              </Typography>
              <Alert severity="info">
                {submission.ai_feedback}
              </Alert>
            </>
          )}
        </>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Submitted Code
      </Typography>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 2, 
          bgcolor: 'grey.100', 
          overflow: 'auto',
          maxHeight: '300px',
          fontFamily: 'monospace',
          whiteSpace: 'pre-wrap'
        }}
      >
        {submission.code}
      </Paper>
    </Paper>
  )
}

export default SubmissionResult