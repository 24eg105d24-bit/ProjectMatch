package com.projectmatch;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.projectmatch.entity.TaskStatus;
import com.projectmatch.repository.ProjectRepository;
import com.projectmatch.repository.TaskRepository;
import com.projectmatch.repository.TeamRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProjectWorkflowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Test
    void registeredStudentsCanCreateProjectsJoinTeamsAndPersistTasks() throws Exception {
        mockMvc.perform(get("/api/projects/{projectId}", 9223372036854775807L))
                .andExpect(status().isNotFound());

        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String creatorEmail = "creator-" + suffix + "@example.com";
        String memberEmail = "member-" + suffix + "@example.com";
        String creatorToken = register("Project Creator", creatorEmail);
        String memberRegistrationToken = register("Joining Student", memberEmail);

        String memberToken = objectMapper.readTree(mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("email", memberEmail, "password", "password-123")))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString()).get("token").asText();
        assertThat(memberToken).isNotBlank();
        assertThat(memberRegistrationToken).isNotBlank();

        mockMvc.perform(get("/api/students/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills.length()").value(1))
                .andExpect(jsonPath("$.interests.length()").value(1));

        mockMvc.perform(put("/api/students/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"headline\":\"Backend student\",\"interests\":[\"Education\",\"Accessibility\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.headline").value("Backend student"))
                .andExpect(jsonPath("$.interests.length()").value(2));

        JsonNode addedSkill = objectMapper.readTree(mockMvc.perform(post("/api/students/me/skills")
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"skillName\":\"Java\",\"category\":\"Programming\",\"proficiency\":\"ADVANCED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills.length()").value(1))
                .andReturn().getResponse().getContentAsString());
        long skillId = addedSkill.path("skills").get(0).path("id").asLong();
        mockMvc.perform(delete("/api/students/me/skills/{skillId}", skillId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.skills.length()").value(0));

        String title = "Persisted workflow " + suffix;
        JsonNode createdProject = objectMapper.readTree(mockMvc.perform(post("/api/projects")
                        .header(HttpHeaders.AUTHORIZATION, bearer(creatorToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"" + title + "\",\"tagline\":\"Integration workflow\","
                                + "\"description\":\"A project created through the authenticated API.\","
                                + "\"category\":\"Education\",\"maxTeamSize\":4,"
                                + "\"weeklyHoursExpectation\":8,\"tags\":[\"Education\"],"
                                + "\"openRoles\":[\"Backend Developer\"],"
                                + "\"requiredSkills\":[{\"skillName\":\"Java\",\"minProficiency\":\"BEGINNER\",\"isRequired\":true}]}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        long projectId = createdProject.path("id").asLong();
        long teamId = createdProject.path("teamId").asLong();
        assertThat(projectRepository.findById(projectId)).isPresent();
        assertThat(teamRepository.findById(teamId)).isPresent();
        mockMvc.perform(get("/api/teams/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(creatorToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(teamId))
                .andExpect(jsonPath("$[0].members[0].memberRole").value("LEADER"));

        mockMvc.perform(get("/api/teams/{teamId}/tasks", teamId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == " + projectId + ")].title").value(title));
        mockMvc.perform(get("/api/recommendations/projects")
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.projectId == " + projectId + ")].projectTitle").value(title));

        JsonNode application = objectMapper.readTree(mockMvc.perform(post("/api/projects/{projectId}/applications", projectId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"targetRole\":\"Backend Developer\",\"message\":\"I would like to join.\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        long invitationId = application.path("id").asLong();

        mockMvc.perform(post("/api/invitations/{invitationId}/accept", invitationId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(creatorToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACCEPTED"));
        mockMvc.perform(get("/api/teams/me")
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(teamId));

        JsonNode createdTask = objectMapper.readTree(mockMvc.perform(post("/api/teams/{teamId}/tasks", teamId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Persisted task\",\"description\":\"Verify database storage\","
                                + "\"status\":\"IN_PROGRESS\",\"priority\":\"HIGH\",\"tag\":\"API\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        long taskId = createdTask.path("id").asLong();
        assertThat(taskRepository.findById(taskId)).isPresent();

        mockMvc.perform(get("/api/teams/{teamId}/tasks", teamId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(taskId));
        mockMvc.perform(patch("/api/tasks/{taskId}/status", taskId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"DONE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));
        assertThat(taskRepository.findById(taskId).orElseThrow().getStatus()).isEqualTo(TaskStatus.DONE);

        mockMvc.perform(delete("/api/tasks/{taskId}", taskId)
                        .header(HttpHeaders.AUTHORIZATION, bearer(memberToken)))
                .andExpect(status().isOk());
        assertThat(taskRepository.findById(taskId)).isEmpty();
    }

    private String register(String name, String email) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"" + name + "\",\"email\":\"" + email
                                + "\",\"password\":\"password-123\",\"role\":\"ADMIN\","
                                + "\"department\":\"Computer Science\",\"academicYear\":\"Senior\","
                                + "\"skills\":[\"Java\",\" java \"],\"interests\":[\"Education\",\" education \"]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("ROLE_STUDENT"))
                .andReturn();
        return objectMapper.readTree(result.getResponse().getContentAsString()).path("token").asText();
    }

    private String json(String emailKey, String email, String passwordKey, String password) {
        return "{\"" + emailKey + "\":\"" + email + "\",\"" + passwordKey + "\":\"" + password + "\"}";
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}