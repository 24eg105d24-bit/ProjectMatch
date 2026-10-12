import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import AlertBanner from '../components/common/AlertBanner';
import { Users, Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: true
  });

  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (formError) setFormError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid university email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const res = await login({
        email: formData.email,
        password: formData.password
      });

      if (res?.success) {
        if (res.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setFormError(err.message || 'Unable to sign in. Please check your credentials.');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div className="d-flex align-items-center justify-content-center rounded-3 bg-violet-gradient text-white p-2 shadow-sm">
              <Users size={22} />
            </div>
            <span className="h4 mb-0 fw-bold text-navy">
              Project<span style={{ color: 'var(--pm-violet-600)' }}>Match</span>
            </span>
          </Link>
          <h2 className="fw-bold text-navy mb-1">Welcome Back</h2>
          <p className="text-muted small">Sign in to manage your student profile and teams</p>
        </div>

        <div className="pm-card p-4 p-sm-5 bg-white shadow-md">
          {formError && (
            <AlertBanner
              type="danger"
              message={formError}
              onClose={() => setFormError('')}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <FormInput
              id="login-email"
              label="University Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. student@university.edu"
              icon={Mail}
              error={errors.email}
              required
              autoComplete="email"
            />

            <FormInput
              id="login-password"
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              icon={Lock}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div className="d-flex align-items-center justify-content-between mb-4">
              <div className="form-check">
                <input
                  className="form-check-checkbox"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label className="form-check-label small text-muted ms-2" htmlFor="rememberMe">
                  Remember this device
                </label>
              </div>

              <span className="small text-violet" style={{ cursor: 'pointer' }}>
                Forgot password?
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2"
              loading={loading}
              icon={LogIn}
            >
              Sign In
            </Button>
          </form>

        </div>

        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Don't have a profile yet?{' '}
            <Link to="/register" className="text-violet fw-semibold">
              Create student account &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
