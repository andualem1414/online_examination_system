// material-ui
import { Box } from '@mui/material';
import { Plus } from 'react-huge-icons/solid';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// component import
import MainButton from 'layout/MainLayout/Drawer/DrawerContent/Navigation/MainButton';
import { useSelector } from 'react-redux';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItem.items.map((item) => {
    return <NavGroup key={item.id} item={item} />;
  });

  const user = useSelector((state) => state.user.userDetails);

  return (
    <Box sx={{ pt: 2 }}>
      {user.user_type === 'EXAMINER' ? (
        <MainButton name="Create Exam" icon={<Plus />} />
      ) : (
        <MainButton name="Join Exam" icon={<Plus />} />
      )}
      {navGroups}
    </Box>
  );
};

export default Navigation;
