import { cn } from '@/utils/cn';

/** @param {{label?: string, error?: string, helperText?: string, leftIcon?: import('react').ReactNode, rightIcon?: import('react').ReactNode, className?: string} & import('react').InputHTMLAttributes<HTMLInputElement>} props */
const Input = ({ label, error, helperText, leftIcon, rightIcon, className, id, ...props }) => {
  const inputId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={inputId} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <div className="relative">
        {leftIcon ? <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">{leftIcon}</span> : null}
        <input
          id={inputId}
          className={cn(
            'w-full rounded-[var(--radius)] border bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border',
            className
          )}
          {...props}
        />
        {rightIcon ? <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">{rightIcon}</span> : null}
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : helperText ? <p className="text-sm text-text-muted">{helperText}</p> : null}
    </div>
  );
};

export default Input;
