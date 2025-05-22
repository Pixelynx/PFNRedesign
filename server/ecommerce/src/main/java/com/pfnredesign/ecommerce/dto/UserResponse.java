package com.pfnredesign.ecommerce.dto;

import com.pfnredesign.ecommerce.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;

    // Factory method to create UserResponse from User entity
    public static UserResponse fromUser(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getUserId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        return response;
    }
} 