import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosPrivate } from 'api/axios';

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
  Stack,
  Slider,
  Chip,
  Box
} from '@mui/material';
import AnimateButton from 'components/@extended/AnimateButton';
import MainPaper from '../MainPaper';
import IconButton from '@mui/material/IconButton';

// Third party
import * as Yup from 'yup';
import { Formik } from 'formik';
import { DatePicker } from 'antd';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

// Custom Components
import { createExam, updateExam, deleteExam } from 'store/reducers/exam';
import Confirmation from './Confirmation';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createPayment, fetchPaymentCode } from 'store/reducers/payments';
import { Height } from '../../../node_modules/@mui/icons-material/index';

const ExamForm = (props) => {
  const { open, handleClose, modalType, initialValues, examId } = props;
  const { enqueueSnackbar } = useSnackbar();
  const userDetails = useSelector((state) => state.user.userDetails);

  const [paid, setPaid] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // For Delete Modal
  let [openConfimation, setOpenConfimation] = useState(false);
  let handleConfimationClose = () => setOpenConfimation(false);
  let handleConfimationOpen = () => setOpenConfimation(true);

  const getPaymentCodeAPI = async (amount, title) => {
    const params = {
      amount: amount,
      title: title
    };

    try {
      const response = await axiosPrivate.get(`exams/payments/code/`, { params });
      return response.data;
    } catch (error) {
      enqueueSnackbar('Error connecting check your internet', {
        variant: 'error'
      });
    }
  };

  const checkPaymentAPI = async (paymentCode) => {
    try {
      const response = await axiosPrivate.get(`exams/payments/check/`, {
        params: { payment_code: paymentCode }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch code', error);
    }
  };
  useEffect(() => {
    setPaid(false);
    setPaymentCode('');
  }, [open]);

  const handleConfimationClick = () => {
    dispatch(deleteExam(examId)).then((data) => {
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
  };

  const payWithChapa = (amount, title) => {
    let returnUrl = '';

    getPaymentCodeAPI(amount, title).then((response) => {
      if (response) {
        let data = JSON.parse(response.data);
        if (data.status === 'failed') {
          enqueueSnackbar('Error occured while creating payment', { variant: 'error' });
          return;
        }
        setPaymentCode(response.code);

        window.open(data.data.checkout_url, '_blank');
        console.log(response.code, data);
      }
    });
  };

  const checkPayment = (paymentCode) => {
    checkPaymentAPI(paymentCode).then((response) => {
      if (response.paid) {
        setPaid(true);
        enqueueSnackbar('Payment verified', { variant: 'success' });
      } else {
        setPaid(false);
        enqueueSnackbar('Not Paid', { variant: 'error' });
      }
    });
  };

  return (
    <>
      {/* Delete Confirmation Modal */}
      <Confirmation
        openConfimation={openConfimation}
        handleConfimationClose={handleConfimationClose}
        handleConfimationClick={handleConfimationClick}
        warning={'Are you sure you want to delete this exam?'}
        ConfirmButton={'Delete'}
      />

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
              {modalType} Exam
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Formik
              initialValues={{
                title: initialValues.title,
                description: initialValues.description,
                start_time: initialValues.start_time,
                end_time: initialValues.end_time,
                max_examinees: initialValues.max_examinees,
                submit: null
              }}
              validationSchema={Yup.object().shape({
                title: Yup.string().required('Title is required'),
                description: Yup.string().required('Description is required'),
                start_time: Yup.string().required('Start Time is required'),
                end_time: Yup.string().required('End Time is required'),
                max_examinees: Yup.number().min(1, 'Atleast one Examinee')
              })}
              onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                try {
                  if (new Date(values.start_time) > new Date(values.end_time)) {
                    throw new Error('Start Time must be less than End Time');
                  }
                  modalType === 'Create'
                    ? dispatch(createExam(values)).then((data) => {
                        if (data.type === 'exam/createExam/fulfilled') {
                          let paymentDetails = {
                            exam_id: data?.payload?.id,
                            payment_code: paymentCode,
                            payment_method: 'Chapa'
                          };
                          dispatch(createPayment(paymentDetails));

                          enqueueSnackbar('Exam Created Successfully', {
                            variant: 'success'
                          });
                          handleClose();
                          localStorage.setItem('examId', data.payload.id);
                          navigate('/my-exams/exam-details');
                        }
                      })
                    : dispatch(updateExam({ id: examId, data: values })).then((data) => {
                        if (data.type === 'exam/updateExam/fulfilled') {
                          enqueueSnackbar('Exam Updated Successfully', {
                            variant: 'success'
                          });
                          handleClose();
                        }
                        if (data.type === 'exam/updateExam/rejected') {
                          enqueueSnackbar(data.error.message, {
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
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8} direction="column" spacing={2} container>
                      {/* Title Input */}
                      <Grid item>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="title">Title</InputLabel>
                          <OutlinedInput
                            id="title"
                            type="text"
                            multiline
                            value={values.title}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            placeholder="Enter Your Title Here"
                            fullWidth
                            sx={{ borderRadius: '14px' }}
                            error={Boolean(touched.title && errors.title)}
                          />
                          {touched.title && errors.title && (
                            <FormHelperText error id="standard-weight-helper-text-title">
                              {errors.title}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      {/* Description Input */}
                      <Grid item>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="description">Description</InputLabel>
                          <OutlinedInput
                            id="description"
                            type="text"
                            multiline
                            value={values.description}
                            name="description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{ borderRadius: '14px' }}
                            placeholder="Enter Your description Here"
                            fullWidth
                            error={Boolean(touched.description && errors.description)}
                          />
                          {touched.description && errors.description && (
                            <FormHelperText error id="standard-weight-helper-text-description">
                              {errors.description}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>

                      {/* Input for Start time and End time */}
                      <Grid item container direction="column" spacing={2}>
                        <Grid item xs={6}>
                          <Stack spacing={1} sx={{ width: '400px' }}>
                            <InputLabel htmlFor="start_time">Start Time</InputLabel>
                            <DatePicker
                              id="start_time"
                              name="start_time"
                              defaultValue={values.start_time}
                              onChange={(date, dateString) => {
                                setFieldValue('start_time', dateString);
                              }}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}
                              showTime
                              needConfirm={false}
                              status={Boolean(touched.start_time && errors.start_time) && 'error'}
                            />
                            {touched.start_time && errors.start_time && (
                              <FormHelperText error id="standard-weight-helper-text-start_time">
                                {errors.start_time}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                        <Grid item xs={6}>
                          <Stack spacing={1} sx={{ width: '400px' }}>
                            <InputLabel htmlFor="end_time">End Time</InputLabel>
                            <DatePicker
                              id="end_time"
                              name="end_time"
                              defaultValue={values.end_time}
                              onChange={(date, dateString) => {
                                setFieldValue('end_time', dateString);
                              }}
                              getPopupContainer={(triggerNode) => triggerNode.parentNode}
                              showTime
                              needConfirm={false}
                              status={Boolean(touched.end_time && errors.end_time) && 'error'}
                            />
                            {touched.end_time && errors.end_time && (
                              <FormHelperText error id="standard-weight-helper-text-end_time">
                                {errors.end_time}
                              </FormHelperText>
                            )}
                          </Stack>
                        </Grid>
                      </Grid>
                    </Grid>

                    {/* Payment and create or update exam */}
                    <Grid
                      item
                      xs={12}
                      md={4}
                      direction="column"
                      display="flex"
                      justifyContent="flex-end"
                    >
                      {/* Delete Button */}
                      {modalType === 'Update' && (
                        <>
                          <AnimateButton>
                            <Button
                              disableElevation
                              fullWidth
                              size="large"
                              variant="contained"
                              color="error"
                              sx={{ mb: 2 }}
                              onClick={() => {
                                handleConfimationOpen();
                              }}
                            >
                              Delete Exam
                            </Button>
                          </AnimateButton>
                          <AnimateButton>
                            <Button
                              disableElevation
                              disabled={isSubmitting}
                              fullWidth
                              size="large"
                              type="submit"
                              variant="contained"
                              color="primary"
                            >
                              Update Exam
                            </Button>
                          </AnimateButton>
                        </>
                      )}
                      {modalType === 'Create' && (
                        <MainPaper sx={{ p: 2 }}>
                          <Stack sx={{ mb: 2 }} spacing={2}>
                            <Stack sx={{ mb: 2 }} spacing={2}>
                              <Stack direction="row" spacing={2}>
                                <Stack spacing={1}>
                                  <Typography htmlFor="max_examinees">Max Examinees:</Typography>
                                  <OutlinedInput
                                    id="max_examinees"
                                    type="number"
                                    value={values.max_examinees}
                                    name="max_examinees"
                                    disabled={paid ? true : false}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    sx={{ width: '100px', borderRadius: 4 }}
                                    error={Boolean(touched.max_examinees && errors.max_examinees)}
                                  />
                                  {touched.max_examinees && errors.max_examinees && (
                                    <FormHelperText
                                      error
                                      id="standard-weight-helper-text-max_examinees"
                                    >
                                      {errors.max_examinees}
                                    </FormHelperText>
                                  )}
                                </Stack>

                                {/* <Stack spacing={2}>
                                <Typography variant="h5" htmlFor="point">
                                  Code:
                                </Typography>
                                <OutlinedInput
                                  id="point"
                                  type="text"
                                  value={paymentCode}
                                  name="point"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  sx={{ width: '130px', borderRadius: 4 }}
                                  error={Boolean(touched.point && errors.point)}
                                />
                              </Stack> */}
                              </Stack>

                              <Stack direction="row">
                                {paid ? (
                                  <Chip label="Paid" color="success" />
                                ) : (
                                  <Chip label="Not Paid" color="error" />
                                )}
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => {
                                    checkPayment(paymentCode);
                                  }}
                                >
                                  <RefreshIcon />
                                </IconButton>
                              </Stack>
                            </Stack>
                            <Stack direction="row" spacing={2}>
                              <Typography>Total Amount :</Typography>
                              <Typography variant="h5">
                                {' '}
                                {values.max_examinees * 0.5} Birr{' '}
                              </Typography>
                            </Stack>
                            <AnimateButton>
                              <Button
                                disableElevation
                                disabled={isSubmitting}
                                fullWidth
                                size="large"
                                onClick={() => {
                                  payWithChapa(values.max_examinees * 0.5, values.title);
                                }}
                                variant="outlined"
                                color="success"
                              >
                                Pay with Chapa
                              </Button>
                            </AnimateButton>
                            <AnimateButton>
                              <Button
                                disableElevation
                                disabled={isSubmitting || !paid}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="primary"
                              >
                                Create Exam
                              </Button>
                            </AnimateButton>
                          </Stack>
                        </MainPaper>
                      )}
                      {/* Create or Update Button */}
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
    </>
  );
};

export default ExamForm;
