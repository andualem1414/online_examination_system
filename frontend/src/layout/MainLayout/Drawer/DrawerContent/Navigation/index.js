// material-ui
import { Box, Chip, Typography, Stack } from '@mui/material';
import { Plus } from 'react-huge-icons/solid';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';
import adminItems from 'menu-items/admin-items';

// component import
import MainButton from 'layout/MainLayout/Drawer/DrawerContent/Navigation/MainButton';
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItem.items.map((item) => {
    return <NavGroup key={item.id} item={item} />;
  });

  const adminNavGroups = adminItems.items.map((item) => {
    return <NavGroup key={item.id} item={item} />;
  });

  const user = useSelector((state) => state.user.userDetails);

  return (
    <Box sx={{ pt: 2 }}>
      {user.user_type === 'EXAMINER' && <MainButton name="Create Exam" icon={<Plus />} />}
      {user.user_type === 'EXAMINEE' && <MainButton name="Join Exam" icon={<Plus />} />}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
        {user.user_type === 'ADMIN' && (
          <Stack direction="column" spacing={2}>
            <Chip
              sx={{ px: 2, py: 2.5 }}
              label={<Typography variant="h5">DB Panel</Typography>}
              color="error"
              onClick={() => (window.location.href = process.env.REACT_APP_DATABASE_URL + '/admin')}
              icon={<StorageRoundedIcon />}
            />
            <Chip
              sx={{ px: 2, py: 2.5 }}
              label={<Typography variant="h5">Chapa Panel</Typography>}
              color="success"
              onClick={() =>
                (window.location.href = 'https://dashboard.chapa.co/dashboard/overview')
              }
              icon={<StorageRoundedIcon />}
            />
          </Stack>
        )}
      </Box>

      {user.user_type === 'ADMIN' ? adminNavGroups : navGroups}
    </Box>
  );
};

export default Navigation;
