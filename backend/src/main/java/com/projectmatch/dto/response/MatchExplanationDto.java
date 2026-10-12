package com.projectmatch.dto.response;

public class MatchExplanationDto {
    private String criterion;
    private String highlight;
    private String badge;

    public MatchExplanationDto() {}

    public MatchExplanationDto(String criterion, String highlight, String badge) {
        this.criterion = criterion;
        this.highlight = highlight;
        this.badge = badge;
    }

    public String getCriterion() {
        return criterion;
    }

    public void setCriterion(String criterion) {
        this.criterion = criterion;
    }

    public String getHighlight() {
        return highlight;
    }

    public void setHighlight(String highlight) {
        this.highlight = highlight;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }
}
