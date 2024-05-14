import React, { useState, useRef, useEffect } from 'react';
// Material UI
import {
  Modal,
  Button,
  Stack,
  Divider,
  Typography,
  Stepper,
  Step,
  StepLabel,
  TextField
} from '@mui/material';
import MainCard from 'components/MainCard';
import Webcam from 'react-webcam';
import CircularProgress from '@mui/material/CircularProgress';
import { useSnackbar } from 'notistack';

// Custom Component
import MainPaper from '../MainPaper';
import ChecklistIcon from '@mui/icons-material/Checklist';
import SendIcon from '@mui/icons-material/Send';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from 'store/reducers/user';
import { dataURLtoFile } from 'utils/utils';

const StartExamModal = (props) => {
  const { openStartExam, handleOpenStartExamClose, handleStartExam, one_step } = props;

  const steps = one_step ? ['Accept Rules '] : ['Accept Rules', 'Autorize if it is really you'];

  const [activeStep, setActiveStep] = React.useState(0);
  const verified = useSelector((state) => state.user.verified);
  const loading = useSelector((state) => state.user.loading);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const webcamRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null); // State to store captured image data (optional)

  useEffect(() => {
    const formData = new FormData();
    dispatch(verifyUser(formData));
  }, []);

  const handleNext = (e) => {
    if (e.target.innerText === 'Start Exam') {
      handleStartExam();
    }
    activeStep < 1 && setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleVerify = () => {
    const image = webcamRef.current.getScreenshot();
    setImageSrc(image);

    const formData = new FormData();
    const imageData = dataURLtoFile(image, 'captured_image.jpg');

    formData.append('image', imageData);
    dispatch(verifyUser(formData)).then((data) => {
      if (data.type === 'user/verifyUser/fulfilled' && data.payload.verified === true) {
        enqueueSnackbar('Successfully verified', { variant: 'success' });
      } else {
        enqueueSnackbar('Failed to verify user', { variant: 'error' });
      }
    });
  };

  return (
    <Modal
      open={openStartExam}
      onClose={handleOpenStartExamClose}
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
        <Stepper activeStep={activeStep} sx={{ mx: 4 }}>
          {steps.map((label, index) => {
            return (
              <Step key={label}>
                <StepLabel>
                  <Typography>{label}</Typography>
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === 0 && (
          <MainCard sx={{ p: 2, my: 3 }}>
            <Stack direction="row" sx={{ mb: 2 }} spacing={2} alignItems="center">
              <ChecklistIcon sx={{ fontSize: 32 }} />
              <Typography variant="h3">Exam Taking Rules</Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
              <SendIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 18 }}>You can't change Tabs while in exam</Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
              <SendIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 18 }}>You can't exit fullScreen</Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
              <SendIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 18 }}>
                Your face should match your profile picture
              </Typography>
            </Stack>
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
              <SendIcon sx={{ fontSize: 18 }} />
              <Typography sx={{ fontSize: 18 }}>Only you should be in the exam</Typography>
            </Stack>
            <Divider sx={{ mb: 3 }} />
            <Stack direction="row" sx={{ mb: 2, ml: 2 }} spacing={2} alignItems="center">
              <WarningRoundedIcon color="error" sx={{ fontSize: 22 }} />
              <Typography color="secondary" sx={{ fontSize: 16 }}>
                Failure to adhere to the rules outlined above will result in automatic
                disqualification from the examination.
              </Typography>
            </Stack>
          </MainCard>
        )}
        {activeStep === 1 && (
          <MainCard sx={{ p: 2, my: 3 }}>
            <Stack direction="column" display="flex" alignItems="center" spacing={2}>
              <Typography variant="h4">Verify Yourself!</Typography>

              <Webcam
                screenshotFormat="image/jpeg"
                audio={false}
                height={240}
                ref={webcamRef}
                width={320}
                style={{ borderRadius: '5%' }}
              />
              {loading && <CircularProgress />}
              <Button
                variant="contained"
                color={verified ? 'success' : 'primary'}
                onClick={handleVerify}
              >
                {verified ? 'Verified' : 'Verify'}
              </Button>
            </Stack>
          </MainCard>
        )}
        <Stack direction="row" display="flex" justifyContent="space-between">
          <Button
            color="inherit"
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>

          <Button onClick={handleNext} disabled={activeStep === 1 && !verified} variant="contained">
            {activeStep === 1 || one_step === true ? 'Start Exam' : 'Continue'}
          </Button>
        </Stack>
      </MainPaper>
    </Modal>
  );
};

export default StartExamModal;
