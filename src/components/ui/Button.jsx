import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

const buttonVariants = {
  primary: 'bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
  secondary: 'bg-dark-700 hover:bg-dark-600 text-dark-100 border border-dark-600 hover:border-dark-500',
  accent: 'bg-accent-500 hover:bg-accent-600 text-dark-900 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40',
  ghost: 'bg-transparent hover:bg-dark-800 text-dark-200 hover:text-white',
  outline: 'bg-transparent border-2 border-brand-500 text-brand-400 hover:bg-brand-500 hover:text-white',
  gradient: 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white shadow-lg shadow-brand-500/25',
};

const buttonSizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
  xl: 'px-10 py-5 text-xl',
  icon: 'p-3',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  href,
  ...props
}, ref) => {
  const baseStyles = cn(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-xl',
    'transition-all duration-200 ease-out',
    'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-dark-900',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
    'cursor-pointer',
    buttonVariants[variant],
    buttonSizes[size],
    className
  );

  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
    </>
  );

  if (href) {
    return (
      <a href={href} className={baseStyles} ref={ref} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={baseStyles}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
