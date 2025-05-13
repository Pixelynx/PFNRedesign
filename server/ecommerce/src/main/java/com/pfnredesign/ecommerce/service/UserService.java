package com.pfnredesign.ecommerce.service;

import com.pfnredesign.ecommerce.dto.AuthResponse;
import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.model.User;

import java.util.List;
import java.util.Optional;

public interface UserService {

    UserResponse registerUser(RegistrationRequest request);
    
    AuthResponse authenticateUser(LoginRequest request);

    List<User> getAllUsers();

    Optional<User> getUserById(Long id);

    User saveUser(User user);

    void deleteUser(Long id);
    
    User getCurrentUser();
} 