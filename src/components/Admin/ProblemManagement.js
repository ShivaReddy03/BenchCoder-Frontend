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
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { fetchProblems, createProblem, updateProblem, deleteProblem } from '../../store/slices/problemsSlice'

const ProblemManagement = () => {
  const dispatch = useDispatch()
  const { problems, loading, error } = useSelector((state) => state.problems)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingProblem, setEditingProblem] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    points: 10,
    time_limit: 1000,
    memory_limit: 256,
  })

  useEffect(() => {
    dispatch(fetchProblems())
  }, [dispatch])

  const handleOpenDialog = (problem = null) => {
    if (problem) {
      setEditingProblem(problem)
      setFormData({
        title: problem.title,
        description: problem.description,
        difficulty: problem.difficulty,
        points: problem.points,
        time_limit: problem.time_limit || 1000,
        memory_limit: problem.memory_limit || 256,
      })
    } else {
      setEditingProblem(null)
      setFormData({
        title: '',
        description: '',
        difficulty: 'easy',
        points: 10,
        time_limit: 1000,
        memory_limit: 256,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingProblem(null)
  }

  const handleSubmit = () => {
    if (editingProblem) {
      dispatch(updateProblem({ id: editingProblem.id, ...formData }))
    } else {
      dispatch(createProblem(formData))
    }
    handleCloseDialog()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      dispatch(deleteProblem(id))
    }
  }

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { 
      field: 'difficulty', 
      headerName: 'Difficulty', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={
            params.value === 'easy' ? 'success' : 
            params.value === 'medium' ? 'warning' : 'error'
          }
        />
      )
    },
    { field: 'points', headerName: 'Points', width: 100 },
    { field: 'time_limit', headerName: 'Time Limit (ms)', width: 130 },
    { field: 'memory_limit', headerName: 'Memory Limit (MB)', width: 150 },
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
        <Typography variant="h5">Problem Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Problem
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.detail || 'Error loading problems'}
        </Alert>
      )}

      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={problems}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          loading={loading}
        />
      </div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProblem ? 'Edit Problem' : 'Create Problem'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              margin="normal"
              multiline
              rows={4}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={formData.difficulty}
                label="Difficulty"
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              type="number"
              label="Points"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Time Limit (ms)"
              value={formData.time_limit}
              onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) })}
              margin="normal"
            />
            <TextField
              fullWidth
              type="number"
              label="Memory Limit (MB)"
              value={formData.memory_limit}
              onChange={(e) => setFormData({ ...formData, memory_limit: parseInt(e.target.value) })}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProblem ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ProblemManagement