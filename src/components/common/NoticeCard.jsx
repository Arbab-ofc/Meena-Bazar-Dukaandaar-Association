import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { formatDate } from '@/utils/formatDate';

/** @param {{notice: any, featured?: boolean}} props */
const NoticeCard = ({ notice, featured = false }) => (
  <Card className="p-6" hover>
    <div className="mb-4 flex items-center justify-between gap-3">
      <Badge variant={featured ? 'gold' : 'accent'}>{featured ? 'Featured' : notice.status || 'Notice'}</Badge>
      <span className="text-sm text-text-muted">{formatDate(notice.createdAt)}</span>
    </div>
    <h3 className="font-heading text-2xl text-text">{notice.title}</h3>
    <p className="mt-3 line-clamp-3 text-sm text-text-muted">{notice.summary}</p>
    <Link to={`/notices/${notice.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition hover:text-accent-hover">
      Read More
      <ArrowRight className="h-4 w-4" />
    </Link>
  </Card>
);

export default memo(NoticeCard);
