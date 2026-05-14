package com.hkm.confession_box.Dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hkm.confession_box.models.UnblockRequest;
import com.hkm.confession_box.models.UnblockRequestStatus;

@Repository
public interface UnblockRequestDao extends JpaRepository<UnblockRequest, Integer> {
    
    // Find all unblock requests by status
    List<UnblockRequest> findByStatusOrderByCreatedAtDesc(UnblockRequestStatus status);
    
    // Find unblock requests for a specific user
    List<UnblockRequest> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    // Find unblock requests for a specific confession
    List<UnblockRequest> findByConfessionIdOrderByCreatedAtDesc(Integer confessionId);
    
    // Find pending unblock request for a confession by user
    Optional<UnblockRequest> findByConfessionIdAndUserIdAndStatus(
        Integer confessionId, 
        Integer userId, 
        UnblockRequestStatus status
    );
    
    // Check if a pending request exists for a confession
    boolean existsByConfessionIdAndUserIdAndStatus(
        Integer confessionId, 
        Integer userId, 
        UnblockRequestStatus status
    );
}
