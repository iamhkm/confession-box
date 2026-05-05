package com.hkm.confession_box.exception;

public class InvalidUserStateException extends Exception{
	
	private static final long serialVersionUID = 1L;

	public InvalidUserStateException (String message) {
		super(message);
	}
}
