import { FormPanel } from '@/shared/components/FormPanel';
import { Input } from '@/shared/components/Input';
import { useCallback, useEffect, useState } from 'react';
import {
  ChangePasswordError,
  useChangePassword,
} from '../api/changePasswordApi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getRouteLogin } from '@/app/providers/Router/conts/routers';

const ChangePassword = () => {
  const [password, setPassword] = useState('');

  const [searchParams] = useSearchParams();

  const token = searchParams.get('key');

  const [changePasswordMutation, { isLoading, isError, isSuccess, error }] =
    useChangePassword();

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      navigate(getRouteLogin());
    }
  }, [isSuccess, navigate]);

  const onSubmit = useCallback(async () => {
    try {
      await changePasswordMutation({
        token: String(token),
        newPassword: password,
      });
    } catch (error) {
      console.error(error);
    }
  }, [changePasswordMutation, password, token]);

  if (!token) {
    return null;
  }

  return (
    <div className='flex w-full items-center justify-center py-20 text-black'>
      <FormPanel
        onSubmit={onSubmit}
        error={error ? (error as ChangePasswordError)?.data.message : ''}
        className='w-1/2 py-20'
        title='ChangePassword'
        buttonText='Change password'
        buttonProps={{ className: 'w-fit' }}
      >
        <Input
          iconClassName='absolute top-1/2 right-[20%]'
          value={password}
          onChange={setPassword}
          type='password'
          containerClassName='flex flex-col items-center gap-2 w-'
          label={'Please enter your email below to change password: '}
          className={'w-2/3'}
          isRequired
        />
      </FormPanel>
    </div>
  );
};

export default ChangePassword;
