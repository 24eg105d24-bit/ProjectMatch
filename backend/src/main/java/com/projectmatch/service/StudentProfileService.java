package com.projectmatch.service;

import com.projectmatch.dto.request.AddSkillRequest;
import com.projectmatch.dto.request.UpdateProfileRequest;
import com.projectmatch.dto.response.SkillResponse;
import com.projectmatch.dto.response.StudentProfileResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.repository.StudentProfileRepository;
import com.projectmatch.repository.StudentSkillRepository;
import com.projectmatch.repository.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;
    private final StudentSkillRepository studentSkillRepository;
    private final EntityManager entityManager;

    public StudentProfileService(StudentProfileRepository profileRepository,
                                 UserRepository userRepository,
                                 SkillService skillService,
                                 StudentSkillRepository studentSkillRepository,
                                 EntityManager entityManager) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.skillService = skillService;
        this.studentSkillRepository = studentSkillRepository;
        this.entityManager = entityManager;
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getProfileByUserId(Long userId) {
        StudentProfile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return mapToResponse(profile);
    }

    @Transactional(readOnly = true)
    public StudentProfileResponse getCurrentProfile(String email) {
        StudentProfile profile = profileRepository.findByUserEmail(email.toLowerCase().trim())
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email.toLowerCase().trim())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
                    StudentProfile newProfile = new StudentProfile(user);
                    return profileRepository.save(newProfile);
                });
        return mapToResponse(profile);
    }

    @Transactional
    public StudentProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        StudentProfile profile = profileRepository.findByUserEmail(email.toLowerCase().trim())
                .orElseGet(() -> {
                    User user = userRepository.findByEmail(email.toLowerCase().trim())
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
                    return new StudentProfile(user);
                });

        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline());
        if (request.getUniversity() != null) profile.setUniversity(request.getUniversity());
        if (request.getDepartment() != null) profile.setDepartment(request.getDepartment());
        if (request.getAcademicYear() != null) profile.setAcademicYear(request.getAcademicYear());
        if (request.getGpa() != null) profile.setGpa(request.getGpa());
        if (request.getAvatarUrl() != null) {
            String trimmed = request.getAvatarUrl().trim();
            if (trimmed.startsWith("data:")) {
                throw new BadRequestException(
                    "Avatar URL must not be a data URI. " +
                    "Use a built-in preset identifier (e.g. \"preset:indigo-cube\") " +
                    "or an external image URL."
                );
            }
            if (trimmed.length() > 500) {
                throw new BadRequestException(
                    "Avatar URL must not exceed 500 characters. " +
                    "Use a built-in preset identifier or a shorter external image URL."
                );
            }
            profile.setAvatarUrl(trimmed.isEmpty() ? null : trimmed);
        }
        if (request.getHoursPerWeek() != null) profile.setHoursPerWeek(request.getHoursPerWeek());
        if (request.getPreferredTime() != null) profile.setPreferredTime(request.getPreferredTime());
        if (request.getTimezone() != null) profile.setTimezone(request.getTimezone());
        if (request.getAvailabilityStatus() != null) {
            try {
                profile.setAvailabilityStatus(AvailabilityStatus.valueOf(request.getAvailabilityStatus()));
            } catch (IllegalArgumentException ignored) {}
        }
        if (request.getPreferredRoles() != null) {
            profile.setPreferredRoles(new ArrayList<>(request.getPreferredRoles()));
        }
        if (request.getInterests() != null) {
            List<String> interests = request.getInterests().stream()
                    .filter(interest -> interest != null)
                    .map(String::trim)
                    .filter(interest -> !interest.isEmpty())
                    .distinct()
                    .toList();
            profile.setInterests(new ArrayList<>(interests));
        }

        StudentProfile saved = profileRepository.save(profile);
        return mapToResponse(saved);
    }

    @Transactional
    public StudentProfileResponse addSkill(String email, AddSkillRequest request) {
        StudentProfile profile = profileRepository.findByUserEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + email));

        Skill skill = skillService.getOrCreateSkill(request.getSkillName(), request.getCategory());

        SkillProficiency proficiency = SkillProficiency.INTERMEDIATE;
        if (request.getProficiency() != null) {
            try {
                proficiency = SkillProficiency.valueOf(request.getProficiency().toUpperCase());
            } catch (IllegalArgumentException ignored) {}
        }

        Optional<StudentSkill> existing = studentSkillRepository
                .findByStudentProfileIdAndSkillId(profile.getId(), skill.getId());

        if (existing.isPresent()) {
            StudentSkill sSkill = existing.get();
            sSkill.setProficiency(proficiency);
            if (request.getYearsOfExperience() != null) {
                sSkill.setYearsOfExperience(request.getYearsOfExperience());
            }
            studentSkillRepository.saveAndFlush(sSkill);
        } else {
            StudentSkill newSSkill = new StudentSkill(profile, skill, proficiency, request.getYearsOfExperience());
            profile.addSkill(newSSkill);
            studentSkillRepository.saveAndFlush(newSSkill);
        }

        StudentProfile updatedProfile = profileRepository.saveAndFlush(profile);
        return mapToResponse(updatedProfile);
    }

    @Transactional
    public StudentProfileResponse removeSkill(String email, Long skillId) {
        String normalizedEmail = email.toLowerCase().trim();
        StudentProfile profile = profileRepository
                .findByUserEmail(normalizedEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user: " + email));

        StudentSkill targetSkill = profile.getSkills().stream()
                .filter(ss -> (ss.getSkill() != null && skillId.equals(ss.getSkill().getId()))
                           || skillId.equals(ss.getId()))
                .findFirst()
                .orElse(null);

        if (targetSkill == null) {
            targetSkill = studentSkillRepository
                    .findByStudentProfileIdAndSkillId(profile.getId(), skillId)
                    .orElseThrow(() -> new ResourceNotFoundException("Skill not found in your profile: " + skillId));
        }

        profile.removeSkill(targetSkill);
        studentSkillRepository.delete(targetSkill);
        studentSkillRepository.flush();

        StudentProfile updatedProfile = profileRepository.saveAndFlush(profile);
        return mapToResponse(updatedProfile);
    }

    @Transactional(readOnly = true)
    public List<StudentProfileResponse> getAllProfiles() {
        return profileRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StudentProfileResponse mapToResponse(StudentProfile profile) {
        StudentProfileResponse resp = new StudentProfileResponse();
        resp.setId(profile.getId());
        if (profile.getUser() != null) {
            resp.setUserId(profile.getUser().getId());
            resp.setFullName(profile.getUser().getFullName());
            resp.setEmail(profile.getUser().getEmail());
            resp.setRole(profile.getUser().getRole().name());
        }
        resp.setHeadline(profile.getHeadline());
        resp.setUniversity(profile.getUniversity());
        resp.setDepartment(profile.getDepartment());
        resp.setAcademicYear(profile.getAcademicYear());
        resp.setGpa(profile.getGpa());
        resp.setBio(profile.getBio());
        resp.setAvatarUrl(profile.getAvatarUrl());
        resp.setHoursPerWeek(profile.getHoursPerWeek());
        resp.setPreferredTime(profile.getPreferredTime());
        resp.setTimezone(profile.getTimezone());
        resp.setAvailabilityStatus(profile.getAvailabilityStatus().name());
        resp.setPreferredRoles(profile.getPreferredRoles());
        resp.setInterests(profile.getInterests());

        List<SkillResponse> skillResponses = profile.getSkills().stream()
                .map(ss -> new SkillResponse(
                        ss.getSkill().getId(),
                        ss.getSkill().getName(),
                        ss.getSkill().getCategory(),
                        ss.getProficiency().name(),
                        ss.getYearsOfExperience()
                ))
                .toList();
        resp.setSkills(skillResponses);

        return resp;
    }
}
