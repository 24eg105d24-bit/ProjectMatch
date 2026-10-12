package com.projectmatch.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 200)
    private String headline;

    @Column(length = 150)
    private String university;

    @Column(length = 150)
    private String department;

    @Column(length = 50)
    private String academicYear;

    private Double gpa;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 500)
    private String avatarUrl;

    @Column(nullable = false)
    private Integer hoursPerWeek = 15;

    @Column(length = 150)
    private String preferredTime;

    @Column(length = 50)
    private String timezone = "UTC-5";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AvailabilityStatus availabilityStatus = AvailabilityStatus.ACTIVELY_LOOKING;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_preferred_roles", joinColumns = @JoinColumn(name = "student_profile_id"))
    @Column(name = "role_name", length = 100)
    private List<String> preferredRoles = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "student_interests", joinColumns = @JoinColumn(name = "student_profile_id"))
    @Column(name = "interest_name", length = 100)
    private List<String> interests = new ArrayList<>();

    @OneToMany(mappedBy = "studentProfile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<StudentSkill> skills = new ArrayList<>();

    public StudentProfile() {}

    public StudentProfile(User user) {
        this.user = user;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public Integer getHoursPerWeek() {
        return hoursPerWeek;
    }

    public void setHoursPerWeek(Integer hoursPerWeek) {
        this.hoursPerWeek = hoursPerWeek != null ? hoursPerWeek : 15;
    }

    public String getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(String preferredTime) {
        this.preferredTime = preferredTime;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public AvailabilityStatus getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) {
        this.availabilityStatus = availabilityStatus != null ? availabilityStatus : AvailabilityStatus.ACTIVELY_LOOKING;
    }

    public List<String> getPreferredRoles() {
        return preferredRoles;
    }

    public void setPreferredRoles(List<String> preferredRoles) {
        this.preferredRoles = preferredRoles != null ? preferredRoles : new ArrayList<>();
    }

    public List<String> getInterests() {
        return interests;
    }

    public void setInterests(List<String> interests) {
        this.interests = interests != null ? interests : new ArrayList<>();
    }

    public List<StudentSkill> getSkills() {
        return skills;
    }

    public void setSkills(List<StudentSkill> skills) {
        this.skills = skills != null ? skills : new ArrayList<>();
    }

    public void addSkill(StudentSkill studentSkill) {
        if (studentSkill != null) {
            skills.add(studentSkill);
            studentSkill.setStudentProfile(this);
        }
    }

    public void removeSkill(StudentSkill studentSkill) {
        if (studentSkill != null) {
            skills.remove(studentSkill);
            studentSkill.setStudentProfile(null);
        }
    }
}
