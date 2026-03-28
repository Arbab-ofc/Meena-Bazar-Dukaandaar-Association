import { cn } from '@/utils/cn';

/** @param {{label?: string, error?: string, helperText?: string, className?: string} & import('react').TextareaHTMLAttributes<HTMLTextAreaElement>} props */
const Textarea = ({ label, error, helperText, className, id, ...props }) => {
  const textareaId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={textareaId} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <textarea
        id={textareaId}
        className={cn(
          'w-full rounded-[var(--radius)] border bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border',
          className
        )}
        {...props}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : helperText ? <p className="text-sm text-text-muted">{helperText}</p> : null}
    </div>
  );
};

export default Textarea;
