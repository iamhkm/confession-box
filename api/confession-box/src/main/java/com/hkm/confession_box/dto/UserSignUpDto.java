package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;

public record UserSignUpDto(
		
		@NotBlank(message = "Username cannot be null or empty") 
		String username,

		@NotBlank(message = "Email cannot be null or empty")
		String email,

		@NotBlank(message = "Password cannot be null or empty")
		String password,

		@NotBlank(message = "Name cannot be null or empty")
		String name
) {}
