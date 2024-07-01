import { rtkApi } from '@/shared/api/rtkApi';

export interface ChangePasswordError {
  data: { message: string };
}

const changePasswordApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    changePassword: build.mutation<
      void,
      { token: string; newPassword: string }
    >({
      query: ({ token, newPassword }) => ({
        url: `/resetPassword/${token}`,
        method: 'POST',
        body: {
          newPassword,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useChangePassword = changePasswordApi.useChangePasswordMutation;
