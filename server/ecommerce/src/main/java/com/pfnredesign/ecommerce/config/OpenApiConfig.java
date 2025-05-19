package com.pfnredesign.ecommerce.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
public class OpenApiConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(apiInfo())
                .servers(Arrays.asList(
                        new Server().url("http://localhost:" + serverPort).description("Local Development Server")
                ))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .in(SecurityScheme.In.HEADER)
                                        .name("Authorization")
                        )
                )
                .addSecurityItem(new SecurityRequirement().addList("bearer-jwt"));
    }

    private Info apiInfo() {
        return new Info()
                .title("Pink Friday Nails E-commerce API")
                .description("RESTful API for the Pink Friday Nails E-commerce Platform")
                .version("v1.0")
                .contact(new Contact()
                        .name("PFN Development Team")
                        .email("dev@pinkfridaynails.com")
                        .url("https://www.pinkfridaynails.com"))
                .license(new License()
                        .name("Proprietary")
                        .url("https://www.pinkfridaynails.com/terms"));
    }
} 