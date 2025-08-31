import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Tabs,
  Tab,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { fetchProblem } from '../store/slices/problemsSlice'
import CodeEditor from '../components/CodeEditor/CodeEditor'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`problem-tabpanel-${index}`}
      aria-labelledby={`problem-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const ProblemDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { currentProblem, loading, error } = useSelector((state) => state.problems)
  const [tabValue, setTabValue] = React.useState(0)

  useEffect(() => {
    dispatch(fetchProblem(id))
  }, [dispatch, id])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error.detail || 'Error loading problem'}</Alert>
      </Container>
    )
  }

  if (!currentProblem) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">Problem not found</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/')}
          sx={{ mr: 2 }}
        >
          Back to Problems
        </Button>
        <Box>
          <Chip
            label={currentProblem.difficulty}
            color={
              currentProblem.difficulty === 'easy'
                ? 'success'
                : currentProblem.difficulty === 'medium'
                ? 'warning'
                : 'error'
            }
            sx={{ mr: 1 }}
          />
          <Chip label={`${currentProblem.points} pts`} variant="outlined" />
        </Box>
      </Box>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Problem" />
            <Tab label="Submit Solution" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentProblem.title}
          </Typography>
          
          <Typography variant="body1" paragraph>
            {currentProblem.description}
          </Typography>

          {currentProblem.time_limit && (
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Time Limit:</strong> {currentProblem.time_limit}ms
            </Typography>
          )}

          {currentProblem.memory_limit && (
            <Typography variant="body2" color="text.secondary" paragraph>
              <strong>Memory Limit:</strong> {currentProblem.memory_limit}MB
            </Typography>
          )}

          <Button 
            variant="contained" 
            onClick={() => setTabValue(1)}
            sx={{ mt: 2 }}
          >
            Solve Problem
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h5" gutterBottom>
            Code Editor
          </Typography>
          <CodeEditor problemId={id} />
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default ProblemDetail