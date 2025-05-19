package com.pfnredesign.ecommerce.exception;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.HttpStatus;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiError {
    private HttpStatus status;
    private int statusCode;
    private String message;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String path;
    
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private List<ValidationError> errors = new ArrayList<>();
    
    public ApiError(HttpStatus status, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.statusCode = status.value();
        this.message = message;
        this.path = path;
    }
    
    public void addValidationError(String field, String message) {
        errors.add(new ValidationError(field, message));
    }
    
    public void addValidationErrors(Map<String, String> errorMap) {
        errorMap.forEach(this::addValidationError);
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    private static class ValidationError {
        private String field;
        private String message;
    }
} 