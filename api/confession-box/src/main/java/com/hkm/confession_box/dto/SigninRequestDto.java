package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;

public record SigninRequestDto(
	
	@NotBlank(message = "Username cannot be null or empty")
	String username,
	
	@NotBlank(message = "Password cannot be null or empty")
	String password
) {}
