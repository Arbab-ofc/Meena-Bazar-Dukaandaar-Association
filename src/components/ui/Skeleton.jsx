import { cn } from '@/utils/cn';

const variantClasses = {
  line: 'h-4 w-full',
  card: 'h-32 w-full',
  circle: 'h-12 w-12 rounded-full',
  image: 'h-48 w-full'
};

/** @param {{variant?: 'line'|'card'|'circle'|'image', className?: string}} props */
const Skeleton = ({ variant = 'line', className }) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-[var(--radius)] bg-surface-2 before:absolute before:inset-0 before:bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] before:bg-[length:200%_100%] before:animate-shimmer',
      variantClasses[variant],
      className
    )}
    aria-hidden="true"
  />
);

export default Skeleton;
