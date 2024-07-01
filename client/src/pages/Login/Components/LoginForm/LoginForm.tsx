import { Input } from '@/shared/components/Input';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import { FormPanel } from '@/shared/components/FormPanel';

import { useForm } from '@/shared/lib/hooks/useForm';
import { useLoginUser } from '@/entities/User/api/userApi';
import { Login } from '../types/login';
const initRegisterForm = {
  username: '',
  password: '',
};
const LoginForm = () => {
  const [loginForm, handleLoginForm, resetForm] =
    useForm<Login>(initRegisterForm);

  const [loginUserMutation, { isLoading, error, isError }] = useLoginUser();

  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    if (isError) {
      //@ts-ignore
      setRequestError(error?.data.message);
    } else {
      setRequestError('');
    }
  }, [isError, error]);

  const onSubmit = useCallback(() => {
    try {
      loginUserMutation(loginForm);
      if (!isError) {
        resetForm();
        setRequestError('');
      }
    } catch (error) {
      console.log(error);
    }
  }, [isError, loginForm, loginUserMutation, resetForm]);

  return (
    <div className='flex items-center justify-center text-black py-20'>
      <FormPanel
        isLoading={isLoading}
        error={requestError}
        title='Login an account'
        className='w-1/2'
        buttonText='Login'
        onSubmit={onSubmit}
      >
        <div className='flex flex-col w-2/3 text-black gap-4'>
          <Input
            isRequired
            value={loginForm.username}
            placeholder='Username'
            name='username'
            label='Username'
            className='w-full text-black'
            onChange={(value) => handleLoginForm(value, 'username')}
          />

          <Input
            name='password'
            type='password'
            onChange={(value) => handleLoginForm(value, 'password')}
            value={loginForm.password}
            isRequired
            placeholder='Password'
            label='Password'
            className='w-full text-black'
          />
        </div>
      </FormPanel>
    </div>
  );
};

export default LoginForm;
