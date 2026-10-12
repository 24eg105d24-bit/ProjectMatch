package com.projectmatch.dto.response;

import java.util.List;
import java.util.Map;

public class AiResponse {

    private String response;
    private List<String> suggestions;
    private List<String> recommendedRoles;
    private List<String> learningResources;
    private Map<String, Object> metadata;

    public AiResponse() {}

    public AiResponse(String response) {
        this.response = response;
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public List<String> getRecommendedRoles() {
        return recommendedRoles;
    }

    public void setRecommendedRoles(List<String> recommendedRoles) {
        this.recommendedRoles = recommendedRoles;
    }

    public List<String> getLearningResources() {
        return learningResources;
    }

    public void setLearningResources(List<String> learningResources) {
        this.learningResources = learningResources;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }
}
