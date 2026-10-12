import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import {
  Compass,
  Sparkles,
  Users,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ChevronDown,
  User,
  FolderKanban
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, switchRole, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close profile dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    logout();
    navigate('/login');
  };

  const handleRoleToggle = () => {
    const nextRole = isAdmin ? 'student' : 'admin';
    switchRole(nextRole);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate(nextRole === 'admin' ? '/admin' : '/dashboard');
  };

  const closeMenus = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="pm-navbar py-2 px-3 px-lg-4" aria-label="Main Navigation">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Left: Brand */}
        <Link to="/" className="pm-nav-brand text-decoration-none" onClick={closeMenus}>
          <div
            className="d-flex align-items-center justify-content-center rounded-3 bg-violet-gradient text-white flex-shrink-0"
            style={{ width: 36, height: 36, boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)' }}
          >
            <Users size={20} />
          </div>
          <span className="fw-bold tracking-tight text-white ms-1">
            Project<span style={{ color: 'var(--pm-violet-400)' }}>Match</span>
          </span>
          <span className="brand-dot" aria-hidden="true"></span>
        </Link>

        {/* Center: Desktop Navigation Links (Clean, streamlined) */}
        <div className="d-none d-lg-flex align-items-center gap-1 mx-auto">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/projects"
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            <Compass size={16} />
            <span>Discover Projects</span>
          </NavLink>

          {currentUser && (
            <>
              {!isAdmin && (
                <>
                  <NavLink
                    to="/recommendations"
                    className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Sparkles size={16} />
                    <span>Recommendations</span>
                  </NavLink>
                  <NavLink
                    to="/teams"
                    className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <FolderKanban size={16} />
                    <span>Teams & Tasks</span>
                  </NavLink>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </NavLink>
                </>
              )}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                >
                  <ShieldAlert size={16} />
                  <span>Admin Portal</span>
                </NavLink>
              )}
            </>
          )}
        </div>

        {/* Right: Desktop Auth & Profile Controls */}
        <div className="d-none d-lg-flex align-items-center gap-2">
          {currentUser ? (
            <div className="position-relative" ref={dropdownRef}>
              {/* Compact User Trigger Button */}
              <button
                type="button"
                onClick={() => setProfileDropdownOpen(prev => !prev)}
                className="btn btn-sm d-flex align-items-center gap-2 py-1 px-2 rounded-pill border-0 transition"
                style={{
                  backgroundColor: profileDropdownOpen ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
                  color: '#ffffff',
                  outline: 'none'
                }}
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
                aria-label="User account menu"
                data-testid="profile-dropdown-trigger"
              >
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size={32}
                  shape="circle"
                />
                <span className="fw-semibold text-white small text-truncate" style={{ maxWidth: 120 }}>
                  {currentUser.name}
                </span>
                <span
                  className="badge rounded-pill px-2 py-1 small fw-semibold"
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.25)',
                    color: isAdmin ? '#fca5a5' : '#c4b5fd',
                    border: `1px solid ${isAdmin ? 'rgba(239, 68, 68, 0.35)' : 'rgba(124, 58, 237, 0.4)'}`
                  }}
                >
                  {isAdmin ? 'Admin' : 'Student'}
                </span>
                <ChevronDown
                  size={14}
                  className="text-white opacity-75 ms-1"
                  style={{
                    transform: profileDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease'
                  }}
                />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className="position-absolute end-0 mt-2 py-2 rounded-3 shadow-lg"
                  style={{
                    width: 260,
                    backgroundColor: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    backdropFilter: 'blur(16px)',
                    zIndex: 1050
                  }}
                  role="menu"
                  aria-label="User profile options"
                  data-testid="profile-dropdown-menu"
                >
                  {/* Account Header */}
                  <div className="px-3 py-2 border-bottom border-secondary border-opacity-25 d-flex align-items-center gap-3">
                    <Avatar
                      src={currentUser.avatar}
                      name={currentUser.name}
                      size={40}
                      shape="circle"
                    />
                    <div className="overflow-hidden">
                      <div className="fw-bold text-white small text-truncate">{currentUser.name}</div>
                      <div className="text-muted text-truncate" style={{ fontSize: '0.75rem' }}>
                        {currentUser.email}
                      </div>
                      <div className="mt-1">
                        <span
                          className="badge rounded-pill px-2 py-0.5"
                          style={{
                            fontSize: '0.65rem',
                            backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.2)',
                            color: isAdmin ? '#fca5a5' : '#c4b5fd'
                          }}
                        >
                          {isAdmin ? 'Platform Administrator' : 'Verified Student'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Quick Links */}
                  <div className="py-1">
                    {isAdmin ? (
                      <Link
                        to="/admin"
                        onClick={closeMenus}
                        className="dropdown-item px-3 py-2 text-light small d-flex align-items-center gap-2 hover-bg-dark"
                        role="menuitem"
                      >
                        <ShieldAlert size={16} className="text-danger" />
                        <span>Admin Portal</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={closeMenus}
                          className="dropdown-item px-3 py-2 text-light small d-flex align-items-center gap-2 hover-bg-dark"
                          role="menuitem"
                        >
                          <LayoutDashboard size={16} className="text-violet-light" />
                          <span>Student Dashboard</span>
                        </Link>
                        <Link
                          to="/teams"
                          onClick={closeMenus}
                          className="dropdown-item px-3 py-2 text-light small d-flex align-items-center gap-2 hover-bg-dark"
                          role="menuitem"
                        >
                          <Users size={16} className="text-violet-light" />
                          <span>My Teams & Tasks</span>
                        </Link>
                        <Link
                          to="/recommendations"
                          onClick={closeMenus}
                          className="dropdown-item px-3 py-2 text-light small d-flex align-items-center gap-2 hover-bg-dark"
                          role="menuitem"
                        >
                          <Sparkles size={16} className="text-violet-light" />
                          <span>Recommendations</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Role Switcher (Preview helper) */}
                  <div className="px-3 py-1 border-top border-secondary border-opacity-25">
                    <button
                      type="button"
                      onClick={handleRoleToggle}
                      className="btn btn-sm btn-link text-muted p-0 text-decoration-none small d-flex align-items-center gap-2 w-100 text-start"
                      title="Toggle demo preview role"
                    >
                      <User size={14} />
                      <span style={{ fontSize: '0.78rem' }}>
                        Preview as {isAdmin ? 'Student' : 'Admin'}
                      </span>
                    </button>
                  </div>

                  <div className="border-top border-secondary border-opacity-25 my-1"></div>

                  {/* Sign Out Action */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-item px-3 py-2 text-danger small d-flex align-items-center gap-2 hover-bg-danger-subtle w-100 text-start"
                    role="menuitem"
                    data-testid="logout-button"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-link text-white text-decoration-none fw-semibold px-3">
                Sign In
              </Link>
              <Link to="/register" className="btn-pm-primary btn-sm py-2 px-3">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle hamburger button */}
        <button
          type="button"
          className="btn btn-link text-white d-lg-none p-1 border-0"
          onClick={() => setMobileMenuOpen(prev => !prev)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
          data-testid="mobile-menu-toggle"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Responsive Mobile Drawer (< 992px) */}
      {mobileMenuOpen && (
        <div
          className="d-lg-none pt-3 pb-3 px-3 border-top border-secondary border-opacity-25 mt-2"
          data-testid="mobile-drawer"
        >
          {/* User Profile Banner on Mobile */}
          {currentUser && (
            <div
              className="p-3 mb-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}
            >
              <div className="d-flex align-items-center gap-3">
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size={42}
                  shape="circle"
                />
                <div>
                  <div className="fw-bold text-white small">{currentUser.name}</div>
                  <div className="text-muted small" style={{ fontSize: '0.75rem' }}>{currentUser.email}</div>
                </div>
              </div>
              <span
                className="badge rounded-pill px-2 py-1 small"
                style={{
                  backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.2)' : 'rgba(124, 58, 237, 0.25)',
                  color: isAdmin ? '#fca5a5' : '#c4b5fd',
                  border: `1px solid ${isAdmin ? 'rgba(239, 68, 68, 0.35)' : 'rgba(124, 58, 237, 0.4)'}`
                }}
              >
                {isAdmin ? 'Admin' : 'Student'}
              </span>
            </div>
          )}

          {/* Navigation Links */}
          <div className="d-flex flex-column gap-1">
            <NavLink
              to="/"
              end
              onClick={closeMenus}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              onClick={closeMenus}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <Compass size={16} />
              <span>Discover Projects</span>
            </NavLink>

            {currentUser && (
              <>
                {!isAdmin && (
                  <>
                    <NavLink
                      to="/recommendations"
                      onClick={closeMenus}
                      className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <Sparkles size={16} />
                      <span>Recommendations</span>
                    </NavLink>
                    <NavLink
                      to="/teams"
                      onClick={closeMenus}
                      className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <FolderKanban size={16} />
                      <span>My Teams & Tasks</span>
                    </NavLink>
                    <NavLink
                      to="/dashboard"
                      onClick={closeMenus}
                      className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                    >
                      <LayoutDashboard size={16} />
                      <span>Student Dashboard</span>
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <NavLink
                    to="/admin"
                    onClick={closeMenus}
                    className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
                  >
                    <ShieldAlert size={16} />
                    <span>Admin Portal</span>
                  </NavLink>
                )}
              </>
            )}

            {/* Mobile Footer Actions */}
            <div className="pt-3 mt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
              {currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={handleRoleToggle}
                    className="btn btn-outline-secondary btn-sm text-start text-light py-2"
                  >
                    Switch to {isAdmin ? 'Student' : 'Admin'} View
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-sm btn-danger text-start d-flex align-items-center gap-2 py-2"
                    data-testid="mobile-logout-button"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-sm flex-grow-1 py-2 text-center"
                    onClick={closeMenus}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn-pm-primary btn-sm flex-grow-1 text-center py-2"
                    onClick={closeMenus}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
