import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { leaveService } from '../Services/LeaveServices';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ApplyLeave = () => {
  const navigate = useNavigate();
  const [leaveTypes, setLeaveTypes] = useState([]);

  // Redirect if not logged in (optional)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('You must be logged in to apply for leave');
      navigate('/login');
    }
  }, [navigate]);

  // Fetch leave types on mount
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const response = await leaveService.getLeaveTypes(); // API should return [{ value, label }]
        setLeaveTypes(response);
      } catch (error) {
        toast.error('Failed to fetch leave types');
        // fallback default types
        setLeaveTypes([
          { value: 'Annual', label: 'Annual Leave' },
          { value: 'Sick', label: 'Sick Leave' },
          { value: 'Casual', label: 'Casual Leave' }
        ]);
      }
    };
    fetchLeaveTypes();
  }, []);

  const formik = useFormik({
    initialValues: {
      type: '',
      startDate: '',
      endDate: '',
      reason: ''
    },
    validationSchema: Yup.object({
      type: Yup.string().required('Leave type is required'),
      startDate: Yup.date()
        .required('Start date is required')
        .min(new Date('2025-06-16'), 'Start date cannot be in the past'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
      reason: Yup.string().required('Reason is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await leaveService.applyLeave(values);
        toast.success('Leave application submitted successfully!');
        resetForm();
        navigate('/leave-list');
      } catch (error) {
        toast.error(error.response?.data?.error || 'Failed to submit leave application');
      }
    }
  });

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom>Apply for Leave</Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Leave Type"
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            error={formik.touched.type && Boolean(formik.errors.type)}
            helperText={formik.touched.type && formik.errors.type}
          >
            <MenuItem value="">
              <em>Select Leave Type</em>
            </MenuItem>
            {leaveTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            fullWidth
            margin="normal"
            label="Start Date"
            name="startDate"
            InputLabelProps={{ shrink: true }}
            value={formik.values.startDate}
            onChange={formik.handleChange}
            error={formik.touched.startDate && Boolean(formik.errors.startDate)}
            helperText={formik.touched.startDate && formik.errors.startDate}
            inputProps={{ min: '2025-06-17' }}
          />

          <TextField
            type="date"
            fullWidth
            margin="normal"
            label="End Date"
            name="endDate"
            InputLabelProps={{ shrink: true }}
            value={formik.values.endDate}
            onChange={formik.handleChange}
            error={formik.touched.endDate && Boolean(formik.errors.endDate)}
            helperText={formik.touched.endDate && formik.errors.endDate}
            inputProps={{ min: formik.values.startDate || '2025-06-17' }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Reason"
            name="reason"
            multiline
            rows={3}
            value={formik.values.reason}
            onChange={formik.handleChange}
            error={formik.touched.reason && Boolean(formik.errors.reason)}
            helperText={formik.touched.reason && formik.errors.reason}
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={formik.isSubmitting}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ApplyLeave;
