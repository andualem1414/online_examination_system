import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Grid, Typography } from '@mui/material';

// custom Components
import HeaderDetailsComponent from 'components/HeaderDetailsComponent';
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';

// Redux Imports
import { fetchQuestions } from 'store/reducers/question';
import { fetchExamDetails } from 'store/reducers/exam';

import { useSelector, useDispatch } from 'react-redux';

const ExamDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examId = localStorage.getItem('examId');

  const examDetails = useSelector((state) => state.exam.examDetails);
  const loading = useSelector((state) => state.question.loading);
  const questions = useSelector((state) => state.question.questions);

  const startTime = new Date(examDetails.start_time);
  const endTime = new Date(examDetails.end_time);
  const [currentTime] = useState(new Date());

  const [buttonName, setButtonName] = useState({ name: 'Add Question', disabled: false });

  useEffect(() => {
    dispatch(fetchExamDetails(examId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (startTime.getTime() < currentTime.getTime()) {
      setButtonName({ name: 'Results', disabled: true });

      // If exam is Conducted
      if (endTime.getTime() < currentTime.getTime()) {
        setButtonName({ name: 'Results', disabled: false });
      }
    } else {
      setButtonName({ name: 'Add Question', disabled: false });
    }
    console.log(buttonName, endTime.toTimeString());

    dispatch(fetchQuestions(examDetails.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, examDetails]);

  const chipColorSelector = (type) => {
    if (type === 'SHORT_ANSWER') {
      return 'success';
    } else {
      return 'primary';
    }
  };

  const headCells = [
    {
      id: 'question',
      numeric: false,
      label: 'Question'
    },
    {
      id: 'type',
      numeric: false,
      label: 'Status',
      chip: true,
      chipColor: chipColorSelector
    },
    {
      id: 'point',
      numeric: true,
      label: 'Point'
    }
  ];

  // Change to either Questions or Results
  const handelButtonClick = (buttonName) => {
    if (['Choice', 'True/False', 'Short Answer'].includes(buttonName)) {
      navigate('/my-exams/exam-details/add-question', { state: { questionType: buttonName } });
    } else if (buttonName === 'Question') {
      setButtonName({ name: 'Result', disabled: false });
    } else {
      setButtonName({ name: 'Question', disabled: false });
    }
  };

  // Handle Search form
  const handleSearchOnChange = (e) => {
    console.log(e);
  };

  // For every Questions
  const handleRowClick = (event, id) => {
    // dispatch(fetchExamDetails(id));
    // return navigate('/my-exams/exam-details');
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <HeaderDetailsComponent examDetails={examDetails} buttonName={buttonName} handleButtonClick={handelButtonClick} />
        </Grid>

        <Grid item xs={12} md={8} display="block" justifyContent="center">
          {loading ? (
            <div>Loading...</div>
          ) : questions.length > 0 ? (
            <TableComponent headCells={headCells} rows={questions} title="Questions" handleRowClick={handleRowClick} />
          ) : (
            <Typography variant="h5" textAlign="center">
              Added Questions will be displayed here!
            </Typography>
          )}
        </Grid>

        <Grid item xs={12} md={4} container spacing={2} direction="column">
          <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
            <SearchField handleOnChange={handleSearchOnChange} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default ExamDetails;
