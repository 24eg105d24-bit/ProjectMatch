import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Sparkles,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Layers,
  BarChart
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="position-relative bg-hero-gradient text-white py-5 py-lg-6 overflow-hidden">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>

        <div className="container position-relative py-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7 text-center text-lg-start">
              <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{
                backgroundColor: 'rgba(124, 58, 237, 0.25)',
                border: '1px solid rgba(167, 139, 250, 0.4)'
              }}>
                <Sparkles size={14} className="text-violet-light" />
                <span className="small fw-semibold text-white">Smart Academic Team Formation Platform</span>
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3" style={{ letterSpacing: '-0.03em', lineHeight: 1.15 }}>
                Build Capstone Teams That <span style={{
                  background: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Thrive Together</span>
              </h1>

              <p className="lead text-light opacity-85 mb-4" style={{ maxWidth: '600px', fontSize: '1.15rem' }}>
                Stop relying on awkward group chats and arbitrary team assignments. ProjectMatch unites university students based on complementary skills, availability, and shared vision.
              </p>

              <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start mb-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" iconRight={ArrowRight}>
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/projects">
                  <Button variant="outline" size="lg" className="border-secondary text-white">
                    Explore Projects
                  </Button>
                </Link>
              </div>

              {/* Trust markers */}
              <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start gap-4 pt-3 text-muted small">
                <div className="d-flex align-items-center gap-2 text-light opacity-75">
                  <CheckCircle2 size={16} className="text-violet-light" />
                  <span>Verified Student Profiles</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-75">
                  <CheckCircle2 size={16} className="text-violet-light" />
                  <span>Transparent Match Scores</span>
                </div>
                <div className="d-flex align-items-center gap-2 text-light opacity-75">
                  <CheckCircle2 size={16} className="text-violet-light" />
                  <span>Integrated Task Boards</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="col-12 col-lg-5">
              <div
                className="p-4 rounded-4 shadow-xl position-relative"
                style={{
                  background: 'rgba(28, 37, 65, 0.85)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              >
                <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom border-secondary border-opacity-25">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle p-2 bg-violet-subtle text-violet">
                      <Target size={18} />
                    </div>
                    <div>
                      <h6 className="mb-0 text-white fw-bold">Live Match Card</h6>
                      <small className="text-muted">Algorithm-Generated Recommendation</small>
                    </div>
                  </div>
                  <Badge variant="emerald">96% Fit</Badge>
                </div>

                <div className="mb-3">
                  <h6 className="text-white fw-bold mb-1">CampusPulse: Mental Health App</h6>
                  <p className="small text-muted mb-2">Team recruiting 1 Frontend Architect & 1 UI/UX Specialist.</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    <Badge variant="navy">React</Badge>
                    <Badge variant="navy">Figma</Badge>
                    <Badge variant="navy">Node.js</Badge>
                  </div>
                </div>

                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'rgba(11, 19, 43, 0.7)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="small text-light">Compatibility Breakdown</span>
                    <span className="small text-violet-light fw-bold">High Overlap</span>
                  </div>
                  <div className="progress mb-2" style={{ height: '6px' }}>
                    <div className="progress-bar bg-violet-gradient" role="progressbar" style={{ width: '96%' }} aria-valuenow="96" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <div className="d-flex justify-content-between small text-muted" style={{ fontSize: '0.72rem' }}>
                    <span>Skills: 98%</span>
                    <span>Hours: 15 hrs/wk</span>
                    <span>Schedule: Evenings</span>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80" alt="Lead" className="rounded-circle border border-dark" style={{ width: 28, height: 28 }} />
                      <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&q=80" alt="Member" className="rounded-circle border border-dark ms-n2" style={{ width: 28, height: 28, marginLeft: '-8px' }} />
                    </div>
                    <span className="small text-muted">2 of 4 Filled</span>
                  </div>
                  <Link to="/projects/proj-1" className="btn btn-sm btn-outline-light rounded-pill px-3">
                    View Project
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How ProjectMatch Works */}
      <section className="py-5 py-lg-6 bg-white" id="how-it-works">
        <div className="container">
          <div className="text-center mb-5" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <Badge variant="violet" className="mb-2">Structured Methodology</Badge>
            <h2 className="display-6 fw-bold text-navy mb-3">How ProjectMatch Works</h2>
            <p className="text-muted">
              A balanced team requires more than just friend circles. Our platform optimizes for complementary technical skills, realistic time commitment, and aligned academic targets.
            </p>
          </div>

          <div className="row g-4">
            {/* Step 1 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="pm-card p-4 h-100 text-center text-md-start">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 bg-violet-subtle text-violet mb-3"
                  style={{ width: 48, height: 48 }}
                >
                  <Users size={24} />
                </div>
                <div className="small text-violet fw-bold text-uppercase mb-1 tracking-wider">Step 1</div>
                <h5 className="fw-bold text-navy mb-2">Build Your Skill Profile</h5>
                <p className="text-muted small mb-0">
                  Document your technical competencies, design tools, preferred roles (e.g. Frontend Lead, ML Engineer), and actual weekly hours.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="pm-card p-4 h-100 text-center text-md-start">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 bg-violet-subtle text-violet mb-3"
                  style={{ width: 48, height: 48 }}
                >
                  <Sparkles size={24} />
                </div>
                <div className="small text-violet fw-bold text-uppercase mb-1 tracking-wider">Step 2</div>
                <h5 className="fw-bold text-navy mb-2">Algorithmic Compatibility</h5>
                <p className="text-muted small mb-0">
                  Our transparent matching algorithm evaluates skill complementarity, time availability, and domain interests to calculate a fit score.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="pm-card p-4 h-100 text-center text-md-start">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 bg-violet-subtle text-violet mb-3"
                  style={{ width: 48, height: 48 }}
                >
                  <Target size={24} />
                </div>
                <div className="small text-violet fw-bold text-uppercase mb-1 tracking-wider">Step 3</div>
                <h5 className="fw-bold text-navy mb-2">Form Balanced Teams</h5>
                <p className="text-muted small mb-0">
                  Browse recruiting projects or publish your own capstone proposal. Send structured join requests tailored to open roles.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="col-12 col-md-6 col-lg-3">
              <div className="pm-card p-4 h-100 text-center text-md-start">
                <div
                  className="d-inline-flex align-items-center justify-content-center rounded-3 bg-violet-subtle text-violet mb-3"
                  style={{ width: 48, height: 48 }}
                >
                  <Layers size={24} />
                </div>
                <div className="small text-violet fw-bold text-uppercase mb-1 tracking-wider">Step 4</div>
                <h5 className="fw-bold text-navy mb-2">Collaborate on Task Boards</h5>
                <p className="text-muted small mb-0">
                  Once formed, jump straight into execution with sprint task boards, milestone tracking, and faculty mentor oversight.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-5 py-lg-6" style={{ backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <Badge variant="navy" className="mb-2">Platform Capabilities</Badge>
              <h2 className="display-6 fw-bold text-navy mb-3">Designed Exclusively for University Projects</h2>
              <p className="text-muted mb-4">
                Generic recruiting platforms lack the context of academic deadlines, grading rubrics, and faculty supervision. ProjectMatch is designed around university semesters.
              </p>

              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-white text-violet shadow-xs flex-shrink-0" style={{ height: 'fit-content' }}>
                    <BarChart size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-navy mb-1">Clear Compatibility Explanations</h6>
                    <p className="small text-muted mb-0">
                      Understand exactly why a project fits: see matching proficiencies, mutual meeting windows, and complementary role balance.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-white text-violet shadow-xs flex-shrink-0" style={{ height: 'fit-content' }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-navy mb-1">Availability & Commitment Alignment</h6>
                    <p className="small text-muted mb-0">
                      Prevent the #1 cause of capstone conflict: mismatched time commitment. Match with teammates who share your weekly schedule.
                    </p>
                  </div>
                </div>

                <div className="d-flex gap-3">
                  <div className="p-2 rounded-3 bg-white text-violet shadow-xs flex-shrink-0" style={{ height: 'fit-content' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h6 className="fw-bold text-navy mb-1">Faculty & Admin Oversight</h6>
                    <p className="small text-muted mb-0">
                      Course coordinators can review project proposals, ensure fair team sizing, and audit cohort formation health.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="pm-card p-4 bg-white border-0 shadow-lg">
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <h5 className="fw-bold text-navy mb-0">Active Capstones Snapshot</h5>
                  <Link to="/projects" className="text-violet small fw-semibold">Browse All &rarr;</Link>
                </div>

                {/* Sample project mini cards */}
                <div className="d-flex flex-column gap-3">
                  <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-navy" style={{ fontSize: '0.92rem' }}>CodeCollab: Peer Review Room</h6>
                      <span className="small text-muted">Developer Tools &bull; 3/4 Members</span>
                    </div>
                    <Badge variant="violet">In Progress</Badge>
                  </div>

                  <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-navy" style={{ fontSize: '0.92rem' }}>EcoTrack: Food Waste IoT</h6>
                      <span className="small text-muted">GreenTech &bull; 3/5 Members</span>
                    </div>
                    <Badge variant="emerald">Recruiting</Badge>
                  </div>

                  <div className="p-3 rounded-3 bg-light border d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="fw-bold mb-1 text-navy" style={{ fontSize: '0.92rem' }}>RoboNav: Rover Web Telemetry</h6>
                      <span className="small text-muted">Robotics &bull; 3/4 Members</span>
                    </div>
                    <Badge variant="amber">1 Slot Left</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-5 bg-navy-dark text-white text-center position-relative">
        <div className="container py-4">
          <h2 className="display-6 fw-bold text-white mb-3">Ready to Build Something Extraordinary?</h2>
          <p className="text-light opacity-80 mb-4 mx-auto" style={{ maxWidth: '580px' }}>
            Join hundreds of university students forming balanced, productive teams for their senior capstones and research initiatives.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/register">
              <Button variant="primary" size="lg">
                Create Student Profile
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" size="lg" className="border-secondary text-white">
                Discover Open Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
