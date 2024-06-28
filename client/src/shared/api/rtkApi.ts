import { refreshToken, accessToken } from './../../entities/User/types/user';
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { Cookies } from 'react-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../consts/cookies';
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes';

const cookies = new Cookies();

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: {}) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = cookies.get(REFRESH_TOKEN);
    const refreshResult: QueryReturnValue<
      any,
      FetchBaseQueryError,
      FetchBaseQueryMeta
    > = await baseQuery(
      {
        url: '/refresh',
        headers: { authorization: `Bearer ${refreshToken}` },
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      cookies.set(ACCESS_TOKEN, refreshResult.data.accessToken);
      result = await baseQuery(args, api, extraOptions);
    } else {
      throw new Error('please re-login');
    }
  }

  return result;
};
export const rtkApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({}),
});

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  prepareHeaders: (headers) => {
    const accessToken = cookies.get(ACCESS_TOKEN);

    if (!headers.has('Authorization') && accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return headers;
  },
});
