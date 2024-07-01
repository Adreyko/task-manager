import { FormPanel } from '@/shared/components/FormPanel';
import { Input } from '@/shared/components/Input';
import { useCallback, useState } from 'react';
import { Card } from '@/shared/components/Card';
import { CheckCircle } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { getRouteMain } from '@/app/providers/Router/conts/routers';
import { Button } from '@/shared/components/Button';
import { useSendResetEmailApiPassword } from '../api/sendResetPassword';
import { ChangePasswordError } from '@/pages/ChangePassword/api/changePasswordApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const [
    sendResetEmailPasswordMutation,
    { isLoading, isError, isSuccess, error },
  ] = useSendResetEmailApiPassword();

  const onSubmit = useCallback(async () => {
    try {
      await sendResetEmailPasswordMutation({ email });
    } catch (error) {
      console.error(error);
    }
  }, [email, sendResetEmailPasswordMutation]);

  return (
    <div className='flex w-full items-center justify-center py-20 text-black'>
      {isSuccess ? (
        <Card className='text-2xl text-green-500 h-fit rounded-lg flex items-center py-10 gap-4 flex-col mx-auto border border-black bg-white w-1/2'>
          Email sent successfully
          <CheckCircle size={200} />
          <Link to={getRouteMain()}>
            <Button variant={'primary'} size={'large'}>
              Go back to main page
            </Button>
          </Link>
        </Card>
      ) : (
        <FormPanel
          onSubmit={onSubmit}
          buttonProps={{ className: 'w-fit' }}
          className='w-1/2'
          title='Forgot password?'
          buttonText='send email'
          isLoading={isLoading}
          error={error ? (error as ChangePasswordError)?.data.message : ''}
        >
          <Input
            value={email}
            onChange={setEmail}
            containerClassName='flex flex-col items-center gap-2'
            label={'Please enter your email below to change password: '}
            className={'w-2/3'}
            type='email'
            isRequired
          />
        </FormPanel>
      )}
    </div>
  );
};

export default ForgotPassword;
