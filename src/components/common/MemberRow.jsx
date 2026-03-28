import { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import ImageKitImage from '@/components/ui/ImageKitImage';

const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const scheduleSummary = (schedule = {}) => {
  const openDays = WEEK_DAYS.filter((day) => Boolean(schedule[day]));
  if (!openDays.length) return 'Closed all days';
  if (openDays.length === WEEK_DAYS.length) return 'Open all days';
  return `Open: ${openDays.join(', ')}`;
};

/** @param {{member: any}} props */
const MemberRow = ({ member }) => {
  const [open, setOpen] = useState(false);
  const openDays = useMemo(() => WEEK_DAYS.filter((day) => Boolean(member.schedule?.[day])), [member.schedule]);
  const closedDays = useMemo(() => WEEK_DAYS.filter((day) => !Boolean(member.schedule?.[day])), [member.schedule]);

  return (
    <article className="overflow-hidden rounded-[var(--radius)] border border-border bg-surface">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <p className="text-sm text-text">
            <span className="font-medium">Shop {member.shopNumber}:</span> {member.shopName}
          </p>
          <p className="mt-1 text-sm text-text-muted">
            <span className="font-medium text-text">Owner:</span> {member.ownerName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={member.status === 'Active' ? 'success' : 'warning'}>{member.status}</Badge>
          <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border"
          >
            <div className="space-y-4 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <p className="text-sm text-text-muted">
                  <span className="font-medium text-text">Open Time:</span> {member.openTime || 'Not set'}
                </p>
                <p className="text-sm text-text-muted">
                  <span className="font-medium text-text">Close Time:</span> {member.closeTime || 'Not set'}
                </p>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-border bg-bg p-3">
                <p className="text-sm font-medium text-text">Schedule</p>
                <p className="mt-1 text-sm text-text-muted">{scheduleSummary(member.schedule)}</p>
                <p className="mt-2 text-xs text-text-subtle">
                  <span className="font-medium text-text">Open:</span> {openDays.length ? openDays.join(', ') : 'None'}
                </p>
                <p className="mt-1 text-xs text-text-subtle">
                  <span className="font-medium text-text">Closed:</span> {closedDays.length ? closedDays.join(', ') : 'None'}
                </p>
              </div>

              {member.shopImageUrl || member.ownerImageUrl ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {member.shopImageUrl ? (
                    <div>
                      <p className="mb-2 text-xs text-text-muted">Shop Photo</p>
                      <ImageKitImage src={member.shopImageUrl} alt={`${member.shopName} shop`} className="h-44 w-full rounded-[var(--radius-sm)]" />
                    </div>
                  ) : null}
                  {member.ownerImageUrl ? (
                    <div>
                      <p className="mb-2 text-xs text-text-muted">Owner Photo</p>
                      <ImageKitImage src={member.ownerImageUrl} alt={`${member.ownerName} owner`} className="h-44 w-full rounded-[var(--radius-sm)]" />
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No photos uploaded yet.</p>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </article>
  );
};

export default memo(MemberRow);
