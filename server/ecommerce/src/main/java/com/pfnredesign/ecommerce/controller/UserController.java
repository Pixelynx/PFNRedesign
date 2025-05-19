package com.pfnredesign.ecommerce.controller;

import com.pfnredesign.ecommerce.dto.UserCreateDTO;
import com.pfnredesign.ecommerce.dto.UserDTO;
import com.pfnredesign.ecommerce.dto.UserUpdateDTO;
import com.pfnredesign.ecommerce.mapper.UserMapper;
import com.pfnredesign.ecommerce.model.User;
import com.pfnredesign.ecommerce.service.UserService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.Map;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
@RequestMapping("/api/v0/users")
@Tag(name = "User Management", description = "API for managing users")
public class UserController {
    private final UserService userService;
    private final UserMapper userMapper;
    private final PagedResourcesAssembler<UserDTO> pagedResourcesAssembler;
    
    public UserController(UserService userService, UserMapper userMapper, PagedResourcesAssembler<UserDTO> pagedResourcesAssembler) {
        this.userService = userService;
        this.userMapper = userMapper;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }
    
    @GetMapping
    @Operation(summary = "Get all users", description = "Returns a paginated list of users with sorting options")
    @ApiResponse(responseCode = "200", description = "Users retrieved successfully")
    public PagedModel<EntityModel<UserDTO>> getAllUsers(
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
        Page<User> users = userService.getAllUsers(pageable);
        Page<UserDTO> userDTOs = userMapper.toDTOPage(users);
        
        return pagedResourcesAssembler.toModel(
                userDTOs,
                userDTO -> toUserModel(userDTO)
        );
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Returns a single user by their ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User found"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<EntityModel<UserDTO>> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> {
                    UserDTO userDTO = userMapper.toDTO(user);
                    EntityModel<UserDTO> userModel = toUserModel(userDTO);
                    return ResponseEntity.ok(userModel);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new user", description = "Creates a new user and returns the created user")
    @ApiResponse(responseCode = "201", description = "User created successfully")
    public EntityModel<UserDTO> createUser(@Valid @RequestBody UserCreateDTO userCreateDTO) {
        User user = userMapper.toEntity(userCreateDTO);
        User savedUser = userService.saveUser(user);
        UserDTO userDTO = userMapper.toDTO(savedUser);
        return toUserModel(userDTO);
    }
    
    @PutMapping("/{id}")
    @Operation(summary = "Update a user", description = "Updates an existing user with the provided data")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<EntityModel<UserDTO>> updateUser(@Valid @PathVariable Long id, @RequestBody UserUpdateDTO userUpdateDTO) {
        return userService.getUserById(id)
                .map(existingUser -> {
                    User updatedUser = userMapper.updateEntityFromDTO(userUpdateDTO, existingUser);
                    User savedUser = userService.saveUser(updatedUser);
                    UserDTO userDTO = userMapper.toDTO(savedUser);
                    EntityModel<UserDTO> userModel = toUserModel(userDTO);
                    return ResponseEntity.ok(userModel);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PatchMapping("/{id}")
    @Operation(summary = "Partially update a user", description = "Updates specific fields of an existing user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User updated successfully"),
        @ApiResponse(responseCode = "404", description = "User not found")
    })
    public ResponseEntity<EntityModel<UserDTO>> partialUpdateUser(@PathVariable Long id, @RequestBody Map<String, Object> fields) {
        User updatedUser = userService.updateUser(id, fields);
        if (updatedUser == null) {
            return ResponseEntity.notFound().build();
        }
        UserDTO userDTO = userMapper.toDTO(updatedUser);
        EntityModel<UserDTO> userModel = toUserModel(userDTO);
        return ResponseEntity.ok(userModel);
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
    
    /**
     * Converts a UserDTO to an EntityModel with HATEOAS links
     */
    private EntityModel<UserDTO> toUserModel(UserDTO userDTO) {
        Link selfLink = linkTo(methodOn(UserController.class).getUserById(userDTO.getUserId())).withSelfRel();
        
        Link usersLink = linkTo(methodOn(UserController.class).getAllUsers(0, 10, new String[]{"userId", "asc"}))
                .withRel("users");
        
        return EntityModel.of(userDTO, selfLink, usersLink);
    }
}