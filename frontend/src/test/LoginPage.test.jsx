/**
 * LoginPage.test.jsx
 *
 * Behaviour-driven tests for the LoginPage component.
 * Covers: field validation, user interaction, successful/failed login,
 * post-login navigation, and loading-state protection.
 *
 * - api/client is NOT mocked here; instead useAuth is mocked so the
 *   login function is a plain spy, keeping tests fast and deterministic.
 * - useNavigate is mocked via a hoisted spy so we can assert navigation
 *   without running a full MemoryRouter history transition.
 * - No real secrets or backend connections are used.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

// ---------------------------------------------------------------------------
// Hoisted mocks (evaluated before any imports are resolved)
// ---------------------------------------------------------------------------

// Spy for navigate(); hoisted so the vi.mock factory below can reference it.
const mockNavigate = vi.hoisted(() => vi.fn());

// Replace react-router-dom's useNavigate with our spy.
// All other exports (Link, MemoryRouter, etc.) are kept real.
vi.mock('react-router-dom', async (importActual) => {
  const actual = await importActual();
  return { ...actual, useNavigate: () => mockNavigate };
});

// Replace the AuthContext module so we can fully control login() and loading.
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Render helper
// ---------------------------------------------------------------------------

function renderLoginPage(authOverrides = {}) {
  const mockLogin = vi.fn();

  useAuth.mockReturnValue({
    login: mockLogin,
    loading: false,
    isAuthenticated: false,
    currentUser: null,
    ...authOverrides,
  });

  const view = render(
    // MemoryRouter makes Link, useLocation, etc. work inside LoginPage
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>,
  );

  const emailInput    = () => screen.getByLabelText(/university email/i);
  // FormInput renders "Password *" (required asterisk in a sibling <span>),
  // so we query by placeholder text to avoid the regex ambiguity.
  const passwordInput = () => screen.getByPlaceholderText(/^password$/i);
  const submitBtn     = () => screen.getByRole('button', { name: /sign in/i });

  return { ...view, mockLogin, emailInput, passwordInput, submitBtn };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders the email and password fields and the submit button', () => {
    const { emailInput, passwordInput, submitBtn } = renderLoginPage();

    expect(emailInput()).toBeInTheDocument();
    expect(passwordInput()).toBeInTheDocument();
    expect(submitBtn()).toBeInTheDocument();
  });

  // ── Validation: empty fields ───────────────────────────────────────────────

  it('shows an email required error when the form is submitted empty', async () => {
    const user = userEvent.setup();
    const { submitBtn } = renderLoginPage();

    await user.click(submitBtn());

    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();
  });

  it('shows a password required error when only the email is filled in', async () => {
    const user = userEvent.setup();
    const { emailInput, submitBtn } = renderLoginPage();

    await user.type(emailInput(), 'student@university.edu');
    await user.click(submitBtn());

    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
  });

  // ── Validation: format checks ──────────────────────────────────────────────

  it('shows an error for an invalid email format', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn } = renderLoginPage();

    await user.type(emailInput(), 'not-an-email');
    await user.type(passwordInput(), 'password123');
    await user.click(submitBtn());

    expect(await screen.findByText(/valid university email/i)).toBeInTheDocument();
  });

  it('shows an error when the password is fewer than 6 characters', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn } = renderLoginPage();

    await user.type(emailInput(), 'student@university.edu');
    await user.type(passwordInput(), '123');
    await user.click(submitBtn());

    expect(await screen.findByText(/at least 6 characters/i)).toBeInTheDocument();
  });

  // ── Validation errors are cleared on next input ────────────────────────────

  it('clears the email error as soon as the user starts correcting it', async () => {
    const user = userEvent.setup();
    const { emailInput, submitBtn } = renderLoginPage();

    await user.click(submitBtn()); // trigger error
    expect(await screen.findByText(/email address is required/i)).toBeInTheDocument();

    await user.type(emailInput(), 'a'); // start correcting
    expect(screen.queryByText(/email address is required/i)).not.toBeInTheDocument();
  });

  // ── Successful login ───────────────────────────────────────────────────────

  it('calls login() with the entered credentials on submit', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn, mockLogin } = renderLoginPage();

    mockLogin.mockResolvedValueOnce({ success: true, user: { role: 'student' } });

    await user.type(emailInput(), 'student@university.edu');
    await user.type(passwordInput(), 'mypassword');
    await user.click(submitBtn());

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'student@university.edu',
        password: 'mypassword',
      });
    });
  });

  it('navigates to /dashboard after a successful student login', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn, mockLogin } = renderLoginPage();

    mockLogin.mockResolvedValueOnce({ success: true, user: { role: 'student' } });

    await user.type(emailInput(), 'student@university.edu');
    await user.type(passwordInput(), 'mypassword');
    await user.click(submitBtn());

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/dashboard'));
  });

  it('navigates to /admin after a successful admin login', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn, mockLogin } = renderLoginPage();

    mockLogin.mockResolvedValueOnce({ success: true, user: { role: 'admin' } });

    await user.type(emailInput(), 'admin@university.edu');
    await user.type(passwordInput(), 'adminpass');
    await user.click(submitBtn());

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin'));
  });

  // ── Failed login ───────────────────────────────────────────────────────────

  it('displays an error alert when login() throws (invalid credentials)', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn, mockLogin } = renderLoginPage();

    mockLogin.mockRejectedValueOnce(new Error('Invalid credentials'));

    await user.type(emailInput(), 'student@university.edu');
    await user.type(passwordInput(), 'wrongpass');
    await user.click(submitBtn());

    // AlertBanner renders with role="alert"
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/invalid credentials/i);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows a fallback error message when the error has no message', async () => {
    const user = userEvent.setup();
    const { emailInput, passwordInput, submitBtn, mockLogin } = renderLoginPage();

    mockLogin.mockRejectedValueOnce(new Error());

    await user.type(emailInput(), 'student@university.edu');
    await user.type(passwordInput(), 'mypassword');
    await user.click(submitBtn());

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/unable to sign in/i);
  });

  // ── Loading state ──────────────────────────────────────────────────────────

  it('disables the submit button while loading is true', () => {
    renderLoginPage({ loading: true });

    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toBeDisabled();
  });

  it('shows a spinner inside the button while loading is true', () => {
    renderLoginPage({ loading: true });

    // Button component renders <span role="status" aria-hidden="true"> when loading
    const spinner = screen.getByRole('status', { hidden: true });
    expect(spinner).toBeInTheDocument();
  });

  // ── Form does not submit when validation fails ─────────────────────────────

  it('does not call login() when the form has validation errors', async () => {
    const user = userEvent.setup();
    const { submitBtn, mockLogin } = renderLoginPage();

    await user.click(submitBtn());

    expect(mockLogin).not.toHaveBeenCalled();
  });
});
