import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
  Box,
  Button,
} from '@mui/material';
import { leaveService } from '../Services/LeaveServices';
import { useNavigate } from 'react-router-dom';

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    leaveService.getMyLeaves().then(data => {
      setLeaves(data);
      setLoading(false);
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom sx={{ color: '#6D213C', fontWeight: 'bold' }}>
          My Leave Requests
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
          <List>
            {leaves.length === 0 ? (
              <ListItem>
                <ListItemText primary="No leave requests found." />
              </ListItem>
            ) : (
              leaves.map((leave) => (
                <ListItem key={leave.id} divider>
                  <ListItemText
                    primary={`${leave.type} (${leave.startDate} to ${leave.endDate})`}
                    secondary={leave.reason}
                  />
                  <Chip label={leave.status} color={getStatusColor(leave.status)} />
                </ListItem>
              ))
            )}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default MyLeaves;