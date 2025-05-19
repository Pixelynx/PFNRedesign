package com.pfnredesign.ecommerce.controller;

import com.pfnredesign.ecommerce.dto.AuthResponse;
import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.service.UserService;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import jakarta.validation.Valid;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/v0/auth")
@Tag(name = "Authentication", description = "API for user authentication and registration")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns user details")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "User registered successfully"),
        @ApiResponse(responseCode = "409", description = "Account with email already exists")
    })
    public ResponseEntity<EntityModel<UserResponse>> registerUser(@Valid @RequestBody RegistrationRequest registrationRequest) {
        UserResponse userResponse = userService.registerUser(registrationRequest);
        
        Link selfLink = linkTo(methodOn(AuthController.class).registerUser(registrationRequest)).withSelfRel();
        
        Link loginLink = linkTo(methodOn(AuthController.class).loginUser(null)).withRel("login");
        
        Link userLink = linkTo(methodOn(UserController.class).getUserById(userResponse.getId())).withRel("user");
        
        EntityModel<UserResponse> userResponseModel = EntityModel.of(userResponse, selfLink, loginLink, userLink);
        
        return new ResponseEntity<>(userResponseModel, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Log in a user", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<EntityModel<AuthResponse>> loginUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = userService.authenticateUser(loginRequest);
        
        Link selfLink = linkTo(methodOn(AuthController.class).loginUser(loginRequest)).withSelfRel();
        
        Link userLink = linkTo(methodOn(UserController.class).getUserById(authResponse.getUser().getId())).withRel("user");
        
        EntityModel<AuthResponse> authResponseModel = EntityModel.of(authResponse, selfLink, userLink);
        
        return ResponseEntity.ok(authResponseModel);
    }
} 