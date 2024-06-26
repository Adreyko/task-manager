export enum AppRoutes {
  MAIN = 'main',
  Register = 'Registration',
}

export const getRouteMain = () => '/';
export const getRegistration = () => '/registration';

export const RouterPath: Record<AppRoutes, string> = {
  [AppRoutes.MAIN]: getRouteMain(),
  [AppRoutes.Register]: getRegistration(),
};
