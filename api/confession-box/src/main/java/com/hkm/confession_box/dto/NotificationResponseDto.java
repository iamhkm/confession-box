package com.hkm.confession_box.dto;

import java.time.LocalDateTime;
import com.hkm.confession_box.models.NotificationType;

public record NotificationResponseDto(
    Integer id,
    NotificationType type,
    String message,
    Boolean isRead,
    Integer confessionId,
    Integer unblockRequestId,
    LocalDateTime createdAt
) {}
