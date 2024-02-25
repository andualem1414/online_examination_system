import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

// redux Imports
import { fetchExamineeAnswerDetails } from 'store/reducers/examineeAnswer';

const QuestionDetails = () => {
  const dispatch = useDispatch();

  useEffect(() => {}, []);
  return <div>QuestionDetails</div>;
};

export default QuestionDetails;
