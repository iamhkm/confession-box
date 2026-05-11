package com.hkm.confession_box.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.hkm.confession_box.security.UserPrincipal;
import org.springframework.stereotype.Service;
import com.hkm.confession_box.Dao.ConfessionDao;
import com.hkm.confession_box.Dao.UserDao;
import com.hkm.confession_box.dto.ConfessionResponseDto;
import com.hkm.confession_box.dto.CreateConfessionRequestDto;
import com.hkm.confession_box.dto.UpdateConfessionRequestDto;
import com.hkm.confession_box.dto.UpdateConfessionStatusDto;
import com.hkm.confession_box.exception.InvalidUserException;
import com.hkm.confession_box.models.Confession;
import com.hkm.confession_box.models.ConfessionStatus;
import com.hkm.confession_box.models.User;

@Service
public class ConfessionService {
	
	private ConfessionDao confessionDao;
	private UserDao userDao;
	
	public ConfessionService(ConfessionDao confessionDao, UserDao userDao) {
		this.confessionDao = confessionDao;
		this.userDao = userDao;
	}
	
	/**
	 * Get all confessions
	 */
	public List<ConfessionResponseDto> getAllConfessions() {
		Authentication auth =
		        SecurityContextHolder.getContext().getAuthentication();

		    UserPrincipal user = (UserPrincipal) auth.getPrincipal();

		    if (user.hasRole("ADMIN")) {
		        return confessionDao.findAll()
		                .stream()
		                .map(this::convertToConfessionResponseDto)
		                .toList();
		    }

		    return confessionDao.findByUserId(user.getId())
		            .stream()
		            .map(this::convertToConfessionResponseDto)
		            .toList();
	}
	
	/**
	 * Get confession by ID
	 */
	public ConfessionResponseDto getConfessionById(Integer id) {
		return confessionDao.findById(id)
			.map(this::convertToConfessionResponseDto)
			.orElseThrow(() -> new RuntimeException("Confession not found with id: " + id));
	}

	/**
	 * Create a new confession
	 * @throws InvalidUserException 
	 */
	public ConfessionResponseDto createConfession(CreateConfessionRequestDto createRequest) throws InvalidUserException {
		UserPrincipal currentUsere = getCurrentUser();
		User user = userDao.findById(currentUsere.getId())
			.orElseThrow(() -> new InvalidUserException("User not found with id: " + currentUsere.getId()));
		Confession confession = new Confession();
		confession.setConfesion(createRequest.confesion());
		confession.setAnonymous(createRequest.anonymous());
		confession.setStatus(ConfessionStatus.DRAFT);
		confession.setUser(user);
		confession.setCreatedAt(LocalDateTime.now());
		confession.setUpdatedAt(LocalDateTime.now());
		confession.setUser(user);
		Confession savedConfession = confessionDao.save(confession);
		return convertToConfessionResponseDto(savedConfession);
	}

	/**
	 * Update confession content
	 */
	public ConfessionResponseDto updateConfession(Integer id, UpdateConfessionRequestDto updateRequest) {
		return confessionDao.findById(id).map(existingConfession -> {
			existingConfession.setConfesion(updateRequest.confesion());
			if (updateRequest.anonymous() != null) {
				existingConfession.setAnonymous(updateRequest.anonymous());
			}
			existingConfession.setUpdatedAt(LocalDateTime.now());
			Confession updatedConfession = confessionDao.save(existingConfession);
			return convertToConfessionResponseDto(updatedConfession);
		}).orElseThrow(() -> new RuntimeException("Confession not found with id: " + id));
	}

	/**
	 * Update confession status (Admin operation)
	 */
	public ConfessionResponseDto updateConfessionStatus(Integer id, UpdateConfessionStatusDto statusRequest) {
		return confessionDao.findById(id).map(existingConfession -> {
			existingConfession.setStatus(statusRequest.status());
			existingConfession.setUpdatedAt(LocalDateTime.now());
			Confession updatedConfession = confessionDao.save(existingConfession);
			return convertToConfessionResponseDto(updatedConfession);
		}).orElseThrow(() -> new RuntimeException("Confession not found with id: " + id));
	}

	/**
	 * Delete a confession
	 */
	public void deleteConfession(Integer id) {
		if (!confessionDao.existsById(id)) {
			throw new RuntimeException("Confession not found with id: " + id);
		}
		confessionDao.deleteById(id);
	}
	
	/**
	 * Get confessions by user ID
	 */
	public List<ConfessionResponseDto> getConfessionsByUserId(Integer userId) {
		User user = userDao.findById(userId)
			.orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
		return user.getConfessions().stream()
			.map(this::convertToConfessionResponseDto)
			.collect(Collectors.toList());
	}
	
	/**
	 * Helper method to convert Confession to ConfessionResponseDto
	 */
	private ConfessionResponseDto convertToConfessionResponseDto(Confession confession) {
		return new ConfessionResponseDto(
			confession.getId(),
			confession.getConfesion(),
			confession.getAnonymous(),
			confession.getStatus(),
			confession.getUser().getId(),
			confession.getUser().getUsername(),
			confession.getCreatedAt(),
			confession.getUpdatedAt()
		);
	}
	
	private UserPrincipal getCurrentUser() {
		Authentication auth =
		        SecurityContextHolder.getContext().getAuthentication();
		UserPrincipal user = (UserPrincipal) auth.getPrincipal();
		return user;
	}
	
}
