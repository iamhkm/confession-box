package com.hkm.confession_box.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hkm.confession_box.dto.ChangePasswordRequestDto;
import com.hkm.confession_box.dto.UpdateUserRequestDto;
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

	@GetMapping("/me")
	public ResponseEntity<UserResponseDto> getSelf() {
		UserResponseDto user = userService.getSelfUser();
		return ResponseEntity.ok(user);
	}

	/**
	 * Update user profile information
	 * 
	 * @param id                User ID
	 * @param updateUserRequest User update request
	 * @return UserResponseDto with updated user details
	 */
	@PutMapping("/me")
	public ResponseEntity<UserResponseDto> updateUser(@Valid @RequestBody UpdateUserRequestDto updateUserRequest) {
		UserResponseDto updatedUser = userService.updateUser(updateUserRequest);
		return ResponseEntity.ok(updatedUser);
	}

	/**
	 * Change user password
	 * 
	 * @param id              User ID
	 * @param passwordRequest Password change request
	 * @return ResponseEntity with status
	 */
	@PostMapping("/me/change-password")
	public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequestDto passwordRequest) {
		userService.changePassword(passwordRequest);
		return ResponseEntity.ok("Password changed successfully");
	}

}
