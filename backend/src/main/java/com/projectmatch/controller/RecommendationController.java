package com.projectmatch.controller;

import com.projectmatch.dto.response.MatchExplanationDto;
import com.projectmatch.dto.response.ProjectResponse;
import com.projectmatch.dto.response.RecommendationResponse;
import com.projectmatch.dto.response.SkillResponse;
import com.projectmatch.dto.response.StudentProfileResponse;
import com.projectmatch.service.ProjectService;
import com.projectmatch.service.StudentProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final StudentProfileService studentProfileService;
    private final ProjectService projectService;

    public RecommendationController(StudentProfileService studentProfileService, ProjectService projectService) {
        this.studentProfileService = studentProfileService;
        this.projectService = projectService;
    }

    @GetMapping("/projects")
    public ResponseEntity<List<RecommendationResponse>> getProjectRecommendations(Authentication authentication) {
        StudentProfileResponse profile = studentProfileService.getCurrentProfile(authentication.getName());
        Set<String> studentSkills = profile.getSkills() == null
                ? Set.of()
                : profile.getSkills().stream()
                        .map(SkillResponse::getName)
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet());
        Set<String> interests = profile.getInterests() == null
                ? Set.of()
                : profile.getInterests().stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet());
        Set<String> preferredRoles = profile.getPreferredRoles() == null
                ? Set.of()
                : profile.getPreferredRoles().stream()
                        .map(String::toLowerCase)
                        .collect(Collectors.toSet());
        int studentHours = profile.getHoursPerWeek() != null ? profile.getHoursPerWeek() : 15;

        List<RecommendationResponse> recommendations = projectService.getAllProjects(null, null, "RECRUITING").stream()
                .filter(project -> !project.getCreatorEmail().equalsIgnoreCase(profile.getEmail()))
                .map(project -> mapRecommendation(project, studentSkills, interests, preferredRoles, studentHours))
                .sorted(Comparator.comparing(RecommendationResponse::getCompatibilityScore).reversed())
                .toList();

        return ResponseEntity.ok(recommendations);
    }

    @GetMapping("/candidates/{projectId}")
    public ResponseEntity<List<com.projectmatch.dto.response.CandidateRecommendationResponse>> getCandidateRecommendations(
            @org.springframework.web.bind.annotation.PathVariable Long projectId) {
        com.projectmatch.dto.response.ProjectDetailResponse project = projectService.getProjectById(projectId);
        Set<Long> existingMemberUserIds = project.getMembers() == null
                ? Set.of()
                : project.getMembers().stream()
                        .map(com.projectmatch.dto.response.ProjectDetailResponse.TeamMemberDto::getUserId)
                        .collect(Collectors.toSet());

        List<String> requiredSkillNames = project.getRequiredSkills() == null
                ? List.of()
                : project.getRequiredSkills().stream().map(SkillResponse::getName).toList();
        List<String> openRoles = project.getOpenRoles() == null ? List.of() : project.getOpenRoles();
        int expectedHours = project.getWeeklyHoursExpectation() != null ? project.getWeeklyHoursExpectation() : 12;

        List<com.projectmatch.dto.response.CandidateRecommendationResponse> candidates = studentProfileService.getAllProfiles().stream()
                .filter(p -> !existingMemberUserIds.contains(p.getId()) && !p.getEmail().equalsIgnoreCase(project.getCreatorEmail()))
                .map(p -> mapCandidateRecommendation(p, project, requiredSkillNames, openRoles, expectedHours))
                .sorted(Comparator.comparing(com.projectmatch.dto.response.CandidateRecommendationResponse::getCompatibilityScore).reversed())
                .toList();

        return ResponseEntity.ok(candidates);
    }

    private com.projectmatch.dto.response.CandidateRecommendationResponse mapCandidateRecommendation(
            StudentProfileResponse student,
            com.projectmatch.dto.response.ProjectDetailResponse project,
            List<String> requiredSkills,
            List<String> openRoles,
            int expectedHours) {
        Set<String> studentSkills = student.getSkills() == null
                ? Set.of()
                : student.getSkills().stream().map(SkillResponse::getName).map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> preferredRoles = student.getPreferredRoles() == null
                ? Set.of()
                : student.getPreferredRoles().stream().map(String::toLowerCase).collect(Collectors.toSet());
        Set<String> interests = student.getInterests() == null
                ? Set.of()
                : student.getInterests().stream().map(String::toLowerCase).collect(Collectors.toSet());
        int studentHours = student.getHoursPerWeek() != null ? student.getHoursPerWeek() : 15;

        List<String> matchingSkills = requiredSkills.stream()
                .filter(skill -> studentSkills.contains(skill.toLowerCase()))
                .toList();
        List<String> missingSkills = requiredSkills.stream()
                .filter(skill -> !studentSkills.contains(skill.toLowerCase()))
                .toList();

        int skillScore = requiredSkills.isEmpty()
                ? 70
                : Math.round((matchingSkills.size() * 100f) / requiredSkills.size());

        boolean roleMatched = openRoles.stream()
                .anyMatch(role -> preferredRoles.stream().anyMatch(pr -> role.toLowerCase().contains(pr) || pr.contains(role.toLowerCase())));
        int roleScore = openRoles.isEmpty() ? 75 : (roleMatched ? 95 : 50);

        int scheduleScore = studentHours >= expectedHours ? 100 : Math.max(40, Math.round((studentHours * 100f) / expectedHours));

        boolean categoryMatch = project.getCategory() != null && interests.contains(project.getCategory().toLowerCase());
        boolean tagMatch = project.getTags() != null && project.getTags().stream().anyMatch(t -> interests.contains(t.toLowerCase()));
        int interestScore = categoryMatch && tagMatch ? 100 : (categoryMatch || tagMatch ? 85 : 50);

        int totalScore = Math.round((skillScore * 0.40f) + (roleScore * 0.25f) + (scheduleScore * 0.15f) + (interestScore * 0.20f));

        String matchedRole = openRoles.stream()
                .filter(role -> preferredRoles.stream().anyMatch(pr -> role.toLowerCase().contains(pr) || pr.contains(role.toLowerCase())))
                .findFirst()
                .orElse(openRoles.isEmpty() ? "Contributor" : openRoles.get(0));

        com.projectmatch.dto.response.CandidateRecommendationResponse resp = new com.projectmatch.dto.response.CandidateRecommendationResponse();
        resp.setStudentId(student.getId());
        resp.setFullName(student.getFullName());
        resp.setEmail(student.getEmail());
        resp.setAvatarUrl(student.getAvatarUrl());
        resp.setDepartment(student.getDepartment());
        resp.setAcademicYear(student.getAcademicYear());
        resp.setHoursPerWeek(studentHours);
        resp.setCompatibilityScore(totalScore);
        resp.setMatchRating(totalScore >= 80 ? "Top Candidate" : totalScore >= 60 ? "Strong Fit" : "Potential Contributor");
        resp.setBreakdown(new RecommendationResponse.ScoreBreakdown(skillScore, roleScore, scheduleScore, interestScore));
        resp.setMatchingSkills(matchingSkills);
        resp.setMissingSkills(missingSkills);
        resp.setPreferredRoles(student.getPreferredRoles());
        resp.setSuggestedRole(matchedRole);
        resp.setExplanations(List.of(
                new MatchExplanationDto("Skills", matchingSkills.isEmpty()
                        ? "Complementary skill potential"
                        : "Proficient in " + String.join(", ", matchingSkills), skillScore + "%"),
                new MatchExplanationDto("Role Alignment", roleMatched
                        ? "Student prefers target role: " + matchedRole
                        : "General contributor", roleScore + "%"),
                new MatchExplanationDto("Availability", studentHours + " hrs/wk committed vs " + expectedHours + " hrs/wk target", scheduleScore + "%"),
                new MatchExplanationDto("Domain Alignment", (categoryMatch || tagMatch)
                        ? "Shared interest in " + project.getCategory()
                        : "Cross-disciplinary potential", interestScore + "%")
        ));
        return resp;
    }

    private RecommendationResponse mapRecommendation(ProjectResponse project,
                                                     Set<String> studentSkills,
                                                     Set<String> interests,
                                                     Set<String> preferredRoles,
                                                     int studentHours) {
        List<String> requiredSkillNames = project.getRequiredSkills() == null
                ? List.of()
                : project.getRequiredSkills().stream().map(SkillResponse::getName).toList();
        List<String> matchingSkills = requiredSkillNames.stream()
                .filter(skill -> studentSkills.contains(skill.toLowerCase()))
                .toList();
        List<String> missingSkills = requiredSkillNames.stream()
                .filter(skill -> !studentSkills.contains(skill.toLowerCase()))
                .toList();

        int skillScore = requiredSkillNames.isEmpty()
                ? 65
                : Math.round((matchingSkills.size() * 100f) / requiredSkillNames.size());

        // Role score: does any open role match student's preferred roles
        List<String> openRoles = project.getOpenRoles() == null ? List.of() : project.getOpenRoles();
        boolean roleMatched = openRoles.stream()
                .anyMatch(role -> preferredRoles.stream().anyMatch(pr -> role.toLowerCase().contains(pr) || pr.contains(role.toLowerCase())));
        int roleScore = openRoles.isEmpty() ? 75 : (roleMatched ? 95 : 50);

        // Schedule score: student commitment vs project weekly hours expectation
        int expectedHours = project.getWeeklyHoursExpectation() != null ? project.getWeeklyHoursExpectation() : 12;
        int scheduleScore = studentHours >= expectedHours ? 100 : Math.max(40, Math.round((studentHours * 100f) / expectedHours));

        // Interest score: category and tags overlap
        boolean categoryMatch = project.getCategory() != null && interests.contains(project.getCategory().toLowerCase());
        boolean tagMatch = project.getTags() != null && project.getTags().stream().anyMatch(t -> interests.contains(t.toLowerCase()));
        int interestScore = categoryMatch && tagMatch ? 100 : (categoryMatch || tagMatch ? 85 : 50);

        int totalScore = Math.round((skillScore * 0.40f) + (roleScore * 0.25f) + (scheduleScore * 0.15f) + (interestScore * 0.20f));

        RecommendationResponse response = new RecommendationResponse();
        response.setId("project-" + project.getId());
        response.setProjectId(project.getId());
        response.setProjectTitle(project.getTitle());
        response.setCategory(project.getCategory());
        response.setLeadName(project.getCreatorName());
        response.setCompatibilityScore(totalScore);
        response.setMatchRating(totalScore >= 80 ? "Strong Match" : totalScore >= 60 ? "Good Match" : "Explore");
        response.setBreakdown(new RecommendationResponse.ScoreBreakdown(skillScore, roleScore, scheduleScore, interestScore));
        response.setMatchingSkills(matchingSkills);
        response.setMissingSkills(missingSkills);
        response.setTargetRole(openRoles.isEmpty() ? "Team Member" : openRoles.get(0));
        response.setTeamCapacity(project.getCurrentTeamSize() + "/" + project.getMaxTeamSize());
        response.setExplanations(List.of(
                new MatchExplanationDto("Skills", matchingSkills.isEmpty()
                        ? "No direct skill overlap yet"
                        : "Matches " + String.join(", ", matchingSkills), skillScore + "%"),
                new MatchExplanationDto("Roles", roleMatched
                        ? "Open role aligns with your preferred roles"
                        : "General contributor match", roleScore + "%"),
                new MatchExplanationDto("Commitment", studentHours + " hrs/wk aligns with " + expectedHours + " hrs/wk expected", scheduleScore + "%"),
                new MatchExplanationDto("Interest", (categoryMatch || tagMatch)
                        ? "Category / tags match your declared interests"
                        : "Explore new domains outside core interests", interestScore + "%")
        ));
        return response;
    }
}
