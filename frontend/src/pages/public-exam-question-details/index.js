import React, { useEffect } from 'react';

// redux Imports
import { useDispatch, useSelector } from 'react-redux';
// Material Ui
import { Typography, Grid, Divider, Stack, Chip, IconButton } from '@mui/material';
import MainPaper from 'components/MainPaper';
import { fetchQuestionDetails } from 'store/reducers/question';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const PublicExamQuestionDetails = () => {
  const dispatch = useDispatch();
  const questionId = localStorage.getItem('questionId');

  const questionDetails = useSelector((state) => state.question.questionDetails);
  const [showAnswer, setShowAnswer] = React.useState(false);

  useEffect(() => {
    dispatch(fetchQuestionDetails(questionId));
  }, []);
  const handleClickShowAnswer = () => setShowAnswer((show) => !show);

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} md={8} spacing={2}>
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
      </Grid>
      <Grid item xs={12} md={4}>
        <MainPaper sx={{ p: 3, mt: 3.7 }}>
          <Typography variant="h4">Question Details</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container sx={{ ml: 2 }}>
            <Grid item container direction="column" xs={6} spacing={3}>
              <Grid item>
                <Typography variant="h5">Points </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">Type </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5">Exam </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="column" xs={6} spacing={2}>
              <Grid item>
                <Chip label={questionDetails.point} variant="light" color="primary" />
              </Grid>

              <Grid item>
                <Chip label={questionDetails.type} variant="light" color="primary" />
              </Grid>
              <Grid item>
                <Chip label={questionDetails.exam} variant="light" color="primary" />
              </Grid>
            </Grid>
          </Grid>
        </MainPaper>
      </Grid>
    </Grid>
  );
};

export default PublicExamQuestionDetails;
