import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldError } from 'react-hook-form';

interface FormFieldProps {
  label: string;
  placeholder?: string;
  type?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  id?: string;
}

export function FormField({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  error,
  disabled,
  required,
  id,
}: FormFieldProps) {
  const fieldId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId} className={required ? 'after:content-["*"] after:ml-1 after:text-red-500' : ''}>
        {label}
      </Label>
      <Input
        id={fieldId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={error ? 'border-red-500' : ''}
      />
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
