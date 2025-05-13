package com.pfnredesign.ecommerce.dto;

import com.pfnredesign.ecommerce.model.User;

public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;

    public UserResponse() {
    }

    public UserResponse(Long id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Factory method to create UserResponse from User entity
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
} 