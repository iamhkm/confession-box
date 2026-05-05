package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UserRole;
import com.hkm.confession_box.models.UserStatus;

public record UserListResponseDto(
	Integer id,
	String username,
	String email,
	String name,
	UserRole role,
	UserStatus status
) {}
