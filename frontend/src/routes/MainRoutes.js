import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MainLayout from 'layout/MainLayout';
import RequireAuth from 'layout/RequireAuth';

// render - dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/SamplePage')));

// render - utilities
const Typography = Loadable(lazy(() => import('pages/components-overview/Typography')));
const Color = Loadable(lazy(() => import('pages/components-overview/Color')));
const Shadow = Loadable(lazy(() => import('pages/components-overview/Shadow')));
const AntIcons = Loadable(lazy(() => import('pages/components-overview/AntIcons')));

const MyExams = Loadable(lazy(() => import('pages/my-exams')));
const ExamDetails = Loadable(lazy(() => import('pages/exam-details')));
const AddQuestion = Loadable(lazy(() => import('pages/add-question')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      element: <RequireAuth allowedTypes={['EXAMINEE', 'EXAMINER']} />,
      children: [
        {
          path: '/',
          element: <DashboardDefault />
        },
        {
          path: 'color',
          element: <Color />
        },
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'sample-page',
          element: <SamplePage />
        },
        {
          path: 'shadow',
          element: <Shadow />
        },
        {
          path: 'typography',
          element: <Typography />
        },
        {
          path: 'icons/ant',
          element: <AntIcons />
        },
        {
          path: 'my-exams',
          element: <MyExams />
        },
        {
          path: 'my-exams/exam-details',
          element: <ExamDetails />
        }
      ]
    },
    {
      element: <RequireAuth allowedTypes={['EXAMINER']} />,
      children: [
        {
          path: 'my-exams/exam-details/add-question',
          element: <AddQuestion />
        }
      ]
    }
  ]
};

export default MainRoutes;
