package com.projectmatch.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "team_members", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"team_id", "user_id"})
})
public class TeamMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id", nullable = false)
    private Team team;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TeamMemberRole memberRole = TeamMemberRole.MEMBER;

    @Column(length = 100)
    private String assignedRoleName;

    @Column(nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    public TeamMember() {}

    public TeamMember(Team team, User user, TeamMemberRole memberRole, String assignedRoleName) {
        this.team = team;
        this.user = user;
        this.memberRole = memberRole != null ? memberRole : TeamMemberRole.MEMBER;
        this.assignedRoleName = assignedRoleName;
    }

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TeamMemberRole getMemberRole() {
        return memberRole;
    }

    public void setMemberRole(TeamMemberRole memberRole) {
        this.memberRole = memberRole != null ? memberRole : TeamMemberRole.MEMBER;
    }

    public String getAssignedRoleName() {
        return assignedRoleName;
    }

    public void setAssignedRoleName(String assignedRoleName) {
        this.assignedRoleName = assignedRoleName;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }
}
