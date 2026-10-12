/**
 * AuthContext.test.jsx
 *
 * Unit tests for AuthProvider / useAuth hook.
 * Covers: initial state, localStorage restoration, login success/failure,
 * token persistence, logout, updateProfile, and isAdmin flag.
 *
 * The api/client module is replaced entirely with a mock so no real HTTP
 * requests are made. jsdom's localStorage is cleared before every test.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// ---------------------------------------------------------------------------
// Mock the Axios client — no real HTTP calls
// ---------------------------------------------------------------------------

vi.mock('../api/client', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}));

import api from '../api/client';

// ---------------------------------------------------------------------------
// Helper: mount AuthProvider and expose the context value
// ---------------------------------------------------------------------------

function renderAuth() {
  // A stable ref-like object so we can read the latest value outside React
  const result = { current: null };

  const Spy = () => {
    result.current = useAuth();
    return null;
  };

  render(
    <AuthProvider>
      <Spy />
    </AuthProvider>,
  );

  return result;
}

// Minimal API response that saveSession() can parse
const makeLoginResponse = (overrides = {}) => ({
  data: {
    userId: 1,
    fullName: 'Test User',
    email: 'test@university.edu',
    role: 'ROLE_STUDENT',
    token: 'test-jwt-token',
    ...overrides,
  },
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // ── Initial state ──────────────────────────────────────────────────────────

  it('starts unauthenticated when localStorage is empty', () => {
    const auth = renderAuth();

    expect(auth.current.isAuthenticated).toBe(false);
    expect(auth.current.currentUser).toBeNull();
    expect(auth.current.loading).toBe(false);
    expect(auth.current.isAdmin).toBe(false);
  });

  // ── localStorage restoration ───────────────────────────────────────────────

  it('restores an existing session from localStorage on mount', () => {
    const saved = {
      id: 5,
      name: 'Alice',
      email: 'alice@university.edu',
      role: 'student',
      token: 'saved-token',
    };
    localStorage.setItem('projectmatch_user', JSON.stringify(saved));

    const auth = renderAuth();

    expect(auth.current.isAuthenticated).toBe(true);
    expect(auth.current.currentUser.email).toBe('alice@university.edu');
    expect(auth.current.currentUser.role).toBe('student');
  });

  it('handles corrupt localStorage data gracefully (starts unauthenticated)', () => {
    localStorage.setItem('projectmatch_user', 'NOT_VALID_JSON{{{');

    const auth = renderAuth();

    expect(auth.current.isAuthenticated).toBe(false);
    expect(auth.current.currentUser).toBeNull();
  });

  // ── Successful login ───────────────────────────────────────────────────────

  it('sets currentUser and returns { success: true } on a successful login', async () => {
    api.post.mockResolvedValueOnce(makeLoginResponse());
    const auth = renderAuth();

    let result;
    await act(async () => {
      result = await auth.current.login({ email: 'test@university.edu', password: 'pass123' });
    });

    expect(result.success).toBe(true);
    expect(auth.current.isAuthenticated).toBe(true);
    expect(auth.current.currentUser.email).toBe('test@university.edu');
  });

  it('strips the ROLE_ prefix so role is stored in lowercase', async () => {
    api.post.mockResolvedValueOnce(makeLoginResponse({ role: 'ROLE_STUDENT' }));
    const auth = renderAuth();

    await act(async () => {
      await auth.current.login({ email: 'test@university.edu', password: 'pass123' });
    });

    expect(auth.current.currentUser.role).toBe('student');
  });

  it('sets isAdmin to true for an admin user', async () => {
    api.post.mockResolvedValueOnce(makeLoginResponse({ role: 'ROLE_ADMIN', email: 'admin@pm.edu' }));
    const auth = renderAuth();

    await act(async () => {
      await auth.current.login({ email: 'admin@pm.edu', password: 'admin123' });
    });

    expect(auth.current.isAdmin).toBe(true);
  });

  it('persists the session token to localStorage after login', async () => {
    api.post.mockResolvedValueOnce(makeLoginResponse({ token: 'persisted-jwt' }));
    const auth = renderAuth();

    await act(async () => {
      await auth.current.login({ email: 'test@university.edu', password: 'pass123' });
    });

    const session = JSON.parse(localStorage.getItem('projectmatch_session'));
    expect(session?.token).toBe('persisted-jwt');
  });

  it('persists currentUser to localStorage so it survives page reload', async () => {
    api.post.mockResolvedValueOnce(makeLoginResponse());
    const auth = renderAuth();

    await act(async () => {
      await auth.current.login({ email: 'test@university.edu', password: 'pass123' });
    });

    const stored = JSON.parse(localStorage.getItem('projectmatch_user'));
    expect(stored?.email).toBe('test@university.edu');
  });

  // ── Failed login ───────────────────────────────────────────────────────────

  it('propagates the error thrown by the API on a failed login', async () => {
    api.post.mockRejectedValueOnce(new Error('Invalid credentials'));
    const auth = renderAuth();

    await expect(
      act(async () => {
        await auth.current.login({ email: 'bad@test.com', password: 'wrong' });
      }),
    ).rejects.toThrow('Invalid credentials');
  });

  it('resets loading to false after a login error (no stuck spinner)', async () => {
    api.post.mockRejectedValueOnce(new Error('Network error'));
    const auth = renderAuth();

    try {
      await act(async () => {
        await auth.current.login({ email: 'x@test.com', password: 'pass' });
      });
    } catch {
      // expected — we just want to check loading is reset
    }

    expect(auth.current.loading).toBe(false);
  });

  // ── Logout ─────────────────────────────────────────────────────────────────

  it('clears currentUser and removes both localStorage keys on logout', async () => {
    const saved = { id: 1, name: 'Bob', email: 'bob@uni.edu', role: 'student', token: 't' };
    localStorage.setItem('projectmatch_user', JSON.stringify(saved));
    localStorage.setItem('projectmatch_session', JSON.stringify({ token: 't' }));
    const auth = renderAuth();

    expect(auth.current.isAuthenticated).toBe(true);

    act(() => {
      auth.current.logout();
    });

    await waitFor(() => {
      expect(auth.current.isAuthenticated).toBe(false);
      expect(auth.current.currentUser).toBeNull();
      expect(localStorage.getItem('projectmatch_user')).toBeNull();
      expect(localStorage.getItem('projectmatch_session')).toBeNull();
    });
  });

  // ── updateProfile ──────────────────────────────────────────────────────────

  it('merges updated fields into the existing currentUser via updateProfile', async () => {
    const saved = {
      id: 2,
      name: 'Carol',
      email: 'carol@uni.edu',
      role: 'student',
      token: 't',
      department: 'CSE',
      skills: [],
    };
    localStorage.setItem('projectmatch_user', JSON.stringify(saved));
    const auth = renderAuth();

    act(() => {
      auth.current.updateProfile({ department: 'ECE', skills: ['React', 'Java'] });
    });

    await waitFor(() => {
      expect(auth.current.currentUser.department).toBe('ECE');
      expect(auth.current.currentUser.skills).toEqual(['React', 'Java']);
      // Fields not in the update are preserved
      expect(auth.current.currentUser.email).toBe('carol@uni.edu');
    });
  });

  it('does nothing on updateProfile when there is no current user', () => {
    const auth = renderAuth();
    // Should not throw
    act(() => {
      auth.current.updateProfile({ department: 'ECE' });
    });
    expect(auth.current.currentUser).toBeNull();
  });
});
