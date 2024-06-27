import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import * as dayjs from 'dayjs';
import SendIcon from '@mui/icons-material/Send';

import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';

import CircularProgress from '@mui/material/CircularProgress';
import FlagIcon from '@mui/icons-material/Flag';
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
  TextField,
  Chip
} from '@mui/material';

import { useTheme } from '@mui/material/styles';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Modal from '@mui/material/Modal';

// redux imports
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchExamineeExamDetails, updateExamineeExam } from 'store/reducers/examineeExam';
import { fetchQuestions } from 'store/reducers/question';
import { fetchRules, verifyUser } from 'store/reducers/user';

// Custom components
import MinimalLogo from 'components/Logo/MinimalLogo';
import MainPaper from 'components/MainPaper';
import { dataURLtoFile, msToTime, shuffle } from 'utils/utils';
import {
  createExamineeAnswer,
  fetchExamineeAnswers,
  updateExamineeAnswer
} from 'store/reducers/examineeAnswer';

import Countdown from 'react-countdown';
import { createFlag, fetchFlags } from 'store/reducers/flag';
import MainCard from 'components/MainCard';
import FullScreenButton from './FullScreenButton';
import screenfull from 'screenfull';

const drawerWidth = 70;
let answers = {};
let flagged = new Set();
// let currentQuestionIndex = 0;

