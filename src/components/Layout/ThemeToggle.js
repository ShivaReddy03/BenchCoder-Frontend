import React from 'react'
import { useTheme } from '@mui/material/styles'
import { IconButton, Tooltip } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useNotification } from '../../contexts/NotificationContext'

const ThemeToggle = ({ darkMode, toggleDarkMode }) => {
  const theme = useTheme()
  const showNotification = useNotification()

  const handleToggle = () => {
    toggleDarkMode()
    showNotification(
      `Switched to ${darkMode ? 'light' : 'dark'} mode`,
      'info'
    )
  }

  return (
    <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
      <IconButton onClick={handleToggle} color="inherit">
        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle