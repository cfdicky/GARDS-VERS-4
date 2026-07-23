import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const cardVariants = {
  default: 'glass-card',
  elevated: 'bg-dark-800 border border-dark-700 shadow-xl',
  outlined: 'bg-transparent border-2 border-dark-600',
  ghost: 'bg-dark-800/30 border border-transparent hover:border-dark-600',
  gradient: 'bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700',
};

const Card = forwardRef(({
  children,
  variant = 'default',
  hover = true,
  padding = 'md',
  className,
  ...props
}, ref) => {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants[variant],
        paddingStyles[padding],
        hover && 'glass-card-hover',
        'rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Card Header
const CardHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props}>
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

// Card Title
const CardTitle = forwardRef(({ children, className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-bold text-white', className)} {...props}>
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

// Card Description
const CardDescription = forwardRef(({ children, className, ...props }, ref) => (
  <p ref={ref} className={cn('text-dark-300', className)} {...props}>
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

// Card Content
const CardContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('', className)} {...props}>
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

// Card Footer
const CardFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={cn('mt-4 pt-4 border-t border-dark-700', className)} {...props}>
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
