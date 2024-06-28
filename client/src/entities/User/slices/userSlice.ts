import { createSlice } from '@reduxjs/toolkit';
import { accessToken, refreshToken } from '../types/user';
import { loginUserApi, UserData } from '../api/userApi';
import { Cookies } from 'react-cookie';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/shared/consts/cookies';
export interface UserSchema {
  authData?: UserData;
  accessToken?: accessToken;
  refreshToken?: refreshToken;
  _mounted: boolean;
}

const initialState: UserSchema = {
  _mounted: false,
};

const cookies = new Cookies();

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        loginUserApi.endpoints.login.matchFulfilled,
        (state, { payload }) => {
          if (payload.user) {
            state.authData = payload.user;
            if (payload.accessToken) {
              cookies.set(ACCESS_TOKEN, payload.accessToken, { path: '/' });
              state.accessToken = payload.accessToken;
            }

            if (payload.refreshToken) {
              cookies.set(REFRESH_TOKEN, payload.refreshToken, { path: '/' });
              state.refreshToken = payload.refreshToken;
            }
          }
        }
      )
      .addMatcher(
        loginUserApi.endpoints.initUser.matchFulfilled,
        (state, { payload }) => {
          state.authData = payload;
        }
      );
  },
});

export const { actions: userActions } = userSlice;
export const { reducer: userReducer } = userSlice;
