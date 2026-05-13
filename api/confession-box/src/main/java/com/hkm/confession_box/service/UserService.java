package com.hkm.confession_box.service;

import java.time.LocalDateTime;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.ChangePasswordRequestDto;
import com.hkm.confession_box.dto.UpdateUserRequestDto;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.exception.InvalidUserException;
import com.hkm.confession_box.models.User;
import com.hkm.confession_box.security.UserPrincipal;
import com.hkm.confession_box.utils.HashUtil;
import jakarta.validation.constraints.NotBlank;

@Service
public class UserService {

	private UserDao userDao;
	private HashUtil hashUtils;
	private PasswordEncoder passwordEncoder;

	public UserService(UserDao userDao, HashUtil hashUtils, PasswordEncoder passwordEncoder) {
		this.userDao = userDao;
		this.hashUtils = hashUtils;
		this.passwordEncoder = passwordEncoder;
	}

	/**
	 * Get detailed user information by ID
	 */
	public UserResponseDto getSelfUser() {
		UserPrincipal user = getCurrentUser();
		return userDao.findById(user.getId()).map(this::convertToUserResponseDto)
				.orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
	}

	public UserResponseDto getUserByUsername(@NotBlank(message = "Username cannot be null or empty") String username) {
		return userDao.findByUsername(username).map(this::convertToUserResponseDto)
				.orElseThrow(() -> new RuntimeException("User not found with username: " + username));
	}

	/**
	 * Update user profile information
	 */
	public UserResponseDto updateUser(UpdateUserRequestDto updateRequest) {
		UserPrincipal user = getCurrentUser();
		return userDao.findById(user.getId()).map(existingUser -> {
			if (updateRequest.email() != null && !updateRequest.email().equals(existingUser.getEmail())) {
				if (userDao.existsByEmail(updateRequest.email())) {
					throw new RuntimeException("Email already exists");
				}
				existingUser.setEmail(updateRequest.email());
			}
			if (updateRequest.name() != null) {
				existingUser.setName(updateRequest.name());
			}
			existingUser.setUpdatedAt(LocalDateTime.now());
			User updatedUser = userDao.save(existingUser);
			return convertToUserResponseDto(updatedUser);
		}).orElseThrow(() -> new RuntimeException("User not found with id: " + user.getId()));
	}

	/**
	 * Change user password
	 */
	public void changePassword(ChangePasswordRequestDto passwordRequest) throws InvalidUserException{
		UserPrincipal currentUsere = getCurrentUser();
		User user = userDao.findById(currentUsere.getId()).orElseThrow(() -> new RuntimeException("User not found with id: " + currentUsere.getId()));
		if (!passwordEncoder.matches(passwordRequest.currentPassword(), user.getPassword())) {
			throw new InvalidUserException("Current password is incorrect");
		}

		if (!passwordRequest.newPassword().equals(passwordRequest.confirmPassword())) {
			throw new RuntimeException("New password and confirm password do not match");
		}

		user.setPassword(hashUtils.hashPassword(passwordRequest.newPassword()));
		user.setUpdatedAt(LocalDateTime.now());
		userDao.save(user);
	}

	/**
	 * Get user by email
	 * 
	 * @throws InvalidUserException
	 */
	public UserResponseDto getUserByEmail(String email) throws InvalidUserException {
		return userDao.findByEmail(email).map(this::convertToUserResponseDto)
				.orElseThrow(() -> new InvalidUserException("User not found with email: " + email));
	}
	
	private UserPrincipal getCurrentUser() {
		Authentication auth =
		        SecurityContextHolder.getContext().getAuthentication();
		UserPrincipal user = (UserPrincipal) auth.getPrincipal();
		return user;
	}

	/**
	 * Helper method to convert User to UserResponseDto
	 */
	private UserResponseDto convertToUserResponseDto(User user) {
		return new UserResponseDto(user.getId(), user.getUsername(), user.getEmail(), user.getName(), user.getRole(),
				user.getStatus(), user.getCreatedAt(), user.getUpdatedAt());
	}
}
