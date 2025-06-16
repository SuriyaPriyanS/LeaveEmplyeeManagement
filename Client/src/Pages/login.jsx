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
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { userService } from '../Services/ApiServers.jsx'; // Adjust the path as needed
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().required('Required'),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const data = await userService.login(values);
        navigate('/dashboard');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        onLogin(data.user);
        navigate('/dashboard'); // Redirect to dashboard on successful login
        setSnackbarMessage('Login successful! Redirecting to dashboard...');
        setOpenSnackbar(true);
        setTimeout(() => navigate('/dashboard'), 2000); // Redirect after 2 seconds
      } catch (err) {
        // setErrors({ password: 'Invalid credentials' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleForgotPassword = () => {
    // Placeholder for forgot password functionality
    alert('Forgot Password functionality is not implemented yet.');
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
          {/* Logo Placeholder */}
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            {/* <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1C2526' }}>
              CromaPages
            </Typography> */}
          </Box>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ color: '#6D213C', fontWeight: 'bold', textAlign: 'center' }}
          >
            Login
          </Typography>
          <Typography variant="body2" sx={{ color: 'gray', mb: 3, textAlign: 'center' }}>
            Sign in to your account
          </Typography>

          <form onSubmit={formik.handleSubmit}>
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
            <Typography variant="body2" sx={{ color: 'gray', mt: 1, textAlign: 'right' }}>
              <a
                href="#"
                style={{ color: 'gray', textDecoration: 'none' }}
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
              >
                Forgot password?
              </a>
            </Typography>
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
                Log In
              </Button>
            </Box>
          </form>

          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            New on our platform?{' '}
            <a
              href="/register"
              style={{ color: '#1976D2', textDecoration: 'underline' }}
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Create an account
            </a>
          </Typography>
        </Paper>

        {/* Toast Notification */}
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

export default Login;