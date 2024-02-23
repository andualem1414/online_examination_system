import React from 'react';
import { Box, Typography } from '@mui/material';
import MainCard from 'components/MainCard';

const Missing = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        m: '32px'
      }}
    >
      <Typography variant="h2">404 Not Found</Typography>
    </Box>
  );
};

export default Missing;
