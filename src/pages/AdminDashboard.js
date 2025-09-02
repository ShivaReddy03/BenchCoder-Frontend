import React, { useState } from 'react'
import { Container, Typography, Box, Tabs, Tab, Paper } from '@mui/material'
import ProblemManagement from '../components/Admin/ProblemManagement'
import TestCaseManagement from '../components/Admin/TestCaseManagement'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`admin-tabpanel-${index}`}
      aria-labelledby={`admin-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Problem Management" />
            <Tab label="Test Case Management" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <ProblemManagement />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TestCaseManagement />
        </TabPanel>
      </Paper>
    </Container>
  )
}

export default AdminDashboard