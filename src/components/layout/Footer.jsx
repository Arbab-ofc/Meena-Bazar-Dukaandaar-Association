import { motion } from 'framer-motion';
import { ChevronRight, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import NotificationOptIn from '@/components/common/NotificationOptIn';

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Team', '/team'],
  ['Members', '/members'],
  ['Notices', '/notices'],
  ['Legal Updates', '/legal-updates'],
  ['Documents', '/documents'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
  ['Links', '/links']
];

const legalLinks = [
  ['Registration Certificate', '/documents?category=Registration'],
  ['PAN/TAN Documents', '/documents?category=PAN/TAN'],
  ['Court Orders', '/documents?category=Court Orders'],
  ['RTI Copies', '/documents?category=RTI'],
  ['Commission Notices', '/documents?category=Commission Notices']
];

const scrollToTop = () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

const Footer = () => (
  <motion.footer className="mt-0 border-t border-border bg-surface" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent" />
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-2 lg:grid-cols-4 md:px-6">
      <div>
        <h3 className="font-heading text-3xl text-text">Patna Market Dukaandaar Association</h3>
        <p className="mt-1 text-sm text-gold-muted">Meena Bazar</p>
        <p className="mt-4 text-sm text-text-muted">
          A legally registered trade association representing the merchants and shop owners of Meena Bazar, Patna since its establishment. Committed to the welfare, legal protection, and collective strength of its members.
        </p>
        <p className="mt-4 font-heading text-xl italic text-text">Unity is Strength</p>
        <div className="my-4 h-px w-full bg-border" />
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 font-medium text-text shadow-sm">Registered Association</span>
          <span className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 font-medium text-text shadow-sm">PAN Registered</span>
          <span className="rounded-full border border-border bg-bg-elevated px-2.5 py-1 font-medium text-text shadow-sm">RTI Applicable</span>
        </div>
      </div>
      <div>
        <h4 className="font-heading text-2xl text-text">Navigation</h4>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          {links.map(([label, href]) => (
            <li key={href}>
              <Link className="inline-flex items-center gap-2 transition hover:text-text" to={href} onClick={scrollToTop}>
                <ChevronRight className="h-4 w-4" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-heading text-2xl text-text">Legal & Records</h4>
        <ul className="mt-4 space-y-2 text-sm text-text-muted">
          {legalLinks.map(([label, href]) => (
            <li key={href}>
              <Link className="inline-flex items-center gap-2 transition hover:text-text" to={href} onClick={scrollToTop}>
                <ChevronRight className="h-4 w-4" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-heading text-2xl text-text">Contact</h4>
        <div className="mt-4 space-y-3 text-sm text-text-muted">
          <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-gold" /> Patna Market, Bihar, India</p>
          <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 7717730628</p>
          <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 9631724124</p>
          <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 6202317396</p>
          <p className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-gold" /> contact@meenabazarassociation.org</p>
        </div>
        <div className="my-4 h-px w-full bg-border" />
        <div className="rounded-[var(--radius)] border border-border bg-bg-elevated px-3 py-2 shadow-sm">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gold">Business Hours</p>
          <p className="mt-1 text-xs text-text-muted sm:whitespace-nowrap">Monday to Saturday, 10:00 AM to 7:00 PM</p>
        </div>
        <div className="mt-4">
          <NotificationOptIn compact />
        </div>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-text-subtle md:flex-row md:items-center md:justify-between md:px-6">
        <p>© 2024 Patna Market Dukaandaar Association. All rights reserved.</p>
        <p>Patna, Bihar, India</p>
      </div>
      <p className="pb-4 text-center text-xs text-text-subtle">Designed with care for the merchants of Patna Market.</p>
    </div>
  </motion.footer>
);

export default Footer;
