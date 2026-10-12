package com.projectmatch.dto.request;

public class CreateInvitationRequest {

    private String targetRole;
    private String message;
    private Long receiverUserId;

    public CreateInvitationRequest() {}

    public CreateInvitationRequest(String targetRole, String message, Long receiverUserId) {
        this.targetRole = targetRole;
        this.message = message;
        this.receiverUserId = receiverUserId;
    }

    public String getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(String targetRole) {
        this.targetRole = targetRole;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getReceiverUserId() {
        return receiverUserId;
    }

    public void setReceiverUserId(Long receiverUserId) {
        this.receiverUserId = receiverUserId;
    }
}
