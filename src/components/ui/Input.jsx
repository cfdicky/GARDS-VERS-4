import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const inputVariants = {
  default: 'bg-dark-800 border-dark-600 focus:border-brand-500 focus:ring-brand-500/20',
  filled: 'bg-dark-800/50 border-dark-700 focus:border-brand-500 focus:ring-brand-500/20',
  outlined: 'bg-transparent border-2 border-dark-600 focus:border-brand-500 focus:ring-brand-500/20',
};

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  iconPosition = 'left',
  variant = 'default',
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-dark-400" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 rounded-xl text-white placeholder-dark-400',
            'border transition-all duration-200',
            'focus:outline-none focus:ring-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            inputVariants[variant],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            Icon && iconPosition === 'left' && 'pl-10',
            Icon && iconPosition === 'right' && 'pr-10',
            className
          )}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-dark-400" />
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={cn(
          'mt-2 text-sm',
          error ? 'text-red-400' : 'text-dark-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea Component
const Textarea = forwardRef(({
  label,
  error,
  helperText,
  variant = 'default',
  rows = 4,
  className,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-dark-200 mb-2">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          'w-full px-4 py-3 rounded-xl text-white placeholder-dark-400',
          'border transition-all duration-200 resize-none',
          'focus:outline-none focus:ring-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          inputVariants[variant],
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          'mt-2 text-sm',
          error ? 'text-red-400' : 'text-dark-400'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export { Input, Textarea };
export default Input;
