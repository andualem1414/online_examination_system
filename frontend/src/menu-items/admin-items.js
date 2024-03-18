import { DashboardOutlined } from '@ant-design/icons';
import { ClipboardList } from 'react-huge-icons/outline';
import { CalendarDot } from 'react-huge-icons/outline';
import { Exam } from 'react-huge-icons/outline';
import { Share } from 'react-huge-icons/outline';

import pages from './pages';
// icons
const icons = {
  DashboardOutlined,
  ClipboardList,
  Exam,
  CalendarDot,
  Share
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'admin-exams',
      title: 'Exams',
      type: 'item',
      url: '/admin-exams',
      icon: icons.Exam,
      breadcrumbs: true
    },
    {
      id: 'admin-users',
      title: 'Users',
      type: 'item',
      url: '/admin-users',
      icon: icons.Share,
      breadcrumbs: true
    },
    {
      id: 'admin-payments',
      title: 'Payments',
      type: 'item',
      url: '/admin-payments',
      icon: icons.CalendarDot,
      breadcrumbs: true
    },
    {
      id: 'rules',
      title: 'Rules',
      type: 'item',
      url: '/rules',
      icon: icons.ClipboardList,
      breadcrumbs: true
    }
  ]
};

const adminItems = {
  items: [dashboard, pages]
};

export default adminItems;
