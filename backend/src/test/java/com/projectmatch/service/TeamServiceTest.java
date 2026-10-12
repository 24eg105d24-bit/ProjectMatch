package com.projectmatch.service;

import com.projectmatch.dto.request.CreateTeamRequest;
import com.projectmatch.dto.response.TeamResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.repository.TeamMemberRepository;
import com.projectmatch.repository.TeamRepository;
import com.projectmatch.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private TeamMemberRepository teamMemberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TeamService teamService;

    private User lead;
    private User memberUser;
    private Project project;
    private Team team;

    @BeforeEach
    void setUp() {
        lead = new User();
        lead.setId(1L);
        lead.setEmail("lead@projectmatch.edu");
        lead.setFullName("Team Lead");

        memberUser = new User();
        memberUser.setId(2L);
        memberUser.setEmail("member@projectmatch.edu");
        memberUser.setFullName("Member Student");

        project = new Project();
        project.setId(10L);
        project.setTitle("Autonomous Drone Delivery");
        project.setMaxTeamSize(4);
        project.setCreator(lead);

        team = new Team("Drone Fleet Team", project);
        team.setId(100L);
        team.setMembers(new ArrayList<>());
    }

    @Test
    void addMemberToTeamSucceedsWhenCapacityAllows() {
        when(teamRepository.findById(100L)).thenReturn(Optional.of(team));
        when(userRepository.findById(2L)).thenReturn(Optional.of(memberUser));
        when(teamMemberRepository.existsByTeamIdAndUserId(100L, 2L)).thenReturn(false);
        when(teamMemberRepository.countByTeamId(100L)).thenReturn(1L);

        teamService.addMemberToTeam(100L, 2L, "Navigation Dev");

        verify(teamMemberRepository).save(any(TeamMember.class));
    }

    @Test
    void addMemberToTeamThrowsWhenCapacityExceeded() {
        when(teamRepository.findById(100L)).thenReturn(Optional.of(team));
        when(userRepository.findById(2L)).thenReturn(Optional.of(memberUser));
        when(teamMemberRepository.existsByTeamIdAndUserId(100L, 2L)).thenReturn(false);
        when(teamMemberRepository.countByTeamId(100L)).thenReturn(4L);

        assertThatThrownBy(() -> teamService.addMemberToTeam(100L, 2L, "Navigation Dev"))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Team capacity limit reached");
    }

    @Test
    void updateTeamDetailsSucceedsForLead() {
        TeamMember leadMember = new TeamMember(team, lead, TeamMemberRole.LEADER, "Lead Architect");
        team.getMembers().add(leadMember);

        when(teamRepository.findById(100L)).thenReturn(Optional.of(team));
        when(teamRepository.save(any(Team.class))).thenReturn(team);

        CreateTeamRequest request = new CreateTeamRequest();
        request.setName("Drone Fleet Pro");
        request.setFacultyAdvisor("Dr. Sarah Vance");
        request.setMeetingSchedule("Tuesdays 4pm");

        TeamResponse response = teamService.updateTeamDetails(100L, "lead@projectmatch.edu", request);
        assertThat(response).isNotNull();
        assertThat(team.getFacultyAdvisor()).isEqualTo("Dr. Sarah Vance");
        assertThat(team.getMeetingSchedule()).isEqualTo("Tuesdays 4pm");
    }
}
