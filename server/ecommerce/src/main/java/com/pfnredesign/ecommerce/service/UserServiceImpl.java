package com.pfnredesign.ecommerce.service;

import com.pfnredesign.ecommerce.dto.AuthResponse;
import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.exception.InvalidCredentialsException;
import com.pfnredesign.ecommerce.exception.UserAlreadyExistsException;
import com.pfnredesign.ecommerce.model.User;
import com.pfnredesign.ecommerce.repository.UserRepository;
import com.pfnredesign.ecommerce.security.JwtTokenUtil;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @Override
    public UserResponse registerUser(RegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        // Create new user with encrypted password
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User savedUser = userRepository.save(user);

        // Return user data without password
        return UserResponse.fromUser(savedUser);
    }

    @Override
    public AuthResponse authenticateUser(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Set authentication in security context
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String token = jwtTokenUtil.generateToken(userDetails);

            // Get user from repository
            User user = userRepository.findByEmail(request.getEmail());

            // Create user response
            UserResponse userResponse = UserResponse.fromUser(user);

            // Return authentication response with token
            return new AuthResponse(token, userResponse);
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
    }

    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    @Override
    public Page<User> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, Map<String, Object> fields) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return null;
        }
        
        User user = optionalUser.get();
        
        fields.forEach((key, value) -> {
            switch (key) {
                case "email":
                    if (value != null && !value.toString().equals(user.getEmail())) {
                        if (userRepository.existsByEmail(value.toString())) {
                            throw new UserAlreadyExistsException("User with email " + value + " already exists");
                        }
                        user.setEmail(value.toString());
                    }
                    break;
                case "firstName":
                    if (value != null) {
                        user.setFirstName(value.toString());
                    }
                    break;
                case "lastName":
                    if (value != null) {
                        user.setLastName(value.toString());
                    }
                    break;
                case "phone":
                    if (value != null) {
                        user.setPhone(value.toString());
                    }
                    break;
                case "password":
                    if (value != null && !value.toString().isEmpty()) {
                        user.setPasswordHash(passwordEncoder.encode(value.toString()));
                    }
                    break;
            }
        });
        
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
} 