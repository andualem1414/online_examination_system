import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ExamForm from '../../../../../components/modals/ExamForm';
import JoinExam from '../../../../../components/modals/JoinExam';
import * as dayjs from 'dayjs';

const MainButton = ({ name, icon }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const initialValues = {
    title: '',
    description: '',
    start_time: dayjs(),
    end_time: dayjs(),
    max_examinees: 0
  };

  return (
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
      {/* Create Exam Modal */}
      {name === 'Join Exam' ? (
        <JoinExam open={open} handleClose={handleClose} />
      ) : (
        <ExamForm
          open={open}
          handleClose={handleClose}
          initialValues={initialValues}
          modalType={name === 'Create Exam' ? 'Create' : 'Join'}
        />
      )}

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
