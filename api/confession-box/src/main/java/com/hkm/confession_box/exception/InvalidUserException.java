package com.hkm.confession_box.exception;

public class InvalidUserException extends Exception{

	private static final long serialVersionUID = 1L;
	
	public InvalidUserException (String message) {
		super(message); 
	}
}
