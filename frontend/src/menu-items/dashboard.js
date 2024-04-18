// assets
import { DashboardOutlined } from '@ant-design/icons';
import { ClipboardList } from 'react-huge-icons/outline';
import { CalendarDot } from 'react-huge-icons/outline';
import { Exam } from 'react-huge-icons/outline';
import { Share } from 'react-huge-icons/outline';

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
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'my-exams',
      title: 'My Exams',
      type: 'item',
      url: '/my-exams',
      icon: icons.Exam,
      breadcrumbs: true
    },
    {
      id: 'question-pool',
      title: 'My Question Pool',
      type: 'item',
      url: '/question-pool',
      icon: icons.ClipboardList,
      breadcrumbs: true
    },
    {
      id: 'public-exams',
      title: 'Public Exams',
      type: 'item',
      url: '/public-exams',
      icon: icons.Share,
      breadcrumbs: true
    },
    {
      id: 'exam-schedules',
      title: 'Exam Schedules',
      type: 'item',
      url: '/exam-schedules',
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

export default dashboard;
