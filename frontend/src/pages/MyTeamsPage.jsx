import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import TaskBoard from '../components/tasks/TaskBoard';
import Badge from '../components/common/Badge';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import AlertBanner from '../components/common/AlertBanner';
import Avatar from '../components/common/Avatar';
import {
  Users,
  Calendar,
  FolderGit2,
  MessageSquare,
  Kanban,
  Award,
  Layers,
  Settings,
  UserMinus,
  LogOut
} from 'lucide-react';

const MyTeamsPage = () => {
  const {
    teams,
    tasks,
    moveTask,
    addTask,
    deleteTask,
    loading,
    error,
    updateTeam,
    removeTeamMember
  } = useProjects();
  const { currentUser } = useAuth();

  const [activeTeamId, setActiveTeamId] = useState('');
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [settingsError, setSettingsError] = useState('');

  const [teamSettingsForm, setTeamSettingsForm] = useState({
    name: '',
    facultyAdvisor: '',
    meetingSchedule: '',
    repositoryUrl: '',
    communicationChannel: ''
  });

  const activeTeam = teams.find(team => team.id === activeTeamId) || teams[0];

  const isLeader = activeTeam && (
    activeTeam.myRole?.toUpperCase() === 'LEADER' ||
    activeTeam.myRole?.toUpperCase() === 'PROJECT LEAD'
  );

  useEffect(() => {
    if (activeTeam) {
      setTeamSettingsForm({
        name: activeTeam.projectName || '',
        facultyAdvisor: activeTeam.facultyAdvisor === 'Not assigned' ? '' : activeTeam.facultyAdvisor || '',
        meetingSchedule: activeTeam.meetingSchedule === 'Schedule TBD' ? '' : activeTeam.meetingSchedule || '',
        repositoryUrl: activeTeam.repository === '#' ? '' : activeTeam.repository || '',
        communicationChannel: activeTeam.channel === 'Channel TBD' ? '' : activeTeam.channel || ''
      });
    }
  }, [activeTeam, isSettingsModalOpen]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTeam(activeTeam.id, teamSettingsForm);
      setIsSettingsModalOpen(false);
      setSettingsSuccess('Team settings updated successfully.');
    } catch (err) {
      setSettingsError(err.message || 'Failed to update team settings.');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    const isSelf = String(memberId) === String(currentUser?.id);
    const confirmPrompt = isSelf
      ? `Are you sure you want to leave "${activeTeam.projectName}"?`
      : `Remove ${memberName} from this team?`;
    if (!window.confirm(confirmPrompt)) return;

    try {
      await removeTeamMember(activeTeam.id, memberId);
      setSettingsSuccess(isSelf ? 'You have left the team.' : `Removed ${memberName} from the team.`);
    } catch (err) {
      setSettingsError(err.message || 'Failed to remove team member.');
    }
  };

  return (
    <div className="container py-4 py-lg-5">
      {/* Page Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <Users size={22} className="text-violet" />
            <h2 className="h3 fw-bold text-navy mb-0">My Teams & Task Board</h2>
          </div>
          <p className="text-muted small mb-0">
            Collaborate on your active capstone teams, track milestones, and manage sprint deliverables
          </p>
        </div>
      </div>

      {settingsSuccess && (
        <AlertBanner
          type="success"
          message={settingsSuccess}
          onClose={() => setSettingsSuccess('')}
          className="mb-4"
        />
      )}
      {settingsError && (
        <AlertBanner
          type="error"
          message={settingsError}
          onClose={() => setSettingsError('')}
          className="mb-4"
        />
      )}
      {error && <div className="alert alert-danger" role="alert">{error}</div>}

      {loading && teams.length === 0 && (
        <div className="py-4 text-center text-muted" role="status">Loading your teams...</div>
      )}

      {!loading && !activeTeam && (
        <div className="pm-card p-4 p-md-5 mb-4 text-center bg-white">
          <h3 className="h5 fw-bold text-navy">You are not on a team yet</h3>
          <p className="text-muted mb-3">Create a project or send a join request to start a team workspace.</p>
          <Link to="/projects" className="btn-pm-primary btn-sm py-2 px-3">Explore Projects</Link>
        </div>
      )}

      {/* Team Selection Tabs */}
      <div className="d-flex flex-wrap gap-2 mb-4 pb-2 border-bottom">
        {teams.map((team) => (
          <button
            key={team.id}
            type="button"
            onClick={() => setActiveTeamId(team.id)}
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-2 rounded-3 transition-all ${
              activeTeam?.id === team.id
                ? 'btn-pm-primary shadow-sm'
                : 'btn-outline-secondary bg-white text-navy border'
            }`}
          >
            <Layers size={16} />
            <span className="fw-semibold">{team.projectName}</span>
            <span className="badge rounded-pill bg-white text-dark small" style={{ fontSize: '0.7rem' }}>
              {team.myRole}
            </span>
          </button>
        ))}
      </div>

      {/* Active Team Overview Card */}
      {activeTeam && (
        <div className="pm-card p-4 p-md-5 mb-5 bg-white">
          <div className="row g-4 align-items-center">
            {/* Team details */}
            <div className="col-12 col-lg-7">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-2">
                <div className="d-flex align-items-center gap-2">
                  <Badge variant="violet">{activeTeam.myRole}</Badge>
                  <Badge variant="emerald">Active Sprint</Badge>
                </div>
                {isLeader && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm py-1 px-2 d-inline-flex align-items-center gap-1"
                    onClick={() => setIsSettingsModalOpen(true)}
                  >
                    <Settings size={14} /> Team Settings
                  </button>
                )}
              </div>

              <h3 className="fw-bold text-navy mb-2">{activeTeam.projectName}</h3>
              <p className="text-muted small mb-3">{activeTeam.tagline}</p>

              <div className="row g-3 small text-muted pt-2 border-top">
                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <Award size={16} className="text-violet" />
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Faculty Advisor</span>
                      <strong className="text-navy">{activeTeam.facultyAdvisor}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <Calendar size={16} className="text-violet" />
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Weekly Sync Meeting</span>
                      <strong className="text-navy">{activeTeam.meetingSchedule}</strong>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <FolderGit2 size={16} className="text-violet" />
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Git Repository</span>
                      <a href={activeTeam.repository} target="_blank" rel="noreferrer" className="text-violet fw-semibold">
                        GitHub Repo &rarr;
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="d-flex align-items-center gap-2">
                    <MessageSquare size={16} className="text-violet" />
                    <div>
                      <span className="text-muted d-block" style={{ fontSize: '0.72rem' }}>Team Channel</span>
                      <strong className="text-navy">{activeTeam.channel}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Roster Column */}
            <div className="col-12 col-lg-5 ps-lg-4 border-start-lg">
              <div className="p-3 rounded-3 bg-light border">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-navy mb-0 small text-uppercase tracking-wider">Teammates Roster</h6>
                  <span className="badge bg-white text-navy border small">{activeTeam.members?.length} Members</span>
                </div>

                <div className="d-flex flex-column gap-2 mb-3">
                  {activeTeam.members?.map((m) => (
                    <div key={m.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-white border">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar
                          src={m.avatar}
                          name={m.name}
                          size={28}
                          shape="circle"
                        />
                        <div className="lh-1">
                          <span className="fw-bold text-navy small">{m.name}</span>
                          <span className="text-muted d-block" style={{ fontSize: '0.7rem' }}>{m.role}</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-light text-success border small" style={{ fontSize: '0.68rem' }}>
                          {m.status}
                        </span>
                        {isLeader && String(m.id) !== String(currentUser?.id) && (
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm p-1 border-0"
                            title={`Remove ${m.name}`}
                            onClick={() => handleRemoveMember(m.id, m.name)}
                          >
                            <UserMinus size={14} />
                          </button>
                        )}
                        {!isLeader && String(m.id) === String(currentUser?.id) && (
                          <button
                            type="button"
                            className="btn btn-outline-warning btn-sm p-1 border-0"
                            title="Leave Team"
                            onClick={() => handleRemoveMember(m.id, m.name)}
                          >
                            <LogOut size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center small text-muted">
                  <span>Upcoming Milestone:</span>
                  <strong className="text-navy">{activeTeam.upcomingMilestone}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Board Section */}
      {activeTeam && <div className="mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <Kanban size={20} className="text-violet" />
          <h4 className="fw-bold text-navy mb-0">Sprint Task Board</h4>
        </div>

        <TaskBoard
          tasks={tasks}
          teamId={activeTeam.id}
          onMoveStatus={moveTask}
          onAddTask={addTask}
          onDeleteTask={deleteTask}
        />
      </div>}

      {/* Modal: Team Settings */}
      {activeTeam && (
        <Modal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          title={`Team Settings: ${activeTeam.projectName}`}
          subtitle="Configure faculty advisor, sync schedule, repository and communication channels"
        >
          <form onSubmit={handleSettingsSubmit}>
            <FormInput
              type="text"
              label="Team Name"
              value={teamSettingsForm.name}
              onChange={(e) => setTeamSettingsForm(prev => ({ ...prev, name: e.target.value }))}
              required
            />

            <FormInput
              type="text"
              label="Faculty Advisor"
              placeholder="e.g. Dr. Jane Smith"
              value={teamSettingsForm.facultyAdvisor}
              onChange={(e) => setTeamSettingsForm(prev => ({ ...prev, facultyAdvisor: e.target.value }))}
            />

            <FormInput
              type="text"
              label="Weekly Meeting Schedule"
              placeholder="e.g. Tuesdays at 4:00 PM EST (Virtual)"
              value={teamSettingsForm.meetingSchedule}
              onChange={(e) => setTeamSettingsForm(prev => ({ ...prev, meetingSchedule: e.target.value }))}
            />

            <FormInput
              type="text"
              label="Git Repository URL"
              placeholder="e.g. https://github.com/org/project"
              value={teamSettingsForm.repositoryUrl}
              onChange={(e) => setTeamSettingsForm(prev => ({ ...prev, repositoryUrl: e.target.value }))}
            />

            <FormInput
              type="text"
              label="Communication Channel"
              placeholder="e.g. Discord #capstone or Slack #proj"
              value={teamSettingsForm.communicationChannel}
              onChange={(e) => setTeamSettingsForm(prev => ({ ...prev, communicationChannel: e.target.value }))}
            />

            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setIsSettingsModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary btn-sm">
                Save Settings
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MyTeamsPage;
