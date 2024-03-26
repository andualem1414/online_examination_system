import { Link, useLocation } from 'react-router-dom';

// material-ui
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Grid, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import { useSelector } from 'react-redux';

// project imports

// ==============================|| BREADCRUMBS ||============================== //

const Breadcrumbs = () => {
  const location = useLocation();
  const paths = location.pathname.split('/');
  const user = useSelector((state) => state.user.userDetails);

  const breadcrumbs = paths.map((path, index) => ({
    label: path
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
    path: paths.slice(0, index + 1).join('/')
  }));

  const title = breadcrumbs.at(-1).label;

  return (
    <Box border={false} sx={{ mb: 3, bgcolor: 'transparent' }} content={false}>
      <Grid
        container
        direction="column"
        justifyContent="flex-start"
        alignItems="flex-start"
        spacing={1}
      >
        <Grid item>
          <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
            <Typography
              component={Link}
              to={user.user_type === 'ADMIN' ? '/admin-exams' : '/my-exams'}
              color="textSecondary"
              variant="h6"
              sx={{ textDecoration: 'none' }}
            >
              Home
            </Typography>
            {breadcrumbs.map(
              (item, index) =>
                item.label.length && (
                  <Typography
                    component={Link}
                    key={index}
                    to={item.path || '#'}
                    variant="h6"
                    sx={{ textDecoration: 'none' }}
                    color={index === breadcrumbs.length - 1 ? 'textPrimary' : 'textSecondary'}
                  >
                    {item.label}
                  </Typography>
                )
            )}
          </MuiBreadcrumbs>
        </Grid>

        <Grid item sx={{ mt: 1 }}>
          <Typography variant="h5">{title}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Breadcrumbs;
