import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Container, Typography, Box, Button, CircularProgress, Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { fetchSubmission } from '../store/slices/submissionsSlice'
import SubmissionResult from '../components/Submissions/SubmissionResult'

const SubmissionDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentSubmission, loading, error } = useSelector((state) => state.submissions)
  const [pollingInterval, setPollingInterval] = useState(null)

  useEffect(() => {
    dispatch(fetchSubmission(id))

    // Set up polling for pending submissions
    if (!pollingInterval && (!currentSubmission || currentSubmission.verdict === 'P')) {
      const interval = setInterval(() => {
        dispatch(fetchSubmission(id))
      }, 3000) // Poll every 3 seconds
      setPollingInterval(interval)
    }

    // Clean up interval on unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
        setPollingInterval(null)
      }
    }
  }, [dispatch, id, currentSubmission, pollingInterval])

  // Stop polling when submission is no longer pending
  useEffect(() => {
    if (currentSubmission && currentSubmission.verdict !== 'P' && pollingInterval) {
      clearInterval(pollingInterval)
      setPollingInterval(null)
    }
  }, [currentSubmission, pollingInterval])

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
    </Container>
  )
}

export default SubmissionDetail