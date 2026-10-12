package com.projectmatch.dto.response;

import java.util.List;

public class ProjectDetailResponse extends ProjectResponse {
    private Long teamId;
    private String teamName;
    private List<TeamMemberDto> members;

    public ProjectDetailResponse() {}

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public List<TeamMemberDto> getMembers() {
        return members;
    }

    public void setMembers(List<TeamMemberDto> members) {
        this.members = members;
    }

    public static class TeamMemberDto {
        private Long id;
        private Long userId;
        private String name;
        private String email;
        private String memberRole;
        private String assignedRoleName;
        private String avatarUrl;

        public TeamMemberDto() {}

        public TeamMemberDto(Long id, Long userId, String name, String email, String memberRole, String assignedRoleName, String avatarUrl) {
            this.id = id;
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.memberRole = memberRole;
            this.assignedRoleName = assignedRoleName;
            this.avatarUrl = avatarUrl;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMemberRole() {
            return memberRole;
        }

        public void setMemberRole(String memberRole) {
            this.memberRole = memberRole;
        }

        public String getAssignedRoleName() {
            return assignedRoleName;
        }

        public void setAssignedRoleName(String assignedRoleName) {
            this.assignedRoleName = assignedRoleName;
        }

        public String getAvatarUrl() {
            return avatarUrl;
        }

        public void setAvatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
        }
    }
}
