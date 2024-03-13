import React from 'react';
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

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
import { dispatch } from 'store/index';
import { fetchPayments } from 'store/reducers/payments';

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
  console.log(userDetails);
  const payments = useSelector((state) => state.payment.payments);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
  const handleRowClick = () => {};

  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <MainPaper sx={{ p: 2 }}>
          <Stack direction="column" display="flex" alignItems="center" spacing={2}>
            {userDetails?.profile_picture ? (
              <Avatar
                alt="profile user"
                src={process.env.REACT_APP_DATABASE_URL + userDetails.profile_picture}
                sx={{ mt: 2, width: 100, height: 100 }}
              />
            ) : (
              <Avatar alt="profile user" sx={{ mt: 2, width: 100, height: 100 }} />
            )}
            <Typography variant="h5">{userDetails.full_name}</Typography>
            <Typography variant="h5">{userDetails.discription}</Typography>
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
          </Stack>
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

                discription: userDetails?.discription,
                submit: null
              }}
              validationSchema={Yup.object().shape({
                first_name: Yup.string().max(255).required('First Name is required'),
                last_name: Yup.string().max(255).required('Last Name is required'),
                email: Yup.string()
                  .email('Must be a valid email')
                  .max(255)
                  .required('Email is required'),
                discription: Yup.string().max(255)
              })}
              onSubmit={(values, { setErrors, setStatus, setSubmitting }) => {
                console.log(values);

                try {
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
                      <Stack spacing={1}>
                        <InputLabel htmlFor="email">Email Address*</InputLabel>
                        <OutlinedInput
                          fullWidth
                          error={Boolean(touched.email && errors.email)}
                          id="email"
                          type="email"
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
                        <InputLabel htmlFor="discription">Discription</InputLabel>
                        <OutlinedInput
                          id="discription"
                          type="text"
                          multiline
                          value={values.discription}
                          name="discription"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          sx={{ borderRadius: '14px' }}
                          placeholder="Discribe Your self"
                          fullWidth
                          error={Boolean(touched.discription && errors.discription)}
                        />
                        {touched.discription && errors.discription && (
                          <FormHelperText error id="standard-weight-helper-text-discription">
                            {errors.discription}
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
          <CustomTabPanel value={value} index={1}>
            <TableComponent
              headCells={headCells}
              rows={payments}
              title="Exams"
              handleRowClick={handleRowClick}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}></CustomTabPanel>
        </MainPaper>
      </Grid>
    </Grid>
  );
};

export default MyProfile;
