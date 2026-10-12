package com.projectmatch.service;

import com.projectmatch.dto.request.AddSkillRequest;
import com.projectmatch.dto.request.UpdateProfileRequest;
import com.projectmatch.dto.response.StudentProfileResponse;
import com.projectmatch.entity.Role;
import com.projectmatch.entity.StudentProfile;
import com.projectmatch.entity.User;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.repository.SkillRepository;
import com.projectmatch.repository.StudentProfileRepository;
import com.projectmatch.repository.StudentSkillRepository;
import com.projectmatch.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@SpringBootTest
class StudentProfileServiceTest {

    @Autowired
    private StudentProfileService studentProfileService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private StudentSkillRepository studentSkillRepository;

    @Autowired
    private SkillRepository skillRepository;

    @BeforeEach
    void setUp() {
        studentSkillRepository.deleteAll();
        studentProfileRepository.deleteAll();
        userRepository.deleteAll();
        skillRepository.deleteAll();
    }

    @Test
    void removeSkillDeletesOnlyCurrentStudentsAssociationAndReloadsProfile() {
        createProfile("Alice Student", "alice@example.com");
        createProfile("Bob Student", "bob@example.com");

        AddSkillRequest request = new AddSkillRequest();
        request.setSkillName("Python");
        request.setCategory("Programming");
        request.setProficiency("INTERMEDIATE");
        request.setYearsOfExperience(1.0);

        StudentProfileResponse aliceWithPython = studentProfileService.addSkill("alice@example.com", request);
        StudentProfileResponse bobWithPython = studentProfileService.addSkill("bob@example.com", request);

        Long pythonSkillId = aliceWithPython.getSkills().get(0).getId();

        StudentProfileResponse aliceAfterDelete = studentProfileService.removeSkill("alice@example.com", pythonSkillId);
        StudentProfileResponse aliceReloaded = studentProfileService.getCurrentProfile("alice@example.com");
        StudentProfileResponse bobReloaded = studentProfileService.getCurrentProfile("bob@example.com");

        assertThat(aliceAfterDelete.getSkills()).isEmpty();
        assertThat(aliceReloaded.getSkills()).isEmpty();
        assertThat(bobReloaded.getSkills())
                .extracting("name")
                .containsExactly("Python");
        assertThat(skillRepository.findById(pythonSkillId)).isPresent();
        assertThat(studentSkillRepository.findByStudentProfileIdAndSkillId(bobWithPython.getId(), pythonSkillId)).isPresent();
    }

    @Test
    void removeSkillReturnsNotFoundWhenAssociationDoesNotBelongToCurrentStudent() {
        createProfile("Alice Student", "alice@example.com");
        createProfile("Bob Student", "bob@example.com");

        AddSkillRequest request = new AddSkillRequest();
        request.setSkillName("Python");
        request.setProficiency("INTERMEDIATE");

        StudentProfileResponse aliceWithPython = studentProfileService.addSkill("alice@example.com", request);
        Long pythonSkillId = aliceWithPython.getSkills().get(0).getId();

        assertThatThrownBy(() -> studentProfileService.removeSkill("bob@example.com", pythonSkillId))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Skill not found in your profile");
    }

    @Test
    void canAddSkillAgainAfterDeletion() {
        createProfile("Alice Student", "alice@example.com");

        AddSkillRequest request = new AddSkillRequest();
        request.setSkillName("Python");
        request.setCategory("Programming");
        request.setProficiency("ADVANCED");
        request.setYearsOfExperience(2.0);

        StudentProfileResponse aliceWithPython = studentProfileService.addSkill("alice@example.com", request);
        Long pythonSkillId = aliceWithPython.getSkills().get(0).getId();

        // Delete skill
        studentProfileService.removeSkill("alice@example.com", pythonSkillId);
        StudentProfileResponse afterDelete = studentProfileService.getCurrentProfile("alice@example.com");
        assertThat(afterDelete.getSkills()).isEmpty();

        // Re-add skill
        StudentProfileResponse reAdded = studentProfileService.addSkill("alice@example.com", request);
        assertThat(reAdded.getSkills()).hasSize(1);
        assertThat(reAdded.getSkills().get(0).getName()).isEqualTo("Python");
        assertThat(reAdded.getSkills().get(0).getProficiency()).isEqualTo("ADVANCED");
    }

    @Test
    void removeOneSkillLeavesOtherSkillsIntact() {
        createProfile("Alice Student", "alice@example.com");

        AddSkillRequest reqPython = new AddSkillRequest();
        reqPython.setSkillName("Python");
        reqPython.setCategory("Programming");
        studentProfileService.addSkill("alice@example.com", reqPython);

        AddSkillRequest reqJava = new AddSkillRequest();
        reqJava.setSkillName("Java");
        reqJava.setCategory("Programming");
        StudentProfileResponse withBoth = studentProfileService.addSkill("alice@example.com", reqJava);

        assertThat(withBoth.getSkills()).hasSize(2);
        Long pythonId = withBoth.getSkills().stream()
                .filter(s -> s.getName().equals("Python"))
                .findFirst().get().getId();

        StudentProfileResponse afterRemovePython = studentProfileService.removeSkill("alice@example.com", pythonId);
        assertThat(afterRemovePython.getSkills()).hasSize(1);
        assertThat(afterRemovePython.getSkills().get(0).getName()).isEqualTo("Java");
    }

    private void createProfile(String fullName, String email) {
        User user = userRepository.save(new User(fullName, email, "encoded-password", Role.ROLE_STUDENT));
        studentProfileRepository.save(new StudentProfile(user));
    }
}
