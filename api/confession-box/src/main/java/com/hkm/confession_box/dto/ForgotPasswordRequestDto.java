package com.hkm.confession_box.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequestDto(
	
	@NotBlank(message = "Email cannot be null or empty")
	@Email(message = "Email should be valid")
	String email
) {}
