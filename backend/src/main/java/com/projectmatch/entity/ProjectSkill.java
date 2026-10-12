package com.projectmatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "project_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"project_id", "skill_id"})
})
public class ProjectSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SkillProficiency minProficiency = SkillProficiency.BEGINNER;

    @Column(nullable = false)
    private Boolean isRequired = true;

    public ProjectSkill() {}

    public ProjectSkill(Project project, Skill skill, SkillProficiency minProficiency, Boolean isRequired) {
        this.project = project;
        this.skill = skill;
        this.minProficiency = minProficiency != null ? minProficiency : SkillProficiency.BEGINNER;
        this.isRequired = isRequired != null ? isRequired : true;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public SkillProficiency getMinProficiency() {
        return minProficiency;
    }

    public void setMinProficiency(SkillProficiency minProficiency) {
        this.minProficiency = minProficiency != null ? minProficiency : SkillProficiency.BEGINNER;
    }

    public Boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(Boolean isRequired) {
        this.isRequired = isRequired != null ? isRequired : true;
    }
}
