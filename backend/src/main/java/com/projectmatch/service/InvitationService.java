package com.projectmatch.service;

import com.projectmatch.dto.request.CreateInvitationRequest;
import com.projectmatch.dto.response.InvitationResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.exception.UnauthorizedException;
import com.projectmatch.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final ProjectRepository projectRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final TeamService teamService;

    public InvitationService(InvitationRepository invitationRepository,
                             ProjectRepository projectRepository,
                             TeamRepository teamRepository,
                             TeamMemberRepository teamMemberRepository,
                             UserRepository userRepository,
                             TeamService teamService) {
        this.invitationRepository = invitationRepository;
        this.projectRepository = projectRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
        this.teamService = teamService;
    }

    @Transactional
    public InvitationResponse sendJoinRequest(Long projectId, String senderEmail, CreateInvitationRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with ID: " + projectId));

        User sender = userRepository.findByEmail(senderEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + senderEmail));

        Team team = teamRepository.findByProjectId(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found for project: " + projectId));

        if (teamMemberRepository.existsByTeamIdAndUserId(team.getId(), sender.getId())) {
            throw new BadRequestException("You are already an active member of this project team.");
        }

        if (invitationRepository.existsByProjectIdAndSenderIdAndStatus(projectId, sender.getId(), InvitationStatus.PENDING)) {
            throw new BadRequestException("You already have a pending join application for this project.");
        }

        User receiver = project.getCreator();

        Invitation invitation = new Invitation(
                project,
                team,
                sender,
                receiver,
                request.getTargetRole() != null ? request.getTargetRole() : "Team Member",
                request.getMessage(),
                InvitationType.JOIN_REQUEST
        );

        Invitation saved = invitationRepository.save(invitation);
        return mapToInvitationResponse(saved);
    }

    @Transactional
    public InvitationResponse respondToInvitation(Long invitationId, String userEmail, boolean accept) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException("Invitation not found with ID: " + invitationId));

        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Receiver must match the current authenticated user
        if (!invitation.getReceiver().getId().equals(user.getId())) {
            throw new UnauthorizedException("You are not authorized to respond to this invitation.");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException("Invitation has already been " + invitation.getStatus().name().toLowerCase() + ".");
        }

        if (accept) {
            invitation.setStatus(InvitationStatus.ACCEPTED);
            // If it's a JOIN_REQUEST, the sender joins the team
            // If it's a TEAM_INVITATION, the receiver joins the team
            Long memberToAddId = invitation.getType() == InvitationType.JOIN_REQUEST
                    ? invitation.getSender().getId()
                    : invitation.getReceiver().getId();

            teamService.addMemberToTeam(invitation.getTeam().getId(), memberToAddId, invitation.getTargetRole());
        } else {
            invitation.setStatus(InvitationStatus.REJECTED);
        }

        Invitation saved = invitationRepository.save(invitation);
        return mapToInvitationResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> getUserInvitations(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return invitationRepository.findByReceiverIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToInvitationResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> getUserSentApplications(String userEmail) {
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return invitationRepository.findBySenderIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToInvitationResponse)
                .toList();
    }

    public InvitationResponse mapToInvitationResponse(Invitation inv) {
        InvitationResponse resp = new InvitationResponse();
        resp.setId(inv.getId());
        resp.setProjectId(inv.getProject().getId());
        resp.setProjectTitle(inv.getProject().getTitle());
        if (inv.getTeam() != null) {
            resp.setTeamId(inv.getTeam().getId());
        }
        resp.setSenderId(inv.getSender().getId());
        resp.setSenderName(inv.getSender().getFullName());
        resp.setReceiverId(inv.getReceiver().getId());
        resp.setReceiverName(inv.getReceiver().getFullName());
        resp.setTargetRole(inv.getTargetRole());
        resp.setMessage(inv.getMessage());
        resp.setStatus(inv.getStatus().name());
        resp.setType(inv.getType().name());
        resp.setCreatedAt(inv.getCreatedAt());

        return resp;
    }
}
