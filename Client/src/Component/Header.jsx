import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#FFFFFF',
        color: '#6D213C',
        boxShadow: 3,
        borderBottom: '1px solid #E0E0E0',
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 'bold', color: '#6D213C', cursor: 'pointer' }}
          onClick={() => navigate('/my-leaves')}
        >
          LEMS
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            sx={{ textTransform: 'none', fontWeight: 'medium' }}
          >
            Menu
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/home'); handleMenuClose(); }}>Home</MenuItem>
            <MenuItem onClick={() => { navigate('/apply-leave'); handleMenuClose(); }}>Apply Leave</MenuItem>
            <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: '#6D213C', 
              width: 32, 
              height: 32,
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          />
          <Typography 
            variant="body2" 
            sx={{ 
              ml: 1, 
              color: '#6D213C',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/dashboard')}
          >
            User DashBoard
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;