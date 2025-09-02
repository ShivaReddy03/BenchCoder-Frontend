import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { fetchProblems } from '../../store/slices/problemsSlice'
import { fetchTestCases, createTestCase, updateTestCase, deleteTestCase } from '../../store/slices/testCasesSlice'

const TestCaseManagement = () => {
  const dispatch = useDispatch()
  const { problems } = useSelector((state) => state.problems)
  const { testCases, loading, error } = useSelector((state) => state.testCases)
  const [selectedProblem, setSelectedProblem] = useState('')
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTestCase, setEditingTestCase] = useState(null)
  const [formData, setFormData] = useState({
    input: '',
    expected_output: '',
    is_public: false,
  })

  useEffect(() => {
    dispatch(fetchProblems())
    dispatch(fetchTestCases())
  }, [dispatch])

  const handleOpenDialog = (testCase = null) => {
    if (testCase) {
      setEditingTestCase(testCase)
      setFormData({
        input: testCase.input,
        expected_output: testCase.expected_output,
        is_public: testCase.is_public,
      })
      setSelectedProblem(testCase.problem)
    } else {
      setEditingTestCase(null)
      setFormData({
        input: '',
        expected_output: '',
        is_public: false,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingTestCase(null)
  }

  const handleSubmit = () => {
    if (!selectedProblem) {
      alert('Please select a problem')
      return
    }

    const submitData = {
      ...formData,
      problem: selectedProblem,
    }

    if (editingTestCase) {
      dispatch(updateTestCase({ id: editingTestCase.id, ...submitData }))
    } else {
      dispatch(createTestCase(submitData))
    }
    handleCloseDialog()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this test case?')) {
      dispatch(deleteTestCase(id))
    }
  }

  const filteredTestCases = selectedProblem
    ? testCases.filter(tc => tc.problem == selectedProblem)
    : testCases

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'problem', 
      headerName: 'Problem ID', 
      width: 100,
      valueGetter: (params) => params.row.problem
    },
    { 
      field: 'input', 
      headerName: 'Input', 
      width: 200,
      valueGetter: (params) => params.value.length > 50 
        ? params.value.substring(0, 50) + '...' 
        : params.value
    },
    { 
      field: 'expected_output', 
      headerName: 'Expected Output', 
      width: 200,
      valueGetter: (params) => params.value.length > 50 
        ? params.value.substring(0, 50) + '...' 
        : params.value
    },
    { 
      field: 'is_public', 
      headerName: 'Public', 
      width: 100,
      renderCell: (params) => (
        <Chip 
          label={params.value ? 'Yes' : 'No'} 
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Test Case Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Test Case
        </Button>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Filter by Problem</InputLabel>
        <Select
          value={selectedProblem}
          label="Filter by Problem"
          onChange={(e) => setSelectedProblem(e.target.value)}
        >
          <MenuItem value="">All Problems</MenuItem>
          {problems.map(problem => (
            <MenuItem key={problem.id} value={problem.id}>
              {problem.id} - {problem.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.detail || 'Error loading test cases'}
        </Alert>
      )}

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={filteredTestCases}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
        />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingTestCase ? 'Edit Test Case' : 'Create Test Case'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Problem</InputLabel>
              <Select
                value={selectedProblem}
                label="Problem"
                onChange={(e) => setSelectedProblem(e.target.value)}
                disabled={!!editingTestCase}
              >
                {problems.map(problem => (
                  <MenuItem key={problem.id} value={problem.id}>
                    {problem.id} - {problem.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Input"
              value={formData.input}
              onChange={(e) => setFormData({ ...formData, input: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              label="Expected Output"
              value={formData.expected_output}
              onChange={(e) => setFormData({ ...formData, expected_output: e.target.value })}
              margin="normal"
              multiline
              rows={3}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_public}
                  onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                />
              }
              label="Public Test Case"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTestCase ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default TestCaseManagement