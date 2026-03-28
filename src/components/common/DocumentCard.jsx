import { memo } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import FileIcon from '@/components/ui/FileIcon';
import { formatDate } from '@/utils/formatDate';

/** @param {{item: any}} props */
const DocumentCard = ({ item }) => (
  <Card hover className="p-5">
    <div className="mb-3 flex items-center justify-between">
      <FileIcon type={item.fileType} className="h-7 w-7 text-gold" />
      <Badge variant="accent">{item.category}</Badge>
    </div>
    <h3 className="font-heading text-2xl text-text">{item.title}</h3>
    <p className="mt-2 line-clamp-2 text-sm text-text-muted">{item.description}</p>
    <p className="mt-4 text-xs text-text-subtle">Added {formatDate(item.createdAt)}</p>
    <div className="mt-4 flex gap-2">
      <Button
        variant="secondary"
        size="sm"
        className="flex-1"
        onClick={() => window.open(item.fileUrl, '_blank', 'noopener,noreferrer')}
        leftIcon={<ExternalLink className="h-4 w-4" />}
      >
        View
      </Button>
      <a href={item.fileUrl} download className="flex-1">
        <Button variant="ghost" size="sm" className="w-full" leftIcon={<Download className="h-4 w-4" />}>
          Download
        </Button>
      </a>
    </div>
  </Card>
);

export default memo(DocumentCard);
