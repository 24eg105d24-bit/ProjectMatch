package com.projectmatch.service;

import com.projectmatch.dto.request.CreateTaskRequest;
import com.projectmatch.dto.response.TaskResponse;
import com.projectmatch.entity.*;
import com.projectmatch.exception.BadRequestException;
import com.projectmatch.exception.ResourceNotFoundException;
import com.projectmatch.exception.UnauthorizedException;
import com.projectmatch.repository.TaskRepository;
import com.projectmatch.repository.TeamMemberRepository;
import com.projectmatch.repository.TeamRepository;
import com.projectmatch.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;

    public TaskService(TaskRepository taskRepository,
                       TeamRepository teamRepository,
                       TeamMemberRepository teamMemberRepository,
                       UserRepository userRepository) {
        this.taskRepository = taskRepository;
        this.teamRepository = teamRepository;
        this.teamMemberRepository = teamMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getTasksByTeamId(Long teamId, String userEmail) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));
        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        if (!teamMemberRepository.existsByTeamIdAndUserId(team.getId(), user.getId())) {
            throw new UnauthorizedException("You must be a team member to view tasks.");
        }

        return taskRepository.findByTeamIdOrderByCreatedAtDesc(teamId).stream()
                .map(this::mapToTaskResponse)
                .toList();
    }

    @Transactional
    public TaskResponse createTask(Long teamId, String userEmail, CreateTaskRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException("Team not found with ID: " + teamId));

        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Check if user is a member of the team
        if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, user.getId())) {
            throw new UnauthorizedException("You must be an active team member to create deliverables.");
        }

        TaskStatus status = TaskStatus.TODO;
        if (request.getStatus() != null) {
            try {
                status = TaskStatus.valueOf(request.getStatus().toUpperCase().replace('-', '_'));
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid status: " + request.getStatus());
            }
        }

        TaskPriority priority = TaskPriority.MEDIUM;
        if (request.getPriority() != null) {
            try {
                priority = TaskPriority.valueOf(request.getPriority().toUpperCase());
            } catch (IllegalArgumentException ex) {
                throw new BadRequestException("Invalid priority: " + request.getPriority());
            }
        }

        User assignee = null;
        if (request.getAssigneeId() != null) {
            assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Assignee not found: " + request.getAssigneeId()));
            if (!teamMemberRepository.existsByTeamIdAndUserId(teamId, assignee.getId())) {
                throw new BadRequestException("The assignee must be an active team member.");
            }
        } else {
            assignee = user; // default to author
        }

        Task task = new Task(
                team,
                request.getTitle().trim(),
                request.getDescription(),
                status,
                priority,
                request.getTag() != null ? request.getTag() : "Feature",
                request.getDueDate() != null ? request.getDueDate() : "TBD",
                assignee
        );

        Task saved = taskRepository.save(task);
        return mapToTaskResponse(saved);
    }

    @Transactional
    public TaskResponse updateTaskStatus(Long taskId, String userEmail, String newStatusStr) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (!teamMemberRepository.existsByTeamIdAndUserId(task.getTeam().getId(), user.getId())) {
            throw new UnauthorizedException("You must be a team member to update task statuses.");
        }

        try {
            TaskStatus newStatus = TaskStatus.valueOf(newStatusStr.toUpperCase().replace("-", "_"));
            task.setStatus(newStatus);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status: " + newStatusStr + ". Valid statuses are: TODO, IN_PROGRESS, REVIEW, DONE.");
        }

        Task saved = taskRepository.save(task);
        return mapToTaskResponse(saved);
    }

    @Transactional
    public void deleteTask(Long taskId, String userEmail) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with ID: " + taskId));

        User user = userRepository.findByEmail(userEmail.toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        if (!teamMemberRepository.existsByTeamIdAndUserId(task.getTeam().getId(), user.getId())) {
            throw new UnauthorizedException("You must be a team member to delete tasks.");
        }

        taskRepository.delete(task);
    }

    public TaskResponse mapToTaskResponse(Task task) {
        TaskResponse resp = new TaskResponse();
        resp.setId(task.getId());
        resp.setTeamId(task.getTeam().getId());
        resp.setTitle(task.getTitle());
        resp.setDescription(task.getDescription());
        resp.setStatus(task.getStatus().name());
        resp.setPriority(task.getPriority().name());
        resp.setTag(task.getTag());
        resp.setDueDate(task.getDueDate());
        resp.setCreatedAt(task.getCreatedAt());

        if (task.getAssignee() != null) {
            resp.setAssigneeId(task.getAssignee().getId());
            resp.setAssigneeName(task.getAssignee().getFullName());
            if (task.getAssignee().getStudentProfile() != null) {
                resp.setAssigneeAvatar(task.getAssignee().getStudentProfile().getAvatarUrl());
            }
        }

        return resp;
    }
}
