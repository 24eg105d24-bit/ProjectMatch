package com.projectmatch.repository;

import com.projectmatch.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByProjectId(Long projectId);

    @Query("SELECT DISTINCT t FROM Team t JOIN t.members m WHERE m.user.id = :userId")
    List<Team> findTeamsByUserId(@Param("userId") Long userId);
}
