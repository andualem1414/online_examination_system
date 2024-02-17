import React from 'react';
import { useLocation } from 'react-router-dom';

const AddQuestion = () => {
  const examId = localStorage.getItem('examId');
  const { questionType } = useLocation().state;

  console.log(examId, questionType);
  return <div>AddQuestion</div>;
};

export default AddQuestion;
