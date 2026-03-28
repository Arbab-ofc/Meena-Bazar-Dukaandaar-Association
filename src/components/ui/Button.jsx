import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import Spinner from '@/components/ui/Spinner';

const variantClasses = {
  primary:
    'border border-accent bg-gradient-to-r from-accent to-accent-hover text-white shadow-md hover:shadow-lg',
  secondary:
    'border border-border bg-surface text-text shadow-sm hover:bg-surface-2 hover:shadow-md',
  ghost:
    'border border-border bg-transparent text-text-muted hover:bg-surface/70 hover:text-text',
  danger:
    'border border-red-600 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md hover:shadow-lg',
  gold:
    'border border-gold bg-gradient-to-r from-gold to-gold-light text-white shadow-md hover:shadow-lg'
};

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base'
};

/** @param {{variant?: 'primary'|'secondary'|'ghost'|'danger'|'gold', size?: 'sm'|'md'|'lg', loading?: boolean, disabled?: boolean, leftIcon?: import('react').ReactNode, rightIcon?: import('react').ReactNode, className?: string, children?: import('react').ReactNode} & import('react').ButtonHTMLAttributes<HTMLButtonElement>} props */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-[var(--radius)] font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-60',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : leftIcon}
      <span>{children}</span>
      {!loading && rightIcon}
    </motion.button>
  );
};

export default Button;
