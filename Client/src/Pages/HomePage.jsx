import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { motion } from 'framer-motion'; // For animations
import Header from '../Component/Header.jsx';
import Footer from '../Component/Footer.jsx';

// Hero image URL (you can replace this with a local image or a different URL)
const heroImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80'; // A workplace image

const Home = () => {
  const navigate = useNavigate();

  // Animation variants for feature cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={() => navigate('/login')} />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4, flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            position: 'relative',
            textAlign: 'center',
            color: '#FFFFFF',
            py: 8,
            borderRadius: 4,
            overflow: 'hidden',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            boxShadow: 3,
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 'bold', mb: 2 }}>
            Welcome to Leave Management System
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Manage your leave requests efficiently and effectively
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                backgroundColor: '#6D213C',
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#5A1A31' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/register')}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#E0E0E0', color: '#E0E0E0' },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
              }}
            >
              Register
            </Button>
          </Box>
        </Box>

        {/* Features Section */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="h4" sx={{ color: '#6D213C', fontWeight: 'bold', mb: 4 }}>
            Features
          </Typography>
          <Grid container spacing={4}>
            {[
              { title: 'Apply for Leave', description: 'Submit leave requests with ease' },
              { title: 'Track Leave Status', description: 'Monitor your leave applications' },
              { title: 'Leave History', description: 'View your complete leave history' },
            ].map((feature, index) => (
              <Grid item xs={12} sm={4} key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.2 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      boxShadow: 3,
                      transition: 'transform 0.3s',
                      '&:hover': { transform: 'scale(1.05)' },
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ color: '#6D213C', fontWeight: 'bold' }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
      
    </Box>
  );
};

export default Home;