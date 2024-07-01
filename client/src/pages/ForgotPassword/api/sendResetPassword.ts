import { rtkApi } from '@/shared/api/rtkApi';

const sendResetEmailApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    sendResetEmailApi: build.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: '/sendResetPasswordMail',
        method: 'POST',
        body: {
          email,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useSendResetEmailApiPassword =
  sendResetEmailApi.useSendResetEmailApiMutation;
