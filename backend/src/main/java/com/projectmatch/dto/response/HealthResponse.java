package com.projectmatch.dto.response;

import java.time.LocalDateTime;

public class HealthResponse {
    private String status;
    private String service;
    private String environment;
    private LocalDateTime timestamp;

    public HealthResponse() {}

    public HealthResponse(String status, String service, String environment) {
        this.status = status;
        this.service = service;
        this.environment = environment;
        this.timestamp = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getService() {
        return service;
    }

    public void setService(String service) {
        this.service = service;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
