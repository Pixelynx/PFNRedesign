package com.pfnredesign.ecommerce.mapper.impl;

import com.pfnredesign.ecommerce.dto.UserCreateDTO;
import com.pfnredesign.ecommerce.dto.UserDTO;
import com.pfnredesign.ecommerce.dto.UserUpdateDTO;
import com.pfnredesign.ecommerce.mapper.UserMapper;
import com.pfnredesign.ecommerce.model.User;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UserMapper {

    private final ModelMapper modelMapper;
    
    public UserMapperImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
    
    @Override
    public UserDTO toDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }
    
    @Override
    public User toEntity(UserDTO userDTO) {
        return modelMapper.map(userDTO, User.class);
    }
    
    @Override
    public User toEntity(UserCreateDTO userCreateDTO) {
        return modelMapper.map(userCreateDTO, User.class);
    }
    
    @Override
    public User updateEntityFromDTO(UserUpdateDTO userUpdateDTO, User user) {
        if (userUpdateDTO == null) {
            return user;
        }
        
        if (userUpdateDTO.getEmail() != null) {
            user.setEmail(userUpdateDTO.getEmail());
        }
        
        if (userUpdateDTO.getFirstName() != null) {
            user.setFirstName(userUpdateDTO.getFirstName());
        }
        
        if (userUpdateDTO.getLastName() != null) {
            user.setLastName(userUpdateDTO.getLastName());
        }
        
        if (userUpdateDTO.getPhone() != null) {
            user.setPhone(userUpdateDTO.getPhone());
        }
        
        return user;
    }
    
    @Override
    public Page<UserDTO> toDTOPage(Page<User> users) {
        return users.map(this::toDTO);
    }
} 