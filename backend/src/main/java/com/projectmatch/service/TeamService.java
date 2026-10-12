package com.projectmatch.service;

import com.projectmatch.dto.request.CreateTeamRequest;
import com.projectmatch.dto.response.ProjectDetailResponse;
import com.projectmatch.dto.response.TeamResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.exception.UnauthorizedException;
import com.projectmatch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository,
                       UserRepository userRepository) {
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public TeamResponse getTeamById(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        return mapToTeamResponse(team);
    }

    @Transactional(readOnly = true)
    public List<TeamResponse> getTeamsByUserId(Long userId) {
        List<Team> teams = teamRepository.findTeamsByUserId(userId);
        return teams.stream()
                .map(this::mapToTeamResponse)
                .toList();
    }

    @Transactional
    public TeamResponse updateTeamDetails(Long teamId, String userEmail, CreateTeamRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        // Check if requester is a leader of the team or project creator
        boolean isAuthorized = team.getMembers().stream()
                .anyMatch(m -> m.getUser().getEmail().equalsIgnoreCase(userEmail.trim()) && m.getMemberRole() == TeamMemberRole.LEADER);

        if (!isAuthorized && !team.getProject().getCreator().getEmail().equalsIgnoreCase(userEmail.trim())) {
            throw new UnauthorizedException("Only team leaders or the project creator can edit team settings.");
        }

        if (request.getName() != null && !request.getName().trim().isEmpty()) {
            team.setName(request.getName().trim());
        }
        if (request.getFacultyAdvisor() != null) team.setFacultyAdvisor(request.getFacultyAdvisor());
        if (request.getMeetingSchedule() != null) team.setMeetingSchedule(request.getMeetingSchedule());
        if (request.getRepositoryUrl() != null) team.setRepositoryUrl(request.getRepositoryUrl());
        if (request.getCommunicationChannel() != null) team.setCommunicationChannel(request.getCommunicationChannel());

        Team saved = teamRepository.save(team);
        return mapToTeamResponse(saved);
    }

    @Transactional
    public void addMemberToTeam(Long teamId, Long userId, String assignedRoleName) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        if (teamMemberRepository.existsByTeamIdAndUserId(teamId, userId)) {
            throw new BadRequestException("User is already a member of this team.");
        }

        long currentCount = teamMemberRepository.countByTeamId(teamId);
        if (currentCount >= team.getProject().getMaxTeamSize()) {
            throw new BadRequestException("Team capacity limit reached (" + team.getProject().getMaxTeamSize() + " members maximum).");
        }

        TeamMember member = new TeamMember(team, user, TeamMemberRole.MEMBER, assignedRoleName != null ? assignedRoleName : "Team Member");
        teamMemberRepository.save(member);
    }

    @Transactional
    public void removeMemberFromTeam(Long teamId, Long memberUserId, String requesterEmail) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        User requester = userRepository.findByEmail(requesterEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found: " + requesterEmail));

        boolean isSelfRemoval = requester.getId().equals(memberUserId);
        boolean isLeader = team.getMembers().stream()
                .anyMatch(m -> m.getUser().getId().equals(requester.getId()) && m.getMemberRole() == TeamMemberRole.LEADER);

        if (!isSelfRemoval && !isLeader && !team.getProject().getCreator().getId().equals(requester.getId())) {
            throw new UnauthorizedException("You do not have permission to remove this member.");
        }

        TeamMember member = teamMemberRepository.findByTeamIdAndUserId(teamId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not a member of this team."));

        teamMemberRepository.delete(member);
    }

    public TeamResponse mapToTeamResponse(Team team) {
        TeamResponse resp = new TeamResponse();
        resp.setId(team.getId());
        resp.setName(team.getName());
        resp.setProjectId(team.getProject().getId());
        resp.setProjectTitle(team.getProject().getTitle());
        resp.setFacultyAdvisor(team.getFacultyAdvisor());
        resp.setMeetingSchedule(team.getMeetingSchedule());
        resp.setRepositoryUrl(team.getRepositoryUrl());
        resp.setCommunicationChannel(team.getCommunicationChannel());
        resp.setMemberCount(team.getMembers().size());

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
        resp.setMembers(memberDtos);

        return resp;
    }
}
