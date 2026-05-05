package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;

public record ChangePasswordRequestDto(
	
	@NotBlank(message = "Current password cannot be null or empty")
	String currentPassword,
	
	@NotBlank(message = "New password cannot be null or empty")
	String newPassword,
	
	@NotBlank(message = "Confirm password cannot be null or empty")
	String confirmPassword
) {}
