package com.projectmatch.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class CreateProjectRequest {

    @NotBlank(message = "Project title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    private String title;

    private String tagline;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    private Integer maxTeamSize = 4;

    private String academicTerm = "Fall 2026";

    private String deadline;

    private Integer weeklyHoursExpectation = 12;

    private List<String> tags;

    private List<String> openRoles;

    private List<ProjectSkillRequest> requiredSkills;

    public CreateProjectRequest() {}

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

    public Integer getMaxTeamSize() {
        return maxTeamSize;
    }

    public void setMaxTeamSize(Integer maxTeamSize) {
        this.maxTeamSize = maxTeamSize;
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

    public List<ProjectSkillRequest> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<ProjectSkillRequest> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public static class ProjectSkillRequest {
        private String skillName;
        private String minProficiency; // BEGINNER, INTERMEDIATE, ADVANCED
        private Boolean isRequired = true;

        public ProjectSkillRequest() {}

        public ProjectSkillRequest(String skillName, String minProficiency) {
            this.skillName = skillName;
            this.minProficiency = minProficiency;
        }

        public String getSkillName() {
            return skillName;
        }

        public void setSkillName(String skillName) {
            this.skillName = skillName;
        }

        public String getMinProficiency() {
            return minProficiency;
        }

        public void setMinProficiency(String minProficiency) {
            this.minProficiency = minProficiency;
        }

        public Boolean getIsRequired() {
            return isRequired;
        }

        public void setIsRequired(Boolean isRequired) {
            this.isRequired = isRequired;
        }
    }
}
