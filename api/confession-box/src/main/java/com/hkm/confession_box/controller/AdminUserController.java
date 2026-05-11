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
import com.hkm.confession_box.dto.AdminCreateUserRequestDto;
import com.hkm.confession_box.dto.UpdateUserStatusDto;
import com.hkm.confession_box.dto.UserListResponseDto;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.service.AdminUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/users")
public class AdminUserController {

	private AdminUserService adminUserService;

	public AdminUserController(AdminUserService adminUserService) {
		this.adminUserService = adminUserService;
	}

	/**
	 * Get all users
	 * 
	 * @return List of UserListResponseDto
	 */
	@GetMapping
	public ResponseEntity<List<UserListResponseDto>> getAllUsers() {
		List<UserListResponseDto> users = adminUserService.getAllUsers();
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
		UserResponseDto user = adminUserService.getUserById(id);
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
		UserResponseDto createdUser = adminUserService.createUser(createUserRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}

	/**
	 * Update user status (Admin operation)
	 * 
	 * @param id            User ID
	 * @param statusRequest User status update request
	 * @return UserResponseDto with updated user details
	 */
	@PutMapping("/{id}/status")
	public ResponseEntity<UserResponseDto> updateUserStatus(@PathVariable int id,
			@Valid @RequestBody UpdateUserStatusDto statusRequest) {
		UserResponseDto updatedUser = adminUserService.updateUserStatus(id, statusRequest);
		return ResponseEntity.ok(updatedUser);
	}

	/**
	 * Delete a user
	 * 
	 * @param id User ID
	 * @return ResponseEntity with status
	 */
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable int id) {
		adminUserService.deleteUser(id);
		return ResponseEntity.ok("User deleted successfully");
	}
}
