export enum AppRoutes {
  MAIN = 'main',
  Register = 'Registration',
  Login = 'login',
}

export const getRouteMain = () => '/';
export const getRegistration = () => '/registration';
export const getLogin = () => '/login';

export const RouterPath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: getRouteMain(),
  [AppRoutes.Register]: getRegistration(),
  [AppRoutes.Login]: getLogin(),
};
