package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

public record UpdateUserRequestDto(
	
	@NotBlank(message = "Name cannot be null or empty")
	String name,
	
	@NotBlank(message = "Email cannot be null or empty")
	@Email(message = "Email should be valid")
	String email
) {}
