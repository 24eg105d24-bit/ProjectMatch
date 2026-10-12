import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import AlertBanner from '../components/common/AlertBanner';
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  Check
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { projects, applyToProject } = useProjects();
  const { currentUser } = useAuth();

  const project = projects.find(p => String(p.id) === String(id)) || projects[0];

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(project.openRoles?.[0] || 'Frontend Developer');
  const [pitchNote, setPitchNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Check student skill overlap against required skills
  const studentSkillNames = currentUser?.skills?.map(s => s.name.toLowerCase()) || [];
  const matchingSkills = project.requiredSkills.filter(reqSkill =>
    studentSkillNames.some(studentSkill => studentSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(studentSkill))
  );

  const missingSkills = project.requiredSkills.filter(reqSkill =>
    !studentSkillNames.some(studentSkill => studentSkill.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(studentSkill))
  );

  const matchPercentage = Math.round((matchingSkills.length / project.requiredSkills.length) * 100);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (!pitchNote.trim()) {
      setErrorMessage('Please include a brief note explaining your interest and qualifications.');
      return;
    }

    try {
      await applyToProject(project.id, {
        role: selectedRole,
        note: pitchNote
      });

      setIsApplyModalOpen(false);
      setPitchNote('');
      setErrorMessage('');
      setSuccessMessage(`Your application to join ${project.title} as ${selectedRole} was sent to ${project.lead.name}!`);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to submit your application.');
    }
  };

  const isLead = currentUser && (
    String(currentUser.id) === String(project.lead?.id) ||
    currentUser.email?.toLowerCase() === project.lead?.email?.toLowerCase()
  );

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await updateProjectStatus(project.id, newStatus.toUpperCase().replace(' ', '_'));
      setSuccessMessage(`Recruitment status updated to ${newStatus}.`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update project status.');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm(`Are you sure you want to delete "${project.title}"? This cannot be undone.`)) return;
    try {
      await deleteProject(project.id);
      navigate('/projects');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete project.');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Back button */}
      <div className="mb-3">
        <Link to="/projects" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1 hover-violet">
          <ArrowLeft size={16} /> Back to Project Discovery
        </Link>
      </div>

      {/* Success banner */}
      {successMessage && (
        <AlertBanner
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage('')}
          className="mb-4"
        />
      )}

      {/* Error banner */}
      {errorMessage && (
        <AlertBanner
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage('')}
          className="mb-4"
        />
      )}

      {/* Project Header Card */}
      <div className="pm-card p-4 p-md-5 mb-4 bg-white">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-light text-navy border px-3 py-1 rounded-pill" style={{ fontSize: '0.825rem' }}>
              {project.category}
            </span>
            <Badge variant={project.status === 'Recruiting' ? 'emerald' : 'violet'}>
              {project.status}
            </Badge>
          </div>

          <div className="d-flex align-items-center gap-2">
            {isLead ? (
              <div className="d-flex align-items-center gap-2">
                <select
                  className="form-select form-select-sm"
                  value={project.status}
                  onChange={handleStatusChange}
                  aria-label="Change project status"
                >
                  <option value="Recruiting">Recruiting</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Archived">Archived</option>
                </select>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={handleDeleteProject}
                  title="Delete Project"
                >
                  Delete
                </button>
              </div>
            ) : (
              project.status === 'Recruiting' && (
                <Button
                  variant="primary"
                  icon={Send}
                  onClick={() => setIsApplyModalOpen(true)}
                >
                  Apply to Join Team
                </Button>
              )
            )}
          </div>
        </div>

        <h1 className="h2 fw-bold text-navy mb-2">{project.title}</h1>
        <p className="lead text-muted mb-4" style={{ fontSize: '1.1rem' }}>{project.tagline}</p>

        {/* Meta details bar */}
        <div className="d-flex flex-wrap gap-4 pt-3 border-top border-light-subtle small text-muted">
          <div className="d-flex align-items-center gap-2">
            <img
              src={project.lead?.avatar}
              alt={project.lead?.name}
              className="rounded-circle border"
              style={{ width: 32, height: 32, objectFit: 'cover' }}
            />
            <div>
              <span className="d-block text-navy fw-semibold">{project.lead?.name}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Project Creator & Lead</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Calendar size={18} className="text-violet" />
            <div>
              <span className="d-block text-navy fw-semibold">{project.timeline.term}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Academic Period</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Clock size={18} className="text-violet" />
            <div>
              <span className="d-block text-navy fw-semibold">{project.timeline.weeklyCommitment}</span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Weekly Expectation</span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Users size={18} className="text-violet" />
            <div>
              <span className="d-block text-navy fw-semibold">
                {project.teamSize.current} / {project.teamSize.max} Members
              </span>
              <span className="text-muted" style={{ fontSize: '0.72rem' }}>Team Capacity</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Description & Milestones */}
        <div className="col-12 col-lg-8">
          {/* Detailed Description */}
          <div className="pm-card p-4 mb-4 bg-white">
            <h5 className="fw-bold text-navy mb-3 pb-2 border-bottom">Project Mission & Specifications</h5>
            <p className="text-muted" style={{ lineHeight: 1.75 }}>
              {project.description}
            </p>

            <div className="mt-4">
              <h6 className="fw-bold text-navy mb-2">Project Tags & Domains</h6>
              <div className="d-flex flex-wrap gap-2">
                {project.tags.map((tag, idx) => (
                  <Badge key={idx} variant="navy">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Milestone Schedule */}
          <div className="pm-card p-4 bg-white">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h5 className="fw-bold text-navy mb-0">Milestone Roadmap</h5>
              <span className="small text-muted">{project.timeline.deadline}</span>
            </div>

            <div className="d-flex flex-column gap-3">
              {project.milestones.map((m, idx) => (
                <div key={idx} className="p-3 rounded-3 border bg-light d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className={`rounded-circle p-2 d-flex align-items-center justify-content-center ${
                        m.status === 'Completed' ? 'bg-success text-white' : m.status === 'In Progress' ? 'bg-violet-subtle text-violet' : 'bg-secondary bg-opacity-25 text-muted'
                      }`}
                      style={{ width: 32, height: 32 }}
                    >
                      {m.status === 'Completed' ? <Check size={16} /> : idx + 1}
                    </div>
                    <div>
                      <h6 className="fw-bold text-navy mb-0" style={{ fontSize: '0.92rem' }}>{m.title}</h6>
                      <small className="text-muted">{m.date}</small>
                    </div>
                  </div>

                  <Badge variant={m.status === 'Completed' ? 'emerald' : m.status === 'In Progress' ? 'violet' : 'navy'}>
                    {m.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Matching Info & Team Roster */}
        <div className="col-12 col-lg-4">
          {/* Matching Information Card */}
          <div className="pm-card p-4 mb-4 bg-white border-violet">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2">
                <Sparkles size={18} className="text-violet" />
                <h6 className="fw-bold text-navy mb-0">Profile Match Analysis</h6>
              </div>
              <span className="badge bg-violet text-white rounded-pill px-2 py-1 small">
                {matchPercentage}% Overlap
              </span>
            </div>

            <p className="small text-muted mb-3">
              Transparent compatibility check comparing your registered competencies against this project's technical requirements:
            </p>

            <div className="mb-3">
              <div className="small fw-semibold text-success mb-2 d-flex align-items-center gap-1">
                <CheckCircle2 size={14} />
                <span>You Match ({matchingSkills.length}):</span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {matchingSkills.length > 0 ? (
                  matchingSkills.map((s, idx) => (
                    <Badge key={idx} variant="emerald">{s}</Badge>
                  ))
                ) : (
                  <span className="small text-muted">No direct technical overlap detected yet.</span>
                )}
              </div>
            </div>

            {missingSkills.length > 0 && (
              <div className="mb-3">
                <div className="small fw-semibold text-muted mb-2">
                  Other Skills Required ({missingSkills.length}):
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {missingSkills.map((s, idx) => (
                    <Badge key={idx} variant="navy">{s}</Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="p-3 rounded-3 bg-light border small text-muted">
              <div className="fw-bold text-navy mb-1">Time Alignment:</div>
              <span>Your available 15 hrs/week satisfies this team's requirement ({project.timeline.weeklyCommitment}).</span>
            </div>
          </div>

          {/* Current Team Roster & Vacancies */}
          <div className="pm-card p-4 bg-white">
            <h6 className="fw-bold text-navy mb-3 pb-2 border-bottom">Team Roster ({project.teamSize.current}/{project.teamSize.max})</h6>

            <div className="d-flex flex-column gap-3 mb-4">
              {project.members?.map((member) => (
                <div key={member.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light">
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="rounded-circle"
                      style={{ width: 34, height: 34, objectFit: 'cover' }}
                    />
                    <div className="small lh-1">
                      <div className="fw-bold text-navy">{member.name}</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>{member.role}</span>
                    </div>
                  </div>
                  <Badge variant="navy">Confirmed</Badge>
                </div>
              ))}

              {/* Vacant positions */}
              {project.openRoles?.map((role, idx) => (
                <div key={idx} className="d-flex align-items-center justify-content-between p-2 rounded-2 border border-dashed bg-white">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-light text-muted d-flex align-items-center justify-content-center" style={{ width: 34, height: 34 }}>
                      <Users size={16} />
                    </div>
                    <div className="small lh-1">
                      <div className="fw-semibold text-violet">{role}</div>
                      <span className="text-muted" style={{ fontSize: '0.72rem' }}>Open Vacancy</span>
                    </div>
                  </div>
                  <Badge variant="amber">Recruiting</Badge>
                </div>
              ))}
            </div>

            <Button
              variant="primary"
              className="w-100"
              icon={Send}
              onClick={() => setIsApplyModalOpen(true)}
            >
              Apply for Vacant Role
            </Button>
          </div>
        </div>
      </div>

      {/* Modal: Apply to Join Team */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title={`Apply to Join: ${project.title}`}
        subtitle={`Submit your application to project lead ${project.lead.name}`}
      >
        <form onSubmit={handleApplySubmit}>
          {errorMessage && (
            <AlertBanner
              type="danger"
              message={errorMessage}
              onClose={() => setErrorMessage('')}
              className="mb-3"
            />
          )}

          <FormInput
            type="select"
            label="Which open role are you applying for?"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            options={(project.openRoles || ['Frontend Developer', 'UI/UX Specialist']).map(r => ({
              value: r,
              label: r
            }))}
            required
          />

          <FormInput
            type="textarea"
            label="Brief Introduction & Contribution Note"
            placeholder="Tell the team about relevant classes, coursework, portfolios, and how your skills fulfill this role..."
            value={pitchNote}
            onChange={(e) => setPitchNote(e.target.value)}
            rows={4}
            required
            helperText="Include links to GitHub, Figma, or course deliverables if available."
          />

          <div className="p-3 rounded-3 bg-light border small text-muted mb-3">
            <span className="fw-semibold text-navy">Application Summary: </span>
            Your verified skill profile ({currentUser?.name}, {currentUser?.department}) will be sent directly to the team leader.
          </div>

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit" icon={Send}>Submit Application</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
