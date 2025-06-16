import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userService } from '../Services/ApiServers.jsx';
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';

const API_URL = 'http://localhost:5000/api/users';

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const formik = useFormik({
    initialValues: { 
      name: '', 
      email: '', 
      password: '',
      role: '' 
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Required'),
      role: Yup.string().required('Role is required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        await userService.register(values);
        setSnackbarMessage('Registration successful! Please log in.');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/login'), 2000);
      } catch (err) {
        setErrors({ email: 'Email already exists' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={() => navigate('/login')} />
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: '#F5F7FA',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 12,
          mb: 4,
        }}
      >
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: 3, width: '100%', maxWidth: 400 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: '#6D213C', fontWeight: 'bold', textAlign: 'center' }}
          >
            Register
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', mb: 3, textAlign: 'center' }}>
            Create your account
          </Typography>

          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#6D213C' },
                  '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#6D213C' },
                  '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#6D213C' },
                  '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <FormControl 
              fullWidth 
              margin="normal"
              error={formik.touched.role && Boolean(formik.errors.role)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': { borderColor: '#6D213C' },
                  '&.Mui-focused fieldset': { borderColor: '#6D213C' },
                },
              }}
            >
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                label="Role"
              >
                <MenuItem value="employee">Employee</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            <Box mt={2}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: '#6D213C',
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: '#5A1A31' },
                }}
                fullWidth
                disabled={formik.isSubmitting}
              >
                Register
              </Button>
            </Box>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{ color: '#1976D2', textDecoration: 'underline' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Login
            </a>
          </Typography>
        </Paper>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={2000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </Box>
  );
};

export default Register;