package com.hkm.confession_box.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkm.confession_box.Dao.NotificationDao;
import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.NotificationResponseDto;
import com.hkm.confession_box.models.Confession;
import com.hkm.confession_box.models.Notification;
import com.hkm.confession_box.models.NotificationType;
import com.hkm.confession_box.models.UnblockRequest;
import com.hkm.confession_box.models.User;
import com.hkm.confession_box.models.UserRole;
import com.hkm.confession_box.security.UserPrincipal;

@Service
public class NotificationService {

    private final NotificationDao notificationDao;
    private final UserDao userDao;

    public NotificationService(NotificationDao notificationDao, UserDao userDao) {
        this.notificationDao = notificationDao;
        this.userDao = userDao;
    }

    /**
     * Get all notifications for the current user
     */
    public List<NotificationResponseDto> getMyNotifications() {
        UserPrincipal currentUser = getCurrentUser();
        return notificationDao.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get unread notifications for the current user
     */
    public List<NotificationResponseDto> getUnreadNotifications() {
        UserPrincipal currentUser = getCurrentUser();
        return notificationDao.findByUserIdAndIsReadFalseOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    /**
     * Get count of unread notifications
     */
    public Long getUnreadCount() {
        UserPrincipal currentUser = getCurrentUser();
        return notificationDao.countByUserIdAndIsReadFalse(currentUser.getId());
    }

    /**
     * Mark a notification as read
     */
    @Transactional
    public void markAsRead(Integer notificationId) {
        Notification notification = notificationDao.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        UserPrincipal currentUser = getCurrentUser();
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only mark your own notifications as read");
        }
        
        notification.setIsRead(true);
        notificationDao.save(notification);
    }

    /**
     * Mark all notifications as read for current user
     */
    @Transactional
    public void markAllAsRead() {
        UserPrincipal currentUser = getCurrentUser();
        notificationDao.markAllAsReadForUser(currentUser.getId());
    }

    /**
     * Create a notification for a specific user
     */
    @Transactional
    public void createNotification(User user, NotificationType type, String message, 
                                   Confession confession, UnblockRequest unblockRequest) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setMessage(message);
        notification.setConfession(confession);
        notification.setUnblockRequest(unblockRequest);
        notification.setIsRead(false);
        notificationDao.save(notification);
    }

    /**
     * Create notification for confession status change
     */
    @Transactional
    public void notifyConfessionStatusChange(Confession confession, NotificationType type, String actionBy) {
        String message = buildConfessionStatusMessage(type, confession.getId(), actionBy);
        createNotification(confession.getUser(), type, message, confession, null);
    }

    /**
     * Notify all admins about new confession or unblock request
     */
    @Transactional
    public void notifyAdmins(NotificationType type, String message, Confession confession, 
                            UnblockRequest unblockRequest) {
        List<User> admins = userDao.findByRole(UserRole.ADMIN);
        for (User admin : admins) {
            createNotification(admin, type, message, confession, unblockRequest);
        }
    }

    /**
     * Notify user about their user status change
     */
    @Transactional
    public void notifyUserStatusChange(User user, NotificationType type, String message) {
        createNotification(user, type, message, null, null);
    }

    /**
     * Clean up old read notifications (call this periodically)
     */
    @Transactional
    public void cleanupOldReadNotifications(int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        notificationDao.deleteOldReadNotifications(cutoffDate);
    }

    // Helper methods

    private UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return (UserPrincipal) auth.getPrincipal();
    }

    private NotificationResponseDto convertToDto(Notification notification) {
        return new NotificationResponseDto(
                notification.getId(),
                notification.getType(),
                notification.getMessage(),
                notification.getIsRead(),
                notification.getConfession() != null ? notification.getConfession().getId() : null,
                notification.getUnblockRequest() != null ? notification.getUnblockRequest().getId() : null,
                notification.getCreatedAt()
        );
    }

    private String buildConfessionStatusMessage(NotificationType type, Integer confessionId, String actionBy) {
        return switch (type) {
            case CONFESSION_APPROVED -> "Your confession #" + confessionId + " has been approved by " + actionBy;
            case CONFESSION_BLOCKED -> "Your confession #" + confessionId + " has been blocked by " + actionBy;
            case CONFESSION_UNBLOCKED -> "Your confession #" + confessionId + " has been unblocked by " + actionBy;
            case CONFESSION_ACTIVATED -> "Your confession #" + confessionId + " has been activated by " + actionBy;
            case CONFESSION_DEACTIVATED -> "Your confession #" + confessionId + " has been deactivated by " + actionBy;
            default -> "Status of your confession #" + confessionId + " has been updated";
        };
    }
}
