package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UnblockRequestStatus;
import jakarta.validation.constraints.NotNull;

public record ReviewUnblockRequestDto(
    @NotNull(message = "Status is required")
    UnblockRequestStatus status,
    
    String adminComment
) {}
