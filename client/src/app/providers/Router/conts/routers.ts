export enum AppRoutes {
  MAIN = 'main',
  Register = 'Registration',
  Login = 'login',
  Reset = 'forgot-password',
  ChangePass = 'change-password',
}

export const getRouteMain = () => '/';
export const getRouteRegistration = () => '/registration';
export const getRouteLogin = () => '/login';
export const getRouteForgotPass = () => '/forgot-password';
export const getRouteChangePass = () => '/change-password';

export const RouterPath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: getRouteMain(),
  [AppRoutes.Register]: getRouteRegistration(),
  [AppRoutes.Login]: getRouteLogin(),
  [AppRoutes.Reset]: getRouteForgotPass(),
  [AppRoutes.ChangePass]: getRouteChangePass(),
};
