package com.projectmatch.service;

import com.projectmatch.dto.request.CreateProjectRequest;
import com.projectmatch.dto.response.ProjectDetailResponse;
import com.projectmatch.dto.response.ProjectResponse;
import com.projectmatch.dto.response.SkillResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.exception.UnauthorizedException;
import com.projectmatch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectSkillRepository projectSkillRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final TaskRepository taskRepository;
    private final SkillService skillService;
    private final InvitationRepository invitationRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectSkillRepository projectSkillRepository,
                          UserRepository userRepository,
                          TeamRepository teamRepository,
                          TeamMemberRepository teamMemberRepository,
                          TaskRepository taskRepository,
                          SkillService skillService,
                          InvitationRepository invitationRepository) {
        this.projectRepository = projectRepository;
        this.projectSkillRepository = projectSkillRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.taskRepository = taskRepository;
        this.skillService = skillService;
        this.invitationRepository = invitationRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getAllProjects(String query, String category, String statusStr) {
        ProjectStatus status = null;
        if (statusStr != null && !statusStr.equalsIgnoreCase("ALL")) {
            try {
                status = ProjectStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        String searchCategory = (category != null && !category.equalsIgnoreCase("ALL")) ? category : null;
        String searchQuery = (query != null && !query.trim().isEmpty()) ? query.trim() : null;

        List<Project> projects = projectRepository.searchProjects(searchQuery, searchCategory, status);

        return projects.stream()
                .map(this::mapToProjectResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailResponse getProjectById(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        return mapToDetailResponse(project);
    }

    @Transactional
    public ProjectDetailResponse createProject(String userEmail, CreateProjectRequest request) {
        User creator = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Project project = new Project();
        project.setTitle(request.getTitle().trim());
        project.setTagline(request.getTagline());
        project.setDescription(request.getDescription());
        project.setCategory(request.getCategory());
        project.setStatus(ProjectStatus.RECRUITING);
        project.setCreator(creator);
        project.setMaxTeamSize(request.getMaxTeamSize() != null ? request.getMaxTeamSize() : 4);
        project.setAcademicTerm(request.getAcademicTerm() != null ? request.getAcademicTerm() : "Fall 2026");
        project.setDeadline(request.getDeadline());
        project.setWeeklyHoursExpectation(request.getWeeklyHoursExpectation() != null ? request.getWeeklyHoursExpectation() : 12);

        if (request.getTags() != null) {
            project.setTags(new ArrayList<>(request.getTags()));
        }
        if (request.getOpenRoles() != null) {
            project.setOpenRoles(new ArrayList<>(request.getOpenRoles()));
        }

        Project savedProject = projectRepository.save(project);

        // Add required skills
        if (request.getRequiredSkills() != null) {
            for (CreateProjectRequest.ProjectSkillRequest skillReq : request.getRequiredSkills()) {
                if (skillReq.getSkillName() != null && !skillReq.getSkillName().trim().isEmpty()) {
                    Skill skill = skillService.getOrCreateSkill(skillReq.getSkillName().trim(), "General");
                    SkillProficiency proficiency = SkillProficiency.BEGINNER;
                    if (skillReq.getMinProficiency() != null) {
                        try {
                            proficiency = SkillProficiency.valueOf(skillReq.getMinProficiency().toUpperCase());
                        } catch (IllegalArgumentException ignored) {}
                    }
                    ProjectSkill projectSkill = new ProjectSkill(savedProject, skill, proficiency, skillReq.getIsRequired());
                    projectSkillRepository.save(projectSkill);
                }
            }
        }

        // Create the associated team automatically
        Team team = new Team(savedProject.getTitle() + " Core Team", savedProject);
        Team savedTeam = teamRepository.save(team);
        savedProject.setTeam(savedTeam);

        // Add the creator as the first member with LEADER role
        TeamMember leaderMember = new TeamMember(savedTeam, creator, TeamMemberRole.LEADER, "Project Lead");
        teamMemberRepository.save(leaderMember);

        return getProjectById(savedProject.getId());
    }

    @Transactional
    public ProjectResponse updateProjectStatus(Long projectId, String userEmail, ProjectStatus status) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        User currentUser = userRepository.findByEmail(userEmail.trim()).orElse(null);
        boolean isCreator = project.getCreator().getEmail().equalsIgnoreCase(userEmail.trim());
        boolean isAdmin = currentUser != null && currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isCreator && !isAdmin) {
            throw new UnauthorizedException("Only the project creator or an administrator can update the project status.");
        }

        project.setStatus(status);
        Project saved = projectRepository.save(project);
        return mapToProjectResponse(saved);
    }

    @Transactional
    public ProjectDetailResponse updateProject(Long projectId, String userEmail, CreateProjectRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        if (!project.getCreator().getEmail().equalsIgnoreCase(userEmail.trim())) {
            throw new UnauthorizedException("Only the project creator can update project details.");
        }

        project.setTitle(request.getTitle().trim());
        if (request.getTagline() != null) project.setTagline(request.getTagline());
        if (request.getDescription() != null) project.setDescription(request.getDescription());
        if (request.getCategory() != null) project.setCategory(request.getCategory());
        if (request.getMaxTeamSize() != null) project.setMaxTeamSize(request.getMaxTeamSize());
        if (request.getAcademicTerm() != null) project.setAcademicTerm(request.getAcademicTerm());
        if (request.getDeadline() != null) project.setDeadline(request.getDeadline());
        if (request.getWeeklyHoursExpectation() != null) project.setWeeklyHoursExpectation(request.getWeeklyHoursExpectation());

        if (request.getTags() != null) {
            project.setTags(new ArrayList<>(request.getTags()));
        }
        if (request.getOpenRoles() != null) {
            project.setOpenRoles(new ArrayList<>(request.getOpenRoles()));
        }

        if (request.getRequiredSkills() != null) {
            project.getRequiredSkills().clear();
            for (CreateProjectRequest.ProjectSkillRequest skillReq : request.getRequiredSkills()) {
                if (skillReq.getSkillName() != null && !skillReq.getSkillName().trim().isEmpty()) {
                    Skill skill = skillService.getOrCreateSkill(skillReq.getSkillName().trim(), "General");
                    SkillProficiency proficiency = SkillProficiency.BEGINNER;
                    if (skillReq.getMinProficiency() != null) {
                        try {
                            proficiency = SkillProficiency.valueOf(skillReq.getMinProficiency().toUpperCase());
                        } catch (IllegalArgumentException ignored) {}
                    }
                    ProjectSkill projectSkill = new ProjectSkill(project, skill, proficiency, skillReq.getIsRequired());
                    project.addRequiredSkill(projectSkill);
                }
            }
        }

        Project saved = projectRepository.save(project);
        return mapToDetailResponse(saved);
    }

    @Transactional
    public void deleteProject(Long projectId, String userEmail) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        User currentUser = userRepository.findByEmail(userEmail.trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        boolean isCreator = project.getCreator().getId().equals(currentUser.getId()) ||
                project.getCreator().getEmail().equalsIgnoreCase(userEmail.trim());
        boolean isAdmin = currentUser.getRole() == Role.ROLE_ADMIN;

        if (!isCreator && !isAdmin) {
            throw new UnauthorizedException("Only the project creator or an administrator can delete this project.");
        }

        // 1. Delete all invitations for this project
        List<Invitation> invitations = invitationRepository.findByProjectIdOrderByCreatedAtDesc(projectId);
        if (!invitations.isEmpty()) {
            invitationRepository.deleteAll(invitations);
            invitationRepository.flush();
        }

        // 2. Cascade delete related team, tasks, and members safely
        teamRepository.findByProjectId(projectId).ifPresent(team -> {
            List<Task> tasks = taskRepository.findByTeamIdOrderByCreatedAtDesc(team.getId());
            if (!tasks.isEmpty()) {
                taskRepository.deleteAll(tasks);
                taskRepository.flush();
            }

            List<TeamMember> members = new ArrayList<>(team.getMembers());
            team.getMembers().clear();
            teamMemberRepository.deleteAll(members);
            teamMemberRepository.flush();

            project.setTeam(null);
            team.setProject(null);
            teamRepository.delete(team);
            teamRepository.flush();
        });

        // 3. Delete the project entity
        projectRepository.delete(project);
        projectRepository.flush();
    }

    public ProjectResponse mapToProjectResponse(Project project) {
        ProjectResponse resp = new ProjectResponse();
        resp.setId(project.getId());
        resp.setTitle(project.getTitle());
        resp.setTagline(project.getTagline());
        resp.setDescription(project.getDescription());
        resp.setCategory(project.getCategory());
        resp.setStatus(project.getStatus().name());
        resp.setCreatorId(project.getCreator().getId());
        resp.setCreatorName(project.getCreator().getFullName());
        resp.setCreatorEmail(project.getCreator().getEmail());
        resp.setMaxTeamSize(project.getMaxTeamSize());
        resp.setAcademicTerm(project.getAcademicTerm());
        resp.setDeadline(project.getDeadline());
        resp.setWeeklyHoursExpectation(project.getWeeklyHoursExpectation());
        resp.setTags(project.getTags());
        resp.setOpenRoles(project.getOpenRoles());
        resp.setCreatedAt(project.getCreatedAt());

        long currentMembers = 0;
        if (project.getTeam() != null) {
            currentMembers = teamMemberRepository.countByTeamId(project.getTeam().getId());
        }
        resp.setCurrentTeamSize((int) currentMembers);

        List<SkillResponse> skillResponses = project.getRequiredSkills().stream()
                .map(ps -> new SkillResponse(
                        ps.getSkill().getId(),
                        ps.getSkill().getName(),
                        ps.getSkill().getCategory(),
                        ps.getMinProficiency().name(),
                        null
                ))
                .toList();
        resp.setRequiredSkills(skillResponses);

        return resp;
    }

    public ProjectDetailResponse mapToDetailResponse(Project project) {
        ProjectResponse base = mapToProjectResponse(project);
        ProjectDetailResponse detail = new ProjectDetailResponse();

        detail.setId(base.getId());
        detail.setTitle(base.getTitle());
        detail.setTagline(base.getTagline());
        detail.setDescription(base.getDescription());
        detail.setCategory(base.getCategory());
        detail.setStatus(base.getStatus());
        detail.setCreatorId(base.getCreatorId());
        detail.setCreatorName(base.getCreatorName());
        detail.setCreatorEmail(base.getCreatorEmail());
        detail.setMaxTeamSize(base.getMaxTeamSize());
        detail.setCurrentTeamSize(base.getCurrentTeamSize());
        detail.setAcademicTerm(base.getAcademicTerm());
        detail.setDeadline(base.getDeadline());
        detail.setWeeklyHoursExpectation(base.getWeeklyHoursExpectation());
        detail.setTags(base.getTags());
        detail.setOpenRoles(base.getOpenRoles());
        detail.setRequiredSkills(base.getRequiredSkills());
        detail.setCreatedAt(base.getCreatedAt());

        teamRepository.findByProjectId(project.getId()).ifPresent(team -> {
            detail.setTeamId(team.getId());
            detail.setTeamName(team.getName());

            List<ProjectDetailResponse.TeamMemberDto> memberDtos = team.getMembers().stream()
                    .map(m -> new ProjectDetailResponse.TeamMemberDto(
                            m.getId(),
                            m.getUser().getId(),
                            m.getUser().getFullName(),
                            m.getUser().getEmail(),
                            m.getMemberRole().name(),
                            m.getAssignedRoleName(),
                            m.getUser().getStudentProfile() != null ? m.getUser().getStudentProfile().getAvatarUrl() : null
                    ))
                    .toList();
            detail.setMembers(memberDtos);
        });

        return detail;
    }
}
