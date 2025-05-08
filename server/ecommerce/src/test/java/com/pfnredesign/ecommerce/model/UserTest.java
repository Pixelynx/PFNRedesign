package com.pfnredesign.ecommerce.model;

import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    @Test
    void testEqualsAndHashCode() {
        // Create users with same ID but different other fields
        User user1 = new User("user1@example.com", "password1", "John", "Doe");
        user1.setId(1L);
        
        User user2 = new User("user2@example.com", "password2", "Jane", "Smith");
        user2.setId(1L);
        
        // Create user with different ID but same email
        User user3 = new User("user1@example.com", "password1", "John", "Doe");
        user3.setId(2L);
        
        // Create completely different user
        User user4 = new User("user4@example.com", "password4", "Bob", "Johnson");
        user4.setId(3L);
        
        // Test equals
        assertEquals(user1, user1); // Same object
        assertEquals(user1, user2); // Same ID
        assertNotEquals(user1, user3); // Different ID but same email
        assertNotEquals(user1, user4); // Different ID and email
        assertNotEquals(user1, null); // Null
        assertNotEquals(user1, new Object()); // Different class
        
        // Test hashCode
        assertEquals(user1.hashCode(), user2.hashCode()); // Same ID should have same hash
    }
    
    @Test
    void testGettersAndSetters() {
        // Create user
        User user = new User();
        
        // Set values
        Long id = 1L;
        String email = "test@example.com";
        String password = "password";
        String firstName = "John";
        String lastName = "Doe";
        Date createdAt = new Date();
        
        user.setId(id);
        user.setEmail(email);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setCreatedAt(createdAt);
        
        // Check values
        assertEquals(id, user.getId());
        assertEquals(email, user.getEmail());
        assertEquals(password, user.getPassword());
        assertEquals(firstName, user.getFirstName());
        assertEquals(lastName, user.getLastName());
        assertEquals(createdAt, user.getCreatedAt());
    }
    
    @Test
    void testConstructors() {
        // Test default constructor
        User user1 = new User();
        assertNotNull(user1);
        assertNotNull(user1.getCreatedAt());
        
        // Test parameterized constructor
        String email = "test@example.com";
        String password = "password";
        String firstName = "John";
        String lastName = "Doe";
        
        User user2 = new User(email, password, firstName, lastName);
        
        assertEquals(email, user2.getEmail());
        assertEquals(password, user2.getPassword());
        assertEquals(firstName, user2.getFirstName());
        assertEquals(lastName, user2.getLastName());
        assertNotNull(user2.getCreatedAt());
    }
} 