package com.projectmatch.service;

import com.projectmatch.dto.request.LoginRequest;
import com.projectmatch.dto.request.RegisterRequest;
import com.projectmatch.dto.response.AuthResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.repository.StudentProfileRepository;
import com.projectmatch.repository.StudentSkillRepository;
import com.projectmatch.repository.UserRepository;
import com.projectmatch.security.JwtTokenProvider;
import com.projectmatch.security.UserPrincipal;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Set;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentProfileRepository profileRepository;
    private final StudentSkillRepository studentSkillRepository;
    private final SkillService skillService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
                       StudentProfileRepository profileRepository,
                       StudentSkillRepository studentSkillRepository,
                       SkillService skillService,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.studentSkillRepository = studentSkillRepository;
        this.skillService = skillService;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new BadRequestException("An account with email " + request.getEmail() + " already exists.");
        }

        Role userRole = Role.ROLE_STUDENT;

        User user = new User(
                request.getFullName().trim(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                userRole
        );

        User savedUser = userRepository.save(user);

        // Create student profile
        StudentProfile profile = new StudentProfile(savedUser);
        profile.setDepartment(request.getDepartment());
        profile.setAcademicYear(request.getAcademicYear());
        profile.setHoursPerWeek(request.getHoursPerWeek() != null ? request.getHoursPerWeek() : 15);
        profile.setHeadline(request.getAcademicYear() != null && request.getDepartment() != null
                ? request.getAcademicYear() + " in " + request.getDepartment()
                : "Student at State Polytechnic Institute");
        profile.setAvatarUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80");

        if (request.getPreferredRoles() != null) {
            profile.setPreferredRoles(new ArrayList<>(request.getPreferredRoles()));
        }
        if (request.getInterests() != null) {
            LinkedHashMap<String, String> uniqueInterests = new LinkedHashMap<>();
            for (String interest : request.getInterests()) {
                if (interest != null && !interest.isBlank()) {
                    String trimmed = interest.trim();
                    uniqueInterests.putIfAbsent(trimmed.toLowerCase(Locale.ROOT), trimmed);
                }
            }
            profile.setInterests(new ArrayList<>(uniqueInterests.values()));
        }

        StudentProfile savedProfile = profileRepository.save(profile);

        // Add skills if provided
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            Set<String> uniqueSkills = new HashSet<>();
            for (String skillName : request.getSkills()) {
                if (skillName != null && !skillName.trim().isEmpty()) {
                    String trimmedSkillName = skillName.trim();
                    if (!uniqueSkills.add(trimmedSkillName.toLowerCase(Locale.ROOT))) {
                        continue;
                    }
                    Skill skill = skillService.getOrCreateSkill(trimmedSkillName, "General");
                    StudentSkill studentSkill = new StudentSkill(savedProfile, skill, SkillProficiency.INTERMEDIATE, 1.0);
                    studentSkillRepository.save(studentSkill);
                }
            }
        }

        UserPrincipal userPrincipal = UserPrincipal.create(savedUser);
        String token = tokenProvider.generateToken(userPrincipal);

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getFullName(),
                savedUser.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail().toLowerCase().trim(),
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        String token = tokenProvider.generateToken(authentication);

        return new AuthResponse(
                token,
                userPrincipal.getId(),
                userPrincipal.getEmail(),
                userPrincipal.getFullName(),
                userPrincipal.getAuthorities().iterator().next().getAuthority()
        );
    }
}
