import React, { useState } from 'react';

// Custom components
import MainCard from 'components/MainCard';
import Confirmation from '../../components/modals/Confirmation';
import ExamForm from '../../components/modals/ExamForm';
import { useNavigate } from 'react-router-dom';
import ChecklistRtlRoundedIcon from '@mui/icons-material/ChecklistRtlRounded';
import SummarizeRoundedIcon from '@mui/icons-material/SummarizeRounded';

// Third Party
import { Switch, Dropdown } from 'antd';
import { useSnackbar } from 'notistack';
import * as dayjs from 'dayjs';

// Material Ui
import { Typography, Stack, Chip, Grid, Button, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

// Redux

import { updateExam, deleteExam } from 'store/reducers/exam';
import { useSelector, useDispatch } from 'react-redux';
import { deleteExamineeExam } from 'store/reducers/examineeExam';
import StartExamModal from 'components/modals/StartExamModal';

const HeaderDetailsComponent = (props) => {
  const user = useSelector((state) => state.user.userDetails);
  let dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const {
    examDetails,
    examineeExamDetails,
    buttonName,
    handleButtonClick,
    setQuestionPoolSelectorModal
  } = props;

  const date = new Date(examDetails?.start_time);
  const [copied, setCopied] = useState(false);

  // For Update Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Initial Values for Update Modal
  const initialValues = {
    title: examDetails?.title,
    description: examDetails?.description,
    start_time: dayjs(examDetails?.start_time),
    end_time: dayjs(examDetails?.end_time),
    max_examinees: examDetails?.max_examinees
  };

  // Dropdown Items
  const items = [
    {
      key: '1',
      label: <Typography onClick={(e) => handleButtonClick('CHOICE')}>Choice</Typography>
    },

    {
      key: '2',
      label: <Typography onClick={(e) => handleButtonClick('TRUE_FALSE')}>True/False</Typography>
    },

    {
      key: '3',
      label: (
        <Typography onClick={(e) => handleButtonClick('SHORT_ANSWER')}>Short Answer</Typography>
      )
    },
    {
      key: '4',
      label: (
        <Typography onClick={(e) => setQuestionPoolSelectorModal(true)}>
          From Question Pool
        </Typography>
      )
    }
  ];

  let [warning, setwarning] = useState('');
  let [confirmButton, setconfirmButton] = useState('');

  let [openConfimation, setOpenConfimation] = useState(false);
  let [openStartExam, setOpenStartExam] = useState(false);

  let handleConfimationClose = () => setOpenConfimation(false);
  let handleOpenStartExamClose = () => setOpenStartExam(false);
  let handleOpenStartExamOpen = () => setOpenStartExam(true);

  let handleConfimationOpen = (warning, confirmButton) => {
    setwarning(warning);
    setconfirmButton(confirmButton);
    setOpenConfimation(true);
  };

  // Leave Exam
  const handleConfimationClick = () => {
    if (confirmButton === 'Leave') {
      dispatch(deleteExamineeExam(examineeExamDetails.id)).then((data) => {
        if (data.type === 'examineeExam/deleteExamineeExam/fulfilled') {
          enqueueSnackbar('Successfully left Exam', { variant: 'success' });
          navigate('/my-exams');
        }
      });
    } else {
      dispatch(deleteExam(examDetails.id)).then((data) => {
        if (data.type === 'exam/deleteExam/fulfilled') {
          enqueueSnackbar('Exam Deleted Successfully', {
            variant: 'success'
          });
          handleConfimationClose();
          navigate('/my-exams');
        }
        if (data.type === 'exam/deleteExam/rejected') {
          enqueueSnackbar(data.error.message, {
            variant: 'error'
          });
        }
      });
    }
  };

  // Copy code to Clipboard
  const handleCopyClick = async (textCopied) => {
    const text = textCopied.target.innerText;
    try {
      await navigator.clipboard.writeText(text.slice(6));
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Handle error gracefully, e.g., display an error message
    }
  };

  const handleStartExam = () => {
    localStorage.setItem('examineeExamId', examineeExamDetails?.id);
    localStorage.setItem('remainingTime', examineeExamDetails?.exam?.duration);
    navigate('/my-exams/exam-details/take-exam');
  };
  return (
    <>
      <Confirmation
        openConfimation={openConfimation}
        handleConfimationClose={handleConfimationClose}
        handleConfimationClick={handleConfimationClick}
        warning={warning}
        ConfirmButton={confirmButton}
      />
      <StartExamModal
        openStartExam={openStartExam}
        handleOpenStartExamClose={handleOpenStartExamClose}
        handleStartExam={handleStartExam}
        one_step={examDetails?.remote === false ? true : false}
      />
      <ExamForm
        open={open}
        handleClose={handleClose}
        initialValues={initialValues}
        modalType="Update"
        examId={examDetails.id}
      />
      <MainCard>
        <Grid container spacing={2}>
          {/* Exam title */}
          <Grid item xs={12} md={3} display="flex" justifyContent="flex-start" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {examDetails.title}
            </Typography>
          </Grid>

          {/* Exam description for small screen */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
            <Typography>{examDetails.description}</Typography>
          </Grid>

          <Grid item xs={12} md={5}>
            {/* Exam controls */}
            <Stack direction="row" justifyContent="flex-start" spacing={{ xs: 1, sm: 2, md: 4 }}>
              {/* TODO change comparision !== */}
              {examDetails.status === 'Scheduled' && user.user_type === 'EXAMINER' && (
                <Chip
                  sx={{ px: 1 }}
                  icon={<EditIcon color="secondary" fontSize="small" />}
                  label={<Typography>Edit</Typography>}
                  onClick={() => {
                    handleOpen();
                  }}
                  variant="outlined"
                />
              )}
              {/* Copy Button */}
              <Tooltip title="Copy" arrow>
                <Chip
                  sx={{ borderRadius: 4 }}
                  onClick={handleCopyClick}
                  arial
                  label={
                    copied ? (
                      <Typography>Copied!</Typography>
                    ) : (
                      <Typography variant="h6">Code: {examDetails.exam_code}</Typography>
                    )
                  }
                />
              </Tooltip>
              {/* Delete Button for exam */}
              {examDetails.status === 'Conducted' && user.user_type === 'EXAMINER' && (
                <Chip
                  sx={{ px: 1 }}
                  color="error"
                  icon={<DeleteRoundedIcon color="error" fontSize="small" />}
                  label={<Typography>Delete</Typography>}
                  onClick={() =>
                    handleConfimationOpen('Are you sure you want to delete this exam?', 'Delete')
                  }
                  variant="outlined"
                />
              )}

              {/* TO Public switcher */}
              {examDetails.status === 'Conducted' && user.user_type === 'EXAMINER' && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Typography variant="h5" sx={{ mr: 1 }}>
                    Public:
                  </Typography>
                  <Switch
                    checked={examDetails.public}
                    onChange={() => {
                      dispatch(
                        updateExam({ id: examDetails.id, data: { public: !examDetails.public } })
                      ).then((data) => {
                        if (data.type === 'exam/updateExam/fulfilled') {
                          if (data.payload.public === true) {
                            enqueueSnackbar('Question is Now PUBLIC', { variant: 'info' });
                          }
                          if (data.payload.public === false) {
                            enqueueSnackbar('Question is Now PRIVATE', { variant: 'info' });
                          }
                        }
                        if (data.type === 'exam/examUpdate/rejected') {
                          enqueueSnackbar('Failed to update Exam', { variant: 'success' });
                        }
                      });
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              )}
              {/* TO Remote switcher */}
              {examDetails.status === 'Scheduled' && user.user_type === 'EXAMINER' && (
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                  <Typography variant="h5" sx={{ mr: 1 }}>
                    Remote:
                  </Typography>
                  <Switch
                    checked={examDetails.remote}
                    onChange={() => {
                      dispatch(
                        updateExam({ id: examDetails.id, data: { remote: !examDetails.remote } })
                      ).then((data) => {
                        if (data.type === 'exam/updateExam/fulfilled') {
                          if (data.payload.remote === true) {
                            enqueueSnackbar('Question is Now REMOTE', { variant: 'info' });
                          }
                          if (data.payload.remote === false) {
                            enqueueSnackbar('Question is Now IN PERSON', { variant: 'info' });
                          }
                        }
                        if (data.type === 'exam/examUpdate/rejected') {
                          enqueueSnackbar('Failed to update Exam', { variant: 'success' });
                        }
                      });
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </Stack>
              )}

              {/* Leave Exam chip */}
              {examDetails.status === 'Conducted' && user.user_type === 'EXAMINEE' && (
                <Chip
                  sx={{ px: 1 }}
                  color="error"
                  icon={<ExitToAppIcon color="error" fontSize="small" />}
                  label={<Typography>Leave</Typography>}
                  onClick={() =>
                    handleConfimationOpen('Are you sure you want to Leave this Exam?', 'Leave')
                  }
                  variant="outlined"
                />
              )}
            </Stack>
          </Grid>

          {/* public switcher for mobile Devices */}
          {user.user_type === 'EXAMINER' && (
            <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
              <Stack
                direction="row"
                alignItems="center"
                sx={{ display: { xs: 'flex', md: 'none' } }}
              >
                <Typography variant="h5" sx={{ mr: 1 }}>
                  Public:
                </Typography>
                <Switch
                  checked={true}
                  onChange={() => {}}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Stack>
            </Grid>
          )}

          {/* Time and Date shower */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{ pr: 6 }}
            display="flex"
            justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
            alignItems="flex-start"
          >
            <Typography variant="h5" sx={{ mr: 2 }}>
              Start time:
            </Typography>
            <Stack direction="column">
              <Typography>{date.toDateString()}</Typography>
              <Typography variant="subtitle2" color="secondary">
                {date.toLocaleTimeString()}
              </Typography>
            </Stack>
          </Grid>

          {/* Exam Description */}
          <Grid item xs={8} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography>{examDetails.description}</Typography>
          </Grid>

          {/* Interchangable Main Button */}
          {user.user_type === 'EXAMINER' ? (
            <Grid
              item
              xs={12}
              md={4}
              sx={{ pr: 6 }}
              display="flex"
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              alignItems="center"
            >
              {buttonName.name === 'Add Question' ? (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) => {
                      handleButtonClick('examinees');
                    }}
                  >
                    Joined Examinees
                  </Button>
                  <Dropdown disabled={buttonName.disabled} menu={{ items }} placement="bottom">
                    <Button variant="contained" color="success" startIcon={<ExpandMoreIcon />}>
                      {buttonName.name}
                    </Button>
                  </Dropdown>
                </Stack>
              ) : (
                <Button
                  variant="contained"
                  color={buttonName.name === 'Results' ? 'warning' : 'success'}
                  sx={{ width: '130px' }}
                  onClick={(e) => {
                    handleButtonClick(e.target.innerText);
                  }}
                  disabled={buttonName.disabled}
                  startIcon={
                    buttonName.name === 'Results' ? (
                      <ChecklistRtlRoundedIcon />
                    ) : (
                      <SummarizeRoundedIcon />
                    )
                  }
                >
                  {buttonName.name}
                </Button>
              )}
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              md={4}
              sx={{ pr: 6 }}
              display="flex"
              justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
              alignItems="center"
            >
              {examDetails.status === 'Conducted' || examineeExamDetails.taken ? (
                // Show Result
                <Stack direction="row">
                  <Typography variant="h5" sx={{ mr: 5.4 }}>
                    Result:
                  </Typography>
                  <Stack direction="column" sx={{ mr: 6 }}>
                    <Chip
                      color="success"
                      variant="light"
                      label={
                        <Typography variant="h4">
                          {examineeExamDetails.score} / {examineeExamDetails?.exam?.total_mark}
                        </Typography>
                      }
                    />
                  </Stack>
                </Stack>
              ) : (
                // Show Leave Exam and Start Exam
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={(e) =>
                      handleConfimationOpen('Are you sure you want to Leave this Exam?', 'Leave')
                    }
                  >
                    Leave Exam
                  </Button>

                  <Button
                    variant="contained"
                    color="success"
                    onClick={(e) => {
                      handleOpenStartExamOpen();
                    }}
                    disabled={examDetails.status === 'Live' ? false : true}
                  >
                    Start Exam
                  </Button>
                </Stack>
              )}
            </Grid>
          )}
        </Grid>
      </MainCard>
    </>
  );
};

export default HeaderDetailsComponent;
