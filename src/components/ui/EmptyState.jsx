import { Inbox } from 'lucide-react';
import Button from '@/components/ui/Button';

/** @param {{title?: string, description?: string, actionLabel?: string, onAction?: () => void}} props */
const EmptyState = ({
  title = 'No records found',
  description = 'There is nothing to display at the moment.',
  actionLabel,
  onAction
}) => (
  <div className="rounded-[var(--radius-lg)] border border-dashed border-border bg-surface p-8 text-center">
    <Inbox className="mx-auto mb-4 h-10 w-10 text-text-subtle" />
    <h3 className="font-heading text-2xl text-text">{title}</h3>
    <p className="mx-auto mt-2 max-w-lg text-sm text-text-muted">{description}</p>
    {actionLabel && onAction ? (
      <div className="mt-5">
        <Button variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      </div>
    ) : null}
  </div>
);

export default EmptyState;
