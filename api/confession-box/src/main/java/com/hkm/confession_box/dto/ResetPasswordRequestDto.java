package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;

public record ResetPasswordRequestDto(
	
	@NotBlank(message = "Reset token cannot be null or empty")
	String resetToken,
	
	@NotBlank(message = "New password cannot be null or empty")
	String newPassword,
	
	@NotBlank(message = "Confirm password cannot be null or empty")
	String confirmPassword
) {}
