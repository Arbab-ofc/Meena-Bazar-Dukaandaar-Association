import { memo } from 'react';
import { FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { formatDate } from '@/utils/formatDate';

/** @param {{item: any}} props */
const LegalUpdateCard = ({ item }) => (
  <Card hover className="p-6">
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <Badge variant="gold">{item.caseNumber}</Badge>
      <Badge variant={item.status === 'Resolved' ? 'success' : item.status === 'Pending' ? 'warning' : 'accent'}>{item.status}</Badge>
    </div>
    <h3 className="font-heading text-2xl text-text">{item.title}</h3>
    <p className="mt-1 text-sm text-text-muted">{item.court}</p>
    <p className="mt-3 line-clamp-3 text-sm text-text-muted">{item.summary}</p>
    <p className="mt-4 text-xs text-text-subtle">{formatDate(item.createdAt)}</p>
    <Link to={`/legal-updates/${item.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover">
      <FileText className="h-4 w-4" />
      View Details
    </Link>
  </Card>
);

export default memo(LegalUpdateCard);
