package com.stayhive.controller;

import com.stayhive.config.SecurityConfig;
import com.stayhive.dto.PropertyDetailsResponseDTO;
import com.stayhive.model.Review;
import com.stayhive.model.property.Property;
import com.stayhive.security.JwtUtil;
import com.stayhive.security.OAuth2SuccessHandler;
import com.stayhive.service.PropertyService;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(
        controllers = PropertyController.class,
        includeFilters = @ComponentScan.Filter(
                type = FilterType.ASSIGNABLE_TYPE,
                classes = SecurityConfig.class
        )
)
class PropertyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private JwtUtil jwtUtil;

    @MockitoBean
    private PropertyService propertyService;

    @MockitoBean
    private OAuth2SuccessHandler   oAuth2SuccessHandler;

    @MockitoBean
    private ClientRegistrationRepository clientRegistrationRepository;

    @Test
    void getPropertiesById_ShouldReturnPropertyDetails()  throws Exception {

        String propertyId = "123";

        Property property = Property.builder()
                .id(propertyId)
                .name("Sea View Resort")
                .build();

        Review review = new Review(

                "1",
                propertyId,
                "user1",
                "John",
                null,
                5,
                "Excellent",
                Instant.now()
        );

        PropertyDetailsResponseDTO dto =
                new PropertyDetailsResponseDTO(
                        property,
                        List.of(review)
                );

        when(propertyService.getListingById(propertyId))
                .thenReturn(dto);

        mockMvc.perform(get("/api/properties/{id}", propertyId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.property.id")
                        .value(propertyId))
                .andExpect(jsonPath("$.property.name")
                        .value("Sea View Resort"))
                .andExpect(jsonPath("$.reviews.length()")
                        .value(1));

        verify(propertyService)
                .getListingById(propertyId);
    }

}