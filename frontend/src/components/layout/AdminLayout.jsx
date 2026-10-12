import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  FolderKanban,
  GitMerge,
  BarChart3,
  Settings,
  ArrowLeft,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

const AdminLayout = () => {
  const { currentUser, switchRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleReturnToStudent = () => {
    switchRole('student');
    navigate('/dashboard');
  };

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Top Admin Bar */}
      <header className="bg-navy-dark text-white py-2 px-3 px-lg-4 border-bottom border-secondary border-opacity-25 sticky-top z-3">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-link text-white d-lg-none p-1"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle admin sidebar"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <Link to="/admin" className="d-flex align-items-center gap-2 text-decoration-none text-white">
              <div className="p-1 rounded bg-danger text-white d-flex align-items-center justify-content-center">
                <ShieldAlert size={18} />
              </div>
              <span className="fw-bold tracking-tight">ProjectMatch</span>
              <span className="badge bg-danger text-white rounded-pill px-2 py-1 small">Admin Portal</span>
            </Link>
          </div>

          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              onClick={handleReturnToStudent}
              className="btn btn-sm btn-outline-light d-flex align-items-center gap-1 py-1 px-3 rounded-pill"
            >
              <ArrowLeft size={14} />
              <span className="d-none d-sm-inline">Switch to Student View</span>
              <span className="d-inline d-sm-none">Student View</span>
            </button>

            <div className="d-flex align-items-center gap-2 ps-2 border-start border-secondary border-opacity-50">
              <Avatar
                src={currentUser?.avatar}
                name={currentUser?.name || 'Administrator'}
                size={32}
                shape="circle"
                className="border border-danger"
              />
              <div className="d-none d-md-block text-start">
                <div className="small fw-bold text-white lh-1">{currentUser?.name || 'Administrator'}</div>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Coordinator</small>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <aside
          className={`admin-sidebar ${sidebarOpen ? 'd-block' : 'd-none d-lg-block'}`}
          aria-label="Admin Navigation"
        >
          <div className="mb-4 px-2">
            <span className="text-uppercase small fw-bold text-muted tracking-wider" style={{ fontSize: '0.75rem' }}>
              Management Console
            </span>
          </div>

          <nav className="d-flex flex-column gap-1">
            <NavLink
              to="/admin"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `admin-nav-item text-decoration-none ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Overview & Metrics</span>
            </NavLink>

            <div className="admin-nav-item text-decoration-none opacity-75">
              <Users size={18} />
              <span>Students Directory</span>
            </div>

            <div className="admin-nav-item text-decoration-none opacity-75">
              <FolderKanban size={18} />
              <span>Projects Approval</span>
              <span className="badge bg-danger ms-auto rounded-pill px-2 py-0">5</span>
            </div>

            <div className="admin-nav-item text-decoration-none opacity-75">
              <GitMerge size={18} />
              <span>Team Formations</span>
            </div>

            <div className="admin-nav-item text-decoration-none opacity-75">
              <BarChart3 size={18} />
              <span>Cohort Analytics</span>
            </div>

            <div className="admin-nav-item text-decoration-none opacity-75">
              <Settings size={18} />
              <span>Platform Settings</span>
            </div>
          </nav>

          <div className="mt-5 p-3 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <div className="d-flex align-items-center gap-2 text-warning small fw-bold mb-1">
              <CheckCircle size={14} />
              <span>Capstone Term: Fall 2026</span>
            </div>
            <p className="text-muted small mb-0" style={{ fontSize: '0.78rem' }}>
              Team formation closes on Nov 30, 2026. 78 of 94 target teams locked.
            </p>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-grow-1 p-3 p-md-4 p-xl-5 overflow-auto" style={{ backgroundColor: '#f8fafc' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
