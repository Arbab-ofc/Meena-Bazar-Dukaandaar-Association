import { cn } from '@/utils/cn';

/** @param {{label?: string, title: string, subtitle?: string, centered?: boolean, className?: string}} props */
const SectionHeading = ({ label, title, subtitle, centered = false, className }) => (
  <div className={cn(centered && 'mx-auto text-center', className)}>
    {label ? (
      <div className="mb-3 inline-flex flex-col items-center gap-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gold">{label}</p>
        <span className="h-px w-10 bg-gold/70" />
      </div>
    ) : null}
    <h2 className="font-heading text-3xl text-text md:text-4xl lg:text-5xl">{title}</h2>
    {subtitle ? <p className={cn('mt-3 max-w-2xl text-lg text-text-muted', centered && 'mx-auto')}>{subtitle}</p> : null}
  </div>
);

export default SectionHeading;
