import { cn } from '@/utils/cn';

/** @param {{label?: string, error?: string, helperText?: string, options?: Array<{value: string, label: string}>, className?: string} & import('react').SelectHTMLAttributes<HTMLSelectElement>} props */
const Select = ({ label, error, helperText, options = [], className, id, ...props }) => {
  const selectId = id || props.name;

  return (
    <div className="space-y-2">
      {label ? (
        <label htmlFor={selectId} className="block text-sm font-medium text-text">
          {label}
        </label>
      ) : null}
      <select
        id={selectId}
        className={cn(
          'w-full rounded-[var(--radius)] border bg-bg px-4 py-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30',
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-border',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-500">{error}</p> : helperText ? <p className="text-sm text-text-muted">{helperText}</p> : null}
    </div>
  );
};

export default Select;
