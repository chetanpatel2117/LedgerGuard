import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ledgerguard.jwt';

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: '' }));
    }
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });

      const payload = await response.json();

      if (!response.ok || typeof payload.token !== 'string') {
        throw new Error(payload.message || 'Login failed. Please try again.');
      }

      localStorage.setItem(STORAGE_KEY, payload.token);
      navigate('/dashboard');
    } catch (error) {
      setErrors({
        submit: error.message || 'Login failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="brand-block">
          <div className="brand-mark">LG</div>
          <div>
            <p className="eyebrow">Secure finance</p>
            <h1>LedgerGuard</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <h2>Welcome back</h2>
          <p className="form-copy">Sign in to access your financial operations.</p>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="auth-switch">
            New to LedgerGuard? <Link to="/register">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
