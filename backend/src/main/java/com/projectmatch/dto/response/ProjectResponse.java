package com.projectmatch.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectResponse {
    private Long id;
    private String title;
    private String tagline;
    private String description;
    private String category;
    private String status;
    private Long creatorId;
    private String creatorName;
    private String creatorEmail;
    private Integer maxTeamSize;
    private Integer currentTeamSize;
    private String academicTerm;
    private String deadline;
    private Integer weeklyHoursExpectation;
    private List<String> tags;
    private List<String> openRoles;
    private List<SkillResponse> requiredSkills;
    private LocalDateTime createdAt;

    public ProjectResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public String getCreatorEmail() {
        return creatorEmail;
    }

    public void setCreatorEmail(String creatorEmail) {
        this.creatorEmail = creatorEmail;
    }

    public Integer getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(Integer maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
    }

    public Integer getCurrentTeamSize() {
        return currentTeamSize;
    }

    public void setCurrentTeamSize(Integer currentTeamSize) {
        this.currentTeamSize = currentTeamSize;
    }

    public String getAcademicTerm() {
        return academicTerm;
    }

    public void setAcademicTerm(String academicTerm) {
        this.academicTerm = academicTerm;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public Integer getWeeklyHoursExpectation() {
        return weeklyHoursExpectation;
    }

    public void setWeeklyHoursExpectation(Integer weeklyHoursExpectation) {
        this.weeklyHoursExpectation = weeklyHoursExpectation;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getOpenRoles() {
        return openRoles;
    }

    public void setOpenRoles(List<String> openRoles) {
        this.openRoles = openRoles;
    }

    public List<SkillResponse> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<SkillResponse> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
