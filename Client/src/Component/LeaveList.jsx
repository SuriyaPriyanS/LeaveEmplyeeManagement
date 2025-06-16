import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { leaveService } from '../Services/LeaveServices';
import { useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import Header from './Header.jsx';


const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' });

const getStatusColor = (status) => {
  switch (status) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const LeaveList = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = () => {
    leaveService
      .getLeaveHistory()
      .then((data) => {
        setLeaves(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching leave history:', err);
        setLoading(false);
        setSnackbar({ open: true, message: 'Error fetching leave history', severity: 'error' });
      });
  };

  const handleEditClick = (leave) => {
    if (!leave) {
      setSnackbar({ open: true, message: 'Leave request not found', severity: 'error' });
      return;
    }
    setSelectedLeave(leave);
    setNewStatus(leave.status);
    setOpenEditDialog(true);
  };

  const handleDeleteClick = (id) => {
    if (!id) {
      setSnackbar({ open: true, message: 'Leave request not found', severity: 'error' });
      return;
    }
    if (window.confirm('Are you sure you want to delete this leave request?')) {
      leaveService
        .deleteLeave(id)
        .then(() => {
          fetchLeaves();
          setSnackbar({ open: true, message: 'Leave request deleted successfully', severity: 'success' });
        })
        .catch((err) => {
          console.error('Error deleting leave:', err);
          setSnackbar({ open: true, message: 'Error deleting leave request', severity: 'error' });
        });
    }
  };

  const handleEditSave = () => {
    if (!selectedLeave || !newStatus) {
      setSnackbar({ open: true, message: 'Leave request not found or status not selected', severity: 'error' });
      return;
    }
    leaveService
      .updateLeaveStatus(selectedLeave.id, newStatus)
      .then(() => {
        fetchLeaves();
        setOpenEditDialog(false);
        setSelectedLeave(null);
        setNewStatus('');
        setSnackbar({ open: true, message: 'Leave status updated successfully', severity: 'success' });
      })
      .catch((err) => {
        console.error('Error updating leave status:', err);
        setSnackbar({ open: true, message: 'Error updating leave status', severity: 'error' });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={() => navigate('/login')} />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, backgroundColor: '#F5F7FA', flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" gutterBottom sx={{ color: '#6D213C', fontWeight: 'bold' }}>
            My Leave History
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/apply-leave')}
            sx={{ backgroundColor: '#6D213C', color: '#FFFFFF', '&:hover': { backgroundColor: '#5A1A31' } }}
          >
            Apply New Leave
          </Button>
        </Box>
        <Paper sx={{ p: 2, borderRadius: 4, boxShadow: 3 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave ID</TableCell>
                    <TableCell>Start Date</TableCell>
                    <TableCell>End Date</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Applied Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No leave requests found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaves.map((leave) => (
                      <TableRow key={leave.id}>
                        <TableCell>{leave.id}</TableCell>
                        <TableCell>{formatDate(leave.start_date)}</TableCell>
                        <TableCell>{formatDate(leave.end_date)}</TableCell>
                        <TableCell>{leave.reason}</TableCell>
                        <TableCell>
                          <Chip
                            label={leave.status}
                            color={getStatusColor(leave.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{formatDate(leave.created_at)}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() => handleEditClick(leave)}
                            color="primary"
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDeleteClick(leave.id)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Edit Dialog */}
        <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
          <DialogTitle>Edit Leave Request</DialogTitle>
          <DialogContent>
            {selectedLeave && (
              <>
                <TextField
                  fullWidth
                  label="Leave Type"
                  value={selectedLeave.type || ''}
                  margin="normal"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#6D213C' },
                      '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Start Date"
                  value={formatDate(selectedLeave.start_date)}
                  margin="normal"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#6D213C' },
                      '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="End Date"
                  value={formatDate(selectedLeave.end_date)}
                  margin="normal"
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#6D213C' },
                      '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                    },
                  }}
                />
                <TextField
                  fullWidth
                  label="Reason"
                  value={selectedLeave.reason || ''}
                  margin="normal"
                  multiline
                  rows={4}
                  disabled
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': { borderColor: '#6D213C' },
                      '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                    },
                  }}
                />
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newStatus}
                    label="Status"
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
            <Button
              onClick={handleEditSave}
              variant="contained"
              sx={{ backgroundColor: '#6D213C', color: '#FFFFFF', '&:hover': { backgroundColor: '#5A1A31' } }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>

    </Box>
  );
};

export default LeaveList;