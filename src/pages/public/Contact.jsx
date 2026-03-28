import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import ContactInfoBlock from '@/components/common/ContactInfoBlock';
import { submitContact } from '@/services/firestore/contactService';
import { isRequired, isValidEmail, isValidPhone } from '@/utils/validators';
import { useToast } from '@/components/ui/Toast';

const Contact = () => {
  const [values, setValues] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    document.title = 'Contact | Meena Bazar Dukaandaar Association';
  }, []);

  const validate = () => {
    const next = {};
    if (!isRequired(values.name)) next.name = 'Full name is required.';
    if (!isValidEmail(values.email)) next.email = 'Enter a valid email address.';
    if (values.phone && !isValidPhone(values.phone)) next.phone = 'Enter a valid 10 digit mobile number.';
    if (!isRequired(values.message) || values.message.trim().length < 20) next.message = 'Message must be at least 20 characters.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await submitContact(values);
      setSuccess(true);
      setValues({ name: '', email: '', phone: '', message: '' });
      addToast({ variant: 'success', message: 'Message submitted successfully.' });
    } catch (error) {
      addToast({ variant: 'error', message: error.message || 'Unable to send message.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-10">
        <h1 className="font-heading text-5xl text-text">Contact</h1>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
          <h2 className="font-heading text-4xl text-text">Send a Message</h2>
          {success ? (
            <div className="mt-6 flex items-start gap-3 rounded-[var(--radius)] border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5" />
              Your message has been submitted successfully. We will get back to you shortly.
            </div>
          ) : null}
          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input label="Full Name" name="name" value={values.name} onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))} error={errors.name} required />
            <Input label="Email Address" name="email" type="email" value={values.email} onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))} error={errors.email} required />
            <Input label="Phone Number" name="phone" value={values.phone} onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))} error={errors.phone} />
            <Textarea label="Message" name="message" rows={6} value={values.message} onChange={(event) => setValues((prev) => ({ ...prev, message: event.target.value }))} error={errors.message} required />
            <Button type="submit" loading={loading}>Send Message</Button>
          </form>
        </div>
        <ContactInfoBlock />
      </section>
    </motion.div>
  );
};

export default Contact;
