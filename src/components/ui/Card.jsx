import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

/** @param {{children: import('react').ReactNode, className?: string, hover?: boolean, onClick?: () => void, as?: keyof JSX.IntrinsicElements}} props */
const Card = ({ children, className, hover = false, onClick, as = 'div' }) => {
  const Component = motion[as] || motion.div;

  return (
    <Component
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-lg)' } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn('rounded-[var(--radius)] border border-border bg-surface shadow-sm', hover && 'cursor-pointer', className)}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Card;
