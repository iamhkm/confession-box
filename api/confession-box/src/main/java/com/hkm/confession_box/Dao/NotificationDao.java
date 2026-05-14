package com.hkm.confession_box.Dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hkm.confession_box.models.Notification;
import com.hkm.confession_box.models.NotificationType;

@Repository
public interface NotificationDao extends JpaRepository<Notification, Integer> {
    
    // Find all notifications for a specific user, ordered by creation date (newest first)
    List<Notification> findByUserIdOrderByCreatedAtDesc(Integer userId);
    
    // Find unread notifications for a user
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Integer userId);
    
    // Find notifications by type for a user
    List<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(Integer userId, NotificationType type);
    
    // Count unread notifications for a user
    Long countByUserIdAndIsReadFalse(Integer userId);
    
    // Mark all notifications as read for a user
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsReadForUser(@Param("userId") Integer userId);
    
    // Mark a specific notification as read
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId")
    void markAsRead(@Param("notificationId") Integer notificationId);
    
    // Delete old read notifications (for cleanup)
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.isRead = true AND n.createdAt < :cutoffDate")
    void deleteOldReadNotifications(@Param("cutoffDate") java.time.LocalDateTime cutoffDate);
}
