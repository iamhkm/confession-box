package com.hkm.confession_box.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class JwtAuthenticator {

	private JwtAuthenticationFilter jwtAuthenticationFilter;

	public JwtAuthenticator(JwtAuthenticationFilter jwtAuthenticationFilter) {
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	/**
	 * Configure security filter chain with role-based access control
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth
						// Public endpoints - anyone can access
						.requestMatchers("/auth/**").permitAll()
						.requestMatchers(HttpMethod.GET, "/users/me").authenticated()
						.requestMatchers(HttpMethod.PUT, "/users/me").authenticated()
						.requestMatchers(HttpMethod.GET, "/users").hasRole("ADMIN")
						.requestMatchers(HttpMethod.GET, "/users/*").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/users/*").hasRole("ADMIN")
						.requestMatchers(HttpMethod.PUT, "/users/*/status").hasRole("ADMIN")
						.requestMatchers(HttpMethod.POST, "/users").hasRole("ADMIN")
						.requestMatchers(HttpMethod.DELETE, "/users/*").hasRole("ADMIN")
						.anyRequest().authenticated())
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class).build();
	}

	/**
	 * Password encoder bean
	 */
	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
