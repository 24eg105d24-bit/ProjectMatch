package com.projectmatch.dto.request;

import jakarta.validation.constraints.NotBlank;

public class UpdateTaskStatusRequest {

    @NotBlank(message = "Task status is required")
    private String status;

    public UpdateTaskStatusRequest() {}

    public UpdateTaskStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
