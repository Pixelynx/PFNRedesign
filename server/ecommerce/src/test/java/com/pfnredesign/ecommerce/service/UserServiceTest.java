package com.pfnredesign.ecommerce.service;

import com.pfnredesign.ecommerce.dto.LoginRequest;
import com.pfnredesign.ecommerce.dto.RegistrationRequest;
import com.pfnredesign.ecommerce.dto.UserResponse;
import com.pfnredesign.ecommerce.exception.InvalidCredentialsException;
import com.pfnredesign.ecommerce.exception.UserAlreadyExistsException;
import com.pfnredesign.ecommerce.model.User;
import com.pfnredesign.ecommerce.repository.UserRepository;
import com.pfnredesign.ecommerce.security.JwtTokenUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenUtil jwtTokenUtil;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private UserDetails userDetails;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserServiceImpl(userRepository, passwordEncoder, authenticationManager, jwtTokenUtil);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void registerUser_Success() {
        // Arrange
        RegistrationRequest request = new RegistrationRequest("test@example.com", "password", "John", "Doe");
        User savedUser = new User("test@example.com", "encodedPassword", "John", "Doe");
        savedUser.setId(1L);

        when(userRepository.existsByEmail(request.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        // Act
        UserResponse response = userService.registerUser(request);

        // Assert
        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());

        verify(userRepository).existsByEmail(request.getEmail());
        verify(passwordEncoder).encode(request.getPassword());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void registerUser_UserAlreadyExists() {
        // Arrange
        RegistrationRequest request = new RegistrationRequest("test@example.com", "password", "John", "Doe");
        when(userRepository.existsByEmail(request.getEmail())).thenReturn(true);

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> userService.registerUser(request));
        verify(userRepository).existsByEmail(request.getEmail());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void authenticateUser_Success() {
        // Arrange
        LoginRequest request = new LoginRequest("test@example.com", "password");
        User user = new User("test@example.com", "encodedPassword", "John", "Doe");
        user.setId(1L);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtTokenUtil.generateToken(userDetails)).thenReturn("jwtToken");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(user);
        when(securityContext.getAuthentication()).thenReturn(authentication);

        // Act
        var response = userService.authenticateUser(request);

        // Assert
        assertNotNull(response);
        assertEquals("jwtToken", response.getToken());
        assertNotNull(response.getUser());
        assertEquals(1L, response.getUser().getId());
        assertEquals("test@example.com", response.getUser().getEmail());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtTokenUtil).generateToken(userDetails);
        verify(userRepository).findByEmail(request.getEmail());
        verify(securityContext).setAuthentication(authentication);
    }

    @Test
    void authenticateUser_InvalidCredentials() {
        // Arrange
        LoginRequest request = new LoginRequest("test@example.com", "wrongPassword");
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> userService.authenticateUser(request));
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
} 