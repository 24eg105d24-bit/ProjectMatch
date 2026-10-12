package com.projectmatch.dto.response;

import java.util.List;

public class CandidateRecommendationResponse {
    private Long studentId;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String department;
    private String academicYear;
    private Integer hoursPerWeek;
    private Integer compatibilityScore;
    private String matchRating;
    private RecommendationResponse.ScoreBreakdown breakdown;
    private List<MatchExplanationDto> explanations;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<String> preferredRoles;
    private String suggestedRole;

    public CandidateRecommendationResponse() {}

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek;
    }

    public Integer getCompatibilityScore() {
        return compatibilityScore;
    }

    public void setCompatibilityScore(Integer compatibilityScore) {
        this.compatibilityScore = compatibilityScore;
    }

    public String getMatchRating() {
        return matchRating;
    }

    public void setMatchRating(String matchRating) {
        this.matchRating = matchRating;
    }

    public RecommendationResponse.ScoreBreakdown getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(RecommendationResponse.ScoreBreakdown breakdown) {
        this.breakdown = breakdown;
    }

    public List<MatchExplanationDto> getExplanations() {
        return explanations;
    }

    public void setExplanations(List<MatchExplanationDto> explanations) {
        this.explanations = explanations;
    }

    public List<String> getMatchingSkills() {
        return matchingSkills;
    }

    public void setMatchingSkills(List<String> matchingSkills) {
        this.matchingSkills = matchingSkills;
    }

    public List<String> getMissingSkills() {
        return missingSkills;
    }

    public void setMissingSkills(List<String> missingSkills) {
        this.missingSkills = missingSkills;
    }

    public List<String> getPreferredRoles() {
        return preferredRoles;
    }

    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles;
    }

    public String getSuggestedRole() {
        return suggestedRole;
    }

    public void setSuggestedRole(String suggestedRole) {
        this.suggestedRole = suggestedRole;
    }
}
