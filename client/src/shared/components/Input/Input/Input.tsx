import { cn } from '@/shared/lib/utils';
import { useCallback } from 'react';
import {
  TextField,
  Label,
  type TextFieldProps,
  Input as InputRA,
} from 'react-aria-components';
interface InputProps extends TextFieldProps {
  classNames?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}
const Input = ({ label, value, onChange, classNames }: InputProps) => {
  const onValueChange = useCallback(
    (value: string) => {
      onChange?.(value);
    },
    [onChange]
  );
  return (
    <TextField aria-label='label' onChange={onValueChange}>
      {label && <Label>{label}</Label>}
      <InputRA
        className={cn(
          'flex flex-col gap-4 border border-inverted-bg-color  rounded',
          classNames
        )}
      />
    </TextField>
  );
};

export default Input;
