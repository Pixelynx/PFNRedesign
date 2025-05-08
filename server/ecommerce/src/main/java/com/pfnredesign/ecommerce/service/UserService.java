package com.pfnredesign.ecommerce.service;

import com.pfnredesign.ecommerce.dto.AuthResponse;
import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.model.User;

public interface UserService {

    UserResponse registerUser(RegistrationRequest request);
    
    AuthResponse authenticateUser(LoginRequest request);
    
    User getCurrentUser();
} 