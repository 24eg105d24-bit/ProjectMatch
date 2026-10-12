package com.projectmatch.dto.response;

import java.time.LocalDateTime;

public class InvitationResponse {
    private Long id;
    private Long projectId;
    private String projectTitle;
    private Long teamId;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String targetRole;
    private String message;
    private String status;
    private String type;
    private LocalDateTime createdAt;
    private String senderEmail;
    private String senderAvatar;
    private String senderDepartment;
    private String senderAcademicYear;
    private java.util.List<String> senderSkills;

    public InvitationResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
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

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public Long getSenderId() {
        return senderId;
    }

    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getSenderEmail() {
        return senderEmail;
    }

    public void setSenderEmail(String senderEmail) {
        this.senderEmail = senderEmail;
    }

    public String getSenderAvatar() {
        return senderAvatar;
    }

    public void setSenderAvatar(String senderAvatar) {
        this.senderAvatar = senderAvatar;
    }

    public String getSenderDepartment() {
        return senderDepartment;
    }

    public void setSenderDepartment(String senderDepartment) {
        this.senderDepartment = senderDepartment;
    }

    public String getSenderAcademicYear() {
        return senderAcademicYear;
    }

    public void setSenderAcademicYear(String senderAcademicYear) {
        this.senderAcademicYear = senderAcademicYear;
    }

    public java.util.List<String> getSenderSkills() {
        return senderSkills;
    }

    public void setSenderSkills(java.util.List<String> senderSkills) {
        this.senderSkills = senderSkills;
    }
}
