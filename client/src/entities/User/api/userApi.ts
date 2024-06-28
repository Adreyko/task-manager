import { rtkApi } from '@/shared/api/rtkApi';
import { Login } from '@/pages/Login/Components/types/login';

import { User, accessToken, refreshToken } from '../types/user';
export type UserData = Omit<User, 'password'>;
export interface LoginResponse {
  user: UserData;
  accessToken: accessToken;
  refreshToken: refreshToken;
}
export const loginUserApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, Login>({
      query: ({ username, password }) => ({
        url: '/login',
        method: 'POST',
        body: {
          username,
          password,
        },
      }),
    }),
    initUser: build.query<UserData, void>({
      query: () => ({
        url: '/user',
      }),
    }),
    refreshTokens: build.query<
      { refreshToken: string; accessToken: string },
      { refreshToken: string }
    >({
      query: () => ({
        url: '/refresh',
      }),
    }),
  }),

  overrideExisting: false,
});

export const useLoginUser = loginUserApi.useLoginMutation;
export const useInitUser = loginUserApi.useInitUserQuery;
export const useRefreshTokens = loginUserApi.useRefreshTokensQuery;
