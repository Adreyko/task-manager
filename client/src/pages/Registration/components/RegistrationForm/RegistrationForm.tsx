import { Input } from '@/shared/components/Input';

import { useCallback, useState } from 'react';
import { RegisterUser } from '../../types/register';
import { ErrorMessage, useRegisterUser } from '../../api/register';
import { Link } from 'react-router-dom';

import { FormPanel } from '@/shared/components/FormPanel';
import { useForm } from '@/shared/lib/hooks/useForm';
import { Button } from '@/shared/components/Button';
import { cn } from '@/shared/lib/utils';
import { Card } from '@/shared/components/Card';
import { getRouteLogin } from '@/app/providers/Router/conts/routers';

const initRegisterForm = {
  firstName: '',
  lastName: '',
  username: '',
  password: '',
  email: '',
  confirmPassword: '',
};
const Registration = () => {
  const [registerForm, handleValueChange, resetForm] =
    useForm<RegisterUser>(initRegisterForm);

  const [registerMutation, { isLoading }] = useRegisterUser();
  const [isEmailActivation, setIsEmailActivation] = useState(false);

  const [requestError, setRequestError] = useState<ErrorMessage>('');

  const onSubmit = useCallback(async () => {
    const dataToSend: Omit<RegisterUser, 'confirmPassword'> = {
      username: registerForm.username,
      email: registerForm.email,
      password: registerForm.password,
      firstName: registerForm.firstName,
      lastName: registerForm.lastName,
    };
    setIsEmailActivation(true);

    try {
      const res = await registerMutation(dataToSend).unwrap();
      //@ts-ignore
      if (res?.message) {
        //@ts-ignore
        setRequestError(res?.message);
      } else {
        setRequestError('');
        resetForm();
        setIsEmailActivation(true);
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    registerForm.email,
    registerForm.firstName,
    registerForm.lastName,
    registerForm.password,
    registerForm.username,
    registerMutation,
    resetForm,
  ]);

  return (
    <div className='flex items-center justify-center text-black py-20'>
      <div className='relative overflow-hidden h-full w-1/2'>
        <Card
          className={cn(
            ' absolute -right-[1000%] transition-all duration-300 w-full',
            {
              'right-0 relative': isEmailActivation,
            }
          )}
        >
          <h1 className='text-2xl'>Thanks for registration in our App!</h1>
          <div className='p-20 flex flex-col'>
            <p className='text-xl'>
              We have sent you an email with a link to activate your account.
              Please check your email and click on the link to activate your
              account. You can active your account in any time.
            </p>
            <Link to={getRouteLogin()} className='self-center'>
              <Button
                variant={'primary'}
                size={'large'}
                className={'mt-10 w-fit self-center'}
              >
                Do it letter
              </Button>
            </Link>
          </div>
        </Card>

        {!isEmailActivation && (
          <FormPanel
            isLoading={isLoading}
            buttonText='Register'
            error={requestError}
            title='Register an account'
            onSubmit={onSubmit}
          >
            <div className='flex flex-col w-2/3 text-black gap-4  '>
              <div className='flex gap-10'>
                <Input
                  value={registerForm.firstName}
                  isRequired
                  onChange={(value) => handleValueChange(value, 'firstName')}
                  type='text'
                  placeholder='First name'
                  label='First name'
                  name='firstName'
                  className='w-full text-black'
                />
                <Input
                  value={registerForm.lastName}
                  onChange={(value) => handleValueChange(value, 'lastName')}
                  isRequired
                  placeholder='Last name'
                  label='Last name'
                  name='lastName'
                  className='w-full text-black'
                />
              </div>

              <Input
                value={registerForm.username}
                onChange={(value) => handleValueChange(value, 'username')}
                isRequired
                placeholder='Username'
                name='username'
                label='Username'
                className='w-full text-black'
              />
              <Input
                value={registerForm.email}
                onChange={(value) => handleValueChange(value, 'email')}
                isRequired
                type='email'
                name='email'
                placeholder='Email'
                label='Email'
                className='w-full text-black'
              />
              <div className='flex gap-10'>
                <Input
                  onChange={(value) => handleValueChange(value, 'password')}
                  value={registerForm.password}
                  name='password'
                  type='password'
                  isRequired
                  placeholder='Password'
                  label='Password'
                  className='w-full text-black'
                />
                <Input
                  validate={(value) =>
                    value
                      ? value !== registerForm.password
                        ? 'please add the same password'
                        : ''
                      : ''
                  }
                  onChange={(value) =>
                    handleValueChange(value, 'confirmPassword')
                  }
                  value={registerForm.confirmPassword}
                  name='confirmPassword'
                  type='password'
                  isRequired
                  placeholder='Confirm password'
                  label='Confirm password'
                  className='w-full text-black'
                />
              </div>
            </div>
          </FormPanel>
        )}
      </div>
    </div>
  );
};

export default Registration;
