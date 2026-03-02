import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helpText, 
    icon,
    fullWidth = false,
    className = '',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random()}`;

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label htmlFor={inputId} className="label">
            {label}
            {props.required && <span className="text-danger-600 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              input
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-100' : ''}
              ${fullWidth ? 'w-full' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-danger-600 mt-1 flex items-center gap-1">
            <span>⚠️</span> {error}
          </p>
        )}
        {helpText && !error && (
          <p className="text-xs text-dark-500 mt-1">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
