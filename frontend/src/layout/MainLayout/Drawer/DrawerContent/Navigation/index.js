// material-ui
import { Box } from '@mui/material';
import { Plus } from 'react-huge-icons/solid';

// project import
import NavGroup from './NavGroup';
import menuItem from 'menu-items';

// component import
import MainButton from 'components/MainButton';

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

const Navigation = () => {
  const navGroups = menuItem.items.map((item) => {
    return <NavGroup key={item.id} item={item} />;
  });

  return (
    <Box sx={{ pt: 2 }}>
      <MainButton name="Create Exam" icon={<Plus />} />
      {navGroups}
    </Box>
  );
};

export default Navigation;