const TakeExam = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const webcamRef = useRef(null);

  const rules = useSelector((state) => state.user.rules);

  const remainingTime = localStorage.getItem('remainingTime');
  const examineeExamId = localStorage.getItem('examineeExamId');

  const examineeExamDetails = useSelector((state) => state.examineeExam.examineeExamDetails);
  const prev_answers = useSelector((state) => state.examineeAnswer.examineeAnswers);
  const flags = useSelector((state) => state.flag.flags);

  const [questions, setQuestions] = useState([]);
  let [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  let [currentAnswer, setCurrentAnswer] = useState('');

  let [startVideo, setStartVideo] = useState(false);
  let [startExam, setStartExam] = useState(false);
  let [flagWarning, setFlagWarning] = useState(false);
  let [faceLostSecondCount, setFaceLostSecondCount] = useState(0);

  // let [flagged, setFlagged] = useState(new Set());
  const [flagImage, setFlagImage] = useState(null);
  const [flagType, setFlagType] = useState('');

  const dispatch = useDispatch();
  const theme = useTheme();
  const intervalRef = useRef(null); // Store the interval ID

  const [isFullScreen, setIsFullScreen] = useState(false);
  const containerRef = useRef(document.body);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      screenfull.exit();
    } else {
      screenfull.request(containerRef.current);
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    const changeHandler = () => {
      setIsFullScreen(screenfull.isFullscreen);
      let fullScreen = screenfull.isFullscreen;
      if (fullScreen === false) {
        console.log('hellow');
        handleFinishExam();
        navigate('/my-exams/exam-details');

        window.location.reload();
      }
      console.log(screenfull.isFullscreen);
    };

    screenfull.on('change', changeHandler);

    return () => screenfull.off('change', changeHandler);
  }, []);

  useEffect(() => {
    dispatch(fetchExamineeExamDetails(examineeExamId)).then((data) => {
      dispatch(fetchQuestions(data?.payload?.exam?.id)).then((data) => {
        if (data.type === 'question/fetchQuestions/rejected') {
          enqueueSnackbar('Failed to fetch questions', { variant: 'error' });
          navigate('/my-exams/exam-details');
        } else {
          setQuestions(shuffle(data?.payload));
        }
      });
      dispatch(fetchExamineeAnswers(data?.payload?.exam?.id));
      dispatch(fetchRules(data?.payload?.exam?.created_by));
    });

    async function loadModels() {
      await faceapi.loadTinyFaceDetectorModel('/models');
      await faceapi.loadFaceLandmarkModel('/models');
      await faceapi.loadFaceRecognitionModel('/models');

      setStartVideo(true);
    }
    if (examineeExamDetails?.exam?.remote) {
      loadModels();
    }
  }, []);

  useEffect(() => {
    console.log(answers);

    answers = {};
    questions.forEach((question, i) => {
      console.log(questions);
      prev_answers.forEach((answer, j) => {
        if (answer.question.id === question.id) {
          console.log(answer, i, questions);
          answers[i] = { id: answer.id, answer: answer.answer };
        }
      });
    });
    if (answers[0]) {
      dispatch(fetchFlags(answers[0]?.id));
    }
    console.log(answers);
    setCurrentAnswer(answers[0]?.answer || '');
  }, [questions]);

  const flagger = (flagType) => {
    // setFlagged(true);
    setCurrentQuestionIndex((prev) => {
      console.log('*****************************8', prev);
      flagged.add(prev);
      return prev;
    });

    if (webcamRef.current) {
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame onto canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data URL from canvas
      const imageSrc = canvas.toDataURL('image/jpeg');

      // Set captured screenshot in state

      setFlagImage(imageSrc);
    }
    setFlagType(flagType);
    console.log(flagged);
  };

  const handleVerify = () => {
    if (webcamRef.current && flagWarning === false) {
      console.log('verifying...');
      const video = webcamRef.current.video;
      const canvas = document.createElement('canvas');

      // Set canvas dimensions to match video dimensions
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame onto canvas
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Get image data URL from canvas
      const imageSrc = canvas.toDataURL('image/jpeg');

      const formData = new FormData();
      const imageData = dataURLtoFile(imageSrc, 'captured_image.jpg');

      formData.append('image', imageData);
      return dispatch(verifyUser(formData)).then((data) => {
        if (data.type === 'user/verifyUser/fulfilled' && data.payload.verified === true) {
          return true;
          // enqueueSnackbar('Successfully verified', { variant: 'success' });
        } else {
          enqueueSnackbar('Failed to verify user', { variant: 'error' });
          flagger('SOMEONE_DETECTED');
          return false;
        }
      });
    }
    return true;
  };

  useEffect(() => {
    // Adjust interval duration as needed
  }, []);

  let intervalFaceChecker = () => {
    intervalRef.current = setInterval(() => {
      console.log('******************', flagWarning);
      if (flagWarning === false) {
        handleVerify()
          ? console.log('face verified successfully!')
          : console.log('face not verified!');
      } else {
        console.log('No face to verify');
      }
    }, 15000);
  };
  const addFlag = (flagId, flagImage, flagType) => {
    console.log(flagType, flagImage, flagId);
    const formData = new FormData();
    const imageData = dataURLtoFile(flagImage, 'captured_image.jpg');

    formData.append('type', flagType); // Add other data if needed
    formData.append('image', imageData);

    dispatch(createFlag({ id: flagId, data: formData })).then((data) => {
      console.log(data);
    });
  };

  const handleNavigate = (type) => {
    const question = questions[currentQuestionIndex];
    console.log(answers);
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
      if (flagged.has(currentQuestionIndex) && answers[currentQuestionIndex]) {
        addFlag(answers[currentQuestionIndex].id, flagImage, flagType);
      }
    } else {
      if (currentAnswer) {
        dispatch(createExamineeAnswer({ question: question.id, answer: currentAnswer }))
          .then((data) => {
            if (data.payload) {
              answers[currentQuestionIndex] = { id: data.payload.id, answer: currentAnswer };
            } else {
              let id = parseInt(data.error.message);

              answers[currentQuestionIndex] = { id: id, answer: currentAnswer };
            }
          })
          .then(() => {
            if (flagged.has(currentQuestionIndex) && answers[currentQuestionIndex]) {
              addFlag(answers[currentQuestionIndex].id, flagImage, flagType);
            }
          });
      }
    }

    console.log(answers);

    if (type === 'next') {
      answers[currentQuestionIndex + 1]
        ? setCurrentAnswer(answers[currentQuestionIndex + 1].answer)
        : setCurrentAnswer('');
      dispatch(fetchFlags(answers[currentQuestionIndex + 1]?.id));
      // currentQuestionIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex((prev) => prev + 1);
      console.log(flags);
    } else {
      answers[currentQuestionIndex - 1]
        ? setCurrentAnswer(answers[currentQuestionIndex - 1].answer)
        : setCurrentAnswer('');
      dispatch(fetchFlags(answers[currentQuestionIndex - 1]?.id));
      // currentQuestionIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleFinishExam = () => {
    const totalTime = msToTime(dayjs() - dayjs(examineeExamDetails?.exam?.start_time));

    dispatch(
      updateExamineeExam({
        id: examineeExamId,
        data: { total_time: totalTime }
      })
    );

    enqueueSnackbar('Exam Successfully Conducted', { variant: 'success' });
    localStorage.setItem('examineeExamId', examineeExamId);
    navigate('/my-exams/exam-details');
    window.location.reload();
  };

  const handleTimerEnd = (e) => {
    console.log(e);
  };

  const handleUserMedia = () => {
    console.log('Video Started!');
    toggleFullScreen();
    intervalFaceChecker();
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current.video,
          new faceapi.TinyFaceDetectorOptions({
            scoreThreshold: 0.3
          })
        )
        .withFaceLandmarks();

      // const resizedDetections = faceapi.resizeResults(
      //     detections,
      //     displaySize
      // );

      console.log(detections);

      if (detections.length < 1) {
        console.log('FACE_LOST');
        setFlagWarning(true);

        setFaceLostSecondCount((prev) => {
          prev = prev + 500;
          console.log(prev);
          if (prev === 3000) {
            enqueueSnackbar('Face lost', { variant: 'error' });
            flagger('FACE_LOST');
          }
          return prev;
        });
      } else if (detections.length >= 2) {
        enqueueSnackbar('Someone else Detected!', { variant: 'error' });
        flagger('SOMEONE_DETECTED');
      } else {
        setFlagWarning(false);
        setFaceLostSecondCount(0);
      }

      setStartExam(true);
      // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 500);
  };

  const time = React.useMemo(() => {
    return Date.now() + remainingTime * 1000;
  }, []);

  const Timer = () => {
    return (
      <Countdown
        date={time} // Convert to milliseconds
        onComplete={handleTimerEnd}
        onTick={(timeDelta) => {
          localStorage.setItem('remainingTime', timeDelta.total / 1000);
        }}
        renderer={(props) => (
          <Stack direction="row" spacing={2}>
            <Typography variant="h5" color="secondary">
              Remaining Time:
            </Typography>
            <Typography variant="h4" component="div">
              {String(props.hours).padStart(2, '0')}: {String(props.minutes).padStart(2, '0')}:{' '}
              {String(props.seconds).padStart(2, '0')}
            </Typography>
          </Stack>
        )}
      />
    );
  };

  const [startExamModal, setStartExamModal] = useState(
    !examineeExamDetails?.exam?.remote ? true : false
  );
  return (
    <>
      <Modal open={startExamModal} onClose={() => {}} aria-labelledby="modal-modal-startExamModal">
        <MainCard
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3
          }}
        >
          <Typography id="modal-modal-title" variant="h5" sx={{ mb: 3 }}>
            Start the Exam?
          </Typography>
          <Button
            onClick={() => {
              toggleFullScreen();

              setStartExamModal(false);
            }}
            variant="contained"
            sx={{ ml: 1 }}
          >
            Start Exam
          </Button>
        </MainCard>
      </Modal>

      <Modal
        open={!startExam && examineeExamDetails?.exam?.remote}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MainCard
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3
          }}
        >
          <Stack direction="column" spacing={2} display="flex" alignItems="center">
            <CircularProgress color="success" thickness={5} size={80} />
            <Typography variant="h4">Searching for Faces...</Typography>
          </Stack>
        </MainCard>
      </Modal>
      {/* Searching for faces */}
      <Modal
        open={flagWarning}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <MainCard
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 3
          }}
        >
          <Stack direction="column" spacing={2} display="flex" alignItems="center">
            <CircularProgress color="success" thickness={5} size={80} />
            <Typography variant="h4">Face Lost Searching for Faces...</Typography>
            <Typography variant="h5" color="error">
              Question will be Flagged after 3 seconds...
            </Typography>
          </Stack>
        </MainCard>
      </Modal>

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

            {/* Details and Flags Card */}
            <Grid item xs={4}>
              <MainPaper sx={{ minHeight: '400px', p: 3, mt: 3.7 }}>
                <Typography variant="h4">Exam Details</Typography>
                <Divider sx={{ my: 2 }} />
                <Stack
                  sx={{ ml: 2, mb: 1 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Number of Questions</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip label={questions.length} variant="light" color="primary" />
                  </Typography>
                </Stack>

                <Stack
                  sx={{ ml: 2, mb: 2 }}
                  alignItems="center"
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography>Answered Question</Typography>
                  <Typography color="primary" sx={{ fontWeight: 'bold' }}>
                    <Chip label={Object.keys(answers).length} variant="light" color="primary" />
                  </Typography>
                </Stack>

                <Typography variant="h4">Rules for this Exam</Typography>
                <Divider sx={{ my: 2 }} />

                {rules.map((rule) => {
                  return (
                    <Stack direction="row" sx={{ mb: 2, ml: 2 }} alignItems="center" spacing={2}>
                      <SendIcon sx={{ fontSize: 18 }} />
                      <Typography sx={{ fontSize: 18 }}>{rule.rule}</Typography>
                    </Stack>
                  );
                })}
                <Typography variant="h4" sx={{ my: 2 }}>
                  Question Flags
                </Typography>
                <Divider sx={{ mt: 1, mb: 2 }} />
                {startVideo && (
                  <Webcam
                    screenshotFormat="image/jpeg"
                    audio={false}
                    height={1}
                    ref={webcamRef}
                    width={1}
                    onUserMedia={handleUserMedia}
                  />
                )}

                <Stack direction="column" sx={{ ml: 4 }}>
                  <Stack
                    direction="column"
                    spacing={2}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    {/* <Chip
                      variant="light"
                      icon={<FlagIcon />}
                      onClick={() => {
                        setFlagged(true);
                        console.log(webcamRef.current.getScreenshot());
                        if (webcamRef.current) {
                          const video = webcamRef.current.video;
                          const canvas = document.createElement('canvas');

                          // Set canvas dimensions to match video dimensions
                          canvas.width = video.videoWidth;
                          canvas.height = video.videoHeight;

                          // Draw video frame onto canvas
                          const context = canvas.getContext('2d');
                          context.drawImage(video, 0, 0, canvas.width, canvas.height);

                          // Get image data URL from canvas
                          const imageSrc = canvas.toDataURL('image/jpeg');

                          // Set captured screenshot in state

                          setFlagImage(imageSrc);
                        }
                        setFlagType('FACE_LOST');
                      }}
                      sx={{ width: '60%' }}
                      color="error"
                      label="NO_FACE"
                    /> */}
                    {/* <Chip variant="light" color="error" label="SOME_ONE_ELSE" /> */}

                    {flags.length > 0 ? (
                      flags.map((flag) => {
                        console.log(flag.type);
                        const lable = flag.type;
                        return (
                          <Chip
                            icon={<FlagIcon />}
                            variant="light"
                            sx={{ width: '60%' }}
                            color="error"
                            label={lable}
                          />
                        );
                      })
                    ) : (
                      <Typography variant="h5" textAlign="center">
                        No flags for this question.
                      </Typography>
                    )}
                  </Stack>
                </Stack>
                {/* <Typography>{facesCount}</Typography> */}
              </MainPaper>
            </Grid>

            <Grid item xs={10}>
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
                <>
                  <Button variant="contained" onClick={(event) => handleNavigate('next')}>
                    Next
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default TakeExam;
