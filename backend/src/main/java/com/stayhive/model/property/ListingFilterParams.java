package com.stayhive.model.property;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ListingFilterParams {
    private String search;
    private String country;
    private String market;
    private String propertyType;
    private String roomType;
    private String cancellationPolicy;
    private Double minPrice;
    private Double maxPrice;
    private Double  bathrooms;
    private Integer accommodates;
    private Integer bedrooms;
    private Integer minRating;
    private Boolean isSuperhost;
    private Boolean available30;
    private List<String> amenities;
}
