import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="body1" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingSpinner