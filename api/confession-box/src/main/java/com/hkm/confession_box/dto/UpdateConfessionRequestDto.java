package com.hkm.confession_box.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateConfessionRequestDto(
	
	@NotBlank(message = "Confession cannot be blank")
	String confesion,
	
	Boolean anonymous
) {}
