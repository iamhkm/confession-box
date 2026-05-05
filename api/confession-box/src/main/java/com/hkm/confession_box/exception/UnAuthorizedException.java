package com.hkm.confession_box.exception;

public class UnAuthorizedException extends RuntimeException {
	private static final long serialVersionUID = 1L;

	public UnAuthorizedException(String message) {
		super(message);
	}

}
