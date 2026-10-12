package com.projectmatch.dto.request;

import jakarta.validation.constraints.NotBlank;

public class AddSkillRequest {

    @NotBlank(message = "Skill name is required")
    private String skillName;

    private String category;

    private String proficiency; // BEGINNER, INTERMEDIATE, ADVANCED

    private Double yearsOfExperience;

    public AddSkillRequest() {}

    public AddSkillRequest(String skillName, String proficiency) {
        this.skillName = skillName;
        this.proficiency = proficiency;
    }

    public String getSkillName() {
        return skillName;
    }

    public void setSkillName(String skillName) {
        this.skillName = skillName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }

    public Double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Double yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
