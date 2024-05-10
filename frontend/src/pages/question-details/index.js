import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// redux Imports
import { useDispatch, useSelector } from 'react-redux';
import { fetchExamineeAnswerDetails } from 'store/reducers/examineeAnswer';
import { deleteFlag, fetchFlags } from 'store/reducers/flag';
import FlagIcon from '@mui/icons-material/Flag';
// Material Ui
import { Typography, Grid, Divider, Stack, Chip, Modal, Button } from '@mui/material';
import MainPaper from 'components/MainPaper';

const QuestionDetails = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userDetails);
  const examineeExam = useSelector((state) => state.examineeExam.examineeExamDetails);
  const { enqueueSnackbar } = useSnackbar();
  const examineeAnswerId = localStorage.getItem('examineeAnswerId');
  const [showImage, setShowImage] = useState(false);
  const [showImageSrc, setShowImageSrc] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentFlagId, setCurrentFlagId] = useState(0);

  const examineeAnswerDetails = useSelector((state) => state.examineeAnswer.examineeAnswerDetails);
  const flags = useSelector((state) => state.flag.flags);

  useEffect(() => {
    dispatch(fetchExamineeAnswerDetails(examineeAnswerId));
  }, []);

  useEffect(() => {
    dispatch(fetchFlags(examineeAnswerDetails.id));
  }, [examineeAnswerDetails]);

  const handleDeleteFlag = (flagId) => {
    const examineeExamId = examineeExam.id;
    dispatch(deleteFlag({ id: flagId, examineeExamId: examineeExamId })).then((data) => {
      if (data.type === 'flag/deleteFlag/fulfilled') {
        enqueueSnackbar('Flag Deleted', { variant: 'success' });
      } else {
        enqueueSnackbar('Falied to Delete Flag', { variant: 'error' });
      }
    });
    setShowDeleteConfirmation(false);
  };

  return (
    <>
      <Modal
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MainPaper
          sx={{
            p: 4,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80vw', md: '40vw' }
          }}
        >
          <Typography sx={{ mb: 2 }} variant="h5" id="child-modal-title">
            Are you Sure You want to Delete
          </Typography>
          <Typography variant="subtitle3" id="child-modal-description">
            This action cannot be reversed!
          </Typography>
          <Stack direction="row" sx={{ mt: 1 }} justifyContent="flex-end">
            <Button onClick={() => setShowDeleteConfirmation(false)} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={() => handleDeleteFlag(currentFlagId)}
              color="error"
              variant="contained"
              sx={{ ml: 1 }}
            >
              Delete Flag
            </Button>
          </Stack>
        </MainPaper>
      </Modal>
      <Modal
        open={showImage}
        onClose={() => setShowImage(false)}
        aria-labelledby="child-modal-title"
        aria-describedby="child-modal-description"
      >
        <MainPaper
          sx={{
            p: 4,
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '80vw', md: '40vw' }
          }}
        >
          <img src={showImageSrc} alt="image" width="100%" />
        </MainPaper>
      </Modal>
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

            <Stack direction="column" spacing={3} sx={{ ml: 4, mt: 3 }}>
              {flags.length > 0 ? (
                flags.map((flag) => {
                  const label = flag.type;
                  console.log(label);
                  return (
                    <Stack direction="column">
                      <Chip
                        variant="light"
                        icon={<FlagIcon />}
                        onClick={() => {
                          setShowImageSrc(flag.image);
                          setShowImage(true);
                        }}
                        color="error"
                        label={<Typography>{label}</Typography>}
                      />
                      {user.user_type === 'EXAMINER' && (
                        <Typography
                          textAlign="center"
                          onClick={() => {
                            setCurrentFlagId(flag.id);
                            setShowDeleteConfirmation(true);
                          }}
                          sx={{
                            mt: 1,
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'underline'
                          }}
                        >
                          Delete
                        </Typography>
                      )}
                    </Stack>
                  );
                })
              ) : (
                <Typography variant="h5" sx={{ color: 'green' }} textAlign="center">
                  No Flags for this Question
                </Typography>
              )}
            </Stack>
          </MainPaper>
        </Grid>
      </Grid>
    </>
  );
};

export default QuestionDetails;
