/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Grid, Typography } from '@mui/material';

// custom Components
import TableComponent from 'components/TableComponent';
import SearchField from 'components/SearchField';
import DetailsComponent from 'components/DetailsComponent';
import MainCard from 'components/MainCard';

// Redux Imports
import { fetchQuestions } from 'store/reducers/question';
import { fetchExamDetails } from 'store/reducers/exam';

import { useSelector, useDispatch } from 'react-redux';
import { filterData, secondsToHMS } from 'utils/utils';
import { generateWordDocument } from 'utils/wordCreator';

const PublicExamDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const examId = localStorage.getItem('examId');

  // Examiner
  const examDetails = useSelector((state) => state.exam.examDetails);
  const questions = useSelector((state) => state.question.questions);

  let [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    dispatch(fetchExamDetails(examId));
  }, []);

  useEffect(() => {
    dispatch(fetchQuestions(examDetails.id));
  }, [examDetails]);

  const chipColorSelector = (type) => {
    if (type === 'SHORT_ANSWER') {
      return 'success';
    } else if (type === 'CHOICE') {
      return 'warning';
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
      label: 'Type',
      chip: true,
      chipColor: chipColorSelector
    }
  ];

  const Detailsdata = [
    {
      title: 'Exam Details',
      descriptions: [
        {
          name: 'Duration',
          value: secondsToHMS(examDetails.duration)
        },

        {
          name: 'Number of Questions',
          value: questions.length
        }
      ]
    }
  ];
  const download = (event) => {
    generateWordDocument(event, questions, examDetails);
  };
  const handleRowClick = (event, id) => {
    localStorage.setItem('questionId', id);
    navigate('/public-exams/public-exam-details/question-details');
  };

  const handleSearchOnChange = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <Grid container spacing={2}>
      {/* Header Details */}
      <Grid item xs={12}>
        <MainCard>
          <Grid container spacing={2}>
            {/* Exam title */}
            <Grid
              item
              xs={12}
              md={8}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {examDetails.title}
              </Typography>
            </Grid>

            {/* Created At */}
            <Grid
              item
              xs={12}
              md={4}
              display="flex"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Created At: &nbsp;&nbsp;&nbsp;
              </Typography>
              <Typography> {new Date(examDetails.created_at).toLocaleString()}</Typography>
            </Grid>

            {/* Exam description*/}
            <Grid item xs={10}>
              <Typography>{examDetails.description}</Typography>
            </Grid>
          </Grid>
        </MainCard>
      </Grid>

      {/* Questions List */}
      <Grid item xs={12} md={8} display="block" justifyContent="center">
        {questions.length > 0 ? (
          <TableComponent
            headCells={headCells}
            rows={filterData(questions, searchValue, ['question'])}
            title="Questions"
            handleRowClick={handleRowClick}
            download={download}
          />
        ) : (
          <Typography variant="h5" textAlign="center">
            Added Questions will be displayed here!
          </Typography>
        )}
      </Grid>

      {/* Search and Details Card */}
      <Grid item xs={12} md={4} container spacing={2} direction="column">
        <Grid item sx={{ display: { xs: 'none', md: 'block' } }}>
          <SearchField handleSearchOnChange={handleSearchOnChange} />
        </Grid>
        <Grid item>
          <DetailsComponent data={Detailsdata} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default PublicExamDetails;
