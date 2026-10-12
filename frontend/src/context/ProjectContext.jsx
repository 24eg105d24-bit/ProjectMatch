import React, { createContext, useContext, useCallback, useEffect, useState, startTransition } from 'react';
import api from '../api/client';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

const normalizeStatus = (status) => {
  if (!status) return 'Recruiting';
  return status
    .toLowerCase()
    .split('_')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const normalizeTaskStatus = (status) => (status || 'TODO').toLowerCase().replaceAll('_', '-');
const requireDatabaseId = (id, resource) => {
  const databaseId = String(id ?? '');
  if (!/^[1-9]\d*$/.test(databaseId)) {
    throw new Error(`${resource} ID must be a numeric database ID.`);
  }
  return databaseId;
};

const mapProject = (project) => ({
  id: String(project.id),
  title: project.title,
  tagline: project.tagline || project.description || '',
  category: project.category || 'General',
  status: normalizeStatus(project.status),
  lead: {
    id: String(project.creatorId || ''),
    name: project.creatorName || 'Project Lead',
    email: project.creatorEmail || '',
    avatar: project.creatorAvatar || '',
    role: 'Project Lead'
  },
  teamSize: {
    current: project.currentTeamSize ?? 0,
    max: project.maxTeamSize ?? 4
  },
  members: (project.members || []).map(member => ({
    id: String(member.userId || member.id),
    name: member.fullName || member.name,
    role: member.assignedRoleName || member.memberRole || 'Team Member',
    avatar: member.avatarUrl || '',
    status: 'Confirmed'
  })),
  requiredSkills: (project.requiredSkills || []).map(skill => skill.name || skill),
  openRoles: project.openRoles || [],
  description: project.description || '',
  timeline: {
    term: project.academicTerm || 'Current term',
    deadline: project.deadline || 'Deadline TBD',
    weeklyCommitment: `${project.weeklyHoursExpectation ?? 12} hrs/week`
  },
  milestones: [
    { title: 'Project kickoff', status: 'Completed', date: 'Started' },
    { title: 'Current sprint', status: 'In Progress', date: 'Now' },
    { title: 'Demo readiness', status: 'Upcoming', date: project.deadline || 'TBD' }
  ],
  tags: project.tags || []
});

const mapTeam = (team, currentUserId) => {
  const currentMember = (team.members || []).find(
    member => String(member.userId) === String(currentUserId)
  );

  return {
    id: String(team.id),
    projectId: String(team.projectId),
    projectName: team.projectTitle || team.name,
    tagline: team.name,
    myRole: currentMember?.assignedRoleName || currentMember?.memberRole || 'Team Member',
    facultyAdvisor: team.facultyAdvisor || 'Not assigned',
    meetingSchedule: team.meetingSchedule || 'Schedule TBD',
    repository: team.repositoryUrl || '#',
    channel: team.communicationChannel || 'Channel TBD',
    progress: 0,
    members: (team.members || []).map(member => ({
      id: String(member.userId || member.id),
      name: member.fullName || member.name,
      role: member.assignedRoleName || member.memberRole || 'Team Member',
      avatar: member.avatarUrl || '',
      status: 'Confirmed'
    })),
    upcomingMilestone: 'Next sprint checkpoint'
  };
};

const mapTask = (task) => ({
  id: String(task.id),
  teamId: String(task.teamId),
  title: task.title,
  description: task.description,
  status: normalizeTaskStatus(task.status),
  priority: task.priority ? task.priority.charAt(0) + task.priority.slice(1).toLowerCase() : 'Medium',
  assignee: {
    name: task.assigneeName || 'Unassigned',
    avatar: task.assigneeAvatar || ''
  },
  dueDate: task.dueDate || 'TBD',
  tag: task.tag || 'Feature'
});

const hasSessionToken = () => {
  try {
    return Boolean(JSON.parse(localStorage.getItem('projectmatch_session') || '{}')?.token);
  } catch {
    return false;
  }
};

export const ProjectProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [applications, setApplications] = useState([]);
  const [receivedApplications, setReceivedApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refreshProjects = useCallback(async () => {
    const response = await api.get('/api/projects');
    setProjects((response.data || []).map(mapProject));
  }, []);

  const refreshRecommendations = useCallback(async () => {
    if (!hasSessionToken()) {
      setRecommendations([]);
      return;
    }
    const response = await api.get('/api/recommendations/projects');
    setRecommendations(response.data || []);
  }, []);

  const refreshTeams = useCallback(async () => {
    if (!hasSessionToken()) {
      setTeams([]);
      setTasks([]);
      return;
    }
    const response = await api.get('/api/teams/me');
    const mappedTeams = (response.data || []).map(team => mapTeam(team, currentUser?.id));
    setTeams(mappedTeams);

    const taskResponses = await Promise.allSettled(
      mappedTeams.map(team => api.get(`/api/teams/${team.id}/tasks`))
      
    );
    setTasks(taskResponses
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => result.value.data || [])
      .map(mapTask));
    const taskFailure = taskResponses.find(result => result.status === 'rejected');
    if (taskFailure) throw taskFailure.reason;
  }, [currentUser?.id]);

  const refreshApplications = useCallback(async () => {
    if (!hasSessionToken()) {
      setApplications([]);
      setReceivedApplications([]);
      return;
    }
    try {
      const [sentRes, receivedRes] = await Promise.allSettled([
        api.get('/api/invitations/sent'),
        api.get('/api/invitations/received')
      ]);

      if (sentRes.status === 'fulfilled') {
        const mappedApps = (sentRes.value.data || []).map(inv => ({
          id: String(inv.id),
          projectId: String(inv.projectId),
          projectTitle: inv.projectTitle,
          role: inv.targetRole,
          message: inv.message,
          status: normalizeStatus(inv.status),
          rawStatus: inv.status,
          submittedAt: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'Recently'
        }));
        setApplications(mappedApps);
      }

      if (receivedRes.status === 'fulfilled') {
        const mappedReceived = (receivedRes.value.data || []).map(inv => ({
          id: String(inv.id),
          projectId: String(inv.projectId),
          projectTitle: inv.projectTitle,
          teamId: String(inv.teamId || ''),
          senderId: String(inv.senderId),
          senderName: inv.senderName,
          senderEmail: inv.senderEmail,
          senderAvatar: inv.senderAvatar || '',
          senderDepartment: inv.senderDepartment || 'Computer Science',
          senderAcademicYear: inv.senderAcademicYear || 'Undergraduate',
          senderSkills: inv.senderSkills || [],
          role: inv.targetRole,
          message: inv.message,
          status: normalizeStatus(inv.status),
          rawStatus: inv.status,
          submittedAt: inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'Recently'
        }));
        setReceivedApplications(mappedReceived);
      }
    } catch (err) {
      setApplications([]);
      setReceivedApplications([]);
      throw err;
    }
  }, []);

  const refreshProjectData = useCallback(async () => {
    await Promise.resolve();
    try {
      startTransition(() => {
        setLoading(true);
        setError('');
      });
      const results = await Promise.allSettled([
        refreshProjects(),
        refreshRecommendations(),
        refreshTeams(),
        refreshApplications()
      ]);
      const failures = results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message || 'Some project data could not be loaded.');
      if (failures.length) setError(failures.join(' '));
    } catch (err) {
      setError(err.message || 'Unable to load project data.');
    } finally {
      setLoading(false);
    }
  }, [refreshProjects, refreshRecommendations, refreshTeams, refreshApplications]);

  useEffect(() => {
    refreshProjectData();
  }, [refreshProjectData, currentUser?.id]);

  // Create Project
  const createProject = async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    const newProject = mapProject(response.data);
    setProjects(prev => [newProject, ...prev]);
    await refreshProjectData();
    return newProject;
  };

  // Update Project
  const updateProject = async (projectId, projectData) => {
    const response = await api.put(`/api/projects/${requireDatabaseId(projectId, 'Project')}`, projectData);
    const updated = mapProject(response.data);
    setProjects(prev => prev.map(p => String(p.id) === String(projectId) ? updated : p));
    await refreshProjectData();
    return updated;
  };

  // Delete Project
  const deleteProject = async (projectId) => {
    await api.delete(`/api/projects/${requireDatabaseId(projectId, 'Project')}`);
    setProjects(prev => prev.filter(p => String(p.id) !== String(projectId)));
    await refreshProjectData();
  };

  // Update Project Recruitment Status
  const updateProjectStatus = async (projectId, status) => {
    const response = await api.patch(`/api/projects/${requireDatabaseId(projectId, 'Project')}/status`, { status });
    const updated = mapProject(response.data);
    setProjects(prev => prev.map(p => String(p.id) === String(projectId) ? updated : p));
    return updated;
  };

  // Apply to a project
  const applyToProject = async (projectId, applicationData) => {
    const response = await api.post(`/api/projects/${requireDatabaseId(projectId, 'Project')}/applications`, {
      targetRole: applicationData.role,
      message: applicationData.note
    });
    const project = projects.find(p => String(p.id) === String(projectId));
    const newApp = {
      id: String(response.data.id),
      projectId: String(projectId),
      projectTitle: project ? project.title : 'Project Application',
      role: applicationData.role,
      note: applicationData.note,
      status: normalizeStatus(response.data.status),
      submittedAt: 'Just now'
    };

    setApplications(prev => [newApp, ...prev]);
    return { success: true, application: newApp };
  };

  // Respond to invitation
  const respondToApplication = async (invitationId, accept) => {
    const endpoint = accept
      ? `/api/invitations/${requireDatabaseId(invitationId, 'Invitation')}/accept`
      : `/api/invitations/${requireDatabaseId(invitationId, 'Invitation')}/reject`;
    const response = await api.post(endpoint);
    await refreshProjectData();
    return response.data;
  };

  // Update Team Details
  const updateTeam = async (teamId, teamData) => {
    const id = requireDatabaseId(teamId, 'Team');
    const response = await api.put(`/api/teams/${id}`, teamData);
    await refreshTeams();
    return response.data;
  };

  // Remove Team Member or Leave Team
  const removeTeamMember = async (teamId, memberUserId) => {
    const tId = requireDatabaseId(teamId, 'Team');
    const uId = requireDatabaseId(memberUserId, 'User');
    await api.delete(`/api/teams/${tId}/members/${uId}`);
    await refreshTeams();
  };

  // Add task to Kanban board
  const addTask = async (newTaskData) => {
    const teamId = requireDatabaseId(newTaskData.teamId, 'Team');
    const response = await api.post(`/api/teams/${teamId}/tasks`, {
      title: newTaskData.title,
      description: newTaskData.description,
      status: (newTaskData.status || 'todo').toUpperCase().replaceAll('-', '_'),
      priority: (newTaskData.priority || 'Medium').toUpperCase(),
      tag: newTaskData.tag || 'Feature',
      dueDate: newTaskData.dueDate
    });
    const createdTask = mapTask(response.data);

    setTasks(prev => [createdTask, ...prev]);
    return createdTask;
  };

  // Move task status
  const moveTask = async (taskId, newStatus) => {
    const response = await api.patch(`/api/tasks/${requireDatabaseId(taskId, 'Task')}/status`, {
      status: newStatus.toUpperCase().replaceAll('-', '_')
    });
    const updatedTask = mapTask(response.data);
    setTasks(prev =>
      prev.map(task =>
        String(task.id) === String(taskId) ? updatedTask : task
      )
    );
  };

  // Delete task
  const deleteTask = async (taskId) => {
    await api.delete(`/api/tasks/${requireDatabaseId(taskId, 'Task')}`);
    setTasks(prev => prev.filter(t => String(t.id) !== String(taskId)));
  };

  // Get candidate recommendations for a project
  const getCandidateRecommendations = useCallback(async (projectId) => {
    const response = await api.get(`/api/recommendations/candidates/${requireDatabaseId(projectId, 'Project')}`);
    return response.data;
  }, []);

  return (
    <ProjectContext.Provider value={{
      projects,
      setProjects,
      recommendations,
      teams,
      setTeams,
      tasks,
      applications,
      receivedApplications,
      loading,
      error,
      refreshProjectData,
      createProject,
      updateProject,
      deleteProject,
      updateProjectStatus,
      applyToProject,
      respondToApplication,
      getCandidateRecommendations,
      updateTeam,
      removeTeamMember,
      addTask,
      moveTask,
      deleteTask
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => useContext(ProjectContext);
