import { Link } from 'react-router-dom';

// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project import
import AuthLogin from './auth-forms/AuthLogin';
import AuthWrapper from './AuthWrapper';

// ================================|| LOGIN ||================================ //

const Login = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h3" textAlign="center">
          Login
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AuthLogin email="user1@gmail.com" password="a123434!" navigatePath="/my-exams" />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default Login;
