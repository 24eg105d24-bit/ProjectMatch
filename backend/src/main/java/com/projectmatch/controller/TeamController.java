package com.projectmatch.controller;

import com.projectmatch.dto.request.CreateTeamRequest;
import com.projectmatch.dto.response.ApiResponse;
import com.projectmatch.dto.response.TeamResponse;
import com.projectmatch.entity.User;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.repository.UserRepository;
import com.projectmatch.service.TeamService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    private final TeamService teamService;
    private final UserRepository userRepository;

    public TeamController(TeamService teamService, UserRepository userRepository) {
        this.teamService = teamService;
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public ResponseEntity<List<TeamResponse>> getMyTeams(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + authentication.getName()));
        return ResponseEntity.ok(teamService.getTeamsByUserId(user.getId()));
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<TeamResponse> getTeam(@PathVariable Long teamId) {
        return ResponseEntity.ok(teamService.getTeamById(teamId));
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<TeamResponse> updateTeam(
            Authentication authentication,
            @PathVariable Long teamId,
            @Valid @RequestBody CreateTeamRequest request) {
        return ResponseEntity.ok(teamService.updateTeamDetails(teamId, authentication.getName(), request));
    }

    @DeleteMapping("/{teamId}/members/{userId}")
    public ResponseEntity<ApiResponse<Void>> removeMember(
            Authentication authentication,
            @PathVariable Long teamId,
            @PathVariable Long userId) {
        teamService.removeMemberFromTeam(teamId, userId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Member removed", null));
    }
}
