package com.pfnredesign.ecommerce.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.hateoas.config.EnableHypermediaSupport;
import org.springframework.hateoas.mediatype.hal.HalConfiguration;
import org.springframework.hateoas.server.LinkRelationProvider;
import org.springframework.hateoas.server.core.EvoInflectorLinkRelationProvider;

@Configuration
@EnableHypermediaSupport(type = {EnableHypermediaSupport.HypermediaType.HAL})
public class HateoasConfig {

    @Bean
    public LinkRelationProvider linkRelationProvider() {
        return new EvoInflectorLinkRelationProvider();
    }

    @Bean
    public HalConfiguration halConfiguration() {
        return new HalConfiguration()
                .withRenderSingleLinks(HalConfiguration.RenderSingleLinks.AS_ARRAY);
    }
}