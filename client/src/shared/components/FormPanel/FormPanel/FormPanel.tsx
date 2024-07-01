import { cn } from '@/shared/lib/utils';
import React, { ReactNode } from 'react';

import { Form, Text } from 'react-aria-components';
import { Button } from '../../Button';
import { ButtonProps } from '../../Button/Button/Button';

interface FormPanelProps {
  className?: string;
  title?: string;
  children: ReactNode;
  onSubmit?: () => void;
  isLoading?: boolean;
  error?: string;
  buttonText?: string;
  buttonProps?: ButtonProps;
}

const FormPanel = ({
  className,
  title,
  children,
  onSubmit,
  isLoading,
  error,
  buttonText,
  buttonProps,
}: FormPanelProps) => {
  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit?.();
  };
  return (
    <Form
      className={cn(
        'h-fit rounded-lg flex items-center py-10 gap-4 flex-col mx-auto border border-black bg-white',
        className
      )}
      onSubmit={onSubmitHandler}
    >
      {title && <Text className='text-2xl font-bold mb-5'>{title}</Text>}
      {children}
      {error && <div className='text-red-500 self-center text-xl'>{error}</div>}

      {buttonText && (
        <Button
          {...buttonProps}
          loading={isLoading}
          type='submit'
          size={'large'}
          variant={'primary'}
          className={'w-2/3'}
        >
          {buttonText}
        </Button>
      )}
    </Form>
  );
};

export default FormPanel;
