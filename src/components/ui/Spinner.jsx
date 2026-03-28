import { LoaderCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

/** @param {{className?: string}} props */
const Spinner = ({ className }) => (
  <LoaderCircle className={cn('h-4 w-4 animate-spin text-current', className)} aria-hidden="true" />
);

export default Spinner;
