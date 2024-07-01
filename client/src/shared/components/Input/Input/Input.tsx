import { cn } from '@/shared/lib/utils';
import { useCallback, useState } from 'react';
import {
  TextField,
  Label,
  type TextFieldProps,
  Input as InputRA,
  FieldError,
  LabelProps,
} from 'react-aria-components';
import { Eye, EyeSlash } from '@phosphor-icons/react';
import { Button } from '../../Button';

interface InputProps extends TextFieldProps {
  className?: string;
  label?: string;
  placeholder?: string;
  errorMessage?: string;
  containerClassName?: string;
  labelProps?: LabelProps;
  iconClassName?: string;
}
const Input = ({
  label,
  errorMessage,
  className,
  placeholder,
  type = 'text',
  containerClassName,
  labelProps,
  iconClassName,
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
      className={cn('relative w-full', containerClassName)}
    >
      {label && <Label {...labelProps}>{label}</Label>}
      <InputRA
        placeholder={placeholder}
        className={cn(
          'flex flex-col gap-4 border border-black rounded p-4 focus:ring-1 outline-none w-full',
          className
        )}
      />
      {type === 'password' && (
        <Button
          onPress={handleShowPass}
          variant={'text'}
          className={cn('absolute top-1/2 right-2', iconClassName)}
        >
          {showPassword ? <EyeSlash /> : <Eye />}
        </Button>
      )}

      <FieldError className={'text-red-500'}>{errorMessage}</FieldError>
    </TextField>
  );
};

export default Input;
