package com.hkm.confession_box.dto;

public record DeleteUserResponseDto(
	boolean success,
	String message,
	Integer userId
) {}
