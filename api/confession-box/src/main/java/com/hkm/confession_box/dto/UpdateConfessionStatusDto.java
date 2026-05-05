package com.hkm.confession_box.dto;

import com.hkm.confession_box.models.ConfessionStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateConfessionStatusDto(
	
	@NotNull(message = "Confession Status cannot be null")
	ConfessionStatus status
) {}
