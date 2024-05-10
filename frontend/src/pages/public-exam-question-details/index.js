/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

// redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuestionDetails } from 'store/reducers/question';

// Material Ui
import { Typography, Grid, Stack, IconButton } from '@mui/material';
import MainPaper from 'components/MainPaper';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// custom components
import DetailsComponent from 'components/DetailsComponent';

const PublicExamQuestionDetails = () => {
  const dispatch = useDispatch();
  const questionId = localStorage.getItem('questionId');

  const questionDetails = useSelector((state) => state.question.questionDetails);
  const [showAnswer, setShowAnswer] = React.useState(false);

  const Detailsdata = [
    {
      title: 'Question Details',
      descriptions: [
        {
          name: 'Point',
          value: questionDetails.point
        },

        {
          name: 'Type',
          value: questionDetails.type
        },
        {
          name: 'Exam',
          value: questionDetails.exam
        }
      ]
    }
  ];

  useEffect(() => {
    dispatch(fetchQuestionDetails(questionId));
  }, []);

  const handleClickShowAnswer = () => setShowAnswer((show) => !show);

  return (
    <Grid container spacing={2}>
      {/* Question and Answer */}
      <Grid item container xs={12} md={8} spacing={2}>
        {/* Question */}
        <Grid item xs={12}>
          <Typography variant="subtitle3">Question</Typography>
          <MainPaper sx={{ p: 3, mt: 1 }}>
            <Typography variant="h5">{questionDetails.question}</Typography>
            {questionDetails.choices && (
              <Stack direction="column" sx={{ ml: 4 }}>
                {JSON.parse(questionDetails.choices).map((choice) => {
                  return (
                    <Stack sx={{ mt: 2 }} direction="row" spacing={2}>
                      <Typography variant="h5">{choice?.identifier}</Typography>
                      <Typography variant="subtitle">{choice?.choice}</Typography>
                    </Stack>
                  );
                })}
              </Stack>
            )}
          </MainPaper>
        </Grid>

        {/* Correct Answer */}
        <Grid item xs={12}>
          <Typography variant="subtitle3">Correct Answer</Typography>
          <MainPaper sx={{ p: 3, mt: 1 }}>
            <Stack
              direction="row"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              {showAnswer ? (
                <Typography variant="h5">{questionDetails.answer}</Typography>
              ) : (
                <Typography variant="h5">**************</Typography>
              )}
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowAnswer}
                edge="end"
              >
                {showAnswer ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </Stack>
          </MainPaper>
        </Grid>
        <Grid item xs={12}></Grid>
        <Grid item xs={12}></Grid>
      </Grid>

      {/* Detail component */}
      <Grid item xs={12} md={4}>
        <DetailsComponent data={Detailsdata} />
      </Grid>
    </Grid>
  );
};

export default PublicExamQuestionDetails;
