import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography, Box, Tab, Tabs } from '@mui/material';

// project import
import AuthRegister from './auth-forms/AuthRegister';
import AuthWrapper from './AuthWrapper';

import PropTypes from 'prop-types';

// ================================|| REGISTER ||================================ //
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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

const Register = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <AuthWrapper>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
            sx={{ mb: { xs: -0.5, sm: 0.5 } }}
          >
            <Typography variant="h3">Sign up as:</Typography>
            <Typography
              component={Link}
              to="/login"
              variant="body1"
              sx={{ textDecoration: 'none' }}
              color="primary"
            >
              Already have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Examiner" {...a11yProps(0)} />
              <Tab label="Examinee" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <AuthRegister user_type="EXAMINER" />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AuthRegister user_type="EXAMINEE" />
          </CustomTabPanel>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default Register;
