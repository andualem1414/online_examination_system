import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as dayjs from 'dayjs';

// Material Ui
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Typography,
  Drawer,
  Box,
  Stack,
  Grid,
  Divider,
  InputLabel,
  OutlinedInput,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// redux imports
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchExamineeExamDetails, updateExamineeExam } from 'store/reducers/examineeExam';
import { fetchQuestions } from 'store/reducers/question';

// Custom components
import MinimalLogo from 'components/Logo/MinimalLogo';
import MainPaper from 'components/MainPaper';
import { msToTime, shuffle } from 'utils/utils';
import { createExamineeAnswer, updateExamineeAnswer } from 'store/reducers/examineeAnswer';
import Countdown from 'react-countdown';
import { createFlag } from 'store/reducers/flag';

const drawerWidth = 70;

const TakeExam = () => {
  const remainingTime = localStorage.getItem('remainingTime');

  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  const examineeExamId = localStorage.getItem('examineeExamId');
  let [answers, setAnswers] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [questions, setQuestions] = useState([]);
  let [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  let [currentAnswer, setCurrentAnswer] = useState('');

  const dispatch = useDispatch();
  const theme = useTheme();

  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
    console.log(selectedImage);
    setImageUrl(URL.createObjectURL(file)); // Generate a preview URL
  };

  const addFlag = (id) => {
    const formData = new FormData();
    formData.append('type', 'FACE_LOST'); // Add other data if needed
    formData.append('image', selectedImage);

    dispatch(createFlag({ id: 89, data: formData })).then((data) => {
      console.log(data);
    });
  };

  useEffect(() => {
    dispatch(fetchExamineeExamDetails(examineeExamId)).then((data) => {
      dispatch(fetchQuestions(data?.payload?.exam?.id)).then((data) => {
        setQuestions(shuffle(data?.payload));
      });
    });
    console.log('hello');
  }, []);

  const handleNavigate = (type) => {
    const question = questions[currentQuestionIndex];

    const allreadyAnswered = answers[currentQuestionIndex];

    if (allreadyAnswered) {
      answers[currentQuestionIndex] = { ...answers[currentQuestionIndex], answer: currentAnswer };
      currentAnswer &&
        dispatch(
          updateExamineeAnswer({
            id: answers[currentQuestionIndex].id,
            data: { answer: currentAnswer }
          })
        );
    } else {
      if (currentAnswer) {
        dispatch(createExamineeAnswer({ question: question.id, answer: currentAnswer })).then(
          (data) => {
            if (data.payload) {
              answers[currentQuestionIndex] = { id: data.payload.id, answer: currentAnswer };
            } else {
              let id = parseInt(data.error.message);
              answers[currentQuestionIndex] = { id: id, answer: currentAnswer };
            }
          }
        );
      }
    }
    console.log(answers);
    if (type === 'next') {
      answers[currentQuestionIndex + 1]
        ? setCurrentAnswer(answers[currentQuestionIndex + 1].answer)
        : setCurrentAnswer('');

      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      answers[currentQuestionIndex - 1]
        ? setCurrentAnswer(answers[currentQuestionIndex - 1].answer)
        : setCurrentAnswer('');

      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishExam = () => {
    const totalTime = msToTime(dayjs() - dayjs(examineeExamDetails?.exam?.start_time));

    console.log(totalTime, dayjs() - dayjs(examineeExamDetails?.exam?.start_time));

    dispatch(
      updateExamineeExam({
        id: examineeExamId,
        data: { total_time: totalTime }
      })
    );

    enqueueSnackbar('Exam Successfully Conducted', { variant: 'success' });
    localStorage.setItem('examineeExamId', examineeExamId);
    navigate('/my-exams/exam-details');
  };

  const handleTimerEnd = (e) => {
    console.log(e);
  };

  const time = React.useMemo(() => {
    return Date.now() + remainingTime * 1000;
  }, []);

  const Timer = () => {
    return (
      <Countdown
        date={time} // Convert to milliseconds
        onComplete={handleTimerEnd}
        renderer={(props) => (
          <Stack direction="row" spacing={2}>
            <Typography variant="h5" color="secondary">
              Remaining Time:
            </Typography>
            <Typography variant="h4" component="div">
              {props.hours}: {props.minutes}: {props.seconds}
            </Typography>
          </Stack>
        )}
      />
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Drawer variant="permanent" open={true}>
          <Stack
            sx={{ my: 2, width: drawerWidth, height: '100%' }}
            display="flex"
            direction="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <MinimalLogo sx={{ width: '160px' }} />
            <IconButton>
              <InfoOutlinedIcon color="secondary" sx={{ fontSize: 40 }} />
            </IconButton>
          </Stack>
        </Drawer>

        <AppBar
          position="fixed"
          color="inherit"
          elevation={0}
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            width: { sm: `calc(100% - ${drawerWidth}px)` }
            // boxShadow: theme.customShadows.z1
          }}
        >
          <Toolbar>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
              {examineeExamDetails?.exam?.title}
            </Typography>
            <Typography variant="h5" component="div">
              {examineeExamDetails?.examinee?.full_name}
            </Typography>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{ mt: 8, ml: 9, width: '100%', flexGrow: 1, p: { xs: 2, sm: 3 } }}
        >
          <Grid container spacing={3}>
            {/* Timer */}
            <Grid xs={12} sx={{ p: 1 }} display="flex" justifyContent="flex-end">
              <Timer />
            </Grid>

            {currentQuestionIndex === questions.length ? (
              <Grid item display="flex" alignItems="center" justifyContent="center" xs={8}>
                <Typography variant="h2">All Done!</Typography>
              </Grid>
            ) : (
              <Grid item sx={{}} xs={8}>
                <Stack direction="column" spacing={2}>
                  <Stack direction="column">
                    <Typography variant="subtitle3">Question</Typography>
                    <MainPaper sx={{ p: 3, mt: 1 }}>
                      <Typography variant="h4">
                        {currentQuestionIndex + 1}&nbsp;.&nbsp;&nbsp;&nbsp;
                        {questions[currentQuestionIndex]?.question}
                      </Typography>
                    </MainPaper>
                  </Stack>
                  {/* For Choice Questions */}
                  {questions[currentQuestionIndex]?.type === 'CHOICE' && (
                    <Stack direction="column">
                      <Typography variant="subtitle3">Answer</Typography>
                      <MainPaper sx={{ p: 3, mt: 1 }}>
                        {questions[currentQuestionIndex]?.choices && (
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            name="radio-buttons-group"
                            value={currentAnswer}
                            onChange={(event) => {
                              setCurrentAnswer((prev) => (prev = event.target.value));
                            }}
                          >
                            <Stack direction="column" sx={{ ml: 4 }}>
                              {JSON.parse(questions[currentQuestionIndex]?.choices).map(
                                (choice) => {
                                  return (
                                    <FormControlLabel
                                      key={choice?.identifier}
                                      value={choice?.identifier}
                                      control={<Radio size="small" />}
                                      label={
                                        <Stack direction="row" spacing={2}>
                                          <Typography
                                            sx={{ fontWeight: 'bold', fontSize: '17px' }}
                                            variant="body1"
                                          >
                                            {choice?.identifier}.
                                          </Typography>
                                          <Typography sx={{ fontSize: '17px' }} variant="body1">
                                            {choice?.choice}
                                          </Typography>
                                        </Stack>
                                      }
                                    />
                                  );
                                }
                              )}
                            </Stack>
                          </RadioGroup>
                        )}
                      </MainPaper>
                    </Stack>
                  )}

                  {/* For True False Questions */}
                  {questions[currentQuestionIndex]?.type === 'TRUE_FALSE' && (
                    <Stack direction="column">
                      <Typography variant="subtitle3">Answer</Typography>
                      <MainPaper sx={{ p: 3, mt: 1 }}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          value={currentAnswer}
                          onChange={(event) =>
                            setCurrentAnswer((prev) => (prev = event.target.value))
                          }
                        >
                          <Stack direction="column" sx={{ ml: 4 }}>
                            <FormControlLabel
                              value="True"
                              control={<Radio size="small" />}
                              label={
                                <Typography sx={{ fontSize: '17px' }} variant="body1">
                                  True
                                </Typography>
                              }
                            />
                            <FormControlLabel
                              value="False"
                              control={<Radio size="small" />}
                              label={
                                <Typography sx={{ fontSize: '17px' }} variant="body1">
                                  False
                                </Typography>
                              }
                            />
                          </Stack>
                        </RadioGroup>
                      </MainPaper>
                    </Stack>
                  )}

                  {/* For Short Answer Questions */}
                  {questions[currentQuestionIndex]?.type === 'SHORT_ANSWER' && (
                    <Stack direction="column ">
                      <InputLabel htmlFor="answer" sx={{ mb: 1 }}>
                        Answer
                      </InputLabel>
                      <OutlinedInput
                        id="answer"
                        type="text"
                        multiline
                        name="answer"
                        value={currentAnswer}
                        onChange={(event) =>
                          setCurrentAnswer((prev) => (prev = event.target.value))
                        }
                        placeholder="Enter Your Answer Here"
                        fullWidth
                        sx={{
                          borderRadius: '14px'
                        }}
                      />
                    </Stack>
                  )}
                </Stack>
              </Grid>
            )}
            <Grid item xs={4}>
              <MainPaper sx={{ minHeight: '400px', p: 3, mt: 3.7 }}>
                <Typography variant="h4">Rules</Typography>
                <Divider sx={{ my: 2 }} />
                <Stack direction="column" sx={{ ml: 2, mb: 6 }}>
                  <Typography variant="subtitle">Only You should be in the exam</Typography>
                </Stack>
                <Typography variant="h4" sx={{ my: 2 }}>
                  Question Flags
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />

                <Stack direction="column" sx={{ ml: 4 }}>
                  {/* {flags.map((flag) => {
                return <Chip variant="light" color="error" lable={flag} />;
              })} */}
                </Stack>
              </MainPaper>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={(event) => handleNavigate('prev')}
                disabled={currentQuestionIndex === 0}
                sx={{ mr: 2 }}
              >
                Back
              </Button>
              {currentQuestionIndex === questions.length ? (
                <Button variant="contained" color="success" onClick={handleFinishExam}>
                  Finish Exam
                </Button>
              ) : (
                <Button variant="contained" onClick={(event) => handleNavigate('next')}>
                  Next
                </Button>
              )}
            </Grid>

            {/* <Grid item xs={12}>
              <TextField
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                fullWidth
                variant="outlined"
                helperText="Select an image"
              />

              <Button variant="outlined" onClick={(event) => {}} sx={{ mr: 2 }}>
                Submit
              </Button>
            </Grid> */}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TakeExam;
