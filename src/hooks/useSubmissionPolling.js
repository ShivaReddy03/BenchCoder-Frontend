import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { fetchSubmission } from '../store/slices/submissionsSlice'
import { useNotification } from '../contexts/NotificationContext'

const useSubmissionPolling = (submissionId, shouldPoll = true) => {
  const dispatch = useDispatch()
  const showNotification = useNotification()
  const pollingRef = useRef(null)

  useEffect(() => {
    if (!submissionId || !shouldPoll) return

    const pollSubmission = async () => {
      try {
        const resultAction = await dispatch(fetchSubmission(submissionId))
        const submission = resultAction.payload
        
        // Stop polling if submission is no longer pending/judging
        if (submission && submission.verdict !== 'P' && submission.verdict !== 'Judging') {
          clearInterval(pollingRef.current)
          
          // Show notification based on verdict
          const verdictMessages = {
            'AC': 'Your submission was accepted!',
            'WA': 'Your submission has wrong answer.',
            'TLE': 'Your submission exceeded time limit.',
            'MLE': 'Your submission exceeded memory limit.',
            'RE': 'Your submission had a runtime error.',
            'CE': 'Your submission had compilation errors.',
          }
          
          showNotification(
            verdictMessages[submission.verdict] || `Submission ${submission.verdict}`,
            submission.verdict === 'AC' ? 'success' : 'error'
          )
        }
      } catch (error) {
        console.error('Polling error:', error)
      }
    }

    // Poll immediately and then every 5 seconds
    pollSubmission()
    pollingRef.current = setInterval(pollSubmission, 5000)

    // Cleanup on unmount or when submissionId/shouldPoll changes
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current)
      }
    }
  }, [submissionId, shouldPoll, dispatch, showNotification])

  return pollingRef
}

export default useSubmissionPolling