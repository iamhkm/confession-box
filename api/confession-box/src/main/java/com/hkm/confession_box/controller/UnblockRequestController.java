package com.hkm.confession_box.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hkm.confession_box.dto.CreateUnblockRequestDto;
import com.hkm.confession_box.dto.ReviewUnblockRequestDto;
import com.hkm.confession_box.dto.UnblockRequestResponseDto;
import com.hkm.confession_box.service.UnblockRequestService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/unblock-requests")
@CrossOrigin(origins = "*")
public class UnblockRequestController {

    private final UnblockRequestService unblockRequestService;

    public UnblockRequestController(UnblockRequestService unblockRequestService) {
        this.unblockRequestService = unblockRequestService;
    }

    /**
     * Create an unblock request for a confession
     */
    @PostMapping("/confession/{confessionId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UnblockRequestResponseDto> createUnblockRequest(
            @PathVariable Integer confessionId,
            @Valid @RequestBody CreateUnblockRequestDto requestDto) {
        return ResponseEntity.ok(unblockRequestService.createUnblockRequest(confessionId, requestDto));
    }

    /**
     * Get all unblock requests (Admin only)
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UnblockRequestResponseDto>> getAllUnblockRequests() {
        return ResponseEntity.ok(unblockRequestService.getAllUnblockRequests());
    }

    /**
     * Get pending unblock requests (Admin only)
     */
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UnblockRequestResponseDto>> getPendingUnblockRequests() {
        return ResponseEntity.ok(unblockRequestService.getPendingUnblockRequests());
    }

    /**
     * Get unblock requests for current user
     */
    @GetMapping("/my-requests")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<UnblockRequestResponseDto>> getMyUnblockRequests() {
        return ResponseEntity.ok(unblockRequestService.getMyUnblockRequests());
    }

    /**
     * Get unblock request by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<UnblockRequestResponseDto> getUnblockRequestById(@PathVariable Integer id) {
        return ResponseEntity.ok(unblockRequestService.getUnblockRequestById(id));
    }

    /**
     * Review unblock request (Admin only)
     */
    @PutMapping("/{id}/review")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UnblockRequestResponseDto> reviewUnblockRequest(
            @PathVariable Integer id,
            @Valid @RequestBody ReviewUnblockRequestDto reviewDto) {
        return ResponseEntity.ok(unblockRequestService.reviewUnblockRequest(id, reviewDto));
    }
}
