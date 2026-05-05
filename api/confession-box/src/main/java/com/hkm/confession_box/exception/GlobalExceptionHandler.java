package com.hkm.confession_box.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import com.hkm.confession_box.dto.ErrorResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException ex) {

        ErrorResponse error =
                new ErrorResponse(ex.getMessage(), 404);

        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(InvalidUserException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserException(
            InvalidUserException ex) {

        ErrorResponse error =
                new ErrorResponse(ex.getMessage(), 400);

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(InvalidUserStateException.class)
    public ResponseEntity<ErrorResponse> handleInvalidUserStateException(
    		InvalidUserStateException ex) {

        ErrorResponse error =
                new ErrorResponse(ex.getMessage(), 400);

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(BadRequestExceptioin.class)
    public ResponseEntity<ErrorResponse> handleBadRequest(BadRequestExceptioin ex) {

		ErrorResponse error =
				new ErrorResponse(ex.getMessage(), 400);

		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}
    
    @ExceptionHandler(UnAuthorizedException.class)
    public ResponseEntity<ErrorResponse> handleUnauthorized(UnAuthorizedException ex) {
    	ErrorResponse error = new ErrorResponse(ex.getMessage(), 401);
    	return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDuplicate(
            DataIntegrityViolationException ex) {

        String message = "Invalid request";

        if (ex.getMostSpecificCause().getMessage().contains("username")) {
            message = "Username already exists";
        } else if (ex.getMostSpecificCause().getMessage().contains("email")) {
            message = "Email already exists";
        }

        ErrorResponse error = new ErrorResponse(message, 400);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        ));

        return ResponseEntity.badRequest().body(errors);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneralException(Exception ex) {
    	ErrorResponse error = new ErrorResponse("An unexpected error occurred: " + ex.getMessage(), 500);
		return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

