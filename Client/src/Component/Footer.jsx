import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import { Facebook, Twitter, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1C2526',
        color: '#FFFFFF',
        py: 3,
        textAlign: 'center',
        mt: 'auto', // Pushes the footer to the bottom
      }}
    >
      <Typography variant="body2" sx={{ mb: 1 }}>
        © {new Date().getFullYear()} LEMS. All rights reserved.
      </Typography>
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2" component="span" sx={{ mr: 2 }}>
          Email: suriyapriyan506@gmail.com
        </Typography>
        <Typography variant="body2" component="span">
          Phone: (+91) 7871336138
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
        <IconButton
          component={Link}
          href="https://facebook.com"
          target="_blank"
          sx={{ color: '#FFFFFF' }}
        >
          <Facebook />
        </IconButton>
        <IconButton
          component={Link}
          href="https://twitter.com"
          target="_blank"
          sx={{ color: '#FFFFFF' }}
        >
          <Twitter />
        </IconButton>
        <IconButton
          component={Link}
          href="https://linkedin.com"
          target="_blank"
          sx={{ color: '#FFFFFF' }}
        >
          <LinkedIn />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Footer;