import React from 'react';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import {
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  TextField,
  Avatar,
  Tab,
  Tabs
} from '@mui/material';

// third party
import * as Yup from 'yup';
import { Formik } from 'formik';

import MainPaper from 'components/MainPaper';
import AnimateButton from 'components/@extended/AnimateButton';
import TableComponent from 'components/TableComponent';

import PropTypes from 'prop-types';

import { fetchPayments } from 'store/reducers/payments';
import { updateUser } from 'store/reducers/user';
import { axiosPrivate } from 'api/axios';
import { useDispatch } from 'react-redux';

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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

const MyProfile = () => {
  const userDetails = useSelector((state) => state.user.userDetails);
  const dispatch = useDispatch();
  console.log(userDetails);
  const payments = useSelector((state) => state.payment.payments);
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const changePassword = async (data) => {
    try {
      const response = await axiosPrivate.post(`users/change-password/`, data);
      return response.data;
    } catch (error) {
      return error?.response;
    }
  };
  useEffect(() => {
    dispatch(fetchPayments(userDetails.id));
  }, []);

  useEffect(() => {
    console.log(payments);
  }, [payments]);

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
      sx: { bgcolor: index === value && 'primary.lighter' }
    };
  };
  const chipColorSelector = (amount) => {
    if (amount > 100) {
      return 'warning';
    } else {
      return 'primary';
    }
  };

  const headCells = [
    {
      id: 'exam.title',
      numeric: false,
      label: 'Title'
    },
    {
      id: 'created_at',
      numeric: false,
      date: true,
      label: 'Date'
    },
    {
      id: 'amount',
      numeric: true,
      label: 'Amount',
      chip: true,
      chipColor: chipColorSelector
    }
  ];
  const handleRowClick = (event, id) => {
    let payment = payments.find((p) => p.id === id);
    checkPaymentAPI(payment.payment_code).then((response) => {
      let url = `https://checkout.chapa.co/checkout/test-payment-receipt/${response.reference}`;
      window.open(url, '_blank');
    });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <MainPaper sx={{ p: 2, height: '432px' }}>
          <Stack direction="column" display="flex" alignItems="center" spacing={2} sx={{ mb: 6 }}>
            {userDetails?.profile_picture ? (
              <Avatar
                alt="profile user"
                src={userDetails.profile_picture}
                sx={{ mt: 2, width: 100, height: 100 }}
              />
            ) : (
              <Avatar alt="profile user" sx={{ mt: 2, width: 100, height: 100 }} />
            )}
            <Typography variant="h5">{userDetails.full_name}</Typography>
            <Typography variant="subtitle3">{userDetails.description}</Typography>
          </Stack>

          <Tabs
            variant="fullWidth"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            orientation="vertical"
            sx={{
              width: '100%',
              borderRight: 1,
              borderColor: 'divider'
            }}
          >
            <Tab label="Personal Information" {...a11yProps(0)} />
            {userDetails.user_type === 'EXAMINER' && <Tab label="Payments" {...a11yProps(1)} />}
            <Tab label="Change Password" {...a11yProps(2)} />
          </Tabs>
        </MainPaper>
      </Grid>
      <Grid item xs={8}>
        <MainPaper sx={{ p: 3 }}>
          <CustomTabPanel value={value} index={0}>
            <Formik
              initialValues={{
                email: userDetails?.email,
                first_name: userDetails?.first_name,
                last_name: userDetails?.last_name,

                description: userDetails?.description,
                submit: null
              }}
              validationSchema={Yup.object().shape({
                first_name: Yup.string().max(255).required('First Name is required'),
                last_name: Yup.string().max(255).required('Last Name is required'),
                email: Yup.string()
                  .email('Must be a valid email')
                  .max(255)
                  .required('Email is required'),
                description: Yup.string().max(255)
              })}
              onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                console.log(values);

                try {
                  dispatch(updateUser({ id: userDetails.id, data: values })).then((data) => {
                    console.log(data);
                    if (data.type === 'user/updateUser/fulfilled') {
                      enqueueSnackbar('Details Updated successfully', { variant: 'success' });
                    }
                  });
                  console.log(userDetails);

                  setStatus({ success: false });
                  setSubmitting(false);
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                setFieldValue
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={5} display="flex" justifyContent="flex-end">
                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="first_name">First Name*</InputLabel>
                        <OutlinedInput
                          id="first_name"
                          type="text"
                          value={values.first_name}
                          name="first_name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ borderRadius: '14px' }}
                          placeholder="John"
                          fullWidth
                          error={Boolean(touched.first_name && errors.first_name)}
                        />
                        {touched.first_name && errors.first_name && (
                          <FormHelperText error id="helper-text-first_name-signup">
                            {errors.first_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Stack spacing={1}>
                        <InputLabel htmlFor="last_name">Last Name*</InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.last_name && errors.last_name)}
                          id="last_name"
                          type="text"
                          value={values.last_name}
                          name="last_name"
                          onBlur={handleBlur}
                          sx={{ borderRadius: '14px' }}
                          onChange={handleChange}
                          placeholder="Doe"
                          inputProps={{}}
                        />
                        {touched.last_name && errors.last_name && (
                          <FormHelperText error id="helper-text-last_name-signup">
                            {errors.last_name}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    {/* <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="company-signup">Company</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.company && errors.company)}
                    id="company-signup"
                    value={values.company}
                    name="company"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Demo Inc."
                    inputProps={{}}
                  />
                  {touched.company && errors.company && (
                    <FormHelperText error id="helper-text-company-signup">
                      {errors.company}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid> */}
                    <Grid item xs={12}>
                      <Stack spacing={1} width="50%">
                        <InputLabel htmlFor="email">Email Address*</InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                          id="email"
                          type="email"
                          disabled={true}
                          value={values.email}
                          name="email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ borderRadius: '14px' }}
                          placeholder="demo@company.com"
                          inputProps={{}}
                        />
                        {touched.email && errors.email && (
                          <FormHelperText error id="helper-text-email-signup">
                            {errors.email}
                          </FormHelperText>
                        )}
                      </Stack>
                    </Grid>

                    <Grid item xs={12}>
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
                          placeholder="Discribe Your self"
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

                    {/* <Grid item xs={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid> */}
                    {errors.submit && (
                      <Grid item xs={12}>
                        <FormHelperText error>{errors.submit}</FormHelperText>
                      </Grid>
                    )}
                    <Grid item xs={4}>
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
                          Update Account
                        </Button>
                      </AnimateButton>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={userDetails.user_type === 'EXAMINEE' ? 2 : 1}>
            {payments.length > 0 ? (
              <TableComponent
                headCells={headCells}
                rows={payments}
                title="Payments"
                handleRowClick={handleRowClick}
              />
            ) : (
              <Typography textAlign="center" variant="h5">
                {' '}
                No Payments found
              </Typography>
            )}
          </CustomTabPanel>
          <CustomTabPanel value={value} index={userDetails.user_type === 'EXAMINEE' ? 1 : 2}>
            <Formik
              initialValues={{
                old_password: '',
                new_password: '',
                confirm_new_password: '',

                submit: null
              }}
              validationSchema={Yup.object().shape({
                old_password: Yup.string().max(255).required('old password is required'),
                new_password: Yup.string().max(255).required('new password is required'),
                confirm_new_password: Yup.string().max(255).required('confirm password required')
              })}
              onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                console.log(values);

                try {
                  changePassword(values).then((response) => {
                    console.log(response);
                    if (response.status === 400) {
                      enqueueSnackbar(response.data.error, { variant: 'error' });
                    } else {
                      enqueueSnackbar('Password Updated successfully', { variant: 'success' });
                    }
                  });
                  // dispatch(updateUser({ id: userDetails.id, data: values })).then((data) => {
                  //   console.log(data);
                  //   if (data.type === 'user/updateUser/fulfilled') {
                  //     enqueueSnackbar('Details Updated successfully', { variant: 'success' });
                  //   }
                  // });

                  setStatus({ success: false });
                  setSubmitting(false);
                } catch (err) {
                  console.error(err);
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                }
              }}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values,
                setFieldValue
              }) => (
                <form noValidate onSubmit={handleSubmit}>
                  <Grid container spacing={5} display="flex" justifyContent="center">
                    <Grid
                      item
                      container
                      xs={12}
                      md={6}
                      display="flex"
                      justifyContent="center"
                      spacing={4}
                    >
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="old_password">Old Password</InputLabel>
                          <OutlinedInput
                            id="old_password"
                            type="password"
                            value={values.old_password}
                            name="old_password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{ borderRadius: '14px' }}
                            placeholder="Old Password"
                            fullWidth
                            error={Boolean(touched.old_password && errors.old_password)}
                          />
                          {touched.old_password && errors.old_password && (
                            <FormHelperText error id="helper-text-old_password-signup">
                              {errors.old_password}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="new_password">New Password</InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(touched.new_password && errors.new_password)}
                            id="new_password"
                            type="password"
                            value={values.new_password}
                            name="new_password"
                            onBlur={handleBlur}
                            sx={{ borderRadius: '14px' }}
                            onChange={handleChange}
                            placeholder="New Password"
                            inputProps={{}}
                          />
                          {touched.new_password && errors.new_password && (
                            <FormHelperText error id="helper-text-new_password-signup">
                              {errors.new_password}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={12}>
                        <Stack spacing={1}>
                          <InputLabel htmlFor="confirm_new_password">Confirm password</InputLabel>
                          <OutlinedInput
                            fullWidth
                            error={Boolean(
                              touched.confirm_new_password && errors.confirm_new_password
                            )}
                            id="confirm_new_password"
                            type="password"
                            value={values.confirm_new_password}
                            name="confirm_new_password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            sx={{ borderRadius: '14px' }}
                            placeholder="Confirm Password"
                            inputProps={{}}
                          />
                          {touched.confirm_new_password && errors.confirm_new_password && (
                            <FormHelperText error id="helper-text-confirm_new_password-signup">
                              {errors.confirm_new_password}
                            </FormHelperText>
                          )}
                        </Stack>
                      </Grid>
                      <Grid item xs={8}>
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
                            Update Password
                          </Button>
                        </AnimateButton>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </CustomTabPanel>
        </MainPaper>
      </Grid>
    </Grid>
  );
};

export default MyProfile;
