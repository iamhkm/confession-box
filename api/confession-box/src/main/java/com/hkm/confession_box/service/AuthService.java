package com.hkm.confession_box.service;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.LoginResponseDto;
import com.hkm.confession_box.dto.UserResponseDto;
import com.hkm.confession_box.dto.UserSignUpDto;
import com.hkm.confession_box.exception.InvalidUserException;
import com.hkm.confession_box.exception.InvalidUserStateException;
import com.hkm.confession_box.mapper.UserMapper;
import com.hkm.confession_box.models.User;
import com.hkm.confession_box.models.UserRole;
import com.hkm.confession_box.models.UserStatus;
import com.hkm.confession_box.utils.HashUtil;
import com.hkm.confession_box.utils.JwtUtil;
import jakarta.validation.Valid;

@Service
public class AuthService {

	private UserDao userDao;
	private JwtUtil jwtUtil;
	private PasswordEncoder passwordEncoder;
	private HashUtil hashUtils;
	private UserMapper userMapper;

	public AuthService(UserDao userDao, HashUtil hashUtils, JwtUtil jwtUtil, PasswordEncoder passwordEncoder,
			UserMapper userMapper) {
		this.userDao = userDao;
		this.jwtUtil = jwtUtil;
		this.passwordEncoder = passwordEncoder;
		this.hashUtils = hashUtils;
		this.userMapper = userMapper;
	}

	/**
	 * Sign in user with username and password and return JWT token
	 * 
	 * @throws InvalidUserStateException
	 * @throws InvalidUserException
	 */
	public LoginResponseDto signIn(String username, String password)
			throws InvalidUserStateException, InvalidUserException {

		User user = userDao.findByUsername(username)
				.orElseThrow(() -> new InvalidUserException("Invalid username or password"));
		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new InvalidUserException("Invalid username or password");
		}
		if (user.getStatus() != UserStatus.ACTIVE) {
			throw new InvalidUserStateException("User is in " + user.getStatus() + " state. Please contact support.");
		}
		String jwtToken = jwtUtil.generateToken(user.getId(), user.getUsername(), user.getRole().toString());
		return new LoginResponseDto(jwtToken, user.getUsername(), user.getRole());
	}

	/**
	 * Handle forgot password request
	 */
	public String forgotPassword(String email) {
		userDao.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found with email: " + email));

		// Generate a temporary reset token
		String resetToken = UUID.randomUUID().toString();

		// In a real application, you would:
		// 1. Save the reset token to the user (with expiration time)
		// 2. Send an email with the reset link containing the token
		// For now, we'll just return the token

		return resetToken;
	}

	@Transactional
	public UserResponseDto signUp(@Valid UserSignUpDto signUpRequest) {
		User user = new User();
		user.setUsername(signUpRequest.username());
		user.setName(signUpRequest.name());
		user.setEmail(signUpRequest.email());
		user.setRole(UserRole.USER);
		user.setPassword(hashUtils.hashPassword(signUpRequest.password()));
		user.setCreatedAt(LocalDateTime.now());
		user.setUpdatedAt(LocalDateTime.now());
		user.setUpdatedBy(null);
		user.setApprovedBy(null);
		user.setStatus(UserStatus.VERIFICATION_PENDING);
		User savedUser = userDao.save(user);
		return userMapper.toResponseDto(savedUser);
	}
}
