package com.hkm.confession_box.dto;

import java.time.LocalDateTime;
import com.hkm.confession_box.models.ConfessionStatus;

public record ConfessionResponseDto(
	Integer id,
	String confesion,
	Boolean anonymous,
	ConfessionStatus status,
	Integer userId,
	String username,
	String name,
	LocalDateTime createdAt,
	LocalDateTime updatedAt
) {}
