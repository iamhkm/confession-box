package com.hkm.confession_box.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.AdminCreateUserRequestDto;
import com.hkm.confession_box.dto.UpdateUserStatusDto;
import com.hkm.confession_box.dto.UserListResponseDto;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.models.User;
import com.hkm.confession_box.utils.HashUtil;

@Service
public class AdminUserService {

	private UserDao userDao;
	private HashUtil hashUtils;

	public AdminUserService(UserDao userDao, HashUtil hashUtils) {
		this.userDao = userDao;
		this.hashUtils = hashUtils;
	}

	/**
	 * Get all users with basic information (for list operations)
	 */
	@Transactional(readOnly = true)
	public List<UserListResponseDto> getAllUsers() {
		return userDao.findAll().stream().map(this::convertToUserListDto).collect(Collectors.toList());
	}

	/**
	 * Get detailed user information by ID
	 */
	public UserResponseDto getUserById(int id) {
		return userDao.findById(id).map(this::convertToUserResponseDto)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + id));
	}

	/**
	 * Create a new user
	 */
	public UserResponseDto createUser(AdminCreateUserRequestDto userRequest) throws BadRequestException {
		if (userDao.existsByUsername(userRequest.username())) {
			throw new BadRequestException("Username already exists");
		}
		if (userDao.existsByEmail(userRequest.email())) {
			throw new BadRequestException("Email already exists");
		}
		User user = new User();
		user.setUsername(userRequest.username());
		user.setName(userRequest.name());
		user.setEmail(userRequest.email());
		user.setRole(userRequest.role());
		user.setPassword(hashUtils.hashPassword(userRequest.password()));
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		user.setUpdatedBy(null);
		user.setApprovedBy(null);
		User savedUser = userDao.save(user);
		return convertToUserResponseDto(savedUser);
	}

	/**
	 * Update user status (for admin operations)
	 */
	public UserResponseDto updateUserStatus(int id, UpdateUserStatusDto statusRequest) {
		return userDao.findById(id).map(existingUser -> {
			existingUser.setStatus(statusRequest.status());
			existingUser.setUpdatedAt(LocalDateTime.now());
			User updatedUser = userDao.save(existingUser);
			return convertToUserResponseDto(updatedUser);
		}).orElseThrow(() -> new RuntimeException("User not found with id: " + id));
	}

	/**
	 * Delete a user
	 */
	public void deleteUser(int id) {
		if (!userDao.existsById(id)) {
			throw new RuntimeException("User not found with id: " + id);
		}
		userDao.deleteById(id);
	}

	/**
	 * Helper method to convert User to UserListResponseDto
	 */
	private UserListResponseDto convertToUserListDto(User user) {
		return new UserListResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getName(),
				user.getRole(), user.getStatus());
	}

	/**
	 * Helper method to convert User to UserResponseDto
	 */
	private UserResponseDto convertToUserResponseDto(User user) {
		return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getName(), user.getRole(),
				user.getStatus(), user.getCreatedAt(), user.getUpdatedAt());
	}
}
