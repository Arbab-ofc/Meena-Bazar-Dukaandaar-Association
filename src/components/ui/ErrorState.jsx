import { TriangleAlert } from 'lucide-react';
import Button from '@/components/ui/Button';

/** @param {{title?: string, message?: string, onRetry?: () => void}} props */
const ErrorState = ({
  title = 'Unable to load data',
  message = 'Please check your connection and try again.',
  onRetry
}) => (
  <div className="rounded-[var(--radius-lg)] border border-red-500/30 bg-red-500/10 p-8 text-center">
    <TriangleAlert className="mx-auto mb-4 h-10 w-10 text-red-600" />
    <h3 className="font-heading text-2xl text-text">{title}</h3>
    <p className="mt-2 text-sm text-text-muted">{message}</p>
    {onRetry ? (
      <div className="mt-5">
        <Button variant="danger" onClick={onRetry}>
          Retry
        </Button>
      </div>
    ) : null}
  </div>
);

export default ErrorState;
