import { type RouteProps } from 'react-router-dom';
import { AppRoutes, RouterPath } from '../conts/routers';

import Main from '@/pages/Main/components/Main';
import { Registration } from '@/pages/Registration';

export const routeConfig: Record<AppRoutes, RouteProps> = {
  [AppRoutes.MAIN]: {
    path: RouterPath.main,
    element: <Main />,
  },
  [AppRoutes.Register]: {
    path: RouterPath.Registration,
    element: <Registration />,
  },
};
