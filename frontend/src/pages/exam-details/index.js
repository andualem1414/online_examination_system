import React from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@mui/material';

const ExamDetails = () => {
  const { examId } = useSelector((state) => state.exam);
  return <Typography>ExamDetails {examId}</Typography>;
};

export default ExamDetails;
