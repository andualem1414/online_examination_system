import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Box sx={{ display: 'grid', justifyContent: 'center' }}>
      <Typography variant="h1" sx={{ my: 4 }}>
        Unauthorized
      </Typography>
      <Button variant="contained" onClick={goBack()}>
        Back
      </Button>
    </Box>
  );
};

export default Unauthorized;
