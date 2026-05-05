package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UserStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateUserStatusDto(
	
	@NotNull(message = "User Status cannot be null")
	UserStatus status
) {}
