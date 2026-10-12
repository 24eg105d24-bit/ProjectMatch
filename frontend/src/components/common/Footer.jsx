import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Heart, Shield, Sparkles } from 'lucide-react';

const currentYear = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-light pt-5 pb-4 border-top border-secondary border-opacity-25 mt-auto">
      <div className="container">
        <div className="row g-4 mb-4">
          {/* Brand & Mission */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div className="d-flex align-items-center justify-content-center rounded-3 bg-violet-gradient text-white p-2">
                <Users size={20} />
              </div>
              <span className="h5 mb-0 fw-bold text-white">
                Project<span style={{ color: 'var(--pm-violet-400)' }}>Match</span>
              </span>
            </div>
            <p className="small text-muted mb-3" style={{ maxWidth: '340px' }}>
              Transforming academic team formation into a streamlined, high-compatibility experience.
              Match by complementary skills, mutual availability, and shared project vision.
            </p>
            <div className="d-flex align-items-center gap-2 small text-muted">
              <Shield size={14} className="text-violet-light" />
              <span>University Capstone & Research Collaboration</span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3 small text-uppercase tracking-wider">Explore</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/projects" className="text-muted text-decoration-none hover-light">
                  Project Discovery
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="text-muted text-decoration-none hover-light">
                  Team Matching
                </Link>
              </li>
              <li>
                <Link to="/teams" className="text-muted text-decoration-none hover-light">
                  My Teams & Tasks
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-muted text-decoration-none hover-light">
                  Student Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="col-6 col-md-2">
            <h6 className="text-white fw-semibold mb-3 small text-uppercase tracking-wider">Resources</h6>
            <ul className="list-unstyled small d-flex flex-column gap-2 mb-0">
              <li>
                <Link to="/" className="text-muted text-decoration-none hover-light">
                  How It Works
                </Link>
              </li>
              <li>
                <span className="text-muted">Capstone Guide</span>
              </li>
              <li>
                <span className="text-muted">Conflict Resolution</span>
              </li>
              <li>
                <Link to="/admin" className="text-muted text-decoration-none hover-light">
                  Faculty & Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparent matching philosophy */}
          <div className="col-12 col-md-4">
            <div className="p-3 rounded-3" style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div className="d-flex align-items-center gap-2 mb-2 text-violet-light fw-semibold small">
                <Sparkles size={16} />
                <span>Compatibility Matching Engine</span>
              </div>
              <p className="small text-muted mb-0">
                ProjectMatch calculates compatibility transparently using skill coverage, availability overlap, and shared domain interests to build balanced student teams.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-3 border-top border-secondary border-opacity-25 d-flex flex-column flex-sm-row justify-content-between align-items-center gap-2 small text-muted">
          <div>
            &copy; {currentYear} ProjectMatch Platform. Built for University Teams.
          </div>
          <div className="d-flex align-items-center gap-3">
            <span>Terms of Service</span>
            <span>&bull;</span>
            <span>Privacy Policy</span>
            <span>&bull;</span>
            <span className="d-flex align-items-center gap-1">
              Crafted for Students <Heart size={12} className="text-danger fill-danger" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
