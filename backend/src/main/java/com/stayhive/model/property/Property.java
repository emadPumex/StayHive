package com.stayhive.model.property;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "properties")
public class Property {

    @Id
    private String id;

    private String name;

    private PropertyType propertyType;

    private RoomType roomType;

    private Double price;

    private Integer accommodates;

    private Integer bedrooms;

    private Integer bathrooms;

    private List<String> amenities;

    private CancellationPolicy cancellationPolicy;

    private String summary;

    private Host host;

    private Address address;

    private Availability availability;

    private Image images;

    private Double averageRating;

    private Integer reviewCount;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;


    public enum PropertyType {

        APARTMENT,

        HOUSE,

        VILLA,

        CABIN,

        COTTAGE,

        HOTEL,

        RESORT
    }

    public enum RoomType {

        ENTIRE_PLACE,

        PRIVATE_ROOM,

        SHARED_ROOM
    }

    public enum CancellationPolicy {
        FLEXIBLE,
        MODERATE,
        STRICT,
        SUPER_STRICT
    }
}