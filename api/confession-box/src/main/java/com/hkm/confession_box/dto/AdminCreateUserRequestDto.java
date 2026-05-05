package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.UserRole;
import com.hkm.confession_box.models.UserStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record AdminCreateUserRequestDto (
	
	@NotBlank(message = "Username cannot be null or empty")
	String username,
	
	@NotBlank(message = "Email cannot be null or empty")
	String email,
	
	@NotBlank(message = "Password cannot be null or empty")
	String password,
	
	@NotNull(message = "Role cannot be null")
	UserRole role,
	
	@NotBlank(message = "Name cannot be null or empty")
	String name,
	
	@NotNull(message = "Status cannot be null")
	UserStatus status
) {}