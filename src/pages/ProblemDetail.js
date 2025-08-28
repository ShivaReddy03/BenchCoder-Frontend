import React from 'react'
import { useParams } from 'react-router-dom'
import { Container, Typography, Paper, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const ProblemDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Problem #{id}
        </Typography>
        
        <Typography variant="body1" paragraph>
          This is a placeholder for the problem detail page. We'll implement the code editor and problem description here on Day 3.
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Back to Problems
          </Button>
          <Button variant="outlined">
            Start Coding
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default ProblemDetail