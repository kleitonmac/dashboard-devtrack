import React from 'react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  description?: string;
  closeable?: boolean;
  onClose?: () => void;
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ 
    variant = 'info',
    title,
    description,
    closeable = false,
    onClose,
    children,
    className = '',
    ...props 
  }, ref) => {
    const [visible, setVisible] = React.useState(true);

    const handleClose = () => {
      setVisible(false);
      onClose?.();
    };

    if (!visible) return null;

    const variantStyles = {
      success: 'bg-success-50 border-l-4 border-success-500 text-success-900',
      warning: 'bg-warning-50 border-l-4 border-warning-500 text-warning-900',
      danger: 'bg-danger-50 border-l-4 border-danger-500 text-danger-900',
      info: 'bg-primary-50 border-l-4 border-primary-500 text-primary-900',
    };

    const iconMap = {
      success: '✓',
      warning: '⚠',
      danger: '✕',
      info: 'ℹ',
    };

    return (
      <div
        ref={ref}
        className={`rounded-lg p-lg flex items-start gap-lg ${variantStyles[variant]} ${className}`}
        {...props}
      >
        <div className="flex-shrink-0 text-xl font-bold">
          {iconMap[variant]}
        </div>
        <div className="flex-1">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          {description && <p className="text-sm opacity-90">{description}</p>}
          {children}
        </div>
        {closeable && (
          <button
            onClick={handleClose}
            className="flex-shrink-0 text-xl hover:opacity-70 transition-opacity"
          >
            ✕
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';
