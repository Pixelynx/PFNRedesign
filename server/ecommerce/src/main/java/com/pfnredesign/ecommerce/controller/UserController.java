package com.pfnredesign.ecommerce.controller;

import com.pfnredesign.ecommerce.model.User;
import com.pfnredesign.ecommerce.service.UserService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

@RestController
@RequestMapping("/api/v0/users")
@Tag(name = "User Management", description = "API for managing users")
public class UserController {
    private final UserService userService;
    
    public UserController(UserService userService) {
        this.userService = userService;
    }
    
    @GetMapping
    @Operation(summary = "Get all users", description = "Returns a paginated list of users with sorting options")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    public Page<User> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Number of items per page") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sorting criteria in the format: property(,asc|desc).") 
            @RequestParam(defaultValue = "userId,asc") String[] sort) {
        
        // Create sorted object from sort parameters
        Sort.Direction direction = Sort.Direction.ASC;
        String property = "userId";
        
        if (sort.length > 0) {
            property = sort[0];
            if (sort.length > 1 && sort[1].equalsIgnoreCase("desc")) {
                direction = Sort.Direction.DESC;
            }
        }
        
        Pageable pageable = PageRequest.of(page, size, direction, property);
        return userService.getAllUsers(pageable);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Returns a single user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new user", description = "Creates a new user and returns the created user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    public User createUser(@Valid @RequestBody User user) {
        return userService.saveUser(user);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a user", description = "Updates an existing user with the provided data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> updateUser(@Valid @PathVariable Long id, @RequestBody User user) {
        return userService.getUserById(id)
                .map(existingUser -> {
                    user.setUserId(id);
                    return ResponseEntity.ok(userService.saveUser(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partially update a user", description = "Updates specific fields of an existing user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<User> partialUpdateUser(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        User updatedUser = userService.updateUser(id, fields);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedUser);
    }
    
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a user", description = "Deletes a user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User deleted successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> {
                    userService.deleteUser(id);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}