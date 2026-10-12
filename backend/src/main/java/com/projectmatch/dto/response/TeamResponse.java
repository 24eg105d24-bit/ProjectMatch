package com.projectmatch.dto.response;

import java.util.List;

public class TeamResponse {
    private Long id;
    private String name;
    private Long projectId;
    private String projectTitle;
    private String facultyAdvisor;
    private String meetingSchedule;
    private String repositoryUrl;
    private String communicationChannel;
    private Integer memberCount;
    private List<ProjectDetailResponse.TeamMemberDto> members;

    public TeamResponse() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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

    public String getFacultyAdvisor() {
        return facultyAdvisor;
    }

    public void setFacultyAdvisor(String facultyAdvisor) {
        this.facultyAdvisor = facultyAdvisor;
    }

    public String getMeetingSchedule() {
        return meetingSchedule;
    }

    public void setMeetingSchedule(String meetingSchedule) {
        this.meetingSchedule = meetingSchedule;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public void setRepositoryUrl(String repositoryUrl) {
        this.repositoryUrl = repositoryUrl;
    }

    public String getCommunicationChannel() {
        return communicationChannel;
    }

    public void setCommunicationChannel(String communicationChannel) {
        this.communicationChannel = communicationChannel;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public List<ProjectDetailResponse.TeamMemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectDetailResponse.TeamMemberDto> members) {
        this.members = members;
    }
}
