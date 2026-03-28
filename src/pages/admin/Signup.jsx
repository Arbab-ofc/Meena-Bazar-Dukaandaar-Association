import { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { signUp } from '@/services/firebase/authService';
import { createAdminProfile } from '@/services/firestore/adminService';
import { useAuth } from '@/hooks/useAuth';
import { isRequired, isValidEmail } from '@/utils/validators';

const Signup = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Admin Signup | Meena Bazar Dukaandaar Association';
  }, []);

  if (!isLoading && isAdmin) return <Navigate to="/admin/dashboard" replace />;

  const validate = () => {
    if (!isRequired(values.name)) return 'Name is required.';
    if (!isValidEmail(values.email)) return 'Valid email is required.';
    if (values.password.length < 8) return 'Password must be at least 8 characters.';
    if (values.password !== values.confirmPassword) return 'Password confirmation does not match.';

    const envKey = import.meta.env.VITE_ADMIN_SECRET_KEY;
    if (!envKey || values.adminKey !== envKey) return 'Invalid admin secret key.';

    return null;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const credential = await signUp(values.email.trim(), values.password);
      await createAdminProfile({
        uid: credential.user.uid,
        name: values.name.trim(),
        email: values.email.trim(),
        role: 'Admin'
      });
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      if (err?.code === 'permission-denied' || String(err?.message).includes('permission')) {
        setError('Signup blocked by Firestore rules. Allow admin profile creation for signup flow.');
      } else {
        setError(err.message || 'Unable to create admin account.');
      }
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
          <p className="text-xs uppercase tracking-[0.24em] text-gold">Admin Enrollment</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight text-text md:text-5xl">
            Create Authorized Access
          </h1>
          <p className="mt-6 text-text-muted">
            Register a new administrator account using the institutional secret key.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-bg px-4 py-2 text-sm text-text-muted">
            <KeyRound className="h-4 w-4 text-gold" /> Secret key protected registration
          </div>
        </section>

        <section className="p-6 md:p-8 lg:col-span-7">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Admin Sign Up</p>
          <h2 className="mt-2 font-heading text-4xl text-text md:text-5xl">Create Account</h2>
          <p className="mt-2 text-sm text-text-muted">Set up administrator credentials.</p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Full Name"
              value={values.name}
              onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={values.email}
              onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
              required
            />
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
              rightIcon={
                <button type="button" onClick={() => setShowPassword((prev) => !prev)} aria-label="Toggle password visibility">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
              required
            />
            <Input
              label="Confirm Password"
              type="password"
              value={values.confirmPassword}
              onChange={(event) => setValues((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              required
            />
            <Input
              label="Admin Secret Key"
              type="password"
              value={values.adminKey}
              onChange={(event) => setValues((prev) => ({ ...prev, adminKey: event.target.value }))}
              required
            />

            {error ? (
              <p className="rounded-[var(--radius)] border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            ) : null}

            <Button type="submit" loading={loading} className="w-full">
              Create Admin Account
            </Button>
          </form>

          <Link to="/admin/login" className="mt-4 inline-block text-sm text-accent transition hover:text-accent-hover">
            Back to Login
          </Link>
        </section>
      </div>
    </div>
  );
};

export default Signup;
