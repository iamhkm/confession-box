package com.hkm.confession_box.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hkm.confession_box.dto.ForgotPasswordRequestDto;
import com.hkm.confession_box.dto.ForgotPasswordResponseDto;
import com.hkm.confession_box.dto.LoginResponseDto;
import com.hkm.confession_box.dto.SigninRequestDto;
import com.hkm.confession_box.dto.UserSignUpDto;
import com.hkm.confession_box.exception.InvalidUserException;
import com.hkm.confession_box.exception.InvalidUserStateException;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.service.AuthService;
import com.hkm.confession_box.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/public")
public class AuthController {
	
	private AuthService authService;
	
	public AuthController(AuthService authService) {
		this.authService = authService;
	}
	
	/**
	 * Sign in user and receive JWT token
	 * 
	 * @param signinRequest Signin request with username and password
	 * @return LoginResponseDto with JWT token, username and role
	 * @throws InvalidUserException 
	 * @throws InvalidUserStateException 
	 */
	@PostMapping("/signin")
	public ResponseEntity<LoginResponseDto> signIn(@Valid @RequestBody SigninRequestDto signinRequest) throws InvalidUserStateException, InvalidUserException {
		LoginResponseDto loginResponse = authService.signIn(signinRequest.username(), signinRequest.password());
		return ResponseEntity.ok(loginResponse);
	}
	
	/**
	 * Forgot password endpoint
	 * Generates a password reset token and initiates password recovery process
	 * 
	 * @param forgotPasswordRequest Forgot password request with email
	 * @return ForgotPasswordResponseDto with reset token and message
	 */
	@PostMapping("/forgot-password")
	public ResponseEntity<ForgotPasswordResponseDto> forgotPassword(
			@Valid @RequestBody ForgotPasswordRequestDto forgotPasswordRequest) {
		String resetToken = authService.forgotPassword(forgotPasswordRequest.email());
		ForgotPasswordResponseDto response = new ForgotPasswordResponseDto(
			"Password reset token generated successfully. Please use this token to reset your password.",
			resetToken,
			forgotPasswordRequest.email()
		);
		return ResponseEntity.status(HttpStatus.OK).body(response);
	}
	
	@PostMapping("/signup")
	public ResponseEntity<UserResponseDto> signUp(@Valid @RequestBody UserSignUpDto signUpRequest) {
		UserResponseDto user = authService.signUp(signUpRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(user);
	}
}

