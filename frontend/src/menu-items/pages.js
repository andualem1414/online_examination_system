// assets
import {
  LoginOutlined,
  ProfileOutlined,
  AntDesignOutlined,
  BgColorsOutlined
} from '@ant-design/icons';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import { MenuUser, Logout } from 'react-huge-icons/outline';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  MenuUser,
  Logout,
  AntDesignOutlined,
  BgColorsOutlined,
  HistoryRoundedIcon
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'profile-settings',
  title: 'Profile Settings',
  type: 'group',
  children: [
    {
      id: 'my-profile',
      title: 'My Profile',
      type: 'item',
      url: '/my-profile',
      icon: icons.MenuUser
    },
    {
      id: 'recent-actions',
      title: 'Recent Actions',
      type: 'item',
      url: '/recent-actions',
      icon: icons.HistoryRoundedIcon
    }
    // {
    //   id: 'ant-icons',
    //   title: 'Ant Icons',
    //   type: 'item',
    //   url: '/icons/ant',
    //   icon: icons.AntDesignOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'util-color',
    //   title: 'Color',
    //   type: 'item',
    //   url: '/color',
    //   icon: icons.BgColorsOutlined
    // }
  ]
};

export default pages;
