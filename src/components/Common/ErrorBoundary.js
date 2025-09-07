import React from 'react'
import { Box, Typography, Button } from '@mui/material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Something went wrong.
          </Typography>
          <Typography variant="body1" gutterBottom>
            {this.state.error.toString()}
          </Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary