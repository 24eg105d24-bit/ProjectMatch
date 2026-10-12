import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import AlertBanner from '../components/common/AlertBanner';
import Avatar from '../components/common/Avatar';
import {
  ArrowLeft,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Send,
  Check,
  Edit3,
  Inbox,
  UserCheck,
  UserX,
  UserPlus,
  Search
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    applyToProject,
    updateProjectStatus,
    deleteProject,
    updateProject,
    receivedApplications,
    respondToApplication,
    getCandidateRecommendations
  } = useProjects();
  const { currentUser } = useAuth();

  const project = projects.find(p => String(p.id) === String(id)) || null;

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [pitchNote, setPitchNote] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'candidates'
  const [candidates, setCandidates] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [editForm, setEditForm] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'General',
    maxTeamSize: 4,
    academicTerm: 'Fall 2026',
    weeklyHoursExpectation: 12,
    deadline: '',
    openRoles: '',
    tags: '',
    requiredSkills: ''
  });

  useEffect(() => {
    if (project) {
      setEditForm({
        title: project.title || '',
        tagline: project.tagline || '',
        description: project.description || '',
        category: project.category || 'General',
        maxTeamSize: project.teamSize?.max || 4,
        academicTerm: project.timeline?.term || 'Fall 2026',
        weeklyHoursExpectation: parseInt(project.timeline?.weeklyCommitment, 10) || 12,
        deadline: project.timeline?.deadline || '',
        openRoles: (project.openRoles || []).join(', '),
        tags: (project.tags || []).join(', '),
        requiredSkills: (project.requiredSkills || [])
          .map(s => typeof s === 'string' ? s : s.name)
          .join(', ')
      });
    }
  }, [project, isEditModalOpen]);

  useEffect(() => {
    if (project?.openRoles?.length > 0 && !selectedRole) {
      setSelectedRole(project.openRoles[0]);
    }
  }, [project, selectedRole]);

  if (!project) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <p className="text-muted">Loading project details or project not found...</p>
        <Link to="/projects" className="btn btn-outline-primary btn-sm mt-2">Back to Project Discovery</Link>
      </div>
    );
  }

  // Check student skill overlap against required skills
  const studentSkillNames = currentUser?.skills?.map(s => s.name.toLowerCase()) || [];
  const requiredSkillsList = project.requiredSkills || [];
  const matchingSkills = requiredSkillsList.filter(reqSkill => {
    const sName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name || '';
    return studentSkillNames.some(studentSkill => studentSkill.includes(sName.toLowerCase()) || sName.toLowerCase().includes(studentSkill));
  });

  const missingSkills = requiredSkillsList.filter(reqSkill => {
    const sName = typeof reqSkill === 'string' ? reqSkill : reqSkill.name || '';
    return !studentSkillNames.some(studentSkill => studentSkill.includes(sName.toLowerCase()) || sName.toLowerCase().includes(studentSkill));
  });

  const matchPercentage = requiredSkillsList.length > 0
    ? Math.round((matchingSkills.length / requiredSkillsList.length) * 100)
    : 100;

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

  const projectApplications = (receivedApplications || []).filter(
    app => String(app.projectId) === String(project?.id)
  );

  const handleApplicationResponse = async (appId, accept, applicantName, role) => {
    try {
      await respondToApplication(appId, accept);
      setSuccessMessage(
        accept
          ? `Accepted ${applicantName} into the team as ${role}! Team roster updated.`
          : `Application from ${applicantName} was rejected.`
      );
    } catch (err) {
      setErrorMessage(err.message || 'Unable to update application status.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const rolesList = editForm.openRoles
        ? editForm.openRoles.split(',').map(r => r.trim()).filter(Boolean)
        : [];
      const tagsList = editForm.tags
        ? editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      const skillsList = editForm.requiredSkills
        ? editForm.requiredSkills
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(name => ({
              skillName: name,
              minProficiency: 'BEGINNER',
              isRequired: true
            }))
        : [];

      await updateProject(project.id, {
        title: editForm.title.trim(),
        tagline: editForm.tagline,
        description: editForm.description,
        category: editForm.category,
        maxTeamSize: parseInt(editForm.maxTeamSize, 10) || 4,
        academicTerm: editForm.academicTerm,
        deadline: editForm.deadline,
        weeklyHoursExpectation: parseInt(editForm.weeklyHoursExpectation, 10) || 12,
        openRoles: rolesList,
        tags: tagsList,
        requiredSkills: skillsList
      });

      setIsEditModalOpen(false);
      setSuccessMessage('Project details updated successfully!');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to update project details.');
    }
  };

  const handleLoadCandidates = async () => {
    if (!project?.id) return;
    setLoadingCandidates(true);
    try {
      const data = await getCandidateRecommendations(project.id);
      setCandidates(data);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load candidate recommendations.');
    } finally {
      setLoadingCandidates(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'candidates' && candidates.length === 0) {
      handleLoadCandidates();
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
                  className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                  onClick={() => setIsEditModalOpen(true)}
                  title="Edit Project"
                >
                  <Edit3 size={14} /> Edit
                </button>
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
            <Avatar
              src={project.lead?.avatar}
              name={project.lead?.name || 'Project Lead'}
              size={32}
              shape="circle"
              className="border"
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

      {/* Tabs navigation for project lead: Overview vs Find Candidates */}
      {isLead && (
        <div className="d-flex gap-2 mb-4">
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill ${activeTab === 'overview' ? 'btn-primary' : 'btn-light text-muted'}`}
            onClick={() => handleTabChange('overview')}
          >
            Project Overview & Applications
          </button>
          <button
            type="button"
            className={`btn btn-sm px-3 py-2 fw-semibold rounded-pill d-inline-flex align-items-center gap-2 ${activeTab === 'candidates' ? 'btn-primary' : 'btn-light text-muted'}`}
            onClick={() => handleTabChange('candidates')}
          >
            <Sparkles size={15} /> Find Matching Candidates
          </button>
        </div>
      )}

      {/* Candidates Tab View */}
      {isLead && activeTab === 'candidates' ? (
        <div className="mb-5">
          <div className="pm-card p-4 bg-white border-violet mb-4">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
              <div>
                <h5 className="fw-bold text-navy mb-1 d-flex align-items-center gap-2">
                  <Sparkles size={20} className="text-violet" />
                  Recommended Student Candidates
                </h5>
                <p className="text-muted small mb-0">
                  Students evaluated against required skills, open roles, and availability commitment.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-outline-primary btn-sm d-inline-flex align-items-center gap-1"
                onClick={handleLoadCandidates}
                disabled={loadingCandidates}
              >
                <Search size={14} /> Refresh Recommendations
              </button>
            </div>
          </div>

          {loadingCandidates ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading candidates...</span>
              </div>
              <p className="text-muted small mt-2">Computing compatibility scores across candidate pool...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="pm-card p-5 bg-white text-center">
              <Users size={36} className="text-muted mb-3 opacity-50" />
              <h6 className="fw-bold text-navy">No Candidates Available</h6>
              <p className="text-muted small mb-0">
                All eligible registered students are either already in your team or the candidate pool is empty.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {candidates.map((cand) => (
                <div key={cand.studentId} className="col-12 col-md-6 col-lg-4">
                  <div className="pm-card p-4 bg-white h-100 d-flex flex-column justify-content-between border hover-shadow transition">
                    <div>
                      <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
                        <div className="d-flex align-items-center gap-3">
                          <Avatar
                            src={cand.avatarUrl}
                            name={cand.fullName}
                            size={44}
                            shape="circle"
                            className="border"
                          />
                          <div>
                            <h6 className="fw-bold text-navy mb-0">{cand.fullName}</h6>
                            <span className="text-muted small">{cand.department} &bull; {cand.academicYear}</span>
                          </div>
                        </div>
                        <span className={`badge rounded-pill px-2 py-1 small ${cand.compatibilityScore >= 80 ? 'bg-success text-white' : cand.compatibilityScore >= 60 ? 'bg-primary text-white' : 'bg-light text-muted border'}`}>
                          {cand.compatibilityScore}% Match
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="badge bg-light text-violet border small">
                          Suggested: {cand.suggestedRole}
                        </span>
                        <span className="badge bg-light text-muted border small ms-1">
                          {cand.hoursPerWeek} hrs/wk
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="text-muted small fw-semibold mb-1" style={{ fontSize: '0.75rem' }}>
                          Matching Skills ({cand.matchingSkills?.length || 0}):
                        </div>
                        <div className="d-flex flex-wrap gap-1">
                          {cand.matchingSkills && cand.matchingSkills.length > 0 ? (
                            cand.matchingSkills.map((sk, sIdx) => (
                              <Badge key={sIdx} variant="emerald">{sk}</Badge>
                            ))
                          ) : (
                            <span className="text-muted small" style={{ fontSize: '0.72rem' }}>Complementary skill profile</span>
                          )}
                        </div>
                      </div>

                      {cand.explanations && (
                        <div className="bg-light p-2 rounded-2 small text-muted mb-3" style={{ fontSize: '0.75rem' }}>
                          {cand.explanations.slice(0, 2).map((exp, eIdx) => (
                            <div key={eIdx} className="d-flex justify-content-between">
                              <span>{exp.factor}:</span>
                              <span className="fw-semibold text-navy">{exp.detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-top">
                      <a
                        href={`mailto:${cand.email}?subject=Invitation%20to%20join%20${encodeURIComponent(project.title)}&body=Hi%20${encodeURIComponent(cand.fullName)},%0D%0A%0D%0AI%20saw%20your%20profile%20on%20ProjectMatch%20and%20would%20love%20to%20invite%20you%20to%20join%20our%20project:%20${encodeURIComponent(project.title)}%20for%20the%20${encodeURIComponent(cand.suggestedRole)}%20role.`}
                        className="btn btn-outline-primary btn-sm w-100 d-inline-flex align-items-center justify-content-center gap-1"
                      >
                        <UserPlus size={14} /> Contact Candidate ({cand.email})
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
      <div className="row g-4">
        {/* Left Column: Description & Milestones */}
        <div className="col-12 col-lg-8">
          {/* Applications Received Section for Lead */}
          {isLead && (
            <div className="pm-card p-4 mb-4 bg-white border border-violet-subtle shadow-sm">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 pb-2 border-bottom">
                <div className="d-flex align-items-center gap-2">
                  <Inbox size={20} className="text-violet" />
                  <h5 className="fw-bold text-navy mb-0">
                    Incoming Applications ({projectApplications.length})
                  </h5>
                </div>
                <span className="badge bg-violet text-white px-2 py-1 rounded-pill small">
                  {projectApplications.filter(a => a.rawStatus === 'PENDING').length} Pending Review
                </span>
              </div>

              {projectApplications.length === 0 ? (
                <div className="text-center py-4 bg-light rounded-3 border border-dashed">
                  <Users size={28} className="text-muted mb-2 opacity-50" />
                  <p className="text-muted small mb-0">
                    No join requests received yet. Interested students will appear here when they submit applications.
                  </p>
                </div>
              ) : (
                <div className="d-flex flex-column gap-3">
                  {projectApplications.map((app) => (
                    <div key={app.id} className="p-3 rounded-3 border bg-light">
                      <div className="d-flex flex-wrap align-items-start justify-content-between gap-2 mb-2">
                        <div className="d-flex align-items-center gap-3">
                          <Avatar
                            src={app.senderAvatar}
                            name={app.senderName}
                            size={42}
                            shape="circle"
                            className="border"
                          />
                          <div>
                            <div className="fw-bold text-navy d-flex align-items-center gap-2">
                              {app.senderName}
                              <span className="badge bg-white text-muted border small" style={{ fontSize: '0.72rem' }}>
                                {app.senderDepartment} &bull; {app.senderAcademicYear}
                              </span>
                            </div>
                            <span className="text-muted small">{app.senderEmail}</span>
                          </div>
                        </div>

                        <div className="d-flex align-items-center gap-2">
                          <Badge variant={app.rawStatus === 'ACCEPTED' ? 'emerald' : app.rawStatus === 'PENDING' ? 'amber' : 'navy'}>
                            {app.status}
                          </Badge>
                          <span className="badge bg-white text-violet border small">
                            Role: {app.role}
                          </span>
                        </div>
                      </div>

                      {app.message && (
                        <div className="p-2 px-3 rounded-2 bg-white border small text-muted mb-2 fst-italic">
                          "{app.message}"
                        </div>
                      )}

                      {app.senderSkills && app.senderSkills.length > 0 && (
                        <div className="d-flex flex-wrap align-items-center gap-1 mb-3">
                          <span className="small text-muted me-1">Skills:</span>
                          {app.senderSkills.map((sk, sIdx) => (
                            <Badge key={sIdx} variant="emerald">{sk}</Badge>
                          ))}
                        </div>
                      )}

                      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top">
                        <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
                          Applied on {app.submittedAt}
                        </span>

                        {app.rawStatus === 'PENDING' && (
                          <div className="d-flex align-items-center gap-2">
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1"
                              onClick={() => handleApplicationResponse(app.id, false, app.senderName, app.role)}
                            >
                              <UserX size={14} /> Reject
                            </button>
                            <button
                              type="button"
                              className="btn btn-success btn-sm d-inline-flex align-items-center gap-1 text-white"
                              onClick={() => handleApplicationResponse(app.id, true, app.senderName, app.role)}
                            >
                              <UserCheck size={14} /> Accept into Team
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

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
                    <Badge key={idx} variant="emerald">{typeof s === 'string' ? s : s.name}</Badge>
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
                    <Badge key={idx} variant="navy">{typeof s === 'string' ? s : s.name}</Badge>
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
                    <Avatar
                      src={member.avatar}
                      name={member.name}
                      size={34}
                      shape="circle"
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
      )}

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

      {/* Modal: Edit Project */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Project Specifications"
        subtitle={`Update team requirements and details for ${project.title}`}
      >
        <form onSubmit={handleEditSubmit}>
          <FormInput
            type="text"
            label="Project Title"
            value={editForm.title}
            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
            required
          />

          <FormInput
            type="text"
            label="Tagline / Catchphrase"
            value={editForm.tagline}
            onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
          />

          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted">Category</label>
              <select
                className="form-select form-select-sm"
                value={editForm.category}
                onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Fintech">Fintech</option>
                <option value="AI & Robotics">AI & Robotics</option>
                <option value="Social Impact">Social Impact</option>
                <option value="General">General</option>
              </select>
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted">Max Team Size</label>
              <input
                type="number"
                min="2"
                max="10"
                className="form-control form-control-sm"
                value={editForm.maxTeamSize}
                onChange={(e) => setEditForm(prev => ({ ...prev, maxTeamSize: e.target.value }))}
              />
            </div>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted">Academic Term</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Fall 2026"
                value={editForm.academicTerm}
                onChange={(e) => setEditForm(prev => ({ ...prev, academicTerm: e.target.value }))}
              />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label small text-muted">Weekly Hours Expectation</label>
              <input
                type="number"
                min="5"
                max="40"
                className="form-control form-control-sm"
                value={editForm.weeklyHoursExpectation}
                onChange={(e) => setEditForm(prev => ({ ...prev, weeklyHoursExpectation: e.target.value }))}
              />
            </div>
          </div>

          <FormInput
            type="text"
            label="Deadline / Milestone Target"
            placeholder="e.g. Final Presentation Dec 15, 2026"
            value={editForm.deadline}
            onChange={(e) => setEditForm(prev => ({ ...prev, deadline: e.target.value }))}
          />

          <FormInput
            type="textarea"
            label="Mission & Detailed Description"
            rows={4}
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
            required
          />

          <FormInput
            type="text"
            label="Open Roles (comma-separated)"
            placeholder="e.g. Frontend Developer, ML Engineer, UI/UX Designer"
            value={editForm.openRoles}
            onChange={(e) => setEditForm(prev => ({ ...prev, openRoles: e.target.value }))}
            helperText="Separate multiple roles with commas"
          />

          <FormInput
            type="text"
            label="Required Skills (comma-separated)"
            placeholder="e.g. React, Spring Boot, Python, Docker"
            value={editForm.requiredSkills}
            onChange={(e) => setEditForm(prev => ({ ...prev, requiredSkills: e.target.value }))}
            helperText="Separate required skills with commas"
          />

          <FormInput
            type="text"
            label="Project Tags (comma-separated)"
            placeholder="e.g. Web, Cloud, AI"
            value={editForm.tags}
            onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
          />

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectDetailsPage;
