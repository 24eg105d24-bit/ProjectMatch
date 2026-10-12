package com.projectmatch.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_profile_id", "skill_id"})
})
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_profile_id", nullable = false)
    private StudentProfile studentProfile;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SkillProficiency proficiency = SkillProficiency.INTERMEDIATE;

    private Double yearsOfExperience;

    public StudentSkill() {}

    public StudentSkill(StudentProfile studentProfile, Skill skill, SkillProficiency proficiency, Double yearsOfExperience) {
        this.studentProfile = studentProfile;
        this.skill = skill;
        this.proficiency = proficiency != null ? proficiency : SkillProficiency.INTERMEDIATE;
        this.yearsOfExperience = yearsOfExperience;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public StudentProfile getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public Skill getSkill() {
        return skill;
    }

    public void setSkill(Skill skill) {
        this.skill = skill;
    }

    public SkillProficiency getProficiency() {
        return proficiency;
    }

    public void setProficiency(SkillProficiency proficiency) {
        this.proficiency = proficiency != null ? proficiency : SkillProficiency.INTERMEDIATE;
    }

    public Double getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Double yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        StudentSkill that = (StudentSkill) o;
        if (id != null && that.id != null) {
            return id.equals(that.id);
        }
        if (studentProfile != null && that.studentProfile != null && skill != null && that.skill != null) {
            return studentProfile.getId() != null && studentProfile.getId().equals(that.studentProfile.getId())
                    && skill.getId() != null && skill.getId().equals(that.skill.getId());
        }
        return false;
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
