package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UserRole;
import com.hkm.confession_box.models.UserStatus;
import java.time.LocalDateTime;

public record UserResponseDto(
	Integer id,
	String username,
	String email,
	String name,
	UserRole role,
	UserStatus status,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {}
