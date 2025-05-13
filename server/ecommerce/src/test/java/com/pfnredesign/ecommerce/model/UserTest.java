package com.pfnredesign.ecommerce.model;

import com.pfnredesign.ecommerce.model.User;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testEqualsAndHashCode() {
        // Create users with same userId but different other fields
        User user1 = new User();
        user1.setUserId(1L);
        user1.setEmail("user1@example.com");
        user1.setPasswordHash("password1");
        user1.setFirstName("John");
        user1.setLastName("Doe");
        
        User user2 = new User();
        user2.setUserId(1L);
        user2.setEmail("user2@example.com");
        user2.setPasswordHash("password2");
        user2.setFirstName("Jane");
        user2.setLastName("Smith");
        
        // Create user with different userId but same email
        User user3 = new User();
        user3.setUserId(2L);
        user3.setEmail("user1@example.com");
        user3.setPasswordHash("password1");
        user3.setFirstName("John");
        user3.setLastName("Doe");
        
        // Create completely different user
        User user4 = new User();
        user4.setUserId(3L);
        user4.setEmail("user4@example.com");
        user4.setPasswordHash("password4");
        user4.setFirstName("Bob");
        user4.setLastName("Johnson");
        
        // Test equals
        assertEquals(user1, user1); // Same object
        assertEquals(user1.getUserId(), user2.getUserId()); // Same ID
        assertNotEquals(user1, user3); // Different ID but same email
        assertNotEquals(user1, user4); // Different ID and email
        assertNotEquals(user1, null); // Null
        assertNotEquals(user1, new Object()); // Different class
        
        // Test hashCode
        assertEquals(
                user1.getUserId()
                        .hashCode(),
                user2.getUserId()
                        .hashCode()); // Same ID should have same hash
    }
    
    @Test
    void testGettersAndSetters() {
        // Create user
        User user = new User();
        
        // Set values
        Long userId = 1L;
        String email = "test@example.com";
        String passwordHash = "hashedPassword";
        String firstName = "John";
        String lastName = "Doe";
        String phone = "1234567890";
        LocalDateTime createdAt = LocalDateTime.now();
        LocalDateTime updatedAt = LocalDateTime.now();
        
        user.setUserId(userId);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPhone(phone);
        user.setCreatedAt(createdAt);
        user.setUpdatedAt(updatedAt);
        
        // Check values
        assertEquals(userId, user.getUserId());
        assertEquals(email, user.getEmail());
        assertEquals(passwordHash, user.getPasswordHash());
        assertEquals(firstName, user.getFirstName());
        assertEquals(lastName, user.getLastName());
        assertEquals(phone, user.getPhone());
        assertEquals(createdAt, user.getCreatedAt());
        assertEquals(updatedAt, user.getUpdatedAt());
    }
    
    @Test
    void testLombokDataAnnotation() {
        // Test that Lombok @Data is working properly
        User user1 = new User();
        user1.setUserId(1L);
        user1.setEmail("test@example.com");
        
        User user2 = new User();
        user2.setUserId(1L);
        user2.setEmail("test@example.com");
        
        // Test equals and hashCode from @Data
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());
        
        // Test toString from @Data
        assertTrue(user1.toString().contains("userId=1"));
        assertTrue(user1.toString().contains("email=test@example.com"));
    }
} 