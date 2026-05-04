import { useEffect, useState } from 'react';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signIn } from '@/services/firebase/authService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

const mapError = (code = '') => {
  if (code.includes('invalid-credential')) return 'Invalid email or password.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try later.';
  return 'Unable to sign in. Please verify your credentials.';
};

const Login = () => {
  const { isAdmin, isLoading } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Access | Meena Bazar Dukaandaar Association';
  }, []);

  if (!isLoading && isAdmin) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(values.email.trim(), values.password);
      addToast({ variant: 'success', message: 'Signed in successfully.' });
      navigate('/', { replace: true });
    } catch (err) {
      const message = mapError(err.code || err.message);
      setError(message);
      addToast({ variant: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto mb-4 flex w-full max-w-6xl justify-end">
        <Link to="/">
          <Button variant="ghost" size="sm">Back to Home</Button>
        </Link>
      </div>
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated shadow-xl lg:grid-cols-12">
        <section className="border-b border-border bg-surface p-6 md:p-8 lg:col-span-5 lg:border-b-0 lg:border-r">
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Admin Portal</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-text md:text-5xl">
            Meena Bazar Dukaandaar Association
          </h1>
          <p className="mt-2 text-sm text-gold-muted">Patna Market, Bihar</p>
          <p className="mt-6 text-text-muted">
            Official dashboard for notices, legal records, document archives, and member operations.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm text-text-muted">
            <ShieldCheck className="h-4 w-4 text-gold" /> Restricted to authorized administrators
          </div>
        </section>

        <section className="p-6 md:p-8 lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Admin Sign In</p>
          <h2 className="mt-2 font-heading text-4xl text-text md:text-5xl">Welcome Back</h2>
          <p className="mt-2 text-sm text-text-muted">Sign in to continue to the control panel.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Email Address"
              type="email"
              required
              value={values.email}
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              required
              value={values.password}
              onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />

            {error ? (
              <p className="rounded-[var(--radius)] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <div className="flex items-center justify-between text-sm">
              <Link to="/admin/forgot-password" className="text-accent transition hover:text-accent-hover">
                Forgot Password?
              </Link>
              <Link to="/admin/signup" className="text-accent transition hover:text-accent-hover">
                Create Admin
              </Link>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Sign In
            </Button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;
