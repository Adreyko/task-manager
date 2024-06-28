import { cn } from '@/shared/lib/utils';
import React, { ReactNode } from 'react';

import { Form, Text } from 'react-aria-components';
import { Button } from '../../Button';

interface FormPanelProps {
  className?: string;
  title?: string;
  children: ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  isLoading?: boolean;
  error?: string;
  buttonText?: string;
}

const FormPanel = ({
  className,
  title,
  children,
  onSubmit,
  isLoading,
  error,
  buttonText,
}: FormPanelProps) => {
  return (
    <Form
      className={cn(
        'h-fit rounded-lg flex items-center py-10 gap-4 flex-col mx-auto border border-black bg-white',
        className
      )}
      onSubmit={onSubmit}
    >
      {title && <Text className='text-2xl font-bold mb-5'>{title}</Text>}
      {children}
      {error && <div className='text-red-500 self-center text-xl'>{error}</div>}

      {buttonText && (
        <Button
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
