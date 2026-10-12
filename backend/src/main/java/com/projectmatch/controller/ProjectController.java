package com.projectmatch.controller;

import com.projectmatch.dto.request.CreateInvitationRequest;
import com.projectmatch.dto.request.CreateProjectRequest;
import com.projectmatch.dto.response.InvitationResponse;
import com.projectmatch.dto.response.ProjectDetailResponse;
import com.projectmatch.dto.response.ProjectResponse;
import com.projectmatch.entity.ProjectStatus;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.service.InvitationService;
import com.projectmatch.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final InvitationService invitationService;

    public ProjectController(ProjectService projectService, InvitationService invitationService) {
        this.projectService = projectService;
        this.invitationService = invitationService;
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getProjects(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(projectService.getAllProjects(query, category, status));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @PostMapping
    public ResponseEntity<ProjectDetailResponse> createProject(
            Authentication authentication,
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(authentication.getName(), request));
    }

    @PatchMapping("/{projectId}/status")
    public ResponseEntity<ProjectResponse> updateProjectStatus(
            Authentication authentication,
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request) {
        String statusValue = request.get("status");
        if (statusValue == null || statusValue.isBlank()) {
            throw new BadRequestException("Project status is required.");
        }
        try {
            ProjectStatus status = ProjectStatus.valueOf(statusValue.toUpperCase());
            return ResponseEntity.ok(projectService.updateProjectStatus(projectId, authentication.getName(), status));
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid project status: " + statusValue);
        }
    }

    @PutMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> updateProject(
            Authentication authentication,
            @PathVariable Long projectId,
            @Valid @RequestBody CreateProjectRequest request) {
        return ResponseEntity.ok(projectService.updateProject(projectId, authentication.getName(), request));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<com.projectmatch.dto.response.ApiResponse<Void>> deleteProject(
            Authentication authentication,
            @PathVariable Long projectId) {
        projectService.deleteProject(projectId, authentication.getName());
        return ResponseEntity.ok(com.projectmatch.dto.response.ApiResponse.success("Project deleted successfully", null));
    }

    @PostMapping("/{projectId}/applications")
    public ResponseEntity<InvitationResponse> applyToProject(
            Authentication authentication,
            @PathVariable Long projectId,
            @RequestBody CreateInvitationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(invitationService.sendJoinRequest(projectId, authentication.getName(), request));
    }
}
