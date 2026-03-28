import { cn } from '@/utils/cn';

/** @param {{className?: string}} props */
const Divider = ({ className }) => <hr className={cn('border-border', className)} />;

export default Divider;
