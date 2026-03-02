import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, hoverable = false, interactive = false, className = '', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          card
          ${hoverable ? 'hover:shadow-lg hover:-translate-y-1' : ''}
          ${interactive ? 'cursor-pointer' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, subtitle, action, children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`flex items-start justify-between mb-lg ${className}`} {...props}>
        <div className="flex-1">
          {title && <h3 className="text-lg font-semibold text-dark-900">{title}</h3>}
          {subtitle && <p className="text-sm text-dark-500 mt-xs">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// Card Body
export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardBody.displayName = 'CardBody';

// Card Footer
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`flex items-center justify-end gap-md pt-lg border-t border-dark-100 mt-lg ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';
