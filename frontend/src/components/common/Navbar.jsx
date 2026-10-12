import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Compass,
  Sparkles,
  Users,
  LayoutDashboard,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  ArrowRightLeft
} from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout, switchRole, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleRole = () => {
    switchRole(isAdmin ? 'student' : 'admin');
    if (!isAdmin) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <nav className="pm-navbar py-2 px-3 px-lg-4" aria-label="Main Navigation">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        {/* Brand */}
        <Link to="/" className="pm-nav-brand text-decoration-none">
          <div
            className="d-flex align-items-center justify-content-center rounded-3 bg-violet-gradient text-white"
            style={{ width: 36, height: 36, boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)' }}
          >
            <Users size={20} />
          </div>
          <span className="fw-bold tracking-tight text-white">
            Project<span style={{ color: 'var(--pm-violet-400)' }}>Match</span>
          </span>
          <span className="brand-dot" aria-hidden="true"></span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="d-none d-lg-flex align-items-center gap-1">
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
            Discover Projects
          </NavLink>
          <NavLink
            to="/recommendations"
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            <Sparkles size={16} />
            Recommendations
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            <Users size={16} />
            My Teams & Tasks
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={16} />
            Student Dashboard
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
          >
            <ShieldAlert size={16} />
            Admin
          </NavLink>
        </div>

        {/* User / Auth Controls */}
        <div className="d-none d-lg-flex align-items-center gap-3">
          {currentUser ? (
            <div className="d-flex align-items-center gap-2">
              {/* Role Switcher Pill */}
              <button
                type="button"
                onClick={toggleRole}
                className="btn btn-sm text-nowrap d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                style={{
                  backgroundColor: isAdmin ? 'rgba(239, 68, 68, 0.15)' : 'rgba(124, 58, 237, 0.2)',
                  color: isAdmin ? '#fca5a5' : '#c4b5fd',
                  border: `1px solid ${isAdmin ? 'rgba(239, 68, 68, 0.3)' : 'rgba(124, 58, 237, 0.4)'}`
                }}
                title="Switch demo preview between Student & Admin view"
              >
                <ArrowRightLeft size={13} />
                <span className="small fw-semibold">
                  Role: {isAdmin ? 'Admin' : 'Student'}
                </span>
              </button>

              {/* User Avatar & Name */}
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="d-flex align-items-center gap-2 text-decoration-none text-light py-1 px-2 rounded-2"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
              >
                <img
                  src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
                  alt={currentUser.name}
                  className="rounded-circle border border-2 border-violet"
                  style={{ width: 32, height: 32, objectFit: 'cover' }}
                />
                <div className="text-start d-none d-xl-block">
                  <div className="fw-semibold text-white small lh-1">{currentUser.name}</div>
                  <small style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    {currentUser.role === 'admin' ? 'Coordinator' : 'Student'}
                  </small>
                </div>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn btn-sm btn-link text-muted p-1"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut size={18} className="text-light opacity-75" />
              </button>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/login" className="btn btn-sm btn-link text-white text-decoration-none fw-semibold">
                Sign In
              </Link>
              <Link to="/register" className="btn-pm-primary btn-sm py-2 px-3">
                Register Free
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle button */}
        <button
          type="button"
          className="btn btn-link text-white d-lg-none p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="d-lg-none pt-3 pb-2 px-2 border-top border-secondary border-opacity-25 mt-2">
          <div className="d-flex flex-column gap-1">
            <NavLink
              to="/"
              end
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/projects"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <Compass size={16} />
              Discover Projects
            </NavLink>
            <NavLink
              to="/recommendations"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <Sparkles size={16} />
              Recommendations
            </NavLink>
            <NavLink
              to="/teams"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <Users size={16} />
              My Teams & Tasks
            </NavLink>
            <NavLink
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={16} />
              Student Dashboard
            </NavLink>
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `pm-nav-link ${isActive ? 'active' : ''}`}
            >
              <ShieldAlert size={16} />
              Admin Portal
            </NavLink>

            <div className="pt-3 mt-2 border-top border-secondary border-opacity-25 d-flex flex-column gap-2">
              {currentUser ? (
                <>
                  <button
                    type="button"
                    onClick={toggleRole}
                    className="btn btn-outline-light btn-sm text-start"
                  >
                    Switch to {isAdmin ? 'Student' : 'Admin'} View
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="btn btn-sm btn-danger text-start d-flex align-items-center gap-2"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="d-flex gap-2">
                  <Link to="/login" className="btn btn-outline-light btn-sm flex-grow-1" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-pm-primary btn-sm flex-grow-1 text-center" onClick={() => setMobileMenuOpen(false)}>
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
