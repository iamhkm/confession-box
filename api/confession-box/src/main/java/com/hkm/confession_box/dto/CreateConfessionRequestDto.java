package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateConfessionRequestDto(
	
	@NotBlank(message = "Confession cannot be blank")
	String confesion,
	
	@NotNull(message = "Anonymous flag cannot be null")
	Boolean anonymous,
	
	@NotNull(message = "User ID cannot be null")
	Integer userId
) {}
