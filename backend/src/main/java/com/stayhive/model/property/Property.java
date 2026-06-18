package com.stayhive.model.property;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "properties")
public class Property {


    @Id
    private String id;

    private String name;
    private String propertyType;
    private String roomType;
    private Double price;

    private Integer accommodates;
    private Integer bedrooms;
    private Double bathrooms;

    private List<String> amenities;

    private String cancellationPolicy;

    private ReviewScores reviewScores;

    private Host host;

    private Address address;

    private Availability availability;

    private Image image;

    private String summary;

    private List<Review> reviews;
}