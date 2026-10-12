/**
 * ProtectedRoute.test.jsx
 *
 * Tests for the ProtectedRoute route-guard component.
 * Covers: loading state, unauthenticated redirect, authenticated access,
 * role-based access control, and ROLE_ prefix normalisation.
 *
 * Network is never touched — only the AuthContext hook is mocked.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';

// Replace the entire AuthContext module; useAuth is the only export needed here.
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Render helper
// ---------------------------------------------------------------------------

/**
 * Renders the ProtectedRoute inside a MemoryRouter with sentinel routes so we
 * can detect where navigation lands.
 */
function renderProtectedRoute({ children, requiredRole, initialPath = '/protected' } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              {children ?? <div>Protected Content</div>}
            </ProtectedRoute>
          }
        />
        {/* Sentinel routes — their text confirms where Navigation landed */}
        <Route path="/login"     element={<div>Login Page</div>} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route path="/"          element={<div>Home Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it('shows a spinner while authentication is still resolving', () => {
    useAuth.mockReturnValue({ loading: true, isAuthenticated: false, currentUser: null });

    renderProtectedRoute();

    // The Bootstrap spinner has role="status"
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading session...')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  // ── Unauthenticated ────────────────────────────────────────────────────────

  it('redirects unauthenticated users to /login', () => {
    useAuth.mockReturnValue({ loading: false, isAuthenticated: false, currentUser: null });

    renderProtectedRoute();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('redirects when currentUser is null even if isAuthenticated is incorrectly true', () => {
    // Guards against a state inconsistency: isAuthenticated flag true but no user object.
    useAuth.mockReturnValue({ loading: false, isAuthenticated: true, currentUser: null });

    renderProtectedRoute();

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  // ── Authenticated — no role restriction ───────────────────────────────────

  it('renders children for an authenticated user when no role is required', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'student' },
    });

    renderProtectedRoute({ children: <div>My Protected Content</div> });

    expect(screen.getByText('My Protected Content')).toBeInTheDocument();
  });

  // ── Role-based access: student ────────────────────────────────────────────

  it('allows students to access student-only routes', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'student' },
    });

    renderProtectedRoute({ children: <div>Student Area</div>, requiredRole: 'student' });

    expect(screen.getByText('Student Area')).toBeInTheDocument();
  });

  it('redirects a student away from admin routes to /dashboard', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'student' },
    });

    renderProtectedRoute({ children: <div>Admin Only</div>, requiredRole: 'admin' });

    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only')).not.toBeInTheDocument();
  });

  // ── Role-based access: admin ──────────────────────────────────────────────

  it('allows an admin to access admin-only routes', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'admin' },
    });

    renderProtectedRoute({ children: <div>Admin Panel</div>, requiredRole: 'admin' });

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('redirects an unknown role away from restricted routes to /', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'moderator' },
    });

    renderProtectedRoute({ children: <div>Admin Only</div>, requiredRole: 'admin' });

    expect(screen.getByText('Home Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Only')).not.toBeInTheDocument();
  });

  // ── ROLE_ prefix normalisation ────────────────────────────────────────────

  it('normalises ROLE_ prefix in the currentUser role', () => {
    // Backend sometimes returns "ROLE_ADMIN"; the component should strip it.
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'ROLE_ADMIN' },
    });

    renderProtectedRoute({ children: <div>Normalised Admin</div>, requiredRole: 'admin' });

    expect(screen.getByText('Normalised Admin')).toBeInTheDocument();
  });

  it('normalises ROLE_ prefix in the requiredRole prop', () => {
    useAuth.mockReturnValue({
      loading: false,
      isAuthenticated: true,
      currentUser: { role: 'admin' },
    });

    renderProtectedRoute({ children: <div>RequiredRole Normalised</div>, requiredRole: 'ROLE_ADMIN' });

    expect(screen.getByText('RequiredRole Normalised')).toBeInTheDocument();
  });
});
