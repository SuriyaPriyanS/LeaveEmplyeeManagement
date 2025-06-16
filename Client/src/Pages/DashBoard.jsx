import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { leaveService } from '../Services/LeaveServices';
import { toast } from 'react-toastify';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await leaveService.getAllLeaves();
        setLeaves(data);
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to fetch leave data');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  // Chart Data
  const leaveTypeCount = leaves.reduce((acc, leave) => {
    acc[leave.type] = (acc[leave.type] || 0) + 1;
    return acc;
  }, {});

  const leaveStatusCount = leaves.reduce((acc, leave) => {
    acc[leave.status] = (acc[leave.status] || 0) + 1;
    return acc;
  }, {});

  const leaveTypeChart = {
    labels: Object.keys(leaveTypeCount),
    datasets: [
      {
        label: 'Leave Type Count',
        data: Object.values(leaveTypeCount),
        backgroundColor: ['#2196f3', '#f44336', '#ff9800'],
      },
    ],
  };

  const leaveStatusChart = {
    labels: Object.keys(leaveStatusCount),
    datasets: [
      {
        label: 'Leave Status',
        data: Object.values(leaveStatusCount),
        backgroundColor: ['#4caf50', '#ffc107', '#f44336'],
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Leave Type Distribution</Typography>
                <Bar data={leaveTypeChart} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6">Leave Status Overview</Typography>
                <Doughnut data={leaveStatusChart} />
              </Paper>
            </Grid>
          </Grid>

          <Box mt={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Leave Applications Table
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Start</TableCell>
                    <TableCell>End</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {leaves.map((leave, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{leave.name || leave.email}</TableCell>
                      <TableCell>{leave.type}</TableCell>
                      <TableCell>{leave.start_date}</TableCell>
                      <TableCell>{leave.end_date}</TableCell>
                      <TableCell>{leave.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </>
      )}
    </Container>
  );
};

export default Dashboard;