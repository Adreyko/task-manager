import { cn } from '@/shared/lib/utils';
import { useCallback, useState } from 'react';
import {
  TextField,
  Label,
  type TextFieldProps,
  Input as InputRA,
  FieldError,
} from 'react-aria-components';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Button } from '../../Button';

interface InputProps extends TextFieldProps {
  classNames?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
}
const Input = ({
  label,
  errorMessage,
  classNames,
  placeholder,
  type = 'text',
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPass = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <TextField
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      {...props}
      aria-label='label'
      className='w-full relative'
    >
      <div className='relative'>
        {label && <Label className=''>{label}</Label>}
        <InputRA
          placeholder={placeholder}
          className={cn(
            'flex flex-col gap-4 border border-black rounded p-4 focus:ring-1 outline-none',
            classNames
          )}
        />
        {type === 'password' && (
          <Button
            onPress={handleShowPass}
            variant={'text'}
            className='absolute top-1/2 right-2'
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </Button>
        )}
      </div>

      <FieldError className={'text-red-500'}>{errorMessage}</FieldError>
    </TextField>
  );
};

export default Input;
