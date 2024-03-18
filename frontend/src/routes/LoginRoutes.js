import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import MinimalLayout from 'layout/MinimalLayout';

import Missing from 'pages/missing';
import Unauthorized from 'pages/unauthorized';
import RequireAuth from 'layout/RequireAuth';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/authentication/Login')));
const AdminLogin = Loadable(lazy(() => import('pages/authentication/AdminLogin')));
const AuthRegister = Loadable(lazy(() => import('pages/authentication/Register')));
const TakeExam = Loadable(lazy(() => import('pages/take-exam')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'login',
      element: <AuthLogin />
    },
    {
      path: 'admin/login',
      element: <AdminLogin />
    },
    {
      path: 'register',
      element: <AuthRegister />
    },
    {
      path: 'unauthorized',
      element: <Unauthorized />
    },
    {
      path: '*',
      element: <Missing />
    },
    {
      element: <RequireAuth allowedTypes={['EXAMINEE']} />,
      children: [
        {
          path: 'my-exams/exam-details/take-exam',
          element: <TakeExam />
        }
      ]
    }
  ]
};

export default LoginRoutes;
