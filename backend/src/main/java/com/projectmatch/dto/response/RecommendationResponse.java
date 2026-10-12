package com.projectmatch.dto.response;

import java.util.List;

public class RecommendationResponse {
    private String id;
    private Long projectId;
    private String projectTitle;
    private String category;
    private String leadName;
    private Integer compatibilityScore;
    private String matchRating;
    private ScoreBreakdown breakdown;
    private List<MatchExplanationDto> explanations;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private String targetRole;
    private String teamCapacity;

    public RecommendationResponse() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectTitle() {
        return projectTitle;
    }

    public void setProjectTitle(String projectTitle) {
        this.projectTitle = projectTitle;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getLeadName() {
        return leadName;
    }

    public void setLeadName(String leadName) {
        this.leadName = leadName;
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

    public ScoreBreakdown getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(ScoreBreakdown breakdown) {
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

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getTeamCapacity() {
        return teamCapacity;
    }

    public void setTeamCapacity(String teamCapacity) {
        this.teamCapacity = teamCapacity;
    }

    public static class ScoreBreakdown {
        private Integer skillScore;
        private Integer roleScore;
        private Integer scheduleScore;
        private Integer interestScore;

        public ScoreBreakdown() {}

        public ScoreBreakdown(Integer skillScore, Integer roleScore, Integer scheduleScore, Integer interestScore) {
            this.skillScore = skillScore;
            this.roleScore = roleScore;
            this.scheduleScore = scheduleScore;
            this.interestScore = interestScore;
        }

        public Integer getSkillScore() {
            return skillScore;
        }

        public void setSkillScore(Integer skillScore) {
            this.skillScore = skillScore;
        }

        public Integer getRoleScore() {
            return roleScore;
        }

        public void setRoleScore(Integer roleScore) {
            this.roleScore = roleScore;
        }

        public Integer getScheduleScore() {
            return scheduleScore;
        }

        public void setScheduleScore(Integer scheduleScore) {
            this.scheduleScore = scheduleScore;
        }

        public Integer getInterestScore() {
            return interestScore;
        }

        public void setInterestScore(Integer interestScore) {
            this.interestScore = interestScore;
        }
    }
}
