package com.stayhive.dto;

import java.util.List;

import com.stayhive.model.property.Property.PropertyType;
import com.stayhive.model.property.RoomCategory.RoomType;

public record PropertyUpdateDTO(
        String name,
        String summary,
        Double price,
        String city,
        PropertyType propertyType,
        RoomType roomType,
        Integer accommodates,
        Integer bedroomCount,
        Integer bedrooms,
        Integer bathrooms,
        String cancellationPolicy,
        List<String> amenities
) {
}
