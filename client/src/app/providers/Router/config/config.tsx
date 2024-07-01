import { type RouteProps } from 'react-router-dom';
import { AppRoutes, RouterPath } from '../conts/routers';

import Main from '@/pages/Main/components/Main';
import { RegistrationPage } from '@/pages/Registration';
import { LoginPage } from '@/pages/Login';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ChangePasswordPage } from '@/pages/ChangePassword';

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RouterPath.main,
    element: <Main />,
  },
  [AppRoutes.Register]: {
    path: RouterPath.Registration,
    element: <RegistrationPage />,
  },
  [AppRoutes.Login]: {
    path: RouterPath.login,
    element: <LoginPage />,
  },
  [AppRoutes.Reset]: {
    path: RouterPath['forgot-password'],
    element: <ForgotPassword />,
  },
  [AppRoutes.ChangePass]: {
    path: RouterPath['change-password'],
    element: <ChangePasswordPage />,
  },
};
