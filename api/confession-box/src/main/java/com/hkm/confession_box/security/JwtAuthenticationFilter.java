package com.hkm.confession_box.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.util.Collections;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	@Value("${jwt.secret}")
	private String jwtSecret;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
			FilterChain filterChain) throws ServletException, IOException {
		
		try {
			String token = extractToken(request);
			
			if (token != null && isTokenValid(token)) {
				Authentication authentication = getAuthentication(token);
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		} catch (Exception e) {
			logger.error("JWT Token validation failed: ", e);
		}
		
		filterChain.doFilter(request, response);
	}

	/**
	 * Extract JWT token from Authorization header
	 */
	private String extractToken(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		
		if (authHeader != null && authHeader.startsWith("Bearer ")) {
			return authHeader.substring(7);
		}
		
		return null;
	}

	/**
	 * Validate JWT token
	 */
	private boolean isTokenValid(String token) {
		try {
			SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
			Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token);
			return true;
		} catch (Exception e) {
			logger.error("JWT Token validation error: ", e);
			return false;
		}
	}

	/**
	 * Extract authentication details from JWT token
	 */
	private Authentication getAuthentication(String token) {
		try {
			SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
			Claims claims = Jwts.parser()
				.verifyWith(key)
				.build()
				.parseSignedClaims(token)
				.getPayload();
			
			String username = claims.getSubject();
			String role = (String) claims.get("role");
			
			// Convert role to ROLE_ format for Spring Security
			String roleWithPrefix = "ROLE_" + (role != null ? role : "USER");
			
			return new UsernamePasswordAuthenticationToken(
				username,
				null,
				Collections.singletonList(new SimpleGrantedAuthority(roleWithPrefix))
			);
		} catch (Exception e) {
			logger.error("Error extracting authentication from token: ", e);
			return null;
		}
	}
}

