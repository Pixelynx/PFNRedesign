package com.pfnredesign.ecommerce.dto;

import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    
    @Email(message = "Email must be valid")
    private String email;
    
    private String firstName;
    private String lastName;
    private String phone;
} 