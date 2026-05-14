package com.hkm.confession_box.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkm.confession_box.Dao.ConfessionDao;
import com.hkm.confession_box.Dao.UnblockRequestDao;
import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.CreateUnblockRequestDto;
import com.hkm.confession_box.dto.ReviewUnblockRequestDto;
import com.hkm.confession_box.dto.UnblockRequestResponseDto;
import com.hkm.confession_box.models.Confession;
import com.hkm.confession_box.models.ConfessionStatus;
import com.hkm.confession_box.models.NotificationType;
import com.hkm.confession_box.models.UnblockRequest;
import com.hkm.confession_box.models.UnblockRequestStatus;
import com.hkm.confession_box.models.User;
import com.hkm.confession_box.security.UserPrincipal;

@Service
public class UnblockRequestService {

    private final UnblockRequestDao unblockRequestDao;
    private final ConfessionDao confessionDao;
    private final UserDao userDao;
    private final NotificationService notificationService;

    public UnblockRequestService(UnblockRequestDao unblockRequestDao, 
                                ConfessionDao confessionDao,
                                UserDao userDao,
                                NotificationService notificationService) {
        this.unblockRequestDao = unblockRequestDao;
        this.confessionDao = confessionDao;
        this.userDao = userDao;
        this.notificationService = notificationService;
    }

    /**
     * Create an unblock request for a blocked confession
     */
    @Transactional
    public UnblockRequestResponseDto createUnblockRequest(Integer confessionId, CreateUnblockRequestDto requestDto) {
        UserPrincipal currentUser = getCurrentUser();
        
        // Get the confession
        Confession confession = confessionDao.findById(confessionId)
                .orElseThrow(() -> new RuntimeException("Confession not found"));
        
        // Check if confession is blocked
        if (confession.getStatus() != ConfessionStatus.BLOCKED_BY_ADMIN && 
            confession.getStatus() != ConfessionStatus.INACTIVE_BY_ADMIN) {
            throw new RuntimeException("Confession is not blocked");
        }
        
        // Check if user owns the confession
        if (!confession.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only request unblock for your own confessions");
        }
        
        // Check if there's already a pending request
        if (unblockRequestDao.existsByConfessionIdAndUserIdAndStatus(
                confessionId, currentUser.getId(), UnblockRequestStatus.PENDING)) {
            throw new RuntimeException("You already have a pending unblock request for this confession");
        }
        
        // Create the unblock request
        User user = userDao.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UnblockRequest unblockRequest = new UnblockRequest();
        unblockRequest.setConfession(confession);
        unblockRequest.setUser(user);
        unblockRequest.setReason(requestDto.reason());
        unblockRequest.setStatus(UnblockRequestStatus.PENDING);
        
        UnblockRequest savedRequest = unblockRequestDao.save(unblockRequest);
        
        // Notify admins
        String message = "User " + user.getUsername() + " has requested to unblock confession #" + confessionId;
        notificationService.notifyAdmins(NotificationType.UNBLOCK_REQUEST_SUBMITTED, 
                                        message, confession, savedRequest);
        
        return convertToDto(savedRequest);
    }

    /**
     * Get all unblock requests (Admin only)
     */
    public List<UnblockRequestResponseDto> getAllUnblockRequests() {
        return unblockRequestDao.findAll()
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get pending unblock requests (Admin only)
     */
    public List<UnblockRequestResponseDto> getPendingUnblockRequests() {
        return unblockRequestDao.findByStatusOrderByCreatedAtDesc(UnblockRequestStatus.PENDING)
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unblock requests for current user
     */
    public List<UnblockRequestResponseDto> getMyUnblockRequests() {
        UserPrincipal currentUser = getCurrentUser();
        return unblockRequestDao.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unblock request by ID
     */
    public UnblockRequestResponseDto getUnblockRequestById(Integer id) {
        UnblockRequest request = unblockRequestDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Unblock request not found"));
        
        UserPrincipal currentUser = getCurrentUser();
        // Check if user has permission to view this request
        if (!currentUser.hasRole("ADMIN") && 
            !request.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You don't have permission to view this request");
        }
        
        return convertToDto(request);
    }

    /**
     * Review unblock request (Admin only)
     */
    @Transactional
    public UnblockRequestResponseDto reviewUnblockRequest(Integer id, ReviewUnblockRequestDto reviewDto) {
        UserPrincipal currentUser = getCurrentUser();
        
        UnblockRequest request = unblockRequestDao.findById(id)
                .orElseThrow(() -> new RuntimeException("Unblock request not found"));
        
        if (request.getStatus() != UnblockRequestStatus.PENDING) {
            throw new RuntimeException("This request has already been reviewed");
        }
        
        User admin = userDao.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        request.setStatus(reviewDto.status());
        request.setReviewedBy(admin);
        request.setAdminComment(reviewDto.adminComment());
        
        UnblockRequest updatedRequest = unblockRequestDao.save(request);
        
        // If approved, unblock the confession
        if (reviewDto.status() == UnblockRequestStatus.APPROVED) {
            Confession confession = request.getConfession();
            confession.setStatus(ConfessionStatus.ACTIVE);
            confessionDao.save(confession);
            
            // Notify user about approval
            String message = "Your unblock request for confession #" + confession.getId() + 
                           " has been approved by " + admin.getUsername();
            notificationService.createNotification(request.getUser(), 
                    NotificationType.UNBLOCK_REQUEST_APPROVED, message, confession, updatedRequest);
        } else if (reviewDto.status() == UnblockRequestStatus.REJECTED) {
            // Notify user about rejection
            String message = "Your unblock request for confession #" + request.getConfession().getId() + 
                           " has been rejected by " + admin.getUsername();
            if (reviewDto.adminComment() != null && !reviewDto.adminComment().isEmpty()) {
                message += ". Reason: " + reviewDto.adminComment();
            }
            notificationService.createNotification(request.getUser(), 
                    NotificationType.UNBLOCK_REQUEST_REJECTED, message, 
                    request.getConfession(), updatedRequest);
        }
        
        return convertToDto(updatedRequest);
    }

    // Helper methods

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    private UnblockRequestResponseDto convertToDto(UnblockRequest request) {
        return new UnblockRequestResponseDto(
                request.getId(),
                request.getConfession().getId(),
                request.getConfession().getConfesion(),
                request.getUser().getId(),
                request.getUser().getUsername(),
                request.getReason(),
                request.getStatus(),
                request.getReviewedBy() != null ? request.getReviewedBy().getId() : null,
                request.getReviewedBy() != null ? request.getReviewedBy().getUsername() : null,
                request.getAdminComment(),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
