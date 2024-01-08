import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const MainButton = ({ name, icon }) => {
  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
      <Button sx={{ borderRadius: '24px', py: 1 }} variant="contained" startIcon={icon}>
        <Typography sx={{ fontSize: 16 }}>{name}</Typography>
      </Button>
    </Box>
  );
};

export default MainButton;
