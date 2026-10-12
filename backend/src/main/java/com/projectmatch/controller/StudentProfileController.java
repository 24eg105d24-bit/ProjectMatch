package com.projectmatch.controller;

import com.projectmatch.dto.request.AddSkillRequest;
import com.projectmatch.dto.request.UpdateProfileRequest;
import com.projectmatch.dto.response.StudentProfileResponse;
import com.projectmatch.service.StudentProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentProfileController {

    private final StudentProfileService profileService;

    public StudentProfileController(StudentProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/me")
    public ResponseEntity<StudentProfileResponse> getMyProfile(
            Authentication authentication) {
        return ResponseEntity.ok(
                profileService.getCurrentProfile(authentication.getName())
        );
    }

    @PutMapping("/me")
    public ResponseEntity<StudentProfileResponse> updateMyProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(
                profileService.updateProfile(authentication.getName(), request)
        );
    }

    @PostMapping("/me/skills")
    public ResponseEntity<StudentProfileResponse> addSkill(
            Authentication authentication,
            @Valid @RequestBody AddSkillRequest request) {
        return ResponseEntity.ok(
                profileService.addSkill(authentication.getName(), request)
        );
    }

    @DeleteMapping("/me/skills/{skillId}")
    public ResponseEntity<StudentProfileResponse> removeSkill(
            Authentication authentication,
            @PathVariable Long skillId) {
        return ResponseEntity.ok(
                profileService.removeSkill(authentication.getName(), skillId)
        );
    }

    @GetMapping
    public ResponseEntity<List<StudentProfileResponse>> getAllProfiles() {
        return ResponseEntity.ok(profileService.getAllProfiles());
    }
}
