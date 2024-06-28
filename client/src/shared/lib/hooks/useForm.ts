import { useCallback, useState } from 'react';

interface ResetFunction {
  (): void;
}
interface HandleFunction {
  (value: string, name: string): void;
}
export const useForm = <T>(initForm: T): [T, HandleFunction, ResetFunction] => {
  const [form, setForm] = useState<T>(initForm);

  const handleFormChange = useCallback((value: string, name: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetForm = () => {
    setForm(initForm);
  };

  return [form, handleFormChange, resetForm];
};
