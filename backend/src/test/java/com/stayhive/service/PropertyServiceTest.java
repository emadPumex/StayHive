package com.stayhive.service;

import com.stayhive.dto.PropertyDetailsResponseDTO;
import com.stayhive.model.Review;
import com.stayhive.model.property.Property;
import com.stayhive.repository.PropertyRepository;
import com.stayhive.repository.ReviewRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PropertyServiceTest {

    @Mock
    private PropertyRepository listingRepository;

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private PropertyService propertyService;

    @Test
    void getListings_ShouldReturnPropertyAndReviews() {

        String propertyId = "123";


        Property property = Property.builder()
                .id(propertyId)
                .name("Sea View Resort")
                .propertyType(Property.PropertyType.RESORT)
                .averageRating(4.5)
                .reviewCount(2)
                .build();

        Review review1 = new Review(
                "1",
                propertyId,
                "user1",
                "John",
                "img1.jpg",
                5,
                "Excellent stay",
                Instant.now()
        );

        Review review2 = new Review(
                "2",
                propertyId,
                "user2",
                "Alice",
                "img2.jpg",
                4,
                "Nice place",
                Instant.now()
        );

        List<Review> reviews = List.of(review1, review2);

        when(listingRepository.findById(propertyId))
                .thenReturn(Optional.of(property));

        when(reviewRepository.findByPropertyId(propertyId))
                .thenReturn(reviews);

        PropertyDetailsResponseDTO response =
                propertyService.getListingById(propertyId);

        assertNotNull(response);

       assertEquals(2,response.reviews().size());

        verify(listingRepository).findById(propertyId);
        verify(reviewRepository).findByPropertyId(propertyId);

    }
}