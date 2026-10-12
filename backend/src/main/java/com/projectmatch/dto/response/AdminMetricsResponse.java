package com.projectmatch.dto.response;

import java.util.List;
import java.util.Map;

public class AdminMetricsResponse {

    private long totalStudents;
    private long activeProjects;
    private long formedTeams;
    private long totalTasks;
    private int averageMatchScore;
    private Map<String, String> growthRates;
    private List<DepartmentStatDto> departmentStats;
    private List<ProjectApprovalDto> pendingApprovals;

    public AdminMetricsResponse() {}

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getActiveProjects() {
        return activeProjects;
    }

    public void setActiveProjects(long activeProjects) {
        this.activeProjects = activeProjects;
    }

    public long getFormedTeams() {
        return formedTeams;
    }

    public void setFormedTeams(long formedTeams) {
        this.formedTeams = formedTeams;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public int getAverageMatchScore() {
        return averageMatchScore;
    }

    public void setAverageMatchScore(int averageMatchScore) {
        this.averageMatchScore = averageMatchScore;
    }

    public Map<String, String> getGrowthRates() {
        return growthRates;
    }

    public void setGrowthRates(Map<String, String> growthRates) {
        this.growthRates = growthRates;
    }

    public List<DepartmentStatDto> getDepartmentStats() {
        return departmentStats;
    }

    public void setDepartmentStats(List<DepartmentStatDto> departmentStats) {
        this.departmentStats = departmentStats;
    }

    public List<ProjectApprovalDto> getPendingApprovals() {
        return pendingApprovals;
    }

    public void setPendingApprovals(List<ProjectApprovalDto> pendingApprovals) {
        this.pendingApprovals = pendingApprovals;
    }

    public static class DepartmentStatDto {
        private String department;
        private int studentCount;
        private int teamCount;

        public DepartmentStatDto() {}

        public DepartmentStatDto(String department, int studentCount, int teamCount) {
            this.department = department;
            this.studentCount = studentCount;
            this.teamCount = teamCount;
        }

        public String getDepartment() {
            return department;
        }

        public void setDepartment(String department) {
            this.department = department;
        }

        public int getStudentCount() {
            return studentCount;
        }

        public void setStudentCount(int studentCount) {
            this.studentCount = studentCount;
        }

        public int getTeamCount() {
            return teamCount;
        }

        public void setTeamCount(int teamCount) {
            this.teamCount = teamCount;
        }
    }

    public static class ProjectApprovalDto {
        private Long id;
        private String title;
        private String category;
        private String leadName;
        private String status;
        private String submittedDate;

        public ProjectApprovalDto() {}

        public ProjectApprovalDto(Long id, String title, String category, String leadName, String status, String submittedDate) {
            this.id = id;
            this.title = title;
            this.category = category;
            this.leadName = leadName;
            this.status = status;
            this.submittedDate = submittedDate;
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getSubmittedDate() {
            return submittedDate;
        }

        public void setSubmittedDate(String submittedDate) {
            this.submittedDate = submittedDate;
        }
    }
}
