package com.hkm.confession_box.controller;

import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hkm.confession_box.dto.ChangePasswordRequestDto;
import com.hkm.confession_box.dto.AdminCreateUserRequestDto;
import com.hkm.confession_box.dto.UpdateUserRequestDto;
import com.hkm.confession_box.dto.UpdateUserStatusDto;
import com.hkm.confession_box.dto.UserListResponseDto;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class UserController {

	private UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	/**
	 * Get all users
	 * 
	 * @return List of UserListResponseDto
	 */
	@GetMapping
	public ResponseEntity<List<UserListResponseDto>> getAllUsers() {
		List<UserListResponseDto> users = userService.getAllUsers();
		return ResponseEntity.ok(users);
	}

	/**
	 * Get user by ID
	 * 
	 * @param id User ID
	 * @return UserResponseDto with user details
	 */
	@GetMapping("/{id}")
	public ResponseEntity<UserResponseDto> getUserById(@PathVariable int id) {
		UserResponseDto user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}
	
	@GetMapping("/me")
	public ResponseEntity<UserResponseDto> getSelf(@PathVariable int id) {
		UserResponseDto user = userService.getUserById(id);
		return ResponseEntity.ok(user);
	}

	/**
	 * Create a new user
	 * 
	 * @param createUserRequest User creation request
	 * @return UserResponseDto with created user details
	 */
	@PostMapping
	public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody AdminCreateUserRequestDto createUserRequest)
			throws BadRequestException {
		UserResponseDto createdUser = userService.createUser(createUserRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}

	/**
	 * Update user profile information
	 * 
	 * @param id User ID
	 * @param updateUserRequest User update request
	 * @return UserResponseDto with updated user details
	 */
	@PutMapping("/me")
	public ResponseEntity<UserResponseDto> updateUser(@PathVariable int id,
			@Valid @RequestBody UpdateUserRequestDto updateUserRequest) {
		UserResponseDto updatedUser = userService.updateUser(id, updateUserRequest);
		return ResponseEntity.ok(updatedUser);
	}

	/**
	 * Update user status (Admin operation)
	 * 
	 * @param id User ID
	 * @param statusRequest User status update request
	 * @return UserResponseDto with updated user details
	 */
	@PutMapping("/{id}/status")
	public ResponseEntity<UserResponseDto> updateUserStatus(@PathVariable int id,
			@Valid @RequestBody UpdateUserStatusDto statusRequest) {
		UserResponseDto updatedUser = userService.updateUserStatus(id, statusRequest);
		return ResponseEntity.ok(updatedUser);
	}

	/**
	 * Change user password
	 * 
	 * @param id User ID
	 * @param passwordRequest Password change request
	 * @return ResponseEntity with status
	 */
	@PostMapping("/{id}/change-password")
	public ResponseEntity<String> changePassword(@PathVariable int id,
			@Valid @RequestBody ChangePasswordRequestDto passwordRequest) {
		userService.changePassword(id, passwordRequest);
		return ResponseEntity.ok("Password changed successfully");
	}

	/**
	 * Delete a user
	 * 
	 * @param id User ID
	 * @return ResponseEntity with status
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable int id) {
		userService.deleteUser(id);
		return ResponseEntity.ok("User deleted successfully");
	}

}
