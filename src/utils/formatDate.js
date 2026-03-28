import { format, formatDistanceToNow } from 'date-fns';

const toDateSafe = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp?.toDate === 'function') return timestamp.toDate();
  if (typeof timestamp?.seconds === 'number') return new Date(timestamp.seconds * 1000);
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatDate = (timestamp) => {
  const date = toDateSafe(timestamp);
  if (!date) return 'N/A';
  return format(date, 'dd MMM yyyy');
};

export const formatRelative = (timestamp) => {
  const date = toDateSafe(timestamp);
  if (!date) return 'N/A';
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatDateLong = (timestamp) => {
  const date = toDateSafe(timestamp);
  if (!date) return 'N/A';
  return format(date, 'dd MMMM yyyy, hh:mm a');
};
