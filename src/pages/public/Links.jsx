import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText, Link as LinkIcon, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { getPublishedLinks } from '@/services/firestore/linksService';

const quickLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Team', '/team'],
  ['Members', '/members'],
  ['Notices', '/notices'],
  ['Legal Updates', '/legal-updates'],
  ['Documents', '/documents'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact']
];

const legalLinks = [
  ['Registration Certificate', '/documents?category=Registration'],
  ['PAN/TAN Documents', '/documents?category=PAN/TAN'],
  ['Court Orders', '/documents?category=Court Orders'],
  ['RTI Copies', '/documents?category=RTI'],
  ['Commission Notices', '/documents?category=Commission Notices']
];

const contactLinks = [
  ['Call: 7717730628', 'tel:7717730628'],
  ['Call: 9631724124', 'tel:9631724124'],
  ['Call: 6202317396', 'tel:6202317396'],
  ['Email: contact@meenabazarassociation.org', 'mailto:contact@meenabazarassociation.org']
];

const LinksPage = () => {
  const [adminLinks, setAdminLinks] = useState([]);
  const [expandedDescriptions, setExpandedDescriptions] = useState({});

  useEffect(() => {
    document.title = 'Useful Links | Meena Bazar Dukaandaar Association';
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setAdminLinks(await getPublishedLinks());
      } catch (error) {
        setAdminLinks([]);
      }
    };
    load();
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Useful Links</h1>
        <p className="mt-3 max-w-2xl text-text-muted">Quick access to association pages, legal records, and contact actions.</p>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-accent">
            <LinkIcon className="h-3.5 w-3.5" />
            Site Navigation
          </div>
          <div className="space-y-2.5">
            {quickLinks.map(([label, href]) => (
              <Link key={href} to={href} className="group flex items-center justify-between rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text transition hover:border-gold/40 hover:bg-surface-2">
                <span>{label}</span>
                <ArrowUpRight className="h-4 w-4 text-text-subtle transition group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
            <FileText className="h-3.5 w-3.5" />
            Legal Records
          </div>
          <div className="space-y-2.5">
            {legalLinks.map(([label, href]) => (
              <Link key={href} to={href} className="group flex items-center justify-between rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text transition hover:border-gold/40 hover:bg-surface-2">
                <span>{label}</span>
                <ArrowUpRight className="h-4 w-4 text-text-subtle transition group-hover:text-gold" />
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-elevated px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-text">
            <Phone className="h-3.5 w-3.5 text-gold" />
            Contact Actions
          </div>
          <div className="space-y-2.5">
            {contactLinks.map(([label, href]) => (
              <a key={href} href={href} className="group flex items-center justify-between rounded-[var(--radius-sm)] border border-border bg-bg-elevated px-3 py-2.5 text-sm text-text transition hover:border-gold/40 hover:bg-surface-2">
                <span>{label}</span>
                {href.startsWith('mailto:') ? (
                  <Mail className="h-4 w-4 text-text-subtle transition group-hover:text-gold" />
                ) : (
                  <Phone className="h-4 w-4 text-text-subtle transition group-hover:text-gold" />
                )}
              </a>
            ))}
          </div>
        </Card>
      </section>

      {adminLinks.length ? (
        <section className="mt-8">
          <Card className="p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-heading text-3xl text-text">Admin Published Links</h2>
              <p className="text-sm text-text-muted">Latest document and video links from the association</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {adminLinks.map((item) => {
                const isExpanded = Boolean(expandedDescriptions[item.id]);
                const isLongDescription = (item.description || '').length > 160;

                return (
                  <div key={item.id} className="rounded-[var(--radius-sm)] border border-border bg-bg-elevated p-4 transition hover:border-gold/40 hover:bg-surface-2">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <Badge variant={item.type === 'Video' ? 'gold' : 'accent'}>{item.type || 'Link'}</Badge>
                      <a href={item.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-hover">
                        Open
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                    <p className="text-sm font-medium text-text">{item.title}</p>
                    {item.description ? (
                      <motion.div
                        layout
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="mt-1 overflow-hidden"
                      >
                        <p className={`text-xs text-text-muted ${isExpanded ? '' : 'line-clamp-2'}`}>
                          {item.description}
                        </p>
                      </motion.div>
                    ) : null}
                    {item.description && isLongDescription ? (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedDescriptions((prev) => ({
                            ...prev,
                            [item.id]: !prev[item.id]
                          }))
                        }
                        className="mt-2 text-xs font-medium text-accent hover:text-accent-hover"
                      >
                        {isExpanded ? 'Read less' : 'Read more'}
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </Card>
        </section>
      ) : null}
    </motion.div>
  );
};

export default LinksPage;
