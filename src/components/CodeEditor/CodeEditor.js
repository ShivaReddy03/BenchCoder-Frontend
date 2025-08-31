import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material'
import { submitCode } from '../../store/slices/submissionsSlice'

const CodeEditor = ({ problemId }) => {
  const [code, setCode] = useState('// Write your code here\n')
  const [language, setLanguage] = useState('python')
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.submissions)

  const handleEditorChange = (value) => {
    setCode(value)
  }

  const handleSubmit = () => {
    if (!code.trim()) {
      setMessage({ type: 'error', text: 'Code cannot be empty' })
      return
    }

    setMessage(null)

      // Make sure the data format matches what your backend expects
    const submissionData = {
      problem: parseInt(problemId), // Ensure it's a number, not a string
      code: code,
      language: language
    }

    dispatch(submitCode({ problem: problemId, code, language }))
      .unwrap()
      .then((submission) => {
        setMessage({ 
          type: 'success', 
          text: 'Code submitted successfully! Submission ID: ' + submission.id 
        })
      })
      .catch((error) => {
        setMessage({
          type: 'error',
          text: error.detail || 'Submission failed: ' + JSON.stringify(error),
        })
      })
  }

  return (
    <Box>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <FormControl sx={{ minWidth: 120, mb: 2 }}>
        <InputLabel>Language</InputLabel>
        <Select
          value={language}
          label="Language"
          onChange={(e) => setLanguage(e.target.value)}
        >
          <MenuItem value="python">Python</MenuItem>
          <MenuItem value="javascript">JavaScript</MenuItem>
          <MenuItem value="java">Java</MenuItem>
          <MenuItem value="c">C</MenuItem>
          <MenuItem value="cpp">C++</MenuItem>
        </Select>
      </FormControl>

      <Paper elevation={2} sx={{ mb: 2 }}>
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </Paper>

      <Button
        variant="contained"
        sx={{ mt: 2 }}
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Submit Code'}
      </Button>
    </Box>
  )
}

export default CodeEditor