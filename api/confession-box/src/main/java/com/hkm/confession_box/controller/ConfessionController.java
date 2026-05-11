package com.hkm.confession_box.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.hkm.confession_box.dto.ConfessionResponseDto;
import com.hkm.confession_box.dto.CreateConfessionRequestDto;
import com.hkm.confession_box.dto.UpdateConfessionRequestDto;
import com.hkm.confession_box.exception.InvalidUserException;
import com.hkm.confession_box.service.ConfessionService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/confessions")
public class ConfessionController {
	
	private ConfessionService confessionService;
	
	public ConfessionController(ConfessionService confessionService) {
		this.confessionService = confessionService;
	}
	
	/**
	 * Get all confessions
	 * 
	 * @return List of ConfessionResponseDto
	 */
	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<List<ConfessionResponseDto>> getAllConfessions() {
		List<ConfessionResponseDto> confessions = confessionService.getAllConfessions();
		return ResponseEntity.ok(confessions);
	}
	
	/**
	 * Get confession by ID
	 * 
	 * @param id Confession ID
	 * @return ConfessionResponseDto with confession details
	 */
	@PreAuthorize("hasRole('ADMIN') or @confessionSecurity.isConfessionOwner(authentication, #id)")
	@GetMapping("/{id}")
	public ResponseEntity<ConfessionResponseDto> getConfessionById(@PathVariable int id) {
		ConfessionResponseDto confession = confessionService.getConfessionById(id);
		return ResponseEntity.ok(confession);
	}
	
	/**
	 * Get all confessions by user ID
	 * 
	 * @param userId User ID
	 * @return List of ConfessionResponseDto for the user
	 */
	@PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<ConfessionResponseDto>> getConfessionsByUserId(@PathVariable int userId) {
		List<ConfessionResponseDto> confessions = confessionService.getConfessionsByUserId(userId);
		return ResponseEntity.ok(confessions);
	}
	
	/**
	 * Create a new confession
	 * 
	 * @param createRequest Confession creation request
	 * @return ConfessionResponseDto with created confession details
	 * @throws InvalidUserException 
	 */
	@PostMapping
	public ResponseEntity<ConfessionResponseDto> createConfession(@Valid @RequestBody CreateConfessionRequestDto createRequest) 
			throws InvalidUserException {
		ConfessionResponseDto createdConfession = confessionService.createConfession(createRequest);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdConfession);
	}
	
	/**
	 * Update confession content
	 * 
	 * @param id Confession ID
	 * @param updateRequest Confession update request
	 * @return ConfessionResponseDto with updated confession details
	 */
	@PreAuthorize("hasRole('ADMIN') or @confessionSecurity.isConfessionOwner(authentication, #id)")
	@PutMapping("/{id}")
	public ResponseEntity<ConfessionResponseDto> updateConfession(@PathVariable int id, 
			@Valid @RequestBody UpdateConfessionRequestDto updateRequest) {
		ConfessionResponseDto updatedConfession = confessionService.updateConfession(id, updateRequest);
		return ResponseEntity.ok(updatedConfession);
	}
	
	/**
	 * Delete a confession
	 * 
	 * @param id Confession ID
	 * @return ResponseEntity with status message
	 */
	@PreAuthorize("hasRole('ADMIN') or @confessionSecurity.isConfessionOwner(authentication, #id)")
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteConfession(@PathVariable int id) {
		confessionService.deleteConfession(id);
		return ResponseEntity.ok("Confession deleted successfully");
	}
}
