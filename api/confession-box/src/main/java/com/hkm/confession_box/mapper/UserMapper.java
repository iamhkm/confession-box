package com.hkm.confession_box.mapper;

import org.springframework.stereotype.Component;

import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.models.User;

@Component
public class UserMapper {

	public UserResponseDto toResponseDto(User user) {

		return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getName(), user.getRole(),
				user.getStatus(), user.getCreatedAt(), user.getUpdatedAt());
	}
}