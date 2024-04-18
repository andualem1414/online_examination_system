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
const QuestionDetails = Loadable(lazy(() => import('pages/question-details')));
const ExamineeResult = Loadable(lazy(() => import('pages/examinee-result')));
const PublicExam = Loadable(lazy(() => import('pages/public-exam')));
const PublicExamDetails = Loadable(lazy(() => import('pages/public-exam-details')));
const PublicExamQuestionDetails = Loadable(
  lazy(() => import('pages/public-exam-question-details'))
);
const MyProfile = Loadable(lazy(() => import('pages/my-profile')));
const RecentActions = Loadable(lazy(() => import('pages/recent-actions')));
const ExamSchedules = Loadable(lazy(() => import('pages/exam-schedules')));
const Rules = Loadable(lazy(() => import('pages/rules')));
const QuestionPool = Loadable(lazy(() => import('pages/question-pool')));

// Admin

const AdminUsers = Loadable(lazy(() => import('pages/admin-users')));
const AdminExams = Loadable(lazy(() => import('pages/admin-exams')));
const AdminPayments = Loadable(lazy(() => import('pages/admin-payments')));

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
          element: <MyExams />
        },
        {
          path: 'color',
          element: <Color />
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
        },
        {
          path: 'my-exams/exam-details/question-details',
          element: <QuestionDetails />
        },
        {
          path: 'my-exams/exam-details/examinee-result/question-details',
          element: <QuestionDetails />
        },
        {
          path: 'public-exams',
          element: <PublicExam />
        },
        {
          path: 'public-exams/public-exam-details',
          element: <PublicExamDetails />
        },
        {
          path: 'public-exams/public-exam-details/question-details',
          element: <PublicExamQuestionDetails />
        },
        {
          path: 'exam-schedules',
          element: <ExamSchedules />
        }
      ]
    },
    {
      element: <RequireAuth allowedTypes={['EXAMINER']} />,
      children: [
        {
          path: 'my-exams/exam-details/add-question',
          element: <AddQuestion />
        },
        {
          path: 'my-exams/exam-details/examinee-result',
          element: <ExamineeResult />
        },
        {
          path: 'question-pool',
          element: <QuestionPool />
        }
      ]
    },
    {
      element: <RequireAuth allowedTypes={['ADMIN']} />,
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'admin-exams',
          element: <AdminExams />
        },
        {
          path: 'admin-users',
          element: <AdminUsers />
        },
        {
          path: 'admin-payments',
          element: <AdminPayments />
        }
      ]
    },
    {
      element: <RequireAuth allowedTypes={['ADMIN', 'EXAMINER', 'EXAMINEE']} />,
      children: [
        {
          path: 'my-profile',
          element: <MyProfile />
        },
        {
          path: 'rules',
          element: <Rules />
        },
        {
          path: 'recent-actions',
          element: <RecentActions />
        }
      ]
    }
  ]
};

export default MainRoutes;
