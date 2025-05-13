package com.pfnredesign.ecommerce.controller;

import com.pfnredesign.ecommerce.dto.AuthResponse;
import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<UserResponse> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        UserResponse userResponse = userService.registerUser(registrationRequest);
        return new ResponseEntity<>(userResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.authenticateUser(loginRequest);
        return ResponseEntity.ok(authResponse);
    }
} 