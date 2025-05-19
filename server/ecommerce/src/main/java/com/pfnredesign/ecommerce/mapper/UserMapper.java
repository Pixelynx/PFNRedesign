package com.pfnredesign.ecommerce.mapper;

import com.pfnredesign.ecommerce.dto.UserCreateDTO;
import com.pfnredesign.ecommerce.dto.UserDTO;
import com.pfnredesign.ecommerce.dto.UserUpdateDTO;
import com.pfnredesign.ecommerce.model.User;

import org.springframework.data.domain.Page;

public interface UserMapper {
    
    UserDTO toDTO(User user);
    
    User toEntity(UserDTO userDTO);
    
    User toEntity(UserCreateDTO userCreateDTO);
    
    User updateEntityFromDTO(UserUpdateDTO userUpdateDTO, User user);
    
    // Convert a Page of User to a Page of UserDTO
    Page<UserDTO> toDTOPage(Page<User> users);
} 