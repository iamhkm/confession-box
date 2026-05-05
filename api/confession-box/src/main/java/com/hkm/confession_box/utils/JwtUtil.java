package com.hkm.confession_box.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {
	
	@Value("${jwt.secret:mySecretKeyForJWTTokenGenerationPurposeOnlyConfessionBoxApplication2026}")
	private String jwtSecret;
	
	@Value("${jwt.expiration:86400000}")
	private long jwtExpiration; // 24 hours by default
	
	/**
	 * Generate JWT token for user
	 */
	public String generateToken(Integer userId, String username, String role) {
		Map<String, Object> claims = new HashMap<>();
		claims.put("userId", userId);
		claims.put("username", username);
		claims.put("role", role);
		
		return createToken(claims, username);
	}
	
	/**
	 * Create JWT token with claims
	 */
	private String createToken(Map<String, Object> claims, String subject) {
		Date now = new Date();
		Date expiryDate = new Date(now.getTime() + jwtExpiration);
		
		SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
		
		return Jwts.builder()
			.setClaims(claims)
			.setSubject(subject)
			.setIssuedAt(now)
			.setExpiration(expiryDate)
			.signWith(key, SignatureAlgorithm.HS256)
			.compact();
	}
}
