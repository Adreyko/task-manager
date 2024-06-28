import {
  type Reducer,
  type ReducersMapObject,
  configureStore,
} from '@reduxjs/toolkit';
import { type StateSchema } from './StateSchema';
import { useDispatch } from 'react-redux';
import { createReducerManager } from './reducerManager';
import { rtkApi } from '@/shared/api/rtkApi';
import { userReducer } from '@/entities/User/slices/userSlice';

declare const $CombinedState: unique symbol;
interface EmptyObject {
  readonly [$CombinedState]?: undefined;
}
export type CombinedState<S> = EmptyObject & S;

export const createReduxStore = (
  initState?: StateSchema,
  asyncReducers?: ReducersMapObject<StateSchema>
) => {
  const rootReducer: ReducersMapObject<StateSchema> = {
    userState: userReducer,
    ...asyncReducers,
    [rtkApi.reducerPath]: rtkApi.reducer,
  };

  const reducerManager = createReducerManager(rootReducer);
  const store = configureStore<StateSchema>({
    reducer: reducerManager.reduce as Reducer<CombinedState<StateSchema>>,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(rtkApi.middleware) as any,
    preloadedState: initState,
  });

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  store.reducerManager = reducerManager;
  return store;
};

export type AppDispatch = ReturnType<typeof createReduxStore>['dispatch'];

export const useAppDispatch = useDispatch<AppDispatch>;
