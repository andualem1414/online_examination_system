// assets
import { LoginOutlined, ProfileOutlined, AntDesignOutlined, BgColorsOutlined } from '@ant-design/icons';
import { MenuUser, Logout } from 'react-huge-icons/outline';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined,
  MenuUser,
  Logout,
  AntDesignOutlined,
  BgColorsOutlined
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
      id: 'logout',
      title: 'Logout',
      type: 'item',
      url: '/logout',
      icon: icons.Logout
    },
    {
      id: 'ant-icons',
      title: 'Ant Icons',
      type: 'item',
      url: '/icons/ant',
      icon: icons.AntDesignOutlined,
      breadcrumbs: false
    },
    {
      id: 'util-color',
      title: 'Color',
      type: 'item',
      url: '/color',
      icon: icons.BgColorsOutlined
    }
  ]
};

export default pages;
