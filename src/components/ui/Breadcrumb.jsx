import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/** @param {{items: Array<{label: string, href?: string}>}} props */
const Breadcrumb = ({ items }) => (
  <nav aria-label="Breadcrumb" className="mb-6 text-sm text-text-muted">
    <ol className="flex flex-wrap items-center gap-2">
      {items.map((item, index) => (
        <li key={item.label} className="flex items-center gap-2">
          {item.href ? <Link className="transition hover:text-text" to={item.href}>{item.label}</Link> : <span className="text-text">{item.label}</span>}
          {index < items.length - 1 ? <ChevronRight className="h-4 w-4" /> : null}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;
