package com.hkm.confession_box.models;

public enum NotificationType {
	// Confession related notifications
	CONFESSION_APPROVED,
	CONFESSION_BLOCKED,
	CONFESSION_UNBLOCKED,
	CONFESSION_ACTIVATED,
	CONFESSION_DEACTIVATED,
	
	// User status notifications
	USER_BLOCKED,
	USER_UNBLOCKED,
	USER_ACTIVATED,
	
	// Admin notifications
	NEW_CONFESSION_SUBMITTED,
	UNBLOCK_REQUEST_SUBMITTED,
	UNBLOCK_REQUEST_APPROVED,
	UNBLOCK_REQUEST_REJECTED
}
