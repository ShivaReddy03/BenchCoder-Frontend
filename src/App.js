import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { fetchProfile } from './store/slices/authSlice'
import ProtectedRoute from './components/Common/ProtectedRoute'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import Dashboard from './pages/Dashboard'
import ProblemDetail from './pages/ProblemDetail'
import Navbar from './components/Layout/Navbar'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
  },
})

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth) // Get user from state
  
  useEffect(() => {
    // Try to fetch user profile if token exists but we don't have user data
    const token = localStorage.getItem('accessToken')
    if (token && !user) {
      dispatch(fetchProfile())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]) // Remove user from dependency array
  // We only want this to run once on component mount
  
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/problem/:id"
            element={
              <ProtectedRoute>
                <ProblemDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App