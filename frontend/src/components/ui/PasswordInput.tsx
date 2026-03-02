import { useState } from 'react';
import { TextField, IconButton } from '@radix-ui/themes';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './PasswordInput.css';

interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  size?: '1' | '2' | '3';
  required?: boolean;
}

export function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  disabled = false,
  name,
  id,
  size = '3',
  required = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-wrapper">
      <TextField.Root
        name={name}
        id={id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        size={size}
        required={required}
      />
      <IconButton
        type="button"
        variant="ghost"
        size="2"
        className="password-toggle-btn"
        onClick={() => setShowPassword(!showPassword)}
        disabled={disabled}
        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        {showPassword ? (
          <FiEyeOff size={18} aria-hidden />
        ) : (
          <FiEye size={18} aria-hidden />
        )}
      </IconButton>
    </div>
  );
}
