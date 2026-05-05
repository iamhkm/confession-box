package com.hkm.confession_box.dto;

public record ForgotPasswordResponseDto(
	String message,
	String resetToken,
	String email
) {}
