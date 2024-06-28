import { Input } from '@/shared/components/Input';

import { FormEvent, useCallback, useState } from 'react';
import { RegisterUser } from '../../types/register';
import { ErrorMessage, useRegisterUser } from '../../api/register';
import { useNavigate } from 'react-router-dom';
import { getLogin } from '@/app/providers/Router/conts/routers';
import { FormPanel } from '@/shared/components/FormPanel';
import { useForm } from '@/shared/lib/hooks/useForm';

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

  const [requestError, setRequestError] = useState<ErrorMessage>('');
  const navigate = useNavigate();

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const dataToSend: Omit<RegisterUser, 'confirmPassword'> = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
      };

      try {
        const res = await registerMutation(dataToSend).unwrap();
        //@ts-ignore
        if (res?.message) {
          //@ts-ignore
          setRequestError(res?.message);
        } else {
          setRequestError('');
          resetForm();
          navigate(getLogin());
        }
      } catch (error) {
        console.log(error);
      }
    },

    [
      navigate,
      registerForm.email,
      registerForm.firstName,
      registerForm.lastName,
      registerForm.password,
      registerForm.username,
      registerMutation,
      resetForm,
    ]
  );

  return (
    <div className='flex items-center justify-center text-black py-20'>
      <FormPanel
        isLoading={isLoading}
        buttonText='Register'
        error={requestError}
        title='Register an account'
        onSubmit={onSubmit}
        className='w-1/2'
      >
        <div className='flex flex-col w-2/3 text-black gap-4'>
          <div className='flex gap-10'>
            <Input
              value={registerForm.firstName}
              isRequired
              onChange={(value) => handleValueChange(value, 'firstName')}
              type='text'
              placeholder='First name'
              label='First name'
              name='firstName'
              classNames='w-full text-black'
            />
            <Input
              value={registerForm.lastName}
              onChange={(value) => handleValueChange(value, 'lastName')}
              isRequired
              placeholder='Last name'
              label='Last name'
              name='lastName'
              classNames='w-full text-black'
            />
          </div>

          <Input
            value={registerForm.username}
            onChange={(value) => handleValueChange(value, 'username')}
            isRequired
            placeholder='Username'
            name='username'
            label='Username'
            classNames='w-full text-black'
          />
          <Input
            value={registerForm.email}
            onChange={(value) => handleValueChange(value, 'email')}
            isRequired
            type='email'
            name='email'
            placeholder='Email'
            label='Email'
            classNames='w-full text-black'
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
              classNames='w-full text-black'
            />
            <Input
              validate={(value) =>
                value
                  ? value !== registerForm.password
                    ? 'please add the same password'
                    : ''
                  : ''
              }
              onChange={(value) => handleValueChange(value, 'confirmPassword')}
              value={registerForm.confirmPassword}
              name='confirmPassword'
              type='password'
              isRequired
              placeholder='Confirm password'
              label='Confirm password'
              classNames='w-full text-black'
            />
          </div>
        </div>
      </FormPanel>
    </div>
  );
};

export default Registration;
