package com.stayhive.dto;

import com.stayhive.model.Review;
import com.stayhive.model.property.Property;

import java.util.List;

public record PropertyDetailsResponseDTO(

        Property property,
        List<Review> review
) {
}
