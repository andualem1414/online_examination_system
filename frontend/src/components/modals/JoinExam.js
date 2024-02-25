import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Material UI
import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  Divider,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import MainPaper from '../MainPaper';

// Third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// Custom Components
import { createExamineeExam } from 'store/reducers/examineeExam';

const JoinExam = (props) => {
  const { open, handleClose } = props;
  const { enqueueSnackbar } = useSnackbar();
  const error = useSelector((state) => state.examineeExam.error);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500
        }
      }}
      zIndex={999}
    >
      <Fade in={open}>
        <MainPaper
          component="div"
          sx={{
            p: 4,
            pb: 8,
            width: { xs: '80vw', md: '60vw' },
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Title */}
          <Typography variant="h4" textAlign="center" sx={{ pb: 2 }}>
            Join Exam
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Formik
            initialValues={{
              exam_code: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              exam_code: Yup.string()
                .length(10, 'Must be 10 char long')
                .max(10, 'Must be 10 char long')
                .required('Code is required')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              try {
                dispatch(createExamineeExam(values)).then((data) => {
                  if (data.type === 'examineeExam/createExamineeExam/fulfilled') {
                    enqueueSnackbar('Successfully Joined the exam', {
                      variant: 'success'
                    });
                    handleClose();
                    localStorage.setItem('examineeExamId', data.payload.id);
                    navigate('/my-exams/exam-details');
                  }
                  if (data.type === 'examineeExam/createExamineeExam/rejected') {
                    enqueueSnackbar(`${data.error.message}`, {
                      variant: 'error'
                    });
                  }
                });

                setStatus({ success: false });
                setSubmitting(false);
              } catch (err) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              setFieldValue,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container direction="row" spacing={3}>
                  {/* Exam code Input */}
                  <Grid item xs={12} md={8}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="exam_code">Exam Code</InputLabel>
                      <OutlinedInput
                        id="exam_code"
                        type="text"
                        multiline
                        value={values.exam_code}
                        name="exam_code"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter Your Exam Code Here"
                        fullWidth
                        sx={{ borderRadius: '14px' }}
                        error={Boolean(touched.exam_code && errors.exam_code)}
                      />
                      {touched.exam_code && errors.exam_code && (
                        <FormHelperText error id="standard-weight-helper-text-exam_code">
                          {errors.exam_code}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  {/* Join Button*/}
                  <Grid item xs={12} md={4}>
                    {/* Create or Update Button */}
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3.4, height: '53px' }}
                      >
                        Join Exam
                      </Button>
                    </AnimateButton>
                  </Grid>

                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                </Grid>
              </form>
            )}
          </Formik>
        </MainPaper>
      </Fade>
    </Modal>
  );
};

export default JoinExam;
