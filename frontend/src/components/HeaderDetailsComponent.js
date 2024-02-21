import React, { useState } from 'react';

// Custom components
import MainCard from 'components/MainCard';
import DeleteExam from './modals/DeleteExam';
import ExamForm from './modals/ExamForm';

// Third Party
import { Switch, Dropdown } from 'antd';
import * as dayjs from 'dayjs';

// Material Ui
import { Typography, Stack, Chip, Grid, Button, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { dispatch } from 'store/index';
import { updateExam } from 'store/reducers/exam';
import { useSnackbar } from 'notistack';

const HeaderDetailsComponent = (props) => {
  const { examDetails, buttonName, handleButtonClick } = props;
  const date = new Date(examDetails.start_time);
  const [copied, setCopied] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // For Update Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // For Delete Modal
  let [deleteModal, setDeleteModal] = useState(false);
  let handleDeleteClose = () => setDeleteModal(false);
  let handleDeleteOpen = () => setDeleteModal(true);

  // Initial Values for Update Modal
  const initialValues = {
    title: examDetails.title,
    description: examDetails.description,
    start_time: dayjs(examDetails.start_time),
    end_time: dayjs(examDetails.end_time)
  };

  // Copy code to Clipboard
  const handleCopyClick = async (textCopied) => {
    const text = textCopied.target.innerText;
    try {
      await navigator.clipboard.writeText(text.slice(5, -1));
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error('Failed to copy text:', error);
      // Handle error gracefully, e.g., display an error message
    }
  };

  // Question Type selector
  const handleDropdownButtonClick = (e, type) => {
    handleButtonClick(type);
  };

  // Dropdown Items
  const items = [
    {
      key: '1',
      label: <Typography onClick={(e) => handleDropdownButtonClick(e, 'CHOICE')}>Choice</Typography>
    },

    {
      key: '2',
      label: (
        <Typography onClick={(e) => handleDropdownButtonClick(e, 'TRUE_FALSE')}>
          True/False
        </Typography>
      )
    },

    {
      key: '3',
      label: (
        <Typography onClick={(e) => handleDropdownButtonClick(e, 'SHORT_ANSWER')}>
          Short Answer
        </Typography>
      )
    }
  ];

  return (
    <>
      <DeleteExam
        examId={examDetails.id}
        deleteModal={deleteModal}
        handleDeleteClose={handleDeleteClose}
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
              {examDetails.status === 'Scheduled' && (
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

              {/* TO Public switcher */}
              {examDetails.status === 'Conducted' && (
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
                        console.log(data);
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
              {examDetails.status === 'Scheduled' && (
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
                        console.log(data);
                        if (data.type === 'exam/updateExam/fulfilled') {
                          if (data.payload.remote === true) {
                            enqueueSnackbar('Question is Now REMOTE', { variant: 'info' });
                          }
                          if (data.payload.remote === false) {
                            enqueueSnackbar('Question is Now NOT REMOTE', { variant: 'info' });
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

              {/* Delete Button for exam */}
              {examDetails.status === 'Conducted' && (
                <Chip
                  sx={{ px: 1 }}
                  color="error"
                  icon={<DeleteRoundedIcon color="error" fontSize="small" />}
                  label={<Typography>Delete</Typography>}
                  onClick={() => handleDeleteOpen()}
                  variant="outlined"
                />
              )}
            </Stack>
          </Grid>

          {/* public switcher for mobile Devices */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' } }}>
            <Stack direction="row" alignItems="center" sx={{ display: { xs: 'flex', md: 'none' } }}>
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

          {/* Exam Discription */}
          <Grid item xs={8} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Typography>{examDetails.description}</Typography>
          </Grid>

          {/* Interchangable Main Button */}
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
              <Dropdown menu={{ items }} placement="bottom">
                <Button
                  disabled={buttonName.disabled}
                  variant="contained"
                  color="success"
                  startIcon={<ExpandMoreIcon />}
                >
                  {buttonName.name}
                </Button>
              </Dropdown>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={(e) => {
                  handleButtonClick(e.target.innerText);
                  console.log(e);
                }}
                disabled={buttonName.disabled}
              >
                {buttonName.name}
              </Button>
            )}
          </Grid>
        </Grid>
      </MainCard>
    </>
  );
};

export default HeaderDetailsComponent;
