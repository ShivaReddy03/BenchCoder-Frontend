import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { fetchSubmission } from '../store/slices/submissionsSlice'
import SubmissionResult from '../components/Submissions/SubmissionResult'
import useSubmissionPolling from '../hooks/useSubmissionPolling'

const SubmissionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentSubmission, loading, error } = useSelector((state) => state.submissions)
  const [shouldPoll, setShouldPoll] = useState(true)

  useEffect(() => {
    dispatch(fetchSubmission(id))
  }, [dispatch, id])

  // Determine if we should continue polling
  useEffect(() => {
    if (currentSubmission && currentSubmission.verdict !== 'P' && currentSubmission.verdict !== 'Judging') {
      setShouldPoll(false)
    } else {
      setShouldPoll(true)
    }
  }, [currentSubmission])

  // Start polling if submission is pending/judging
  useSubmissionPolling(id, shouldPoll)

  if (loading && !currentSubmission) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error.detail || 'Error loading submission'}</Alert>
      </Container>
    )
  }

  if (!currentSubmission) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">Submission not found</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          Back
        </Button>
        <Typography variant="h4" component="h1">
          Submission #{currentSubmission.id}
        </Typography>
        <Box />
      </Box>

      <SubmissionResult submission={currentSubmission} />
      
      {shouldPoll && (
        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            Checking submission status...
          </Typography>
        </Box>
      )}
    </Container>
  )
}

export default SubmissionDetail