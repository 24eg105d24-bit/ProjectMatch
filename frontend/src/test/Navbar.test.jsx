import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

import { useAuth } from '../context/AuthContext';

function renderNavbar(initialPath = '/') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Navbar />
    </MemoryRouter>
  );
}

describe('Navbar Component', () => {
  const mockLogout = vi.fn();
  const mockSwitchRole = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Unauthenticated state', () => {
    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: null,
        isAuthenticated: false,
        isAdmin: false,
        logout: mockLogout,
        switchRole: mockSwitchRole
      });
    });

    it('renders ProjectMatch brand logo and public links', () => {
      renderNavbar();

      expect(screen.getByText('Project')).toBeInTheDocument();
      expect(screen.getByText('Match')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Home$/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Discover Projects/i })).toBeInTheDocument();
    });

    it('renders Sign In and Register buttons', () => {
      renderNavbar();

      expect(screen.getByRole('link', { name: /Sign In/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Register Free/i })).toBeInTheDocument();
    });

    it('does not render protected navigation destinations or profile dropdown', () => {
      renderNavbar();

      expect(screen.queryByText('Recommendations')).not.toBeInTheDocument();
      expect(screen.queryByText('Teams & Tasks')).not.toBeInTheDocument();
      expect(screen.queryByText('Admin Portal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('profile-dropdown-trigger')).not.toBeInTheDocument();
    });
  });

  describe('Student authenticated state', () => {
    const studentUser = {
      id: 1,
      name: 'Alex Chen',
      email: 'alex@example.edu',
      role: 'student',
      avatar: ''
    };

    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: studentUser,
        isAuthenticated: true,
        isAdmin: false,
        logout: mockLogout,
        switchRole: mockSwitchRole
      });
    });

    it('renders student navigation links and excludes admin portal', () => {
      renderNavbar();

      expect(screen.getByRole('link', { name: /Recommendations/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Teams & Tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /^Dashboard$/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Admin Portal/i })).not.toBeInTheDocument();
    });

    it('renders compact user profile trigger with name, avatar initials, and role badge', () => {
      renderNavbar();

      const trigger = screen.getByTestId('profile-dropdown-trigger');
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent('Alex Chen');
      expect(trigger).toHaveTextContent('Student');
      // Initials in avatar
      expect(trigger).toHaveTextContent('AC');
    });

    it('opens profile dropdown menu when clicking trigger and closes on Escape', async () => {
      renderNavbar();

      const trigger = screen.getByTestId('profile-dropdown-trigger');
      expect(screen.queryByTestId('profile-dropdown-menu')).not.toBeInTheDocument();

      // Click to open
      await userEvent.click(trigger);
      const menu = screen.getByTestId('profile-dropdown-menu');
      expect(menu).toBeInTheDocument();
      expect(menu).toHaveTextContent('Alex Chen');
      expect(menu).toHaveTextContent('alex@example.edu');
      expect(menu).toHaveTextContent('Verified Student');

      // Close on Escape
      fireEvent.keyDown(document, { key: 'Escape' });
      expect(screen.queryByTestId('profile-dropdown-menu')).not.toBeInTheDocument();
    });

    it('calls logout when clicking Sign Out in the dropdown', async () => {
      renderNavbar();

      const trigger = screen.getByTestId('profile-dropdown-trigger');
      await userEvent.click(trigger);

      const logoutBtn = screen.getByTestId('logout-button');
      await userEvent.click(logoutBtn);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  describe('Admin authenticated state', () => {
    const adminUser = {
      id: 2,
      name: 'Dr. Sarah Connor',
      email: 'admin@projectmatch.edu',
      role: 'admin',
      avatar: ''
    };

    beforeEach(() => {
      useAuth.mockReturnValue({
        currentUser: adminUser,
        isAuthenticated: true,
        isAdmin: true,
        logout: mockLogout,
        switchRole: mockSwitchRole
      });
    });

    it('renders Admin Portal link and hides student-specific links in main bar', () => {
      renderNavbar();

      expect(screen.getByRole('link', { name: /Admin Portal/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Recommendations/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /Teams & Tasks/i })).not.toBeInTheDocument();
    });

    it('shows Admin role badge on trigger and Platform Administrator in dropdown', async () => {
      renderNavbar();

      const trigger = screen.getByTestId('profile-dropdown-trigger');
      expect(trigger).toHaveTextContent('Admin');

      await userEvent.click(trigger);
      const menu = screen.getByTestId('profile-dropdown-menu');
      expect(menu).toHaveTextContent('Platform Administrator');
    });
  });

  describe('Mobile menu responsive drawer', () => {
    it('toggles mobile drawer when clicking hamburger button and allows sign out', async () => {
      useAuth.mockReturnValue({
        currentUser: {
          id: 1,
          name: 'Alex Chen',
          email: 'alex@example.edu',
          role: 'student'
        },
        isAuthenticated: true,
        isAdmin: false,
        logout: mockLogout,
        switchRole: mockSwitchRole
      });

      renderNavbar();

      expect(screen.queryByTestId('mobile-drawer')).not.toBeInTheDocument();

      const toggle = screen.getByTestId('mobile-menu-toggle');
      await userEvent.click(toggle);

      expect(screen.getByTestId('mobile-drawer')).toBeInTheDocument();

      const mobileLogout = screen.getByTestId('mobile-logout-button');
      await userEvent.click(mobileLogout);

      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
