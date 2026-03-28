import { cn } from '@/utils/cn';

const variantMap = {
  default: 'bg-surface-2 text-text border-border',
  accent: 'bg-accent/15 text-accent border-accent/30',
  gold: 'bg-gold/15 text-gold border-gold/30',
  success: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
  danger: 'bg-red-500/15 text-red-600 border-red-500/30'
};

/** @param {{variant?: 'default'|'accent'|'gold'|'success'|'warning'|'danger', className?: string, children?: import('react').ReactNode}} props */
const Badge = ({ variant = 'default', className, children }) => (
  <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium', variantMap[variant], className)}>
    {children}
  </span>
);

export default Badge;
