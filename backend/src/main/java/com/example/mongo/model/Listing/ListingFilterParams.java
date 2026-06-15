package com.example.mongo.model.Listing;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListingFilterParams {
    private String search, country, market, propertyType, roomType, cancellationPolicy;
    private Double minPrice, maxPrice, bathrooms;
    private Integer accommodates, bedrooms, minRating;
    private Boolean isSuperhost, available30;
    private List<String> amenities;
}
