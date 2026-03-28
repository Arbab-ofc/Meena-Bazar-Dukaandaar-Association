import { Mail, MapPin, Phone } from 'lucide-react';

const ContactInfoBlock = () => (
  <div className="space-y-5 rounded-[var(--radius-lg)] border border-border bg-surface p-6">
    <h3 className="font-heading text-3xl text-text">Association Office</h3>
    <div className="space-y-3 text-sm text-text-muted">
      <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-gold" /> Meena Bazar, Patna, Bihar, India</p>
      <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 7717730628</p>
      <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 9631724124</p>
      <p className="flex items-start gap-3"><Phone className="mt-0.5 h-4 w-4 text-gold" /> 6202317396</p>
      <p className="flex items-start gap-3"><Mail className="mt-0.5 h-4 w-4 text-gold" /> contact@meenabazarassociation.org</p>
    </div>
    <div className="rounded-[var(--radius)] border border-border bg-bg p-4 text-sm text-text-muted">
      <p className="font-medium text-text">Office Hours</p>
      <p className="mt-1">Monday to Saturday, 10:00 AM to 7:00 PM</p>
    </div>
    <div className="rounded-[var(--radius)] border border-dashed border-border bg-bg p-6 text-center text-sm text-text-muted">
      Map coming soon
    </div>
    <p className="text-xs text-text-subtle">For legal matters, please reference the relevant case number in your message.</p>
  </div>
);

export default ContactInfoBlock;
