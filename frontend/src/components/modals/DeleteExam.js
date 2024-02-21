import React from 'react';

// Third party
import { useSnackbar } from 'notistack';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Material UI
import { Modal, Button, Stack, Typography } from '@mui/material';

// Custom Component
import MainPaper from '../MainPaper';
import { deleteExam } from 'store/reducers/exam';

const DeleteExam = (props) => {
  const { examId, deleteModal, handleDeleteClose } = props;
  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      open={deleteModal}
      onClose={handleDeleteClose}
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
          Are you sure you what to delete this Exam?
        </Typography>
        <Typography variant="subtitle3" id="child-modal-description">
          This action cannot be reversed!
        </Typography>
        <Stack direction="row" sx={{ mt: 1 }} justifyContent="flex-end">
          <Button onClick={handleDeleteClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              dispatch(deleteExam(examId)).then((data) => {
                if (data.type === 'exam/deleteExam/fulfilled') {
                  enqueueSnackbar('Exam Deleted Successfully', {
                    variant: 'success'
                  });
                  handleDeleteClose();
                  navigate('/my-exams');
                }
                if (data.type === 'exam/deleteExam/rejected') {
                  enqueueSnackbar(data.error.message, {
                    variant: 'error'
                  });
                }
              });
            }}
            color="error"
            variant="contained"
            sx={{ ml: 1 }}
          >
            Delete
          </Button>
        </Stack>
      </MainPaper>
    </Modal>
  );
};

export default DeleteExam;
