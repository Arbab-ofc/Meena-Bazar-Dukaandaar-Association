import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { resetPassword } from '@/services/firebase/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Forgot Password | Admin Access';
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await resetPassword(email.trim());
      setMessage('Password reset email sent successfully.');
    } catch (err) {
      setError(err.message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-8">
      <div className="mx-auto mb-4 flex w-full max-w-md justify-end">
        <Link to="/">
          <Button variant="ghost" size="sm">Back to Home</Button>
        </Link>
      </div>
      <div className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-[var(--radius-lg)] border border-border bg-surface p-8 shadow-xl">
        <h1 className="font-heading text-4xl text-text">Forgot Password</h1>
        <p className="mt-1 text-sm text-text-muted">Enter your admin email to receive a reset link.</p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Email Address" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          {message ? <p className="text-sm text-emerald-600">{message}</p> : null}
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" loading={loading} className="w-full">
            Send Reset Email
          </Button>
        </form>
        <Link to="/admin/login" className="mt-4 inline-block text-sm text-accent hover:text-accent-hover">
          Back to Login
        </Link>
      </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
