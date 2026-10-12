import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../context/ProjectContext';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import {
  Clock,
  Briefcase,
  BookOpen,
  Calendar,
  Plus,
  Trash2,
  Edit3,
  ExternalLink
} from 'lucide-react';

const StudentDashboardPage = () => {
  const { currentUser, updateProfile } = useAuth();
const [profileLoading, setProfileLoading] = useState(true);
const [profileError, setProfileError] = useState('');
  const { teams, applications, recommendations } = useProjects();

  // Local state for interactive skill & interest additions
  const [skills, setSkills] = useState(
    currentUser?.skills || []
  );

  const [interests, setInterests] = useState(
    currentUser?.interests || []
  );

  const preferredRoles = currentUser?.preferredRoles || ['Frontend Lead', 'UI/UX Designer', 'Full Stack Developer'];

  const [hoursPerWeek, setHoursPerWeek] = useState(
    currentUser?.availability?.hoursPerWeek || 15
  );

  const [preferredTime, setPreferredTime] = useState(
    currentUser?.availability?.preferredTime || 'Weekday evenings & Weekend afternoons'
  );

  // Modals for editing
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');

  const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
  const [newInterestName, setNewInterestName] = useState('');

  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [headlineEdit, setHeadlineEdit] = useState(currentUser?.headline || '');
  const [bioEdit, setBioEdit] = useState(currentUser?.bio || '');

useEffect(() => {
  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError('');

      const response = await api.get('/api/students/me');
      const data = response.data;

      setSkills(
        (data.skills || []).map(skill => ({
          id: skill.id,
          name: skill.name,
          level: skill.proficiency || skill.level || 'INTERMEDIATE'
        }))
      );

      setInterests(data.interests || []);
      setHoursPerWeek(data.hoursPerWeek ?? 15);
      setPreferredTime(data.preferredTime || 'Flexible');
      setHeadlineEdit(data.headline || '');
      setBioEdit(data.bio || '');

      updateProfile({
        name: data.fullName,
        email: data.email,
        department: data.department,
        headline: data.headline,
        skills: data.skills || [],
        interests: data.interests || []
      });
    } catch (error) {
      setProfileError(error.message || 'Unable to load your profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  fetchProfile();
}, [updateProfile]);

  // Add Skill handler
  const handleAddSkill = async (e) => {
  e.preventDefault();

  if (!newSkillName.trim()) return;

  try {
    const response = await api.post('/api/students/me/skills', {
      skillName: newSkillName.trim(),
      category: 'General',
      proficiency: newSkillLevel.toUpperCase(),
      yearsOfExperience: 1
    });

    const data = response.data;
    const updated = (data.skills || []).map((skill) => ({
      id: skill.id,
      name: skill.name,
      level: skill.proficiency || skill.level || 'INTERMEDIATE'
    }));

    setSkills(updated);
    updateProfile({ skills: data.skills || [] });

    setNewSkillName('');
    setIsSkillModalOpen(false);

    alert('Skill saved successfully!');
  } catch (error) {
    console.error('Failed to add skill:', error);
    alert(`Failed to save skill: ${error.message}`);
  }
};
  // Remove Skill
  const handleRemoveSkill = async (target) => {
    const skill = typeof target === 'number' ? skills[target] : (target || {});

    if (!skill?.id) {
      alert('Skill ID not found. Please refresh and try again.');
      return;
    }

    try {
      const response = await api.delete(`/api/students/me/skills/${skill.id}`);
      const data = response.data;

      const updated = (data.skills || []).map((item) => ({
        id: item.id,
        name: item.name,
        level: item.proficiency || item.level || 'INTERMEDIATE',
      }));

      setSkills(updated);
      updateProfile({ skills: data.skills || [] });
    } catch (error) {
      console.error('Failed to remove skill:', error);
      alert(`Failed to remove skill: ${error.message}`);
    }
  };
  // Add Interest handler
  const handleAddInterest = async (e) => {
    e.preventDefault();
    const interest = newInterestName.trim();
    if (!interest || interests.some((item) => item.toLowerCase() === interest.toLowerCase())) return;
    const updated = [...interests, newInterestName.trim()];

    try {
      const response = await api.put('/api/students/me', { interests: updated });
      const savedInterests = response.data.interests || updated;
      setInterests(savedInterests);
      updateProfile({ interests: savedInterests });
      setNewInterestName('');
      setIsInterestModalOpen(false);
    } catch (error) {
      console.error('Failed to add interest:', error);
      alert(`Failed to save interest: ${error.message}`);
    }
  };

  // Remove Interest
  const handleRemoveInterest = async (interestToRemove) => {
    const updated = interests.filter(item => item !== interestToRemove);

    try {
      const response = await api.put('/api/students/me', { interests: updated });
      const savedInterests = response.data.interests || updated;
      setInterests(savedInterests);
      updateProfile({ interests: savedInterests });
    } catch (error) {
      console.error('Failed to remove interest:', error);
      alert(`Failed to remove interest: ${error.message}`);
    }
  };

  // Save profile edits
  // Save profile edits to backend
const handleSaveProfile = async (e) => {
  e.preventDefault();

  try {
    const response = await api.put('/api/students/me', {
      headline: headlineEdit,
      bio: bioEdit,
      hoursPerWeek: Number(hoursPerWeek),
      preferredTime: preferredTime
    });

    const data = response.data;
    updateProfile({
      headline: data.headline,
      bio: data.bio,
      availability: {
        ...currentUser?.availability,
        hoursPerWeek: data.hoursPerWeek,
        preferredTime: data.preferredTime
      }
    });

    setIsEditProfileModalOpen(false);
    alert('Profile updated successfully!');
  } catch (error) {
    console.error('Profile update failed:', error);
    alert(`Failed to save profile: ${error.message}`);
  }
};

  return (
    <div className="container py-4 py-lg-5">
      {profileLoading && (
        <div className="alert alert-light border mb-4" role="status">
          Loading your profile...
        </div>
      )}

      {profileError && (
        <div className="alert alert-danger mb-4" role="alert">
          {profileError}
        </div>
      )}

      {/* Profile Overview Header Card */}
      <div className="pm-card p-4 p-md-5 mb-4 position-relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0b132b 0%, #1c2541 65%, #312e81 100%)',
        color: '#ffffff'
      }}>
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-auto text-center text-md-start">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'}
              alt={currentUser?.name || 'Student avatar'}
              className="rounded-circle border border-3 border-violet shadow-lg"
              style={{ width: 110, height: 110, objectFit: 'cover' }}
            />
          </div>

          <div className="col-12 col-md text-center text-md-start">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-2">
              <h2 className="fw-bold mb-0 text-white">{currentUser?.name || 'Alex Chen'}</h2>
              <Badge variant="violet" className="bg-opacity-25 text-white border-violet">
                Verified Student
              </Badge>
              <Badge variant="emerald">
                {currentUser?.availability?.status || 'Actively Looking'}
              </Badge>
            </div>

            <p className="text-light opacity-90 mb-2 small" style={{ fontSize: '0.95rem' }}>
              {currentUser?.headline || 'Junior Computer Science & HCI Major &bull; State Polytechnic Institute'}
            </p>

            <p className="text-muted small mb-3 text-light opacity-75" style={{ maxWidth: '640px' }}>
              {currentUser?.bio || 'Passionate about building intuitive web applications and design systems.'}
            </p>

            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-3 small text-light opacity-80">
              <div className="d-flex align-items-center gap-1">
                <BookOpen size={15} className="text-violet-light" />
                <span>{currentUser?.department || 'Computer Science'}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Calendar size={15} className="text-violet-light" />
                <span>{currentUser?.year || 'Junior (Year 3)'}</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <Clock size={15} className="text-violet-light" />
                <span>{hoursPerWeek} hrs/week committed</span>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-auto text-center text-md-end">
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setIsEditProfileModalOpen(true)}
              className="border-secondary text-white"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="pm-card p-3 p-md-4 text-center">
            <div className="small text-muted mb-1 fw-semibold">Active Teams</div>
            <div className="h3 fw-bold text-navy mb-0">{teams.length}</div>
            <small className="text-success small">&bull; Synchronized sprints</small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="pm-card p-3 p-md-4 text-center">
            <div className="small text-muted mb-1 fw-semibold">Available Matches</div>
            <div className="h3 fw-bold text-violet mb-0">{recommendations.length}</div>
            <small className="text-muted small">&gt;80% compatibility</small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="pm-card p-3 p-md-4 text-center">
            <div className="small text-muted mb-1 fw-semibold">Join Applications</div>
            <div className="h3 fw-bold text-navy mb-0">{applications.length}</div>
            <small className="text-muted small">Under team review</small>
          </div>
        </div>

        <div className="col-6 col-lg-3">
          <div className="pm-card p-3 p-md-4 text-center">
            <div className="small text-muted mb-1 fw-semibold">Weekly Hours</div>
            <div className="h3 fw-bold text-navy mb-0">{hoursPerWeek} hrs</div>
            <small className="text-muted small">{currentUser?.availability?.timezone || 'UTC-5 (EST)'}</small>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Skills, Interests, Roles) & Right Column (Availability, Teams, Recommendations) */}
      <div className="row g-4">
        {/* Left Column */}
        <div className="col-12 col-lg-7">
          {/* Skills Profile Section */}
          <div className="pm-card p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold text-navy mb-0">Technical Skill Profile</h5>
                <small className="text-muted">Skills and proficiency ratings used in compatibility scoring</small>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setIsSkillModalOpen(true)}
              >
                Add Skill
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-2 mb-3">
              {skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="p-2 px-3 rounded-3 border d-flex align-items-center gap-2 bg-light"
                  style={{ fontSize: '0.875rem' }}
                >
                  <div>
                    <span className="fw-bold text-navy me-1">{skill.name}</span>
                    <span className="badge bg-violet-subtle text-violet ms-1" style={{ fontSize: '0.72rem' }}>
                      {skill.level}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="btn btn-sm btn-link p-0 text-muted hover-danger"
                    title={`Remove ${skill.name}`}
                    aria-label={`Remove ${skill.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-3 bg-violet-subtle small text-violet">
              <strong>Matching Tip:</strong> Teams with complementary skills (e.g., Frontend paired with Backend & ML) receive higher balance scores than teams with duplicate skill sets.
            </div>
          </div>

          {/* Project Interests & Themes */}
          <div className="pm-card p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <div>
                <h5 className="fw-bold text-navy mb-0">Project Domains & Interests</h5>
                <small className="text-muted">Fields and industries you want to build projects for</small>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => setIsInterestModalOpen(true)}
              >
                Add Domain
              </Button>
            </div>

            <div className="d-flex flex-wrap gap-2">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="badge bg-light text-navy border p-2 px-3 rounded-pill d-inline-flex align-items-center gap-2"
                  style={{ fontSize: '0.82rem' }}
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="btn btn-sm btn-link p-0 text-muted hover-danger"
                    aria-label={`Remove ${interest}`}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Preferred Roles */}
          <div className="pm-card p-4">
            <h5 className="fw-bold text-navy mb-3 pb-2 border-bottom">Preferred Team Roles</h5>
            <div className="d-flex flex-wrap gap-2">
              {preferredRoles.map((role, idx) => (
                <div key={idx} className="p-2 px-3 rounded-3 border bg-light d-flex align-items-center gap-2">
                  <Briefcase size={16} className="text-violet" />
                  <span className="fw-semibold text-navy">{role}</span>
                  {idx === 0 && <Badge variant="violet">Primary</Badge>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-12 col-lg-5">
          {/* Availability Details Card */}
          <div className="pm-card p-4 mb-4">
            <h5 className="fw-bold text-navy mb-3 pb-2 border-bottom">Availability & Logistics</h5>

            <div className="mb-3">
              <label className="form-label small text-muted">Weekly Commitment Threshold</label>
              <div className="d-flex align-items-center gap-3">
                <input
                  type="range"
                  className="form-range flex-grow-1"
                  min="5"
                  max="30"
                  step="1"
                  value={hoursPerWeek}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setHoursPerWeek(val);
                    updateProfile({ availability: { ...currentUser?.availability, hoursPerWeek: val } });
                  }}
                  id="availability-slider"
                  aria-label="Weekly hours commitment"
                />
                <span className="badge bg-navy text-white px-3 py-2 fw-bold" style={{ minWidth: '75px' }}>
                  {hoursPerWeek} hrs/wk
                </span>
              </div>
            </div>

            <div className="mb-3">
              <span className="small text-muted d-block mb-1">Preferred Collaboration Windows</span>
              <div className="p-2 px-3 rounded-3 bg-light border small text-navy fw-medium">
                {preferredTime}
              </div>
            </div>

            <div>
              <span className="small text-muted d-block mb-1">Timezone & Location</span>
              <div className="p-2 px-3 rounded-3 bg-light border small text-navy fw-medium">
                {currentUser?.availability?.timezone || 'UTC-5 (EST)'} &bull; On Campus & Virtual
              </div>
            </div>
          </div>

          {/* Quick Recommended Projects preview */}
          <div className="pm-card p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h5 className="fw-bold text-navy mb-0">Top Team Matches</h5>
              <Link to="/recommendations" className="small text-violet fw-semibold">View All &rarr;</Link>
            </div>

            <div className="d-flex flex-column gap-3">
              {recommendations.slice(0, 2).map((rec) => (
                <div key={rec.id} className="p-3 rounded-3 border bg-light">
                  <div className="d-flex align-items-start justify-content-between gap-2 mb-1">
                    <h6 className="fw-bold text-navy mb-0" style={{ fontSize: '0.9rem' }}>
                      {rec.projectTitle}
                    </h6>
                    <Badge variant="emerald">{rec.compatibilityScore}%</Badge>
                  </div>
                  <p className="text-muted small mb-2 text-truncate" style={{ fontSize: '0.8rem' }}>
                    Open Role: <strong className="text-violet">{rec.targetRole}</strong>
                  </p>
                  <Link to={`/projects/${rec.projectId}`} className="btn btn-sm btn-outline-secondary w-100 py-1" style={{ fontSize: '0.78rem' }}>
                    View Project Details
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Active Teams Shortcut */}
          <div className="pm-card p-4">
            <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
              <h5 className="fw-bold text-navy mb-0">My Active Teams</h5>
              <Link to="/teams" className="small text-violet fw-semibold">Sprint Board &rarr;</Link>
            </div>

            <div className="d-flex flex-column gap-2">
              {teams.map((team) => (
                <div key={team.id} className="p-3 rounded-3 border bg-white d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="fw-bold text-navy mb-0" style={{ fontSize: '0.88rem' }}>
                      {team.projectName}
                    </h6>
                    <span className="small text-muted">{team.myRole}</span>
                  </div>
                  <Link to="/teams" className="btn btn-sm btn-light rounded-circle p-1">
                    <ExternalLink size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Skill */}
      <Modal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        title="Add Technical Skill"
        subtitle="Specify technical competency to enhance project matching accuracy"
      >
        <form onSubmit={handleAddSkill}>
          <FormInput
            label="Skill Name"
            placeholder="e.g. Docker, GraphQL, PyTorch, Figma"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            required
            autoFocus
          />

          <FormInput
            type="select"
            label="Self-Assessed Proficiency Level"
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
            options={[
              { value: 'Beginner', label: 'Beginner (Coursework / Learning)' },
              { value: 'Intermediate', label: 'Intermediate (Built projects)' },
              { value: 'Advanced', label: 'Advanced (Fluent / Production ready)' }
            ]}
          />

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" onClick={() => setIsSkillModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Add Skill</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Interest */}
      <Modal
        isOpen={isInterestModalOpen}
        onClose={() => setIsInterestModalOpen(false)}
        title="Add Project Domain Interest"
        subtitle="Connect with teams working on themes you are passionate about"
      >
        <form onSubmit={handleAddInterest}>
          <FormInput
            label="Domain / Sector Name"
            placeholder="e.g. Clean Energy, Cybersecurity, FinTech, Game Dev"
            value={newInterestName}
            onChange={(e) => setNewInterestName(e.target.value)}
            required
            autoFocus
          />

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" onClick={() => setIsInterestModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Add Interest</Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Profile Headline & Bio */}
      <Modal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        title="Edit Student Headline & Bio"
      >
        <form onSubmit={handleSaveProfile}>
          <FormInput
            label="Headline"
            value={headlineEdit}
            onChange={(e) => setHeadlineEdit(e.target.value)}
            placeholder="e.g. Senior CS Major focusing on HCI & Distributed Systems"
          />

          <FormInput
            type="textarea"
            label="Short Bio"
            value={bioEdit}
            onChange={(e) => setBioEdit(e.target.value)}
            rows={3}
            placeholder="Tell potential teammates about your interests and work style..."
          />

          <FormInput
            label="Preferred Collaboration Times"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            placeholder="e.g. Weekday evenings, Saturdays"
          />

          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <Button variant="ghost" onClick={() => setIsEditProfileModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentDashboardPage;
