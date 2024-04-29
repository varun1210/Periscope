package com.periscope.backend.user.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.rmi.ServerException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class UserExceptionHandler {

    @ExceptionHandler({PageNotFoundException.class})
    public ResponseEntity pageNotFoundHandler(PageNotFoundException pageNotFoundException) {
//        return ResponseEntity.notFound().build();
        HashMap<String, String> responseBody = new HashMap<>();
        responseBody.put("ERROR", "BAD REQUEST");
        responseBody.put("MESSAGE", pageNotFoundException.getMessage());
        return new ResponseEntity<HashMap<String, String>>(responseBody, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({UserNotFoundException.class})
    public ResponseEntity userNotFoundHandler(UserNotFoundException userNotFoundException) {
//        return ResponseEntity.notFound().build();
        HashMap<String, String> responseBody = new HashMap<>();
        responseBody.put("ERROR", "BAD REQUEST");
        responseBody.put("MESSAGE", userNotFoundException.getMessage());
        return new ResponseEntity<HashMap<String, String>>(responseBody, HttpStatus.NOT_FOUND);
    }

    private Map<String, List<String>> getErrorsMap(List<String> errors) {
        Map<String, List<String>> errorResponse = new HashMap<>();
        errorResponse.put("errors", errors);
        return errorResponse;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, List<String>>> handleValidationErrors(MethodArgumentNotValidException ex) {
        List<String> errors = ex.getBindingResult().getFieldErrors()
                .stream().map(FieldError::getDefaultMessage).collect(Collectors.toList());
        return new ResponseEntity<>(getErrorsMap(errors), new HttpHeaders(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ServerException.class})
    public ResponseEntity serverErrorHandler(Exception e) {
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("STATUS", "INTERNAL SERVER ERROR!");
        responseBody.put("MESSAGE", "Please try again in some time!");
        return new ResponseEntity(responseBody, HttpStatus.INTERNAL_SERVER_ERROR);
    }

}
