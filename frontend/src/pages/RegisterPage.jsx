import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/common/FormInput';
import Button from '../components/common/Button';
import AlertBanner from '../components/common/AlertBanner';
import { Users, Mail, Lock, User, Clock, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Computer Science & Engineering',
    year: 'Junior (Year 3)',
    preferredRoles: 'Frontend Lead',
    hoursPerWeek: '15',
    skills: 'React, JavaScript, Figma, Node.js',
    interests: 'EdTech, Collaborative Tools, Healthcare AI',
    agreeTerms: true
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
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'University email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please provide a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the academic team collaboration guidelines.';
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
      const res = await register(formData);
      if (res?.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to create account. Please review your details.');
    }
  };

  return (
    <div className="py-5 bg-light min-vh-100 d-flex align-items-center">
      <div className="container" style={{ maxWidth: '640px' }}>
        <div className="text-center mb-4">
          <Link to="/" className="d-inline-flex align-items-center gap-2 text-decoration-none mb-3">
            <div className="d-flex align-items-center justify-content-center rounded-3 bg-violet-gradient text-white p-2 shadow-sm">
              <Users size={22} />
            </div>
            <span className="h4 mb-0 fw-bold text-navy">
              Project<span style={{ color: 'var(--pm-violet-600)' }}>Match</span>
            </span>
          </Link>
          <h2 className="fw-bold text-navy mb-1">Create Student Profile</h2>
          <p className="text-muted small">Connect with peers for capstone projects and research teams</p>
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
            <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom">1. Account Credentials</h6>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <FormInput
                  label="Full Name"
                  name="fullName"
                  placeholder="e.g. Jordan Rivera"
                  value={formData.fullName}
                  onChange={handleChange}
                  icon={User}
                  error={errors.fullName}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  label="University Email"
                  name="email"
                  type="email"
                  placeholder="e.g. j.rivera@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  icon={Mail}
                  error={errors.email}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  icon={Lock}
                  error={errors.password}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  icon={Lock}
                  error={errors.confirmPassword}
                  required
                />
              </div>
            </div>

            <h6 className="fw-bold text-navy mt-4 mb-3 pb-2 border-bottom">2. Academic Background & Matching Info</h6>

            <div className="row g-3">
              <div className="col-12 col-md-6">
                <FormInput
                  type="select"
                  label="Academic Department / Major"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={[
                    { value: 'Computer Science & Engineering', label: 'Computer Science & Engineering' },
                    { value: 'Design & Interaction Media', label: 'Design & Interaction Media' },
                    { value: 'Data Science & Statistics', label: 'Data Science & Statistics' },
                    { value: 'Electrical & Computer Engineering', label: 'Electrical & Computer Eng.' },
                    { value: 'Business Information Systems', label: 'Business Information Systems' }
                  ]}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  type="select"
                  label="Academic Year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  options={[
                    { value: 'Freshman (Year 1)', label: 'Freshman (Year 1)' },
                    { value: 'Sophomore (Year 2)', label: 'Sophomore (Year 2)' },
                    { value: 'Junior (Year 3)', label: 'Junior (Year 3)' },
                    { value: 'Senior (Year 4)', label: 'Senior (Year 4)' },
                    { value: 'Graduate Student', label: 'Graduate Student' }
                  ]}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  type="select"
                  label="Primary Preferred Role"
                  name="preferredRoles"
                  value={formData.preferredRoles}
                  onChange={handleChange}
                  options={[
                    { value: 'Frontend Lead', label: 'Frontend Lead / Architect' },
                    { value: 'Backend Engineer', label: 'Backend & Database Engineer' },
                    { value: 'Full Stack Developer', label: 'Full Stack Developer' },
                    { value: 'UI/UX Designer', label: 'UI/UX & Product Designer' },
                    { value: 'ML / Data Scientist', label: 'ML / Data Scientist' },
                    { value: 'DevOps & Systems', label: 'DevOps & Systems Specialist' }
                  ]}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <FormInput
                  type="number"
                  label="Weekly Hours Available"
                  name="hoursPerWeek"
                  min="5"
                  max="40"
                  value={formData.hoursPerWeek}
                  onChange={handleChange}
                  icon={Clock}
                  helperText="Average capstone commitment"
                  required
                />
              </div>

              <div className="col-12">
                <FormInput
                  label="Technical Skills (Comma separated)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="e.g. React, Python, Figma, Docker"
                  helperText="Helps match you with complementary teammates"
                />
              </div>

              <div className="col-12">
                <FormInput
                  label="Project Interests / Domains (Comma separated)"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="e.g. EdTech, GreenTech, Healthcare AI"
                />
              </div>
            </div>

            <div className="my-4">
              <div className="form-check">
                <input
                  className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <label className="form-check-label small text-muted" htmlFor="agreeTerms">
                  I agree to follow university academic honesty and respectful team collaboration standards.
                </label>
                {errors.agreeTerms && (
                  <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-100 py-2"
              loading={loading}
              icon={CheckCircle}
            >
              Complete Registration & Enter Dashboard
            </Button>
          </form>
        </div>

        <div className="text-center mt-4">
          <p className="text-muted small mb-0">
            Already registered?{' '}
            <Link to="/login" className="text-violet fw-semibold">
              Sign in to your profile &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
