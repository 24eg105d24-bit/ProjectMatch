package com.projectmatch.repository;

import com.projectmatch.entity.Task;
import com.projectmatch.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByTeamIdOrderByCreatedAtDesc(Long teamId);

    List<Task> findByTeamIdAndStatus(Long teamId, TaskStatus status);
}
