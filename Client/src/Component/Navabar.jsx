import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  EventNote,
  People,
  Settings,
  ExitToApp,
  Notifications,
  Badge
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNotificationClick = (event) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    onLogout();
    navigate('/login');
  };

  const navigationItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'My Leaves', icon: <EventNote />, path: '/my-leaves' },
    { text: 'Apply Leave', icon: <EventNote />, path: '/apply-leave' },
    ...(user?.role === 'admin' || user?.role === 'hr' ? [
      { text: 'All Employees', icon: <People />, path: '/employees' },
      { text: 'Leave Requests', icon: <EventNote />, path: '/leave-requests' },
    ] : []),
    { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    { text: 'Settings', icon: <Settings />, path: '/settings' },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6" color="primary">
          Leave Management
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.light,
                '&:hover': {
                  backgroundColor: theme.palette.primary.light,
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              sx={{ color: location.pathname === item.path ? theme.palette.primary.main : 'inherit' }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
        <AccountCircle sx={{ mr: 1 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
        <Settings sx={{ mr: 1 }} />
        Settings
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ExitToApp sx={{ mr: 1 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  const notificationMenu = (
    <Menu
      anchorEl={notificationAnchor}
      open={Boolean(notificationAnchor)}
      onClose={handleNotificationClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem onClick={handleNotificationClose}>
        <Typography variant="body2">Leave request approved</Typography>
      </MenuItem>
      <MenuItem onClick={handleNotificationClose}>
        <Typography variant="body2">New leave request pending</Typography>
      </MenuItem>
      <MenuItem onClick={handleNotificationClose}>
        <Typography variant="body2">Holiday announcement</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Leave Management System
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              {navigationItems.slice(0, 4).map((item) => (
                <Button
                  key={item.text}
                  color="inherit"
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={handleNotificationClick}
            >
              <Badge badgeContent={3} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.name || 'User'}
              </Typography>
              <IconButton
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user?.avatar}
                  alt={user?.name}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: 250,
              top: '64px', // Height of AppBar
              height: 'calc(100% - 64px)',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {profileMenu}
      {notificationMenu}
    </>
  );
};

export default Navbar;
