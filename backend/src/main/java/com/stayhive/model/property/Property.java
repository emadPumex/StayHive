package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "properties")
public class Property {

    @Id
    private String id;

    private String name;

    private PropertyType propertyType; // e.g., HOTEL, RESORT, VILLA, APARTMENT

    private String summary;

    private Host host;

    private Address address;

    private Image images;

    // Shared features at the property level (e.g., Valet Parking, Gym, Central Pool)
    private List<Amenity> propertyAmenities;

    // Contains the multi-tiered refund calculation timeline matrix
    private CancellationPolicy cancellationPolicy;

    // Physical bookable inventories (e.g., Deluxe Room, Executive Suite, Private Pool Villa)
    private List<RoomCategory> roomCategories;

    // Advanced operational blocks applied to the whole property (e.g., Seasonal Closure)
    private List<BlockRule> propertyBlockRules;

    // Metadata, Reviews, and Status tracking
    private Double averageRating;

    private Integer reviewCount;

    private Boolean isActive;

    private Instant createdAt;

    private Instant updatedAt;



    public enum PropertyType {
        HOTEL, RESORT, VILLA, APARTMENT, HOUSE, CABIN, COTTAGE, HOSTEL
    }


}