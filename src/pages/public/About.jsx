import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SectionHeading from '@/components/ui/SectionHeading';

const objectives = [
  'Protecting the commercial rights of member merchants',
  'Legal representation in courts and commissions',
  'Maintaining official records and documentation',
  'Facilitating dispute resolution',
  'Promoting unity among shop owners',
  'Ensuring transparency through public documents'
];

const About = () => {
  document.title = 'About the Association | Meena Bazar Dukaandaar Association';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'About' }]} />
        <h1 className="font-heading text-5xl text-text">About the Association</h1>
      </section>

      <section className="mt-16">
        <SectionHeading title="Who We Are" />
        <div className="mt-6 space-y-4 text-text-muted">
          <p>Meena Bazar is one of the most historic commercial hubs in Patna, Bihar. The market has long served families, traders, and local businesses with a wide network of independent merchants.</p>
          <p>Meena Bazar Dukaandaar Association represents the collective interests of shop owners and merchants operating in this market ecosystem. It acts as an institutional voice for lawful trade and commercial stability.</p>
          <p>The association actively protects legal rights, engages in representation before authorities, and facilitates dispute resolution on matters affecting member businesses.</p>
          <p>With a strong focus on documentation, compliance, and transparent records, the association maintains legal continuity while promoting unity among all stakeholders.</p>
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading title="Our Mission & Objectives" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {objectives.map((objective) => (
            <div key={objective} className="flex items-center gap-3 rounded-full border border-border bg-surface px-4 py-3 text-sm text-text-muted">
              <span className="rounded-full bg-gold/15 p-1"><Check className="h-3.5 w-3.5 text-gold" /></span>
              {objective}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[var(--radius-lg)] border border-gold/40 bg-surface p-8">
        <h2 className="font-heading text-4xl text-text">Legal Recognition</h2>
        <p className="mt-4 text-text-muted">The association holds official registration, has a permanent account number (PAN), and is recognized under applicable laws. Active in Patna High Court case LPA 486/2021 and related proceedings.</p>
      </section>

      <section className="mt-16">
        <SectionHeading title="Membership Strength" />
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            ['Registered Members', '300+'],
            ['Market Blocks Represented', '12'],
            ['Years of Collective Service', '35+']
          ].map(([label, value]) => (
            <div key={label} className="rounded-[var(--radius)] border border-border bg-surface p-6 text-center">
              <p className="font-heading text-4xl text-gold">{value}</p>
              <p className="mt-2 text-sm text-text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-[var(--radius-lg)] border border-border bg-surface p-8">
        <h2 className="font-heading text-4xl text-text">Our Commitment</h2>
        <p className="mt-4 text-text-muted">We remain committed to legal integrity, merchant welfare, collective representation, and institutional transparency. Our responsibility is to protect the dignity and commercial continuity of every member of Meena Bazar.</p>
      </section>
    </motion.div>
  );
};

export default About;
