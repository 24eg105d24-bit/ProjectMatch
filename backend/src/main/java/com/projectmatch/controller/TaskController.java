package com.projectmatch.controller;

import com.projectmatch.dto.request.CreateTaskRequest;
import com.projectmatch.dto.request.UpdateTaskStatusRequest;
import com.projectmatch.dto.response.ApiResponse;
import com.projectmatch.dto.response.TaskResponse;
import com.projectmatch.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping("/teams/{teamId}/tasks")
    public ResponseEntity<List<TaskResponse>> getTasks(Authentication authentication, @PathVariable Long teamId) {
        return ResponseEntity.ok(taskService.getTasksByTeamId(teamId, authentication.getName()));
    }

    @PostMapping("/teams/{teamId}/tasks")
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @PathVariable Long teamId,
            @Valid @RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(teamId, authentication.getName(), request));
    }

    @PatchMapping("/tasks/{taskId}/status")
    public ResponseEntity<TaskResponse> updateTaskStatus(
            Authentication authentication,
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskStatusRequest request) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, authentication.getName(), request.getStatus()));
    }

    @DeleteMapping("/tasks/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(Authentication authentication, @PathVariable Long taskId) {
        taskService.deleteTask(taskId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Task deleted", null));
    }
}
