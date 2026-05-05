package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UserRole;

public record LoginResponseDto(
	String jwtToken,
	String username,
	UserRole role
) {}
