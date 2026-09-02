import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const STORAGE_KEY = 'ledgerguard.jwt';

const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
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

    if (!formData.name.trim()) nextErrors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required.';
    } else if (!validateEmail(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.password) {
      nextErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters long.';
    }
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.';
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
      await new Promise((resolve) => setTimeout(resolve, 350));
      const token = `demo.${btoa(`${formData.email}:${Date.now()}`)}.session`;
      localStorage.setItem(STORAGE_KEY, token);
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
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
          <h2>Create your account</h2>
          <p className="form-copy">Set up your secure workspace in a few seconds.</p>

          <label htmlFor="name">Full name</label>
          <input id="name" name="name" type="text" autoComplete="name" value={formData.name} onChange={handleChange} placeholder="enter your name" aria-invalid={Boolean(errors.name)} />
          {errors.name && <span className="field-error">{errors.name}</span>}

          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" autoComplete="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" aria-invalid={Boolean(errors.email)} />
          {errors.email && <span className="field-error">{errors.email}</span>}

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" value={formData.password} onChange={handleChange} placeholder="At least 6 characters" aria-invalid={Boolean(errors.password)} />
          {errors.password && <span className="field-error">{errors.password}</span>}

          <label htmlFor="confirmPassword">Confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter your password" aria-invalid={Boolean(errors.confirmPassword)} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;