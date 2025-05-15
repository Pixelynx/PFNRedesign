package com.pfnredesign.ecommerce.config;

import com.pfnredesign.ecommerce.dto.UserCreateDTO;
import com.pfnredesign.ecommerce.dto.UserDTO;
import com.pfnredesign.ecommerce.dto.UserUpdateDTO;
import com.pfnredesign.ecommerce.model.User;
import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configure global settings
        modelMapper.getConfiguration()
            .setMatchingStrategy(MatchingStrategies.STRICT)
            .setSkipNullEnabled(true)
            .setFieldMatchingEnabled(true)
            .setFieldAccessLevel(org.modelmapper.config.Configuration.AccessLevel.PRIVATE);
        
        // Add custom mappings
        configureUserMappings(modelMapper);
        
        return modelMapper;
    }
    
    private void configureUserMappings(ModelMapper modelMapper) {
        // Define custom mapping from UserCreateDTO to User
        modelMapper.createTypeMap(UserCreateDTO.class, User.class)
            .addMappings(mapper -> {
                // Skip password hash mapping (handled in service layer)
                mapper.skip(User::setPasswordHash);
                // Set creation timestamp
                mapper.map(src -> LocalDateTime.now(), User::setCreatedAt);
            });
        
        // Define custom mapping from User to UserDTO
        modelMapper.createTypeMap(User.class, UserDTO.class);
        
        // Define custom converter for LocalDateTime to String if needed
        Converter<LocalDateTime, String> dateToStringConverter = mappingContext -> 
            mappingContext.getSource() == null ? null : 
                mappingContext.getSource().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME);
                
        // Define custom converter for String to LocalDateTime if needed
        Converter<String, LocalDateTime> stringToDateConverter = mappingContext -> 
            mappingContext.getSource() == null ? null : 
                LocalDateTime.parse(mappingContext.getSource(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);
    }
} 