package com.projectmatch.repository;

import com.projectmatch.entity.Invitation;
import com.projectmatch.entity.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    List<Invitation> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    List<Invitation> findByProjectIdOrderByCreatedAtDesc(Long projectId);

    boolean existsByProjectIdAndSenderIdAndStatus(Long projectId, Long senderId, InvitationStatus status);

    void deleteByProjectId(Long projectId);
}
