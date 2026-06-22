package com.stayhive.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class ListingFilterParams {

    private String search;

    private String country;

    private String city;

    private String propertyType;

    private String roomType;

    private String cancellationPolicy;

    private Double minPrice;

    private Double maxPrice;

    private Integer minAccommodates;
    private Integer minBedrooms;
    private Integer minBathrooms;

    private Double minRating;

    private Boolean isSuperhost;

    private List<String> amenities;

    private LocalDate checkIn;

    private LocalDate checkOut;
}