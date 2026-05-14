package com.hkm.confession_box.dto;

import java.time.LocalDateTime;
import com.hkm.confession_box.models.UnblockRequestStatus;

public record UnblockRequestResponseDto(
    Integer id,
    Integer confessionId,
    String confessionText,
    Integer userId,
    String username,
    String reason,
    UnblockRequestStatus status,
    Integer reviewedById,
    String reviewedByUsername,
    String adminComment,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
