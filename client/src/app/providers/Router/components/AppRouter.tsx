import { useCallback, Suspense, memo } from 'react';
import { Route, type RouteProps, Routes } from 'react-router-dom';
import { routeConfig } from '../config/config';

const AppRouter = () => {
  const renderWithCallback = useCallback((router: RouteProps) => {
    return (
      <Route key={router.path} path={router.path} element={router.element} />
    );
  }, []);
  const routes = Object.values(routeConfig).map(renderWithCallback);

  return (
    <Suspense>
      <Routes>{routes}</Routes>
    </Suspense>
  );
};

export default memo(AppRouter);
