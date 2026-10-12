package com.projectmatch.controller;

import com.projectmatch.dto.response.InvitationResponse;
import com.projectmatch.service.InvitationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
public class InvitationController {

    private final InvitationService invitationService;

    public InvitationController(InvitationService invitationService) {
        this.invitationService = invitationService;
    }

    @GetMapping("/received")
    public ResponseEntity<List<InvitationResponse>> getReceived(Authentication authentication) {
        return ResponseEntity.ok(invitationService.getUserInvitations(authentication.getName()));
    }

    @GetMapping("/sent")
    public ResponseEntity<List<InvitationResponse>> getSent(Authentication authentication) {
        return ResponseEntity.ok(invitationService.getUserSentApplications(authentication.getName()));
    }

    @PostMapping("/{invitationId}/accept")
    public ResponseEntity<InvitationResponse> accept(Authentication authentication, @PathVariable Long invitationId) {
        return ResponseEntity.ok(invitationService.respondToInvitation(invitationId, authentication.getName(), true));
    }

    @PostMapping("/{invitationId}/reject")
    public ResponseEntity<InvitationResponse> reject(Authentication authentication, @PathVariable Long invitationId) {
        return ResponseEntity.ok(invitationService.respondToInvitation(invitationId, authentication.getName(), false));
    }
}
