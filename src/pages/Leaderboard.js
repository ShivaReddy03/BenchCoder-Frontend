import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { fetchUsers } from '../store/slices/usersSlice'

const Leaderboard = () => {
  const dispatch = useDispatch()
  const { users, loading, error } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  // Sort users by score (descending)
  const sortedUsers = [...users].sort((a, b) => b.score - a.score)

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Leaderboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.detail || 'Error loading leaderboard'}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Rank</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Score</TableCell>
                <TableCell>Problems Solved</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                sortedUsers.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {index === 0 && <EmojiEventsIcon sx={{ color: 'gold', mr: 1 }} />}
                        {index === 1 && <EmojiEventsIcon sx={{ color: 'silver', mr: 1 }} />}
                        {index === 2 && <EmojiEventsIcon sx={{ color: '#cd7f32', mr: 1 }} />}
                        {index + 1}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.score} color="primary" />
                    </TableCell>
                    <TableCell>
                      <Chip label={user.problems_solved} variant="outlined" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  )
}

export default Leaderboard