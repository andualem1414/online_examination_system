import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ExamForm from './modals/ExamForm';
import * as dayjs from 'dayjs';

const MainButton = ({ name, icon }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const initialValues = {
    title: '',
    description: '',
    start_time: dayjs(),
    end_time: ''
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
      {/* Create Exam Modal */}
      <ExamForm
        open={open}
        handleClose={handleClose}
        initialValues={initialValues}
        modalType="Create"
      />
      <Button
        sx={{ borderRadius: '24px', py: 1 }}
        onClick={handleOpen}
        variant="contained"
        startIcon={icon}
      >
        <Typography variant="h5">{name}</Typography>
      </Button>
    </Box>
  );
};

export default MainButton;
