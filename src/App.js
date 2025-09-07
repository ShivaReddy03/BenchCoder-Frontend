import React, { useEffect, useState } from 'react'   // <-- you also forgot useState
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
import SubmissionDetail from './pages/SubmissionDetail'
import Profile from './pages/Profile'
import Navbar from './components/Layout/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import Leaderboard from './pages/Leaderboard'
import { NotificationProvider } from './contexts/NotificationContext'

function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : true
  })

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#90caf9' },
      secondary: { main: '#f48fb1' },
    },
  })

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token && !user) {
      dispatch(fetchProfile())
    }
  }, [dispatch, user])

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <NotificationProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          {isAuthenticated && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/problem/:id" element={<ProtectedRoute><ProblemDetail /></ProtectedRoute>} />
            <Route path="/submission/:id" element={<ProtectedRoute><SubmissionDetail /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </NotificationProvider>
  )
}

export default App
