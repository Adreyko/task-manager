import { rtkApi } from '@/shared/api/rtkApi';
import { RegisterUser } from '../types/register';

interface RegisterDataResponseSuccess {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
}

export type ErrorMessage = 'Email is in use' | 'Username is in use' | '';

interface RegisterDataError {
  message: ErrorMessage;
  name: string;
  response: ErrorMessage;
  status: number;
}

export type RegisterUserResponse =
  | RegisterDataResponseSuccess
  | RegisterDataError;

const registerUserApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<
      RegisterUserResponse,
      Omit<RegisterUser, 'confirmPassword'>
    >({
      query: ({ username, email, password, firstName, lastName }) => ({
        url: '/auth',
        method: 'POST',
        body: {
          username,
          email,
          password,
          firstName,
          lastName,
        },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useRegisterUser = registerUserApi.useRegisterMutation;
