import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamineeAnswerDetails } from 'store/reducers/examineeAnswer';
import { fetchFlags } from 'store/reducers/flag';

// Material Ui
import { Typography, Grid, Divider, Stack, Chip } from '@mui/material';
import MainPaper from 'components/MainPaper';

const QuestionDetails = () => {
  const dispatch = useDispatch();
  const examineeAnswerId = localStorage.getItem('examineeAnswerId');

  const examineeAnswerDetails = useSelector((state) => state.examineeAnswer.examineeAnswerDetails);
  const flags = useSelector((state) => state.flag.flags);

  useEffect(() => {
    dispatch(fetchExamineeAnswerDetails(examineeAnswerId));
  }, []);
  useEffect(() => {
    console.log(examineeAnswerDetails.id);
    dispatch(fetchFlags(examineeAnswerDetails.id));
  }, [examineeAnswerDetails]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item container xs={12} md={8} spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle3">Question</Typography>
            <MainPaper sx={{ p: 3, mt: 1 }}>
              <Typography variant="h5">{examineeAnswerDetails?.question?.question}</Typography>
              {examineeAnswerDetails?.question?.choices && (
                <Stack direction="column" sx={{ ml: 4 }}>
                  {JSON.parse(examineeAnswerDetails?.question?.choices).map((choice) => {
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
              <Typography variant="h5">{examineeAnswerDetails?.question?.answer}</Typography>
            </MainPaper>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle3">Examinee Answer</Typography>
            <MainPaper sx={{ p: 3, mt: 1 }}>
              <Typography variant="h5">{examineeAnswerDetails?.answer}</Typography>
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
                  <Typography variant="h5">Result </Typography>
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
                  <Chip
                    label={examineeAnswerDetails?.question?.point}
                    variant="light"
                    color="primary"
                  />
                </Grid>
                <Grid item>
                  <Chip label={examineeAnswerDetails?.result} variant="light" color="primary" />
                </Grid>
                <Grid item>
                  <Chip
                    label={examineeAnswerDetails?.question?.type}
                    variant="light"
                    color="primary"
                  />
                </Grid>
                <Grid item>
                  <Chip
                    label={examineeAnswerDetails?.question?.exam}
                    variant="light"
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Typography variant="h4" sx={{ my: 2 }}>
              Question Flags
            </Typography>
            <Divider sx={{ mt: 1, mb: 2 }} />

            <Stack direction="column" sx={{ ml: 4 }}>
              {flags.map((flag) => {
                return <Chip variant="light" color="error" lable={flag} />;
              })}
            </Stack>
          </MainPaper>
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionDetails;
